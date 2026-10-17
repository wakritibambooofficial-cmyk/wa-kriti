import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;

/**
 * Where every Wa-Kriti order ships from.
 */
const ORIGIN = {
  lat: 23.8315,
  lng: 91.2868,
  title: 'Wa-Kriti Studio',
  subtitle: 'Agartala, Tripura',
};

/**
 * Fallback state centres — used only if the pincode/city lookup fails
 * (bad network, address text OpenStreetMap can't resolve, etc).
 */
const STATE_CENTROIDS = {
  'andhra pradesh': [15.9129, 79.74],
  assam: [26.2006, 92.9376],
  bihar: [25.0961, 85.3131],
  chhattisgarh: [21.2787, 81.8661],
  delhi: [28.6139, 77.209],
  goa: [15.2993, 74.124],
  gujarat: [22.2587, 71.1924],
  haryana: [29.0588, 76.0856],
  'himachal pradesh': [31.1048, 77.1734],
  jharkhand: [23.6102, 85.2799],
  karnataka: [15.3173, 75.7139],
  kerala: [10.8505, 76.2711],
  'madhya pradesh': [22.9734, 78.6569],
  maharashtra: [19.7515, 75.7139],
  manipur: [24.6637, 93.9063],
  meghalaya: [25.467, 91.3662],
  mizoram: [23.1645, 92.9376],
  nagaland: [26.1584, 94.5624],
  odisha: [20.9517, 85.0985],
  punjab: [31.1471, 75.3412],
  rajasthan: [27.0238, 74.2179],
  sikkim: [27.533, 88.5122],
  'tamil nadu': [11.1271, 78.6569],
  telangana: [18.1124, 79.0193],
  tripura: [23.9408, 91.9882],
  'uttar pradesh': [26.8467, 80.9462],
  uttarakhand: [30.0668, 79.0193],
  'west bengal': [22.9868, 87.855],
};

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

const markerIcon = (glyph, tone) =>
  L.divIcon({
    className: '',
    html: `
      <div style="
        display:flex;align-items:center;justify-content:center;
        width:34px;height:34px;border-radius:50% 50% 50% 4px;
        transform:rotate(-45deg);
        background:${tone};
        box-shadow:0 4px 10px rgba(0,0,0,.25);
        border:2px solid #fff;
      ">
        <span style="transform:rotate(45deg);font-size:15px;line-height:1">${glyph}</span>
      </div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 32],
    popupAnchor: [0, -30],
  });

const originIcon = markerIcon('🏭', '#3F5B3E');
const destinationIcon = markerIcon('🏠', '#B4744A');

const distanceKm = (a, b) => {
  const toRad = (d) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h)));
};

const arcBetween = (from, to, bend = 0.22, segments = 64) => {
  const mid = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2];
  const dx = to[1] - from[1];
  const dy = to[0] - from[0];
  const control = [mid[0] + dx * bend, mid[1] - dy * bend];

  return Array.from({ length: segments + 1 }, (_, i) => {
    const t = i / segments;
    const u = 1 - t;
    return [
      u * u * from[0] + 2 * u * t * control[0] + t * t * to[0],
      u * u * from[1] + 2 * u * t * control[1] + t * t * to[1],
    ];
  });
};

const FitRoute = ({ from, to }) => {
  const map = useMap();
  useEffect(() => {
    if (!from || !to) return;
    setTimeout(() => map.invalidateSize(), 0);
    map.fitBounds([from, to], { padding: [50, 50], maxZoom: 9 });
  }, [map, from, to]);
  return null;
};

/**
 * Geocodes using ONLY city, state, and pincode — nothing from the model
 * needs to change. Tries pincode+country first (usually the most precise
 * for India), then falls back to city+state if that returns nothing.
 */
const geocodeFromCityStatePincode = async ({ city, state, pincode }, signal) => {
  const attempts = [
    { postalcode: pincode, country: 'India' },
    { city, state, country: 'India' },
  ];

  for (const params of attempts) {
    const cleaned = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v && String(v).trim())
    );
    if (Object.keys(cleaned).length <= 1) continue; // nothing but country

    const query = new URLSearchParams({ format: 'json', limit: '1', ...cleaned });
    const res = await fetch(`https://nominatim.openstreetmap.org/search?${query}`, {
      signal,
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) continue;

    const results = await res.json();
    if (results.length) {
      return [parseFloat(results[0].lat), parseFloat(results[0].lon)];
    }
  }

  throw new Error('Address not found');
};

