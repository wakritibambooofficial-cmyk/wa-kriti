

// import { useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { useQuery, useQueryClient } from '@tanstack/react-query';
// import { Helmet } from 'react-helmet-async';
// import toast from 'react-hot-toast';
// import { FiDownload, FiX } from 'react-icons/fi';

// import { orderApi } from '../../services/commerceApi';
// import Button from '../../components/ui/Button';
// import OrderItemReviewAction from '../../components/review/OrderItemReviewAction';

// const TIMELINE_LABELS = {
//   placed: 'Order Placed',
//   confirmed: 'Confirmed',
//   packed: 'Packed',
//   shipped: 'Shipped',
//   out_for_delivery: 'Out For Delivery',
//   delivered: 'Delivered',
//   cancelled: 'Cancelled',
//   returned: 'Returned',
//   refunded: 'Refunded',
// };

// const OrderDetail = () => {
//   const { id } = useParams(); 
//   const queryClient = useQueryClient();
//   const [isCancelling, setIsCancelling] = useState(false);
//   const [isDownloading, setIsDownloading] = useState(false);

//   const { data: order, isLoading } = useQuery({
//     queryKey: ['order', id],
//     queryFn: () => orderApi.getOrderById(id),
//     select: (res) => res.data.data.order,
//   });

//   const handleCancel = async () => {
//     setIsCancelling(true);
//     try {
//       await orderApi.cancelOrder(id, 'Cancelled by customer from dashboard');
//       toast.success('Order cancelled successfully');
//       queryClient.invalidateQueries({ queryKey: ['order', id] });
//     } catch (error) {
//       toast.error(error?.response?.data?.message || 'Could not cancel order');
//     } finally {
//       setIsCancelling(false);
//     }
//   };

//   const handleDownloadInvoice = async () => {
//     setIsDownloading(true);
//     try {
//       const response = await orderApi.downloadInvoice(id);
//       const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = `invoice-${order.orderNumber}.pdf`;
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
//     } catch {
//       toast.error('Could not download invoice');
//     } finally {
//       setIsDownloading(false);
//     }
//   };

//   if (isLoading || !order) {
//     return (
//       <div className="mx-auto max-w-4xl px-4 py-12">
//         <div className="h-40 animate-pulse rounded-2xl bg-sand-200" />
//       </div>
//     );
//   }

//   // const canCancel = !['delivered', 'cancelled', 'refunded'].includes(order.orderStatus);
//   const canCancel = ['placed', 'confirmed'].includes(order.orderStatus);

//   return (
//     <div className="min-h-screen bg-sand-100 pb-20">
//       <Helmet><title>Order {order.orderNumber}</title></Helmet>
//       <div className="mx-auto max-w-4xl px-4 py-10">
//         <div className="flex flex-wrap items-center justify-between gap-3">
//           <div>
//             <h1 className="font-display text-2xl font-bold text-bamboo-800">Order {order.orderNumber}</h1>
//             <p className="text-sm text-bamboo-500">
//               Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
//             </p>
//           </div>
//           <div className="flex gap-2">
//             <Button variant="secondary" onClick={handleDownloadInvoice} isLoading={isDownloading} className="!px-4 !py-2 text-sm">
//               <FiDownload size={14} className="mr-1.5" /> Invoice
//             </Button>
//             {canCancel && (
//               <Button variant="danger" onClick={handleCancel} isLoading={isCancelling} className="!px-4 !py-2 text-sm">
//                 <FiX size={14} className="mr-1.5" /> Cancel Order
//               </Button>
//             )}
//           </div>
//         </div>

//         {/* Timeline */}
//         <div className="card mt-6 p-6">
//           <h2 className="font-display text-lg font-semibold text-bamboo-800">Order Timeline</h2>
//           <div className="mt-4 space-y-4">
//             {order.timeline.map((event, idx) => (
//               <div key={idx} className="flex gap-3">
//                 <div className="flex flex-col items-center">
//                   <div className="h-3 w-3 rounded-full bg-bamboo-600" />
//                   {idx < order.timeline.length - 1 && <div className="w-px flex-1 bg-sand-300" />}
//                 </div>
//                 <div className="pb-4">
//                   <p className="text-sm font-semibold text-bamboo-800">{TIMELINE_LABELS[event.status] || event.status}</p>
//                   {event.description && <p className="text-xs text-bamboo-500">{event.description}</p>}
//                   <p className="text-xs text-bamboo-400">{new Date(event.timestamp).toLocaleString('en-IN')}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//           {order.trackingNumber && (
//             <div className="mt-2 rounded-xl bg-sand-100 p-3 text-sm">
//               <span className="font-medium text-bamboo-700">Tracking Number:</span> {order.trackingNumber}
//               {order.shippingPartner && <span> ({order.shippingPartner})</span>}
//             </div>
//           )}
//         </div>

