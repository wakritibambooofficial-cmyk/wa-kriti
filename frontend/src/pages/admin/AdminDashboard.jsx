// import { useQuery } from '@tanstack/react-query';
// import { Helmet } from 'react-helmet-async';
// import { FiShoppingBag, FiClock, FiCheckCircle, FiXCircle, FiDollarSign, FiRotateCcw } from 'react-icons/fi';
// import { adminOrderApi } from '../../services/adminApi';

// const StatCard = ({ icon: Icon, label, value, color }) => (
//   <div className="card p-5">
//     <div className={`flex h-10 w-10 items-center justify-center rounded-full ${color}`}>
//       <Icon size={18} />
//     </div>
//     <p className="mt-3 text-xs uppercase tracking-wide text-bamboo-400">{label}</p>
//     <p className="mt-1 font-display text-2xl font-bold text-bamboo-800">{value}</p>
//   </div>
// );

// const AdminDashboard = () => {
//   const { data: stats, isLoading } = useQuery({
//     queryKey: ['admin-order-stats'],
//     queryFn: () => adminOrderApi.getStats(),
//     select: (res) => res.data.data,
//   });

//   return (
//     <div className="px-6 py-8">
//       <Helmet><title>Admin Dashboard</title></Helmet>
//       <h1 className="font-display text-2xl font-bold text-bamboo-800">Dashboard</h1>
//       <p className="text-sm text-bamboo-500">Overview of your store&apos;s performance</p>

//       {isLoading ? (
//         <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
//           {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-32 animate-pulse rounded-2xl bg-sand-200" />)}
//         </div>
//       ) : (
//         <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
//           <StatCard icon={FiDollarSign} label="Total Revenue" value={`₹${stats?.totalRevenue || 0}`} color="bg-green-100 text-green-600" />
//           <StatCard icon={FiClock} label="Pending Orders" value={stats?.pending || 0} color="bg-orange-100 text-orange-600" />
//           <StatCard icon={FiCheckCircle} label="Delivered" value={stats?.completed || 0} color="bg-blue-100 text-blue-600" />
//           <StatCard icon={FiXCircle} label="Cancelled" value={stats?.cancelled || 0} color="bg-red-100 text-red-600" />
//           <StatCard icon={FiRotateCcw} label="Return Requests" value={stats?.returnRequests || 0} color="bg-purple-100 text-purple-600" />
//         </div>
//       )}

//       <div className="mt-8 card p-6">
//         <div className="flex items-center gap-3">
//           <FiShoppingBag className="text-bamboo-500" />
//           <h2 className="font-display text-lg font-semibold text-bamboo-800">Quick Links</h2>
//         </div>
//         <p className="mt-2 text-sm text-bamboo-500">
//           Use the sidebar to manage products, categories, orders, customers, reviews, coupons, CMS content, and blog posts.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;