/* ------------------------------------------------------------------ */
/* component                                                           */
/* ------------------------------------------------------------------ */

/**
 * @param {object} address  { city, state, pincode } — that's all this needs.
 * @param {string} eta       Optional delivery estimate string.
 */
const DeliveryRouteMap = ({ address, eta }) => {
  const [destination, setDestination] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | exact | approximate | failed

  const origin = useMemo(() => [ORIGIN.lat, ORIGIN.lng], []);

  useEffect(() => {
    if (!address || (!address.city && !address.state && !address.pincode)) {
      setStatus('failed');
      return;
    }

    const cacheKey = `geo:${address.pincode || ''}:${address.city || ''}:${address.state || ''}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      setDestination(JSON.parse(cached));
      setStatus('exact');
      return;
    }

    const controller = new AbortController();

    geocodeFromCityStatePincode(address, controller.signal)
      .then((coords) => {
        sessionStorage.setItem(cacheKey, JSON.stringify(coords));
        setDestination(coords);
        setStatus('exact');
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        const fallback = STATE_CENTROIDS[(address.state || '').trim().toLowerCase()];
        if (fallback) {
          setDestination(fallback);
          setStatus('approximate');
        } else {
          setStatus('failed');
        }
      });

    return () => controller.abort();
  }, [address]);

  const path = useMemo(
    () => (destination ? arcBetween(origin, destination) : null),
    [origin, destination]
  );

  if (status === 'loading') {
    return <div className="h-64 w-full animate-pulse rounded-xl bg-sand-200 sm:h-72" />;
  }

  if (status === 'failed' || !destination) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-xl bg-sand-100 px-6 text-center sm:h-72">
        <p className="text-sm text-bamboo-500">
          We couldn&apos;t place your address on the map, but your order is confirmed
          and on its way from Agartala.
        </p>
      </div>
    );
  }

  const km = distanceKm(origin, destination);

  return (
    <div className="overflow-hidden rounded-xl border border-sand-300">
      <MapContainer
        center={origin}
        zoom={5}
        scrollWheelZoom={false}
        style={{ height: '18rem', width: '100%' }}
        attributionControl
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <Polyline positions={path} pathOptions={{ color: '#3F5B3E', weight: 7, opacity: 0.12 }} />
        <Polyline
          positions={path}
          pathOptions={{ color: '#3F5B3E', weight: 3, dashArray: '8 10', lineCap: 'round' }}
        />

        <Marker position={origin} icon={originIcon}>
          <Popup>
            <strong>{ORIGIN.title}</strong>
            <br />
            {ORIGIN.subtitle}
          </Popup>
        </Marker>

        <Marker position={destination} icon={destinationIcon}>
          <Popup>
            <strong>Delivering to</strong>
            <br />
            {[address.city, address.state, address.pincode].filter(Boolean).join(', ')}
          </Popup>
        </Marker>

        <FitRoute from={origin} to={destination} />
      </MapContainer>

      <div className="flex items-center justify-between gap-3 bg-white px-4 py-3 text-left">
        <div>
          <p className="text-sm font-medium text-bamboo-800">
            Agartala → {address.city || address.state}
          </p>
          <p className="text-xs text-bamboo-500">
            {km.toLocaleString('en-IN')} km away
            {status === 'approximate' && ' · approximate location'}
          </p>
        </div>
        {eta && (
          <div className="shrink-0 rounded-lg bg-bamboo-50 px-3 py-1.5 text-right">
            <p className="text-xs text-bamboo-500">Arrives by</p>
            <p className="text-sm font-semibold text-bamboo-800">{eta}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryRouteMap;