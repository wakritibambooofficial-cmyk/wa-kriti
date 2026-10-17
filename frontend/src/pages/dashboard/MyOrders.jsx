// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useQuery } from '@tanstack/react-query';
// import { Helmet } from 'react-helmet-async';
// import { orderApi } from '../../services/commerceApi';
// import EmptyState from '../../components/ui/EmptyState';

// const STATUS_FILTERS = [
//   { value: '', label: 'All' },
//   { value: 'placed', label: 'Placed' },
//   { value: 'shipped', label: 'Shipped' },
//   { value: 'delivered', label: 'Delivered' },
//   { value: 'cancelled', label: 'Cancelled' },
// ];

// const STATUS_COLORS = {
//   placed: 'bg-blue-100 text-blue-700',
//   confirmed: 'bg-blue-100 text-blue-700',
//   packed: 'bg-purple-100 text-purple-700',
//   shipped: 'bg-orange-100 text-orange-700',
//   out_for_delivery: 'bg-orange-100 text-orange-700',
//   delivered: 'bg-green-100 text-green-700',
//   cancelled: 'bg-red-100 text-red-700',
//   returned: 'bg-gray-100 text-gray-700',
//   refunded: 'bg-gray-100 text-gray-700',
// };

// const MyOrders = () => {
//   const [status, setStatus] = useState('');

//   const { data, isLoading } = useQuery({
//     queryKey: ['my-orders', status],
//     queryFn: () => orderApi.getMyOrders(status ? { status } : {}),
//     select: (res) => res.data.data.orders,
//   });

//   return (
//     <div className="min-h-screen bg-sand-100 pb-20">
//       <Helmet><title>My Orders</title></Helmet>
//       <div className="mx-auto max-w-4xl px-4 py-10">
//         <h1 className="font-display text-2xl font-bold text-bamboo-800">My Orders</h1>

//         <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
//           {STATUS_FILTERS.map((f) => (
//             <button
//               key={f.value}
//               onClick={() => setStatus(f.value)}
//               className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
//                 status === f.value ? 'bg-bamboo-600 text-white' : 'bg-white text-bamboo-600'
//               }`}
//             >
//               {f.label}
//             </button>
//           ))}
//         </div>

//         {isLoading ? (
//           <div className="mt-6 space-y-3">
//             {[1, 2, 3].map((i) => (
//               <div key={i} className="h-24 animate-pulse rounded-2xl bg-sand-200" />
//             ))}
//           </div>
//         ) : !data?.length ? (
//           <div className="mt-8">
//             <EmptyState title="No orders yet" message="Your order history will show up here." actionLabel="Start Shopping" actionTo="/shop" />
//           </div>
//         ) : (
//           <div className="mt-6 space-y-4">
//             {data.map((order) => (
//               <Link key={order._id} to={`/dashboard/orders/${order._id}`} className="card block p-5 hover:shadow-soft-lg">
//                 <div className="flex flex-wrap items-center justify-between gap-2">
//                   <div>
//                     <p className="font-semibold text-bamboo-800">{order.orderNumber}</p>
//                     <p className="text-xs text-bamboo-400">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
//                   </div>
//                   <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_COLORS[order.orderStatus] || 'bg-gray-100 text-gray-700'}`}>
//                     {order.orderStatus.replace(/_/g, ' ')}
//                   </span>
//                 </div>
//                 <div className="mt-3 flex items-center justify-between text-sm text-bamboo-500">
//                   <span>{order.items.length} item(s)</span>
//                   <span className="font-display text-base font-semibold text-bamboo-700">₹{order.grandTotal}</span>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MyOrders;



import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiChevronRight, FiLock, FiPackage, FiTruck } from 'react-icons/fi';

import { orderApi } from '../../services/commerceApi';
import EmptyState from '../../components/ui/EmptyState';

const EASE = [0.22, 1, 0.36, 1];
const MAX_THUMBS = 4;

const STATUS_FILTERS = [
  { value: '', label: 'All orders' },
  { value: 'placed', label: 'Placed' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

const STATUS_LABELS = {
  placed: 'Order placed',
  confirmed: 'Confirmed',
  packed: 'Packed',
  shipped: 'Shipped',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  returned: 'Returned',
  refunded: 'Refunded',
};

const STATUS_COLORS = {
  placed: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-blue-100 text-blue-700',
  packed: 'bg-purple-100 text-purple-700',
  shipped: 'bg-orange-100 text-orange-700',
  out_for_delivery: 'bg-orange-100 text-orange-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  returned: 'bg-amber-100 text-amber-700',
  refunded: 'bg-amber-100 text-amber-700',
};

const formatINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

/* ------------------------------------------------------------------ */
/* Order card                                                          */
/* ------------------------------------------------------------------ */

const OrderCard = ({ order, index }) => {
  const items = order.items || [];
  const itemCount = items.reduce((sum, i) => sum + (i.quantity || 1), 0);
  const visibleItems = items.slice(0, MAX_THUMBS);
  const extra = items.length - MAX_THUMBS;
  const firstName = items[0]?.name;
  const statusLabel = STATUS_LABELS[order.orderStatus] || order.orderStatus?.replace(/_/g, ' ');
  const badgeClass = STATUS_COLORS[order.orderStatus] || 'bg-bamboo-100 text-bamboo-700';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3), ease: EASE }}
    >
      <Link
        to={`/dashboard/orders/${order._id}`}
        className="group block rounded-2xl border border-bamboo-200/70 bg-white p-4 transition-shadow hover:shadow-md sm:p-5"
      >
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-bamboo-900">Order {order.orderNumber}</p>
            <p className="mt-0.5 text-xs text-bamboo-400">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>{statusLabel}</span>
        </div>

        {/* Items preview */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex shrink-0 -space-x-2">
            {visibleItems.map((item, i) =>
              item.image ? (
                <img
                  key={item._id || i}
                  src={item.image}
                  alt={item.name}
                  className="h-12 w-12 rounded-lg border-2 border-white object-cover"
                />
              ) : (
                <div key={item._id || i} className="h-12 w-12 rounded-lg border-2 border-white bg-sand-200" />
              )
            )}
            {extra > 0 && (
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-white bg-bamboo-100 text-xs font-semibold text-bamboo-600">
                +{extra}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-bamboo-800">{firstName}</p>
            <p className="text-xs text-bamboo-500">
              {items.length > 1 ? `and ${items.length - 1} more · ` : ''}
              {itemCount} item{itemCount > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Tracking highlight (only when the API returns it) */}
        {order.trackingNumber && (
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl border border-bamboo-300 bg-bamboo-50 px-3 py-2.5 text-sm">
            <span className="flex items-center gap-1.5 font-semibold text-bamboo-800">
              <FiTruck size={14} /> {order.shippingPartner || 'Courier'}
            </span>
            <span className="text-bamboo-600">
              Tracking: <span className="font-mono font-semibold text-bamboo-900">{order.trackingNumber}</span>
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-bamboo-100 pt-3">
          <div>
            <p className="text-[11px] text-bamboo-400">Total</p>
            <p className="font-display text-lg font-bold tabular-nums text-bamboo-900">
              {formatINR(order.grandTotal)}
            </p>
          </div>
          <span className="flex items-center gap-1 text-sm font-semibold text-bamboo-600 group-hover:text-bamboo-800">
            View details
            <FiChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const MyOrders = () => {
  const [status, setStatus] = useState('');

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['my-orders', status],
    queryFn: () => orderApi.getMyOrders(status ? { status } : {}),
    select: (res) => res.data.data.orders,
  });

  const activeFilterLabel = STATUS_FILTERS.find((f) => f.value === status)?.label?.toLowerCase();

  return (
    <div className="min-h-screen bg-[#F7F4EC] pb-16">
      <Helmet>
        <title>My Orders | Wa-Kriti</title>
      </Helmet>

      {/* Top bar */}
      <div className="border-b border-bamboo-200/60 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <h1 className="font-display text-xl font-bold text-bamboo-900 sm:text-2xl">
            My orders
            {!isLoading && data?.length > 0 && (
              <span className="ml-2 text-sm font-normal text-bamboo-500">({data.length})</span>
            )}
          </h1>
          <span className="flex items-center gap-1.5 text-xs font-medium text-green-700 sm:text-sm">
            <FiLock size={14} /> Secure account
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 pt-6 sm:pt-8">
        {/* Filters */}
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setStatus(f.value)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                status === f.value
                  ? 'border-bamboo-600 bg-bamboo-600 text-white'
                  : 'border-bamboo-200/70 bg-white text-bamboo-700 hover:border-bamboo-400'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="mt-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-44 animate-pulse rounded-2xl bg-sand-200" />
            ))}
          </div>
        ) : isError ? (
          <div className="mt-8 rounded-2xl border border-bamboo-200/70 bg-white px-6 py-12 text-center">
            <p className="font-display text-lg font-semibold text-bamboo-900">We couldn’t load your orders</p>
            <p className="mt-1 text-sm text-bamboo-500">Please check your connection and try again.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 rounded-full border border-bamboo-600 px-5 py-2 text-sm font-semibold text-bamboo-600 hover:bg-bamboo-600 hover:text-white"
            >
              Try again
            </button>
          </div>
        ) : !data?.length ? (
          <div className="mt-8 flex flex-col items-center rounded-2xl border border-bamboo-200/70 bg-white px-6 py-14 text-center">
            <span className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-bamboo-50 text-bamboo-500">
              <FiPackage size={28} />
            </span>
            {status ? (
              <>
                <p className="font-display text-lg font-semibold text-bamboo-900">No {activeFilterLabel} orders</p>
                <p className="mt-1 text-sm text-bamboo-500">Try another filter to see your other orders.</p>
                <button
                  type="button"
                  onClick={() => setStatus('')}
                  className="mt-4 text-sm font-semibold text-bamboo-600 hover:underline"
                >
                  Show all orders
                </button>
              </>
            ) : (
              <EmptyState
                title="No orders yet"
                message="Your order history will show up here once you place your first order."
                actionLabel="Start Shopping"
                actionTo="/shop"
              />
            )}
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {data.map((order, index) => (
              <OrderCard key={order._id} order={order} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