import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import {
  FiShoppingBag, FiClock, FiCheckCircle, FiXCircle, FiDollarSign, FiRotateCcw,
  FiTrendingUp, FiTrendingDown, FiAlertTriangle, FiArrowRight, FiPackage,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { adminOrderApi } from '../../services/adminApi';

// ---------- date range helpers ----------
const DATE_PRESETS = [
  { key: 'today', label: 'Today' },
  { key: '7d', label: 'Last 7 Days' },
  { key: '30d', label: 'This Month' },
  { key: 'custom', label: 'Custom Range' },
];

const getRangeFor = (preset, customFrom, customTo) => {
  const now = new Date();
  const to = new Date(now); to.setHours(23, 59, 59, 999);
  let from = new Date(now); from.setHours(0, 0, 0, 0);

  if (preset === '7d') { from = new Date(now); from.setDate(from.getDate() - 6); from.setHours(0, 0, 0, 0); }
  else if (preset === '30d') { from = new Date(now.getFullYear(), now.getMonth(), 1); }
  else if (preset === 'custom' && customFrom && customTo) {
    from = new Date(customFrom); from.setHours(0, 0, 0, 0);
    const customToDate = new Date(customTo); customToDate.setHours(23, 59, 59, 999);
    return { from: from.toISOString(), to: customToDate.toISOString() };
  }
  return { from: from.toISOString(), to: to.toISOString() };
};

const formatMoney = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
const formatShortDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
const formatDateTime = (d) => new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

const pctChange = (current, previous) => {
  if (!previous) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

const STATUS_BADGE = {
  placed: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  packed: 'bg-indigo-100 text-indigo-700',
  shipped: 'bg-purple-100 text-purple-700',
  out_for_delivery: 'bg-cyan-100 text-cyan-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  returned: 'bg-orange-100 text-orange-700',
};

// ---------- trend-aware stat card ----------
const StatCard = ({ icon: Icon, label, value, color, trend }) => {
  const positive = trend >= 0;
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${color}`}>
          <Icon size={18} />
        </div>
        {typeof trend === 'number' && !Number.isNaN(trend) && (
          <span className={`flex items-center gap-0.5 text-xs font-semibold ${positive ? 'text-green-600' : 'text-red-500'}`}>
            {positive ? <FiTrendingUp size={12} /> : <FiTrendingDown size={12} />}
            {Math.abs(trend).toFixed(0)}%
          </span>
        )}
      </div>
      <p className="mt-3 text-xs uppercase tracking-wide text-bamboo-400">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold text-bamboo-800">{value}</p>
    </div>
  );
};

// ---------- lightweight SVG bar chart (no extra dependency) ----------
const RevenueChart = ({ timeline }) => {
  if (!timeline?.length) {
    return <div className="flex h-52 items-center justify-center text-sm text-bamboo-400">No revenue data for this period</div>;
  }
  const max = Math.max(...timeline.map((t) => t.revenue || 0), 1);
  const width = 100 / timeline.length;

  return (
    <div className="mt-2">
      <div className="flex h-52 items-end gap-1">
        {timeline.map((t, i) => {
          const h = Math.max(((t.revenue || 0) / max) * 100, 2);
          return (
            <div key={i} className="group relative flex-1" style={{ minWidth: `${width}%` }}>
              <div
                className="mx-auto w-full max-w-[28px] rounded-t-md bg-bamboo-500 transition-all hover:bg-bamboo-600"
                style={{ height: `${h}%` }}
              />
              <div className="pointer-events-none absolute -top-9 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-bamboo-800 px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                {formatMoney(t.revenue)} · {t.orders || 0} orders
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex gap-1">
        {timeline.map((t, i) => (
          <span key={i} className="flex-1 text-center text-[10px] text-bamboo-400" style={{ minWidth: `${width}%` }}>
            {timeline.length <= 14 || i % Math.ceil(timeline.length / 10) === 0 ? formatShortDate(t.date) : ''}
          </span>
        ))}
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [preset, setPreset] = useState('7d');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  const range = useMemo(() => getRangeFor(preset, customFrom, customTo), [preset, customFrom, customTo]);

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-order-stats', range.from, range.to],
    queryFn: () => adminOrderApi.getStats({ from: range.from, to: range.to }),
    select: (res) => res.data.data,
  });

  // Fallback: fetch recent orders directly if stats endpoint doesn't include them yet
  const { data: fallbackOrders } = useQuery({
    queryKey: ['admin-recent-orders-fallback'],
    queryFn: () => adminOrderApi.getAll({ limit: 6, sort: '-createdAt' }),
    select: (res) => res.data.data.orders,
    enabled: !stats?.recentOrders,
  });

  const recentOrders = stats?.recentOrders?.length ? stats.recentOrders : fallbackOrders;

  const prev = stats?.previousPeriod || {};
  const STAT_CARDS = [
    { icon: FiDollarSign, label: 'Total Revenue', value: formatMoney(stats?.totalRevenue), color: 'bg-green-100 text-green-600', trend: pctChange(stats?.totalRevenue || 0, prev.totalRevenue) },
    { icon: FiClock, label: 'Pending Orders', value: stats?.pending || 0, color: 'bg-orange-100 text-orange-600', trend: pctChange(stats?.pending || 0, prev.pending) },
    { icon: FiCheckCircle, label: 'Delivered', value: stats?.completed || 0, color: 'bg-blue-100 text-blue-600', trend: pctChange(stats?.completed || 0, prev.completed) },
    { icon: FiXCircle, label: 'Cancelled', value: stats?.cancelled || 0, color: 'bg-red-100 text-red-600', trend: pctChange(stats?.cancelled || 0, prev.cancelled) },
    { icon: FiRotateCcw, label: 'Return Requests', value: stats?.returnRequests || 0, color: 'bg-purple-100 text-purple-600', trend: pctChange(stats?.returnRequests || 0, prev.returnRequests) },
  ];

  const QUICK_ACTIONS = [
    { label: 'Add Product', to: '/admin/products/new', icon: FiPackage },
    { label: 'Pending Orders', to: '/admin/orders?status=placed', icon: FiClock },
    { label: 'Low Stock', to: '/admin/products?filter=low-stock', icon: FiAlertTriangle },
    { label: 'Coupons', to: '/admin/coupons', icon: FiShoppingBag },
  ];

  return (
    <div className="px-6 py-8">
      <Helmet><title>Admin Dashboard</title></Helmet>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-bamboo-800">Dashboard</h1>
          <p className="text-sm text-bamboo-500">Overview of your store&apos;s performance</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {DATE_PRESETS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPreset(p.key)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                preset === p.key ? 'bg-bamboo-700 text-white' : 'bg-sand-100 text-bamboo-600 hover:bg-sand-200'
              }`}
            >
              {p.label}
            </button>
          ))}
          {preset === 'custom' && (
            <>
              <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} className="input-field !w-36 !py-1.5 text-xs" />
              <span className="text-bamboo-400 text-sm">to</span>
              <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} className="input-field !w-36 !py-1.5 text-xs" />
            </>
          )}
        </div>
      </div>

      {/* Stat cards */}
      {isLoading ? (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-32 animate-pulse rounded-2xl bg-sand-200" />)}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {STAT_CARDS.map((c) => <StatCard key={c.label} {...c} />)}
        </div>
      )}

      {/* Quick actions */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {QUICK_ACTIONS.map((a) => (
          <Link
            key={a.label}
            to={a.to}
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-medium text-bamboo-700 shadow-soft transition hover:shadow-md"
          >
            <a.icon size={15} className="text-bamboo-500" />
            {a.label}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Revenue chart */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-bamboo-800">Revenue Trend</h2>
            <span className="text-xs text-bamboo-400">{DATE_PRESETS.find((p) => p.key === preset)?.label}</span>
          </div>
          {isLoading ? (
            <div className="mt-4 h-52 animate-pulse rounded-xl bg-sand-100" />
          ) : (
            <RevenueChart timeline={stats?.timeline} />
          )}
        </div>

        {/* Low stock alerts */}
        <div className="card p-6">
          <div className="flex items-center gap-2">
            <FiAlertTriangle className="text-red-500" size={16} />
            <h2 className="font-display text-lg font-semibold text-bamboo-800">Low Stock</h2>
          </div>
          <div className="mt-3 space-y-2">
            {!stats?.lowStockProducts?.length ? (
              <p className="py-6 text-center text-sm text-bamboo-400">All products well stocked</p>
            ) : (
              stats.lowStockProducts.map((p) => (
                <Link
                  key={p._id}
                  to={`/admin/products/${p._id}/edit`}
                  className="flex items-center justify-between rounded-lg px-2 py-2 text-sm hover:bg-sand-50"
                >
                  <span className="text-bamboo-700">{p.name}</span>
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">
                    {p.stock} left
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent orders */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-bamboo-800">Recent Orders</h2>
            <Link to="/admin/orders" className="flex items-center gap-1 text-xs font-semibold text-bamboo-600 hover:underline">
              View all <FiArrowRight size={12} />
            </Link>
          </div>
          <div className="mt-3 divide-y divide-sand-200">
            {!recentOrders?.length ? (
              <p className="py-6 text-center text-sm text-bamboo-400">No recent orders</p>
            ) : (
              recentOrders.slice(0, 6).map((o) => (
                <div key={o._id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <p className="font-medium text-bamboo-800">{o.orderNumber}</p>
                    <p className="text-xs text-bamboo-400">
                      {o.customerName || `${o.customer?.firstName || ''} ${o.customer?.lastName || ''}`} · {formatDateTime(o.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-bamboo-700">{formatMoney(o.grandTotal)}</span>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_BADGE[o.orderStatus] || 'bg-gray-100 text-gray-700'}`}>
                      {o.orderStatus?.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top products */}
        <div className="card p-6">
          <h2 className="font-display text-lg font-semibold text-bamboo-800">Top Products</h2>
          <div className="mt-3 space-y-3">
            {!stats?.topProducts?.length ? (
              <p className="py-6 text-center text-sm text-bamboo-400">No sales data yet</p>
            ) : (
              stats.topProducts.map((p, i) => (
                <div key={p._id} className="flex items-center gap-3 text-sm">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-bamboo-100 text-xs font-bold text-bamboo-700">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-bamboo-800">{p.name}</p>
                    <p className="text-xs text-bamboo-400">{p.unitsSold} sold · {formatMoney(p.revenue)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;