//         {/* Items */}
//         <div className="card mt-6 p-6">
//           <h2 className="font-display text-lg font-semibold text-bamboo-800">Items</h2>
//           <div className="mt-4 divide-y divide-sand-300">
//             {order.items.map((item) => (
//               <div key={item._id} className="py-3">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     {item.image && <img src={item.image} alt={item.name} className="h-14 w-14 rounded-lg object-cover" />}
//                     <div>
//                       <p className="text-sm font-medium text-bamboo-800">{item.name}</p>
//                       <p className="text-xs text-bamboo-500">Qty: {item.quantity} × ₹{item.price}</p>
//                     </div>
//                   </div>
//                   <p className="text-sm font-semibold text-bamboo-700">₹{item.subtotal}</p>
//                 </div>
//                 <div className="mt-2.5">
//                   <OrderItemReviewAction order={order} item={item} />
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="mt-4 space-y-1.5 border-t border-sand-300 pt-4 text-sm">
//             <div className="flex justify-between text-bamboo-600"><span>Subtotal</span><span>₹{order.subtotal}</span></div>
//             {order.discount > 0 && <div className="flex justify-between text-bamboo-600"><span>Discount</span><span className="text-red-500">- ₹{order.discount}</span></div>}
//             <div className="flex justify-between text-bamboo-600"><span>Shipping</span><span>{order.shippingCost === 0 ? 'Free' : `₹${order.shippingCost}`}</span></div>
//             <div className="flex justify-between font-display text-base font-semibold text-bamboo-800"><span>Total</span><span>₹{order.grandTotal}</span></div>
//           </div>
//         </div>

//         {/* Shipping Address */}
//         <div className="card mt-6 p-6">
//           <h2 className="font-display text-lg font-semibold text-bamboo-800">Shipping Address</h2>
//           <p className="mt-2 text-sm text-bamboo-600">
//             {order.shippingAddress.fullName}<br />
//             {order.shippingAddress.addressLine1}, {order.shippingAddress.addressLine2}<br />
//             {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}<br />
//             Phone: {order.shippingAddress.phone}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderDetail;



import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiCheck,
  FiCopy,
  FiDownload,
  FiLock,
  FiMapPin,
  FiPackage,
  FiTruck,
  FiX,
} from 'react-icons/fi';

import { orderApi } from '../../services/commerceApi';
import Button from '../../components/ui/Button';
import OrderItemReviewAction from '../../components/review/OrderItemReviewAction';

const EASE = [0.22, 1, 0.36, 1];

const TIMELINE_LABELS = {
  placed: 'Order Placed',
  confirmed: 'Confirmed',
  packed: 'Packed',
  shipped: 'Shipped',
  out_for_delivery: 'Out For Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  returned: 'Returned',
  refunded: 'Refunded',
};

// Happy-path steps shown in the progress tracker
const PROGRESS_STEPS = ['placed', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered'];

const STATUS_BADGE = {
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  returned: 'bg-amber-100 text-amber-700',
  refunded: 'bg-amber-100 text-amber-700',
};

const formatINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

const formatDateTime = (d) =>
  new Date(d).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });

/* ------------------------------------------------------------------ */
/* Progress tracker                                                    */
/* ------------------------------------------------------------------ */

