import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiClock, FiZap, FiAward, FiArrowRight } from 'react-icons/fi';
import { cmsApi } from '../services/cmsApi';

const isWithinDateRange = (banner) => {
  const now = new Date();
  if (banner.startDate && new Date(banner.startDate) > now) return false;
  if (banner.endDate && new Date(banner.endDate) < now) return false;
  return true;
};

/* ── live countdown to a banner's endDate ── */
const useCountdown = (endDate) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!endDate) return undefined;
    const target = new Date(endDate).getTime();

    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setTimeLeft({ expired: true, days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        expired: false,
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  return timeLeft;
};

const CountdownUnit = ({ value, label }) => (
  <div className="flex flex-col items-center rounded-lg bg-white/15 px-2.5 py-1.5 text-white">
    <span className="font-display text-lg font-bold leading-none tabular-nums">{String(value).padStart(2, '0')}</span>
    <span className="mt-0.5 text-[9px] uppercase tracking-wide opacity-80">{label}</span>
  </div>
);

/* ── Festival Offer: warm, vibrant, urgent ── */
const FestivalOfferCard = ({ banner }) => {
  const countdown = useCountdown(banner.endDate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-red-500 to-rose-600 shadow-[0_20px_50px_-15px_rgba(220,38,38,0.5)]"
    >
      {/* decorative glow blobs */}
      <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-14 -left-10 h-48 w-48 rounded-full bg-yellow-300/20 blur-3xl" />
      {/* sparkle dot texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '28px 28px' }}
      />

      <div className="relative grid grid-cols-1 items-center gap-6 p-6 sm:p-10 lg:grid-cols-2 lg:gap-10">
        {banner.image?.url && (
          <div className="order-1 overflow-hidden rounded-2xl shadow-lg lg:order-none">
            <img src={banner.image.url} alt={banner.title} className="h-56 w-full object-cover sm:h-72" />
          </div>
        )}

        <div className="order-2 text-white lg:order-none">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur">
            <FiZap size={12} /> {banner.subtitle || 'Festival Offer'}
          </span>

          <h2 className="mt-3 font-display text-2xl font-bold leading-tight sm:text-3xl">{banner.title}</h2>
          {banner.description && <p className="mt-2 text-sm text-white/90 sm:text-base">{banner.description}</p>}

          {countdown && !countdown.expired && (
            <div className="mt-5 flex items-center gap-2">
              <FiClock size={14} className="shrink-0 text-white/80" />
              <div className="flex gap-1.5">
                <CountdownUnit value={countdown.days} label="Days" />
                <CountdownUnit value={countdown.hours} label="Hrs" />
                <CountdownUnit value={countdown.minutes} label="Min" />
                <CountdownUnit value={countdown.seconds} label="Sec" />
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            {banner.ctaPrimaryLabel && (
              <Link
                to={banner.ctaPrimaryLink || '/shop'}
                className="group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-red-600 shadow-lg transition-transform hover:scale-105"
              >
                {banner.ctaPrimaryLabel}
                <FiArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            )}
            {banner.ctaSecondaryLabel && (
              <Link
                to={banner.ctaSecondaryLink || '/shop'}
                className="inline-flex items-center rounded-xl border border-white/50 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                {banner.ctaSecondaryLabel}
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
import { FiCalendar } from 'react-icons/fi';
/* ── Limited Edition: premium, dark, exclusive ── */
const LimitedEditionCard = ({ banner }) => {
  const date = banner.date ? new Date(banner.date) : new Date();

  // Hide automatically 24 hours after posting
  const hoursSincePosted = (Date.now() - date.getTime()) / (1000 * 60 * 60);
  if (hoursSincePosted >= 24) return null;

  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  //const weekday = date.toLocaleString('default', { weekday: 'long' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-bamboo-900 via-bamboo-800 to-black shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)]"
    >
      {/* gold accent glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />
      {/* thin gold frame */}
      <div className="pointer-events-none absolute inset-3 rounded-2xl border border-amber-300/20 sm:inset-4" />

      <div className="relative grid grid-cols-1 items-center gap-6 p-6 sm:p-10 lg:grid-cols-2 lg:gap-10">
        <div className="order-2 text-white lg:order-none">
          {/* date badge + category tag */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl border border-amber-300/30 bg-amber-400/10 backdrop-blur-sm">
              <span className="font-display text-lg font-bold leading-none text-amber-300">{day}</span>
              <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-amber-200/80">{month}</span>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/40 bg-amber-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-amber-300">
              <FiAward size={12} /> {banner.subtitle || 'Limited Edition'}
            </span>
          </div>

          <h2 className="mt-4 font-display text-2xl font-bold leading-tight sm:text-3xl">{banner.title}</h2>
          {banner.description && <p className="mt-2 text-sm leading-relaxed text-sand-200 sm:text-base">{banner.description}</p>}

          <div className="mt-6 flex flex-wrap items-center gap-4">
            {banner.ctaPrimaryLabel && (
              <Link
                to={banner.ctaPrimaryLink || '/shop'}
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-3 text-sm font-bold text-bamboo-900 shadow-lg transition-transform hover:scale-105"
              >
                {banner.ctaPrimaryLabel}
                <FiArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            )}
            {banner.ctaSecondaryLabel && (
              <Link
                to={banner.ctaSecondaryLink || '/shop'}
                className="inline-flex items-center rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                {banner.ctaSecondaryLabel}
              </Link>
            )}
          </div>

          <span className="mt-4 inline-flex items-center gap-1.5 text-xs text-sand-400">
            <FiCalendar size={13} />
            Posted {date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>

        {banner.image?.url && (
          <div className="order-1 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-amber-300/20 lg:order-none">
            <img src={banner.image.url} alt={banner.title} className="h-56 w-full object-cover sm:h-72" />
          </div>
        )}
      </div>
    </motion.div>
  );
};
const PromoBanners = () => {
  const { data: festivalBanners = [] } = useQuery({
    queryKey: ['banners', 'festival_offer'],
    queryFn: () => cmsApi.getBanners('festival_offer'),
    select: (res) => res.data.data.banners,
  });

  const { data: limitedBanners = [] } = useQuery({
    queryKey: ['banners', 'limited_edition'],
    queryFn: () => cmsApi.getBanners('limited_edition'),
    select: (res) => res.data.data.banners,
  });

  const activeFestival = festivalBanners.filter(isWithinDateRange);
  const activeLimited = limitedBanners.filter(isWithinDateRange);

  if (!activeFestival.length && !activeLimited.length) return null;

  return (
    <section className="mx-auto max-w-7xl space-y-6 px-4 py-10">
      {activeFestival.map((banner) => (
        <FestivalOfferCard key={banner._id} banner={banner} />
      ))}
      {activeLimited.map((banner) => (
        <LimitedEditionCard key={banner._id} banner={banner} />
      ))}
    </section>
  );
};

export default PromoBanners;