const ProgressTracker = ({ status }) => {
  const currentIdx = PROGRESS_STEPS.indexOf(status);

  // Cancelled / returned / refunded orders don't follow the happy path
  if (currentIdx === -1) return null;

  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-[520px] items-start">
        {PROGRESS_STEPS.map((step, idx) => {
          const done = idx < currentIdx;
          const active = idx === currentIdx;
          return (
            <div key={step} className="flex flex-1 flex-col items-center text-center">
              <div className="flex w-full items-center">
                <div className={`h-0.5 flex-1 ${idx === 0 ? 'opacity-0' : done || active ? 'bg-bamboo-600' : 'bg-bamboo-200'}`} />
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    done
                      ? 'bg-bamboo-600 text-white'
                      : active
                      ? 'border-2 border-bamboo-600 bg-white text-bamboo-700 ring-4 ring-bamboo-100'
                      : 'border-2 border-bamboo-200 bg-white text-bamboo-300'
                  }`}
                >
                  {done ? <FiCheck size={14} /> : idx + 1}
                </span>
                <div
                  className={`h-0.5 flex-1 ${
                    idx === PROGRESS_STEPS.length - 1 ? 'opacity-0' : done ? 'bg-bamboo-600' : 'bg-bamboo-200'
                  }`}
                />
              </div>
              <p
                className={`mt-2 px-1 text-[11px] leading-tight sm:text-xs ${
                  active ? 'font-semibold text-bamboo-900' : done ? 'text-bamboo-600' : 'text-bamboo-300'
                }`}
              >
                {TIMELINE_LABELS[step]}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Highlighted tracking card                                           */
/* ------------------------------------------------------------------ */

const TrackingCard = ({ trackingNumber, shippingPartner }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(trackingNumber);
      setCopied(true);
      toast.success('Tracking number copied');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy. Please select and copy it manually.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="overflow-hidden rounded-2xl border-2 border-bamboo-600 bg-bamboo-50"
    >
      <div className="flex items-center gap-2 bg-bamboo-600 px-5 py-2.5 text-sm font-semibold text-white">
        <FiTruck size={16} /> Your package is on its way
      </div>
      <div className="grid gap-4 p-5 sm:grid-cols-2 sm:gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-bamboo-500">Shipping partner</p>
          <p className="mt-1 font-display text-xl font-bold text-bamboo-900">
            {shippingPartner || 'Will be updated soon'}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-bamboo-500">Tracking number</p>
          <div className="mt-1 flex items-center gap-2">
            <p className="break-all font-mono text-xl font-bold tracking-wide text-bamboo-900">{trackingNumber}</p>
            <button
              type="button"
              onClick={handleCopy}
              aria-label="Copy tracking number"
              className="flex shrink-0 items-center gap-1 rounded-full border border-bamboo-300 bg-white px-3 py-1.5 text-xs font-semibold text-bamboo-700 transition-colors hover:bg-bamboo-100"
            >
              {copied ? <FiCheck size={13} className="text-green-600" /> : <FiCopy size={13} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
      <p className="border-t border-bamboo-200/70 px-5 py-3 text-xs text-bamboo-600">
        Use this number on the shipping partner’s website to see live tracking updates.
      </p>
    </motion.div>
  );
};

const SummaryRow = ({ label, value, highlight }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-bamboo-600">{label}</span>
    <span className={`tabular-nums ${highlight ? 'font-medium text-green-600' : 'text-bamboo-800'}`}>{value}</span>
  </div>
);

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const OrderDetail = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [isCancelling, setIsCancelling] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const {
    data: order,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderApi.getOrderById(id),
    select: (res) => res.data.data.order,
  });

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order? This cannot be undone.')) return;
    setIsCancelling(true);
    try {
      await orderApi.cancelOrder(id, 'Cancelled by customer from dashboard');
      toast.success('Order cancelled successfully');
      queryClient.invalidateQueries({ queryKey: ['order', id] });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not cancel order');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleDownloadInvoice = async () => {
    setIsDownloading(true);
    try {
      const response = await orderApi.downloadInvoice(id);
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${order.orderNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error('Could not download invoice');
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F4EC]">
        <div className="mx-auto max-w-4xl space-y-4 px-4 py-10">
          <div className="h-8 w-56 animate-pulse rounded-lg bg-sand-200" />
          <div className="h-32 animate-pulse rounded-2xl bg-sand-200" />
          <div className="h-48 animate-pulse rounded-2xl bg-sand-200" />
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen bg-[#F7F4EC]">
        <div className="mx-auto max-w-md px-4 py-20 text-center">
          <p className="font-display text-xl font-semibold text-bamboo-900">We couldn’t find this order</p>
          <p className="mt-2 text-sm text-bamboo-500">It may have been removed, or the link is incorrect.</p>
          <Link to="/orders" className="mt-5 inline-block text-sm font-semibold text-bamboo-600 hover:underline">
            Back to my orders
          </Link>
        </div>
      </div>
    );
  }

  const canCancel = ['placed', 'confirmed'].includes(order.orderStatus);
  const timeline = order.timeline || [];
  const statusLabel = TIMELINE_LABELS[order.orderStatus] || order.orderStatus;
  const badgeClass = STATUS_BADGE[order.orderStatus] || 'bg-bamboo-100 text-bamboo-700';
  const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);
  const addr = order.shippingAddress || {};
  const hasTracking = Boolean(order.trackingNumber);

  return (
    <div className="min-h-screen bg-[#F7F4EC] pb-16">
      <Helmet>
        <title>Order {order.orderNumber} | Wa-Kriti</title>
      </Helmet>

      {/* Top bar */}
      <div className="border-b border-bamboo-200/60 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <Link
            to="/orders"
            className="flex items-center gap-1.5 text-sm font-medium text-bamboo-600 hover:text-bamboo-800"
          >
            <FiArrowLeft size={15} /> My orders
          </Link>
          <span className="flex items-center gap-1.5 text-xs font-medium text-green-700 sm:text-sm">
            <FiLock size={14} /> Secure order
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-4xl space-y-5 px-4 pt-6 sm:pt-8">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-2xl font-bold text-bamboo-900">Order {order.orderNumber}</h1>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>{statusLabel}</span>
            </div>
            <p className="mt-1 text-sm text-bamboo-500">
              Placed on {formatDate(order.createdAt)} · {itemCount} item{itemCount > 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={handleDownloadInvoice}
              isLoading={isDownloading}
              className="!px-4 !py-2 text-sm"
            >
              <FiDownload size={14} className="mr-1.5" /> Invoice
            </Button>
            {canCancel && (
              <Button variant="danger" onClick={handleCancel} isLoading={isCancelling} className="!px-4 !py-2 text-sm">
                <FiX size={14} className="mr-1.5" /> Cancel order
              </Button>
            )}
          </div>
        </div>

        {/* Highlighted tracking info */}
        {hasTracking && (
          <TrackingCard trackingNumber={order.trackingNumber} shippingPartner={order.shippingPartner} />
        )}

        {/* Progress */}
        {PROGRESS_STEPS.includes(order.orderStatus) && (
          <div className="rounded-2xl border border-bamboo-200/70 bg-white p-5 sm:p-6">
            <h2 className="mb-5 font-display text-lg font-semibold text-bamboo-900">Order status</h2>
            <ProgressTracker status={order.orderStatus} />
          </div>
        )}

        {/* Timeline */}
        {timeline.length > 0 && (
          <div className="rounded-2xl border border-bamboo-200/70 bg-white p-5 sm:p-6">
            <h2 className="font-display text-lg font-semibold text-bamboo-900">Order updates</h2>
            <div className="mt-4">
              {timeline.map((event, idx) => {
                const isLatest = idx === timeline.length - 1;
                return (
                  <div key={idx} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={`mt-1 h-3 w-3 shrink-0 rounded-full ${
                          isLatest ? 'bg-bamboo-600 ring-4 ring-bamboo-100' : 'bg-bamboo-300'
                        }`}
                      />
                      {idx < timeline.length - 1 && <span className="w-px flex-1 bg-bamboo-200" />}
                    </div>
                    <div className="pb-5">
                      <p className={`text-sm ${isLatest ? 'font-semibold text-bamboo-900' : 'font-medium text-bamboo-700'}`}>
                        {TIMELINE_LABELS[event.status] || event.status}
                      </p>
                      {event.description && <p className="text-xs text-bamboo-500">{event.description}</p>}
                      <p className="text-xs text-bamboo-400">{formatDateTime(event.timestamp)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Items */}
        <div className="rounded-2xl border border-bamboo-200/70 bg-white p-5 sm:p-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-bamboo-900">
            <FiPackage size={17} className="text-bamboo-500" /> Items in this order
          </h2>

          <div className="mt-4 divide-y divide-bamboo-100">
            {order.items.map((item) => (
              <div key={item._id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex items-center gap-4">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="h-16 w-16 shrink-0 rounded-xl object-cover" />
                  ) : (
                    <div className="h-16 w-16 shrink-0 rounded-xl bg-sand-200" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-medium text-bamboo-900">{item.name}</p>
                    <p className="mt-0.5 text-xs text-bamboo-500">
                      Qty: {item.quantity} × {formatINR(item.price)}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold tabular-nums text-bamboo-900">
                    {formatINR(item.subtotal)}
                  </p>
                </div>
                <div className="mt-3">
                  <OrderItemReviewAction order={order} item={item} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-2.5 border-t border-bamboo-100 pt-4">
            <SummaryRow label="Subtotal" value={formatINR(order.subtotal)} />
            {order.discount > 0 && <SummaryRow label="Discount" value={`− ${formatINR(order.discount)}`} highlight />}
            <SummaryRow
              label="Delivery"
              value={order.shippingCost === 0 ? 'FREE' : formatINR(order.shippingCost)}
              highlight={order.shippingCost === 0}
            />
            <div className="flex items-baseline justify-between border-t border-bamboo-100 pt-3">
              <span className="font-display text-base font-semibold text-bamboo-900">Total paid</span>
              <span className="font-display text-xl font-bold tabular-nums text-bamboo-900">
                {formatINR(order.grandTotal)}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping address */}
        <div className="rounded-2xl border border-bamboo-200/70 bg-white p-5 sm:p-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-bamboo-900">
            <FiMapPin size={17} className="text-bamboo-500" /> Delivery address
          </h2>
          <div className="mt-3 text-sm leading-relaxed text-bamboo-600">
            <p className="font-semibold text-bamboo-900">{addr.fullName}</p>
            <p>
              {addr.addressLine1}
              {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
            </p>
            <p>
              {addr.city}, {addr.state} - {addr.pincode}
            </p>
            {addr.phone && <p className="mt-1 text-bamboo-500">Phone: {addr.phone}</p>}
          </div>
        </div>

        {/* Help */}
        <p className="pb-2 text-center text-xs text-bamboo-400">
          Need help with this order? Contact our support team and mention order {order.orderNumber}.
        </p>
      </div>
    </div>
  );
};

export default OrderDetail;