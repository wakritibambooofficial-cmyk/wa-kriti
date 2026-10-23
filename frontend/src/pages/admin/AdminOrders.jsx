


// import { useState, useMemo, useEffect } from 'react';
// import { useQuery, useQueryClient } from '@tanstack/react-query';
// import { Helmet } from 'react-helmet-async';
// import toast from 'react-hot-toast';
// import {
//   Search, Printer, FileText, X, Package,
//   IndianRupee, Clock, CheckCircle2, XCircle, RotateCcw, Truck,
// } from 'lucide-react';
// import { adminOrderApi } from '../../services/adminApi';
// import Button from '../../components/ui/Button';

// const STATUS_OPTIONS = [
//   'placed', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered',
//   'cancelled', 'returned', 'refunded', 'exchange_requested', 'exchange_approved', 'exchange_completed',
// ];

// const STATUS_META = {
//   placed:               { label: 'Placed',            badge: 'bg-amber-100 text-amber-700' },
//   confirmed:            { label: 'Confirmed',         badge: 'bg-blue-100 text-blue-700' },
//   packed:               { label: 'Packed',            badge: 'bg-indigo-100 text-indigo-700' },
//   shipped:              { label: 'Shipped',           badge: 'bg-purple-100 text-purple-700' },
//   out_for_delivery:     { label: 'Out for Delivery',  badge: 'bg-cyan-100 text-cyan-700' },
//   delivered:            { label: 'Delivered',         badge: 'bg-green-100 text-green-700' },
//   cancelled:            { label: 'Cancelled',         badge: 'bg-red-100 text-red-700' },
//   returned:             { label: 'Returned',          badge: 'bg-orange-100 text-orange-700' },
//   refunded:             { label: 'Refunded',          badge: 'bg-gray-200 text-gray-700' },
//   exchange_requested:   { label: 'Exchange Requested',badge: 'bg-pink-100 text-pink-700' },
//   exchange_approved:    { label: 'Exchange Approved', badge: 'bg-pink-100 text-pink-700' },
//   exchange_completed:   { label: 'Exchange Completed',badge: 'bg-pink-100 text-pink-700' },
// };

// const QUICK_TABS = [
//   { key: 'all', label: 'All Orders' },
//   { key: 'placed', label: 'Pending' },
//   { key: 'confirmed', label: 'Confirmed' },
//   { key: 'shipped', label: 'Shipped' },
//   { key: 'delivered', label: 'Delivered' },
//   { key: 'cancelled', label: 'Cancelled' },
//   { key: 'returned', label: 'Returned' },
// ];

// const DATE_PRESETS = [
//   { key: 'all', label: 'All Time' },
//   { key: 'today', label: 'Today' },
//   { key: '7d', label: 'Last 7 Days' },
//   { key: '30d', label: 'This Month' },
//   { key: 'custom', label: 'Custom Range' },
// ];

// const PAGE_SIZE = 20;

// // ---------- helpers ----------
// const isSameDay = (a, b) =>
//   a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

// const formatMoney = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
// const formatDateTime = (d) =>
//   new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

// const openPrintWindow = (html) => {
//   const win = window.open('', '_blank', 'width=900,height=1000');
//   if (!win) {
//     toast.error('Please allow pop-ups to print');
//     return;
//   }
//   win.document.write(html);
//   win.document.close();
//   win.focus();
//   setTimeout(() => win.print(), 400);
// };

// const buildInvoiceHTML = (orders) => {
//   const pages = orders.map((order, idx) => {
//     const items = order.items || [];
//     const subtotal = items.reduce((s, it) => s + (it.price || 0) * (it.quantity || 1), 0);
//     const addr = order.shippingAddress || {};
//     return `
//       <div class="page" style="${idx < orders.length - 1 ? 'page-break-after: always;' : ''}">
//         <div class="header">
//           <div>
//             <h1>WA-KRITI</h1>
//             <p class="muted">Handmade &amp; Eco-friendly Goods</p>
//           </div>
//           <div class="text-right">
//             <h2>Tax Invoice</h2>
//             <p class="muted">Order #${order.orderNumber}</p>
//             <p class="muted">${formatDateTime(order.createdAt)}</p>
//           </div>
//         </div>

//         <div class="grid">
//           <div>
//             <p class="label">Billed To</p>
//             <p>${order.customer?.firstName || ''} ${order.customer?.lastName || ''}</p>
//             <p class="muted">${order.customer?.email || ''}</p>
//             <p class="muted">${addr.phone || ''}</p>
//           </div>
//           <div>
//             <p class="label">Ship To</p>
//             <p>${addr.line1 || ''} ${addr.line2 || ''}</p>
//             <p class="muted">${addr.city || ''}, ${addr.state || ''} - ${addr.pincode || ''}</p>
//           </div>
//           <div>
//             <p class="label">Payment</p>
//             <p class="muted capitalize">${order.paymentStatus || 'N/A'}</p>
//             <p class="label" style="margin-top:8px;">Status</p>
//             <p class="muted capitalize">${(order.orderStatus || '').replace(/_/g, ' ')}</p>
//           </div>
//         </div>

//         <table class="items">
//           <thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Amount</th></tr></thead>
//           <tbody>
//             ${items.map((it) => `
//               <tr>
//                 <td>${it.name || 'Item'}</td>
//                 <td>${it.quantity || 1}</td>
//                 <td>${formatMoney(it.price)}</td>
//                 <td>${formatMoney((it.price || 0) * (it.quantity || 1))}</td>
//               </tr>`).join('')}
//           </tbody>
//         </table>

//         <div class="totals">
//           <div class="row"><span>Subtotal</span><span>${formatMoney(subtotal)}</span></div>
//           <div class="row"><span>Shipping</span><span>${formatMoney(order.shippingCost || 0)}</span></div>
//           <div class="row"><span>Tax</span><span>${formatMoney(order.tax || 0)}</span></div>
//           <div class="row total"><span>Grand Total</span><span>${formatMoney(order.grandTotal)}</span></div>
//         </div>

//         <p class="footer">Thank you for shopping with Wa-Kriti — handcrafted with care.</p>
//       </div>`;
//   }).join('');

//   return `
//     <html>
//       <head>
//         <title>Invoice</title>
//         <style>
//           * { box-sizing: border-box; font-family: Georgia, 'Times New Roman', serif; }
//           body { margin: 0; padding: 0; color: #2d3327; }
//           .page { padding: 40px; }
//           .header { display: flex; justify-content: space-between; border-bottom: 2px solid #2d3327; padding-bottom: 16px; margin-bottom: 20px; }
//           h1 { margin: 0; font-size: 24px; letter-spacing: 1px; }
//           h2 { margin: 0; font-size: 18px; }
//           .text-right { text-align: right; }
//           .muted { color: #6b7263; font-size: 13px; margin: 2px 0; }
//           .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 24px; }
//           .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #8a917f; margin: 0 0 4px; }
//           .capitalize { text-transform: capitalize; }
//           table.items { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
//           table.items th { text-align: left; font-size: 12px; text-transform: uppercase; color: #8a917f; border-bottom: 1px solid #ddd; padding: 8px; }
//           table.items td { padding: 8px; border-bottom: 1px solid #eee; font-size: 14px; }
//           .totals { width: 260px; margin-left: auto; }
//           .totals .row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 14px; }
//           .totals .total { border-top: 2px solid #2d3327; margin-top: 6px; padding-top: 8px; font-weight: bold; font-size: 16px; }
//           .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #8a917f; }
//           @media print { .page { padding: 20px; } }
//         </style>
//       </head>
//       <body>${pages}</body>
//     </html>`;
// };

// const buildLabelHTML = (orders) => {
//   const pages = orders.map((order, idx) => {
//     const addr = order.shippingAddress || {};
//     const items = order.items || [];
//     return `
//       <div class="label ${idx < orders.length - 1 ? 'break' : ''}">
//         <div class="row-top">
//           <span class="brand">WA-KRITI</span>
//           <span class="cod ${order.paymentStatus === 'paid' ? 'prepaid' : ''}">${order.paymentStatus === 'paid' ? 'PREPAID' : 'COD'}</span>
//         </div>
//         <div class="block">
//           <p class="label-sm">FROM</p>
//           <p>Wa-Kriti Fulfillment Center</p>
//           <p class="muted">Ghaziabad, Uttar Pradesh, India</p>
//         </div>
//         <div class="block">
//           <p class="label-sm">TO</p>
//           <p><strong>${order.customer?.firstName || ''} ${order.customer?.lastName || ''}</strong></p>
//           <p>${addr.line1 || ''} ${addr.line2 || ''}</p>
//           <p>${addr.city || ''}, ${addr.state || ''} - ${addr.pincode || ''}</p>
//           <p>Phone: ${addr.phone || ''}</p>
//         </div>
//         <div class="barcode">*${order.orderNumber}*</div>
//         <div class="row-bottom">
//           <span>Order #${order.orderNumber}</span>
//           <span>${items.length} item(s)</span>
//           <span>${formatMoney(order.grandTotal)}</span>
//         </div>
//       </div>`;
//   }).join('');

//   return `
//     <html>
//       <head>
//         <title>Shipping Label</title>
//         <style>
//           * { box-sizing: border-box; font-family: Arial, sans-serif; }
//           body { margin: 0; padding: 20px; }
//           .label { width: 380px; border: 2px solid #000; padding: 16px; margin: 0 auto 20px; }
//           .label.break { page-break-after: always; }
//           .row-top { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed #000; padding-bottom: 8px; margin-bottom: 10px; }
//           .brand { font-weight: bold; font-size: 16px; letter-spacing: 1px; }
//           .cod { font-size: 12px; font-weight: bold; padding: 3px 8px; border: 1px solid #000; }
//           .cod.prepaid { background: #000; color: #fff; }
//           .block { margin-bottom: 10px; }
//           .label-sm { font-size: 10px; font-weight: bold; letter-spacing: 0.5px; margin: 0 0 2px; }
//           .muted { color: #555; font-size: 12px; margin: 0; }
//           .barcode { text-align: center; font-family: 'Libre Barcode 39', monospace; font-size: 36px; letter-spacing: 2px; margin: 10px 0; }
//           .row-bottom { display: flex; justify-content: space-between; border-top: 1px dashed #000; padding-top: 8px; font-size: 12px; font-weight: bold; }
//         </style>
//       </head>
//       <body>${pages}</body>
//     </html>`;
// };

// // ---------- component ----------
// const AdminOrders = () => {
//   const queryClient = useQueryClient();

//   const [rawSearch, setRawSearch] = useState('');
//   const [search, setSearch] = useState('');
//   const [activeTab, setActiveTab] = useState('all');
//   const [datePreset, setDatePreset] = useState('all');
//   const [customFrom, setCustomFrom] = useState('');
//   const [customTo, setCustomTo] = useState('');
//   const [sortBy, setSortBy] = useState('date_desc');
//   const [selected, setSelected] = useState(new Set());
//   const [page, setPage] = useState(1);

//   const [editingOrder, setEditingOrder] = useState(null);
//   const [newStatus, setNewStatus] = useState('');
//   const [trackingNumber, setTrackingNumber] = useState('');
//   const [shippingPartner, setShippingPartner] = useState('');
//   const [isSaving, setIsSaving] = useState(false);

//   // debounce search input
//   useEffect(() => {
//     const t = setTimeout(() => { setSearch(rawSearch); setPage(1); }, 400);
//     return () => clearTimeout(t);
//   }, [rawSearch]);

//   const statusFilter = activeTab === 'all' ? '' : activeTab;

//   const { data, isLoading } = useQuery({
//     queryKey: ['admin-orders', statusFilter, search],
//     queryFn: () => adminOrderApi.getAll({ status: statusFilter || undefined, q: search || undefined }),
//     select: (res) => res.data.data.orders,
//   });

//   // client-side date filter + sort
//   const filtered = useMemo(() => {
//     let list = data || [];
//     const now = new Date();

//     if (datePreset === 'today') {
//       list = list.filter((o) => isSameDay(new Date(o.createdAt), now));
//     } else if (datePreset === '7d') {
//       const cutoff = new Date(now); cutoff.setDate(cutoff.getDate() - 7);
//       list = list.filter((o) => new Date(o.createdAt) >= cutoff);
//     } else if (datePreset === '30d') {
//       const cutoff = new Date(now); cutoff.setDate(cutoff.getDate() - 30);
//       list = list.filter((o) => new Date(o.createdAt) >= cutoff);
//     } else if (datePreset === 'custom' && customFrom && customTo) {
//       const from = new Date(customFrom);
//       const to = new Date(customTo); to.setHours(23, 59, 59, 999);
//       list = list.filter((o) => {
//         const d = new Date(o.createdAt);
//         return d >= from && d <= to;
//       });
//     }

//     const sorted = [...list].sort((a, b) => {
//       if (sortBy === 'date_desc') return new Date(b.createdAt) - new Date(a.createdAt);
//       if (sortBy === 'date_asc') return new Date(a.createdAt) - new Date(b.createdAt);
//       if (sortBy === 'amount_desc') return (b.grandTotal || 0) - (a.grandTotal || 0);
//       if (sortBy === 'amount_asc') return (a.grandTotal || 0) - (b.grandTotal || 0);
//       return 0;
//     });

//     return sorted;
//   }, [data, datePreset, customFrom, customTo, sortBy]);

//   // stats — computed from full unfiltered dataset
//   const stats = useMemo(() => {
//     const all = data || [];
//     const now = new Date();
//     const today = all.filter((o) => isSameDay(new Date(o.createdAt), now));
//     return {
//       todayCount: today.length,
//       todayRevenue: today.reduce((s, o) => s + (o.grandTotal || 0), 0),
//       pending: all.filter((o) => o.orderStatus === 'placed').length,
//       shipped: all.filter((o) => ['shipped', 'out_for_delivery'].includes(o.orderStatus)).length,
//       delivered: all.filter((o) => o.orderStatus === 'delivered').length,
//       cancelled: all.filter((o) => ['cancelled', 'returned'].includes(o.orderStatus)).length,
//     };
//   }, [data]);

//   const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
//   const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

//   const selectedOrders = useMemo(
//     () => filtered.filter((o) => selected.has(o._id)),
//     [filtered, selected]
//   );

//   const toggleSelectAll = () => {
//     if (pageData.every((o) => selected.has(o._id))) {
//       const next = new Set(selected);
//       pageData.forEach((o) => next.delete(o._id));
//       setSelected(next);
//     } else {
//       const next = new Set(selected);
//       pageData.forEach((o) => next.add(o._id));
//       setSelected(next);
//     }
//   };

//   const toggleSelectOne = (id) => {
//     const next = new Set(selected);
//     next.has(id) ? next.delete(id) : next.add(id);
//     setSelected(next);
//   };

//   const clearFilters = () => {
//     setRawSearch(''); setSearch(''); setActiveTab('all');
//     setDatePreset('all'); setCustomFrom(''); setCustomTo('');
//     setSortBy('date_desc'); setPage(1);
//   };

//   const openStatusModal = (order) => {
//     setEditingOrder(order);
//     setNewStatus(order.orderStatus);
//     setTrackingNumber(order.trackingNumber || '');
//     setShippingPartner(order.shippingPartner || '');
//   };

//   const handleUpdateStatus = async () => {
//     setIsSaving(true);
//     try {
//       await adminOrderApi.updateStatus(editingOrder._id, {
//         status: newStatus,
//         trackingNumber,
//         shippingPartner,
//         description: `Status updated to ${newStatus} by admin`,
//       });
//       toast.success('Order status updated');
//       queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
//       setEditingOrder(null);
//     } catch (error) {
//       toast.error(error?.response?.data?.message || 'Could not update order');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleBulkStatusUpdate = async (status) => {
//     if (!selectedOrders.length) return;
//     const toastId = toast.loading(`Updating ${selectedOrders.length} orders...`);
//     try {
//       await Promise.all(
//         selectedOrders.map((o) =>
//           adminOrderApi.updateStatus(o._id, { status, description: `Bulk updated to ${status} by admin` })
//         )
//       );
//       toast.success('Orders updated', { id: toastId });
//       queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
//       setSelected(new Set());
//     } catch {
//       toast.error('Some updates failed', { id: toastId });
//     }
//   };

//   const STAT_CARDS = [
//     { label: "Today's Orders", value: stats.todayCount, icon: Clock, color: 'text-amber-600 bg-amber-100' },
//     { label: "Today's Revenue", value: formatMoney(stats.todayRevenue), icon: IndianRupee, color: 'text-green-600 bg-green-100' },
//     { label: 'Pending', value: stats.pending, icon: Package, color: 'text-blue-600 bg-blue-100' },
//     { label: 'Shipped', value: stats.shipped, icon: Truck, color: 'text-purple-600 bg-purple-100' },
//     { label: 'Delivered', value: stats.delivered, icon: CheckCircle2, color: 'text-green-600 bg-green-100' },
//     { label: 'Cancelled/Returned', value: stats.cancelled, icon: XCircle, color: 'text-red-600 bg-red-100' },
//   ];

//   return (
//     <div className="px-6 py-8">
//       <Helmet><title>Manage Orders</title></Helmet>

//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="font-display text-2xl font-bold text-bamboo-800">Orders</h1>
//           <p className="text-sm text-bamboo-500">Manage, track, and fulfill customer orders</p>
//         </div>
//         <Button variant="secondary" onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-orders'] })}>
//           <RotateCcw size={14} className="mr-1.5 inline" /> Refresh
//         </Button>
//       </div>

//       {/* Stat cards */}
//       <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
//         {STAT_CARDS.map((c) => (
//           <div key={c.label} className="rounded-2xl bg-white p-4 shadow-soft">
//             <div className={`mb-2 inline-flex h-9 w-9 items-center justify-center rounded-full ${c.color}`}>
//               <c.icon size={16} />
//             </div>
//             <p className="text-xs font-medium uppercase tracking-wide text-bamboo-400">{c.label}</p>
//             <p className="mt-1 text-lg font-bold text-bamboo-800">{c.value}</p>
//           </div>
//         ))}
//       </div>

//       {/* Status tabs */}
//       <div className="mt-6 flex flex-wrap gap-2 border-b border-sand-200 pb-3">
//         {QUICK_TABS.map((tab) => (
//           <button
//             key={tab.key}
//             onClick={() => { setActiveTab(tab.key); setPage(1); }}
//             className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
//               activeTab === tab.key
//                 ? 'bg-bamboo-700 text-white'
//                 : 'bg-sand-100 text-bamboo-600 hover:bg-sand-200'
//             }`}
//           >
//             {tab.label}
//           </button>
//         ))}
//       </div>

//       {/* Filter bar */}
//       <div className="mt-4 flex flex-wrap items-center gap-3">
//         <div className="relative">
//           <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-bamboo-400" />
//           <input
//             value={rawSearch}
//             onChange={(e) => setRawSearch(e.target.value)}
//             placeholder="Search order #, customer, email..."
//             className="input-field !w-72 !py-2 pl-9 text-sm"
//           />
//         </div>

//         <select value={datePreset} onChange={(e) => { setDatePreset(e.target.value); setPage(1); }} className="input-field !w-40 !py-2 text-sm">
//           {DATE_PRESETS.map((d) => <option key={d.key} value={d.key}>{d.label}</option>)}
//         </select>

//         {datePreset === 'custom' && (
//           <>
//             <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} className="input-field !w-40 !py-2 text-sm" />
//             <span className="text-bamboo-400">to</span>
//             <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} className="input-field !w-40 !py-2 text-sm" />
//           </>
//         )}

//         <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input-field !w-48 !py-2 text-sm">
//           <option value="date_desc">Newest First</option>
//           <option value="date_asc">Oldest First</option>
//           <option value="amount_desc">Amount: High to Low</option>
//           <option value="amount_asc">Amount: Low to High</option>
//         </select>

//         {(rawSearch || activeTab !== 'all' || datePreset !== 'all' || sortBy !== 'date_desc') && (
//           <button onClick={clearFilters} className="flex items-center gap-1 text-xs font-semibold text-bamboo-500 hover:text-bamboo-700">
//             <X size={14} /> Clear filters
//           </button>
//         )}

//         <span className="ml-auto text-xs text-bamboo-400">{filtered.length} order(s)</span>
//       </div>

//       {/* Bulk action bar */}
//       {selected.size > 0 && (
//         <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl bg-bamboo-50 px-4 py-3">
//           <span className="text-sm font-semibold text-bamboo-700">{selected.size} selected</span>
//           <button
//             onClick={() => openPrintWindow(buildInvoiceHTML(selectedOrders))}
//             className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-bamboo-700 shadow-sm hover:bg-sand-50"
//           >
//             <FileText size={13} /> Print Invoices
//           </button>
//           <button
//             onClick={() => openPrintWindow(buildLabelHTML(selectedOrders))}
//             className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-bamboo-700 shadow-sm hover:bg-sand-50"
//           >
//             <Printer size={13} /> Print Shipping Labels
//           </button>
//           <div className="relative">
//             <select
//               onChange={(e) => e.target.value && handleBulkStatusUpdate(e.target.value)}
//               defaultValue=""
//               className="input-field !w-52 !py-1.5 text-xs"
//             >
//               <option value="" disabled>Bulk update status to...</option>
//               {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
//             </select>
//           </div>
//           <button onClick={() => setSelected(new Set())} className="ml-auto text-xs font-semibold text-bamboo-500 hover:underline">
//             Clear selection
//           </button>
//         </div>
//       )}

//       {/* Table */}
//       <div className="mt-4 overflow-x-auto rounded-2xl bg-white shadow-soft">
//         <table className="w-full text-left text-sm">
//           <thead className="bg-sand-100 text-xs uppercase text-bamboo-500">
//             <tr>
//               <th className="w-10 px-4 py-3">
//                 <input
//                   type="checkbox"
//                   checked={pageData.length > 0 && pageData.every((o) => selected.has(o._id))}
//                   onChange={toggleSelectAll}
//                 />
//               </th>
//               <th className="px-4 py-3">Order #</th>
//               <th className="px-4 py-3">Customer</th>
//               <th className="px-4 py-3">Items</th>
//               <th className="px-4 py-3">Total</th>
//               <th className="px-4 py-3">Payment</th>
//               <th className="px-4 py-3">Status</th>
//               <th className="px-4 py-3">Date</th>
//               <th className="px-4 py-3">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-sand-200">
//             {isLoading ? (
//               <tr><td colSpan={9} className="px-4 py-8 text-center text-bamboo-400">Loading...</td></tr>
//             ) : !pageData.length ? (
//               <tr><td colSpan={9} className="px-4 py-8 text-center text-bamboo-400">No orders found</td></tr>
//             ) : (
//               pageData.map((order) => {
//                 const meta = STATUS_META[order.orderStatus] || { label: order.orderStatus, badge: 'bg-gray-100 text-gray-700' };
//                 const today = isSameDay(new Date(order.createdAt), new Date());
//                 return (
//                   <tr key={order._id} className={selected.has(order._id) ? 'bg-bamboo-50/50' : ''}>
//                     <td className="px-4 py-3">
//                       <input type="checkbox" checked={selected.has(order._id)} onChange={() => toggleSelectOne(order._id)} />
//                     </td>
//                     <td className="px-4 py-3 font-medium text-bamboo-800">
//                       {order.orderNumber}
//                       {today && <span className="ml-2 rounded-full bg-bamboo-700 px-2 py-0.5 text-[10px] font-semibold text-white">TODAY</span>}
//                     </td>
//                     <td className="px-4 py-3 text-bamboo-600">{order.customer?.firstName} {order.customer?.lastName}</td>
//                     <td className="px-4 py-3 text-bamboo-600">{order.items?.length || 0}</td>
//                     <td className="px-4 py-3 font-medium text-bamboo-700">{formatMoney(order.grandTotal)}</td>
//                     <td className="px-4 py-3 capitalize text-bamboo-600">{order.paymentStatus}</td>
//                     <td className="px-4 py-3">
//                       <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${meta.badge}`}>{meta.label}</span>
//                     </td>
//                     <td className="px-4 py-3 text-xs text-bamboo-400">{formatDateTime(order.createdAt)}</td>
//                     <td className="px-4 py-3">
//                       <div className="flex items-center gap-2">
//                         <button onClick={() => openStatusModal(order)} className="text-xs font-semibold text-bamboo-600 hover:underline">
//                           Update
//                         </button>
//                         <button
//                           title="Print Invoice"
//                           onClick={() => openPrintWindow(buildInvoiceHTML([order]))}
//                           className="rounded-md p-1.5 text-bamboo-500 hover:bg-sand-100"
//                         >
//                           <FileText size={14} />
//                         </button>
//                         <button
//                           title="Print Shipping Label"
//                           onClick={() => openPrintWindow(buildLabelHTML([order]))}
//                           className="rounded-md p-1.5 text-bamboo-500 hover:bg-sand-100"
//                         >
//                           <Printer size={14} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="mt-4 flex items-center justify-between text-sm text-bamboo-500">
//           <span>Page {page} of {totalPages}</span>
//           <div className="flex gap-2">
//             <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="rounded-lg border border-sand-200 px-3 py-1.5 disabled:opacity-40">
//               Prev
//             </button>
//             <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-lg border border-sand-200 px-3 py-1.5 disabled:opacity-40">
//               Next
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Status update modal */}
//       {editingOrder && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
//           <div className="w-full max-w-md rounded-2xl bg-white p-6">
//             <h2 className="font-display text-lg font-semibold text-bamboo-800">Update Order {editingOrder.orderNumber}</h2>

//             <div className="mt-4 space-y-3">
//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Status</label>
//                 <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="input-field">
//                   {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
//                 </select>
//               </div>
//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Tracking Number</label>
//                 <input value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} className="input-field" />
//               </div>
//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Shipping Partner</label>
//                 <input value={shippingPartner} onChange={(e) => setShippingPartner(e.target.value)} className="input-field" />
//               </div>
//             </div>

//             <div className="mt-6 flex gap-3">
//               <Button variant="secondary" className="flex-1" onClick={() => setEditingOrder(null)}>Cancel</Button>
//               <Button className="flex-1" onClick={handleUpdateStatus} isLoading={isSaving}>Save</Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminOrders;

import { useState, useMemo, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import {
  Search, Printer, FileText, X, Package,
  IndianRupee, Clock, CheckCircle2, XCircle, RotateCcw, Truck,
} from 'lucide-react';
import { adminOrderApi } from '../../services/adminApi';
import Button from '../../components/ui/Button';

const STATUS_OPTIONS = [
  'placed', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered',
  'cancelled', 'returned', 'refunded', 'exchange_requested', 'exchange_approved', 'exchange_completed',
];

const STATUS_META = {
  placed:               { label: 'Placed',            badge: 'bg-amber-100 text-amber-700' },
  confirmed:            { label: 'Confirmed',         badge: 'bg-blue-100 text-blue-700' },
  packed:               { label: 'Packed',            badge: 'bg-indigo-100 text-indigo-700' },
  shipped:              { label: 'Shipped',           badge: 'bg-purple-100 text-purple-700' },
  out_for_delivery:     { label: 'Out for Delivery',  badge: 'bg-cyan-100 text-cyan-700' },
  delivered:            { label: 'Delivered',         badge: 'bg-green-100 text-green-700' },
  cancelled:            { label: 'Cancelled',         badge: 'bg-red-100 text-red-700' },
  returned:             { label: 'Returned',          badge: 'bg-orange-100 text-orange-700' },
  refunded:             { label: 'Refunded',          badge: 'bg-gray-200 text-gray-700' },
  exchange_requested:   { label: 'Exchange Requested',badge: 'bg-pink-100 text-pink-700' },
  exchange_approved:    { label: 'Exchange Approved', badge: 'bg-pink-100 text-pink-700' },
  exchange_completed:   { label: 'Exchange Completed',badge: 'bg-pink-100 text-pink-700' },
};

const QUICK_TABS = [
  { key: 'all', label: 'All Orders' },
  { key: 'placed', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' },
  { key: 'returned', label: 'Returned' },
];

const DATE_PRESETS = [
  { key: 'all', label: 'All Time' },
  { key: 'today', label: 'Today' },
  { key: '7d', label: 'Last 7 Days' },
  { key: '30d', label: 'This Month' },
  { key: 'custom', label: 'Custom Range' },
];

const PAGE_SIZE = 20;

// ---------- branding / support ----------
const LOGO_PATH = '/wakriti-logo.png'; // file inside /public — change if your file name differs
const SUPPORT_PHONE = '9366431377';
const SUPPORT_WA_LINK = 'https://wa.me/919366431377?text=Hi%2C%20I%20need%20help%20with%20an%20order.';
const SUPPORT_EMAIL = 'wakriti.bambooofficial@gmail.com';

// The print window is a blank page, so the logo needs an absolute URL
const logoUrl = () => `${window.location.origin}${LOGO_PATH}`;

// ---------- helpers ----------
const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const formatMoney = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
const formatDateTime = (d) =>
  new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const openPrintWindow = (html) => {
  const win = window.open('', '_blank', 'width=900,height=1000');
  if (!win) {
    toast.error('Please allow pop-ups to print');
    return;
  }
  win.document.write(html);
  win.document.close();
  win.focus();

  // wait for the logo(s) to load before opening the print dialog
  const imgs = Array.from(win.document.images);
  Promise.all(
    imgs.map((img) =>
      img.complete
        ? Promise.resolve()
        : new Promise((res) => { img.onload = res; img.onerror = res; })
    )
  ).then(() => setTimeout(() => win.print(), 200));
};

const buildInvoiceHTML = (orders) => {
  const logo = logoUrl();

  const pages = orders.map((order, idx) => {
    const items = order.items || [];
    const subtotal = items.reduce((s, it) => s + (it.price || 0) * (it.quantity || 1), 0);
    const addr = order.shippingAddress || {};
    return `
      <div class="page" style="${idx < orders.length - 1 ? 'page-break-after: always;' : ''}">
        <div class="header">
          <div style="display:flex; align-items:center; gap:12px;">
            <img src="${logo}" alt="Wa-Kriti" class="logo" />
            <div>
              <h1>WA-KRITI</h1>
              <p class="muted">Handmade &amp; Eco-friendly Goods</p>
            </div>
          </div>
          <div class="text-right">
            <h2>Tax Invoice</h2>
            <p class="muted">Order #${order.orderNumber}</p>
            <p class="muted">${formatDateTime(order.createdAt)}</p>
          </div>
        </div>

        <div class="grid">
          <div>
            <p class="label">Billed To</p>
            <p>${order.customer?.firstName || ''} ${order.customer?.lastName || ''}</p>
            <p class="muted">${order.customer?.email || ''}</p>
            <p class="muted">${addr.phone || ''}</p>
          </div>
          <div>
            <p class="label">Ship To</p>
            <p>${addr.line1 || ''} ${addr.line2 || ''}</p>
            <p class="muted">${addr.city || ''}, ${addr.state || ''} - ${addr.pincode || ''}</p>
          </div>
          <div>
            <p class="label">Payment</p>
            <p class="muted capitalize">${order.paymentStatus || 'N/A'}</p>
            <p class="label" style="margin-top:8px;">Status</p>
            <p class="muted capitalize">${(order.orderStatus || '').replace(/_/g, ' ')}</p>
          </div>
        </div>

        <table class="items">
          <thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Amount</th></tr></thead>
          <tbody>
            ${items.map((it) => `
              <tr>
                <td>${it.name || 'Item'}</td>
                <td>${it.quantity || 1}</td>
                <td>${formatMoney(it.price)}</td>
                <td>${formatMoney((it.price || 0) * (it.quantity || 1))}</td>
              </tr>`).join('')}
          </tbody>
        </table>

        <div class="totals-wrap">
          <img src="${logo}" alt="" class="watermark" />
          <div class="totals">
            <div class="row"><span>Subtotal</span><span>${formatMoney(subtotal)}</span></div>
            <div class="row"><span>Shipping</span><span>${formatMoney(order.shippingCost || 0)}</span></div>
            <div class="row"><span>Tax</span><span>${formatMoney(order.tax || 0)}</span></div>
            <div class="row total"><span>Grand Total</span><span>${formatMoney(order.grandTotal)}</span></div>
          </div>
        </div>

        <div class="support">
          <p class="label">Need help?</p>
          <p class="muted">WhatsApp us at <a href="${SUPPORT_WA_LINK}">${SUPPORT_PHONE}</a></p>
          <p class="muted">Write to us at <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a></p>
        </div>

        <p class="footer">Thank you for shopping with Wa-Kriti — handcrafted with care.</p>
      </div>`;
  }).join('');

  return `
    <html>
      <head>
        <title>Invoice</title>
        <style>
          * { box-sizing: border-box; font-family: Georgia, 'Times New Roman', serif; }
          body { margin: 0; padding: 0; color: #2d3327; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .page { padding: 40px; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #2d3327; padding-bottom: 16px; margin-bottom: 20px; }
          h1 { margin: 0; font-size: 24px; letter-spacing: 1px; }
          h2 { margin: 0; font-size: 18px; }
          .logo { width: 64px; height: 64px; object-fit: contain; }
          .text-right { text-align: right; }
          .muted { color: #6b7263; font-size: 13px; margin: 2px 0; }
          .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 24px; }
          .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #8a917f; margin: 0 0 4px; }
          .capitalize { text-transform: capitalize; }
          table.items { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          table.items th { text-align: left; font-size: 12px; text-transform: uppercase; color: #8a917f; border-bottom: 1px solid #ddd; padding: 8px; }
          table.items td { padding: 8px; border-bottom: 1px solid #eee; font-size: 14px; }
          .totals-wrap { position: relative; margin-top: 8px; }
          .watermark { position: absolute; top: 50%; left: 50%; width: 190px; height: 190px; object-fit: contain; transform: translate(-50%, -50%); opacity: 0.2; z-index: 0; pointer-events: none; }
          .totals { position: relative; z-index: 1; width: 260px; margin-left: auto; }
          .totals .row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 14px; }
          .totals .total { border-top: 2px solid #2d3327; margin-top: 6px; padding-top: 8px; font-weight: bold; font-size: 16px; }
          .support { text-align: right; margin-top: 32px; padding-top: 16px; border-top: 1px dashed #bbb; }
          .support a { color: #2d3327; text-decoration: none; font-weight: bold; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #8a917f; }
          @media print { .page { padding: 20px; } }
        </style>
      </head>
      <body>${pages}</body>
    </html>`;
};

const buildLabelHTML = (orders) => {
  const logo = logoUrl();

  const pages = orders.map((order, idx) => {
    const addr = order.shippingAddress || {};
    const items = order.items || [];
    return `
      <div class="label ${idx < orders.length - 1 ? 'break' : ''}">
        <div class="row-top">
          <span class="brand"><img src="${logo}" class="logo-sm" alt="" /> WA-KRITI</span>
          <span class="cod ${order.paymentStatus === 'paid' ? 'prepaid' : ''}">${order.paymentStatus === 'paid' ? 'PREPAID' : 'COD'}</span>
        </div>
        <div class="block">
          <p class="label-sm">FROM</p>
          <p>Wa-Kriti Fulfillment Center</p>
          <p class="muted">Ghaziabad, Uttar Pradesh, India</p>
        </div>
        <div class="block">
          <p class="label-sm">TO</p>
          <p><strong>${order.customer?.firstName || ''} ${order.customer?.lastName || ''}</strong></p>
          <p>${addr.line1 || ''} ${addr.line2 || ''}</p>
          <p>${addr.city || ''}, ${addr.state || ''} - ${addr.pincode || ''}</p>
          <p>Phone: ${addr.phone || ''}</p>
        </div>
        <div class="barcode">*${order.orderNumber}*</div>
        <div class="row-bottom">
          <span>Order #${order.orderNumber}</span>
          <span>${items.length} item(s)</span>
          <span>${formatMoney(order.grandTotal)}</span>
        </div>
        <div class="auth-footer">
          <img src="${logo}" class="stamp-sm" alt="Authentic" />
          <div>
            <p class="muted"><strong>Authentic Wa-Kriti Product</strong></p>
            <p class="muted">Need help? WhatsApp: ${SUPPORT_PHONE}</p>
            <p class="muted">${SUPPORT_EMAIL}</p>
          </div>
        </div>
      </div>`;
  }).join('');

  return `
    <html>
      <head>
        <title>Shipping Label</title>
        <style>
          * { box-sizing: border-box; font-family: Arial, sans-serif; }
          body { margin: 0; padding: 20px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .label { width: 380px; border: 2px solid #000; padding: 16px; margin: 0 auto 20px; }
          .label.break { page-break-after: always; }
          .row-top { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed #000; padding-bottom: 8px; margin-bottom: 10px; }
          .brand { display: flex; align-items: center; gap: 8px; font-weight: bold; font-size: 16px; letter-spacing: 1px; }
          .logo-sm { width: 36px; height: 36px; object-fit: contain; }
          .cod { font-size: 12px; font-weight: bold; padding: 3px 8px; border: 1px solid #000; }
          .cod.prepaid { background: #000; color: #fff; }
          .block { margin-bottom: 10px; }
          .label-sm { font-size: 10px; font-weight: bold; letter-spacing: 0.5px; margin: 0 0 2px; }
          .muted { color: #555; font-size: 12px; margin: 0; }
          .barcode { text-align: center; font-family: 'Libre Barcode 39', monospace; font-size: 36px; letter-spacing: 2px; margin: 10px 0; }
          .row-bottom { display: flex; justify-content: space-between; border-top: 1px dashed #000; padding-top: 8px; font-size: 12px; font-weight: bold; }
          .auth-footer { display: flex; align-items: center; gap: 10px; border-top: 1px dashed #000; margin-top: 10px; padding-top: 8px; }
          .stamp-sm { width: 48px; height: 48px; object-fit: contain; }
        </style>
      </head>
      <body>${pages}</body>
    </html>`;
};

// ---------- component ----------
const AdminOrders = () => {
  const queryClient = useQueryClient();

  const [rawSearch, setRawSearch] = useState('');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [datePreset, setDatePreset] = useState('all');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');
  const [selected, setSelected] = useState(new Set());
  const [page, setPage] = useState(1);

  const [editingOrder, setEditingOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shippingPartner, setShippingPartner] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // debounce search input
  useEffect(() => {
    const t = setTimeout(() => { setSearch(rawSearch); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [rawSearch]);

  const statusFilter = activeTab === 'all' ? '' : activeTab;

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', statusFilter, search],
    queryFn: () => adminOrderApi.getAll({ status: statusFilter || undefined, q: search || undefined }),
    select: (res) => res.data.data.orders,
  });

  // client-side date filter + sort
  const filtered = useMemo(() => {
    let list = data || [];
    const now = new Date();

    if (datePreset === 'today') {
      list = list.filter((o) => isSameDay(new Date(o.createdAt), now));
    } else if (datePreset === '7d') {
      const cutoff = new Date(now); cutoff.setDate(cutoff.getDate() - 7);
      list = list.filter((o) => new Date(o.createdAt) >= cutoff);
    } else if (datePreset === '30d') {
      const cutoff = new Date(now); cutoff.setDate(cutoff.getDate() - 30);
      list = list.filter((o) => new Date(o.createdAt) >= cutoff);
    } else if (datePreset === 'custom' && customFrom && customTo) {
      const from = new Date(customFrom);
      const to = new Date(customTo); to.setHours(23, 59, 59, 999);
      list = list.filter((o) => {
        const d = new Date(o.createdAt);
        return d >= from && d <= to;
      });
    }

    const sorted = [...list].sort((a, b) => {
      if (sortBy === 'date_desc') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'date_asc') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'amount_desc') return (b.grandTotal || 0) - (a.grandTotal || 0);
      if (sortBy === 'amount_asc') return (a.grandTotal || 0) - (b.grandTotal || 0);
      return 0;
    });

    return sorted;
  }, [data, datePreset, customFrom, customTo, sortBy]);

  // stats — computed from full unfiltered dataset
  const stats = useMemo(() => {
    const all = data || [];
    const now = new Date();
    const today = all.filter((o) => isSameDay(new Date(o.createdAt), now));
    return {
      todayCount: today.length,
      todayRevenue: today.reduce((s, o) => s + (o.grandTotal || 0), 0),
      pending: all.filter((o) => o.orderStatus === 'placed').length,
      shipped: all.filter((o) => ['shipped', 'out_for_delivery'].includes(o.orderStatus)).length,
      delivered: all.filter((o) => o.orderStatus === 'delivered').length,
      cancelled: all.filter((o) => ['cancelled', 'returned'].includes(o.orderStatus)).length,
    };
  }, [data]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const selectedOrders = useMemo(
    () => filtered.filter((o) => selected.has(o._id)),
    [filtered, selected]
  );

  const toggleSelectAll = () => {
    if (pageData.every((o) => selected.has(o._id))) {
      const next = new Set(selected);
      pageData.forEach((o) => next.delete(o._id));
      setSelected(next);
    } else {
      const next = new Set(selected);
      pageData.forEach((o) => next.add(o._id));
      setSelected(next);
    }
  };

  const toggleSelectOne = (id) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const clearFilters = () => {
    setRawSearch(''); setSearch(''); setActiveTab('all');
    setDatePreset('all'); setCustomFrom(''); setCustomTo('');
    setSortBy('date_desc'); setPage(1);
  };

  const openStatusModal = (order) => {
    setEditingOrder(order);
    setNewStatus(order.orderStatus);
    setTrackingNumber(order.trackingNumber || '');
    setShippingPartner(order.shippingPartner || '');
  };

  const handleUpdateStatus = async () => {
    setIsSaving(true);
    try {
      await adminOrderApi.updateStatus(editingOrder._id, {
        status: newStatus,
        trackingNumber,
        shippingPartner,
        description: `Status updated to ${newStatus} by admin`,
      });
      toast.success('Order status updated');
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      setEditingOrder(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not update order');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBulkStatusUpdate = async (status) => {
    if (!selectedOrders.length) return;
    const toastId = toast.loading(`Updating ${selectedOrders.length} orders...`);
    try {
      await Promise.all(
        selectedOrders.map((o) =>
          adminOrderApi.updateStatus(o._id, { status, description: `Bulk updated to ${status} by admin` })
        )
      );
      toast.success('Orders updated', { id: toastId });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      setSelected(new Set());
    } catch {
      toast.error('Some updates failed', { id: toastId });
    }
  };

  const STAT_CARDS = [
    { label: "Today's Orders", value: stats.todayCount, icon: Clock, color: 'text-amber-600 bg-amber-100' },
    { label: "Today's Revenue", value: formatMoney(stats.todayRevenue), icon: IndianRupee, color: 'text-green-600 bg-green-100' },
    { label: 'Pending', value: stats.pending, icon: Package, color: 'text-blue-600 bg-blue-100' },
    { label: 'Shipped', value: stats.shipped, icon: Truck, color: 'text-purple-600 bg-purple-100' },
    { label: 'Delivered', value: stats.delivered, icon: CheckCircle2, color: 'text-green-600 bg-green-100' },
    { label: 'Cancelled/Returned', value: stats.cancelled, icon: XCircle, color: 'text-red-600 bg-red-100' },
  ];

  return (
    <div className="px-6 py-8">
      <Helmet><title>Manage Orders</title></Helmet>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-bamboo-800">Orders</h1>
          <p className="text-sm text-bamboo-500">Manage, track, and fulfill customer orders</p>
        </div>
        <Button variant="secondary" onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-orders'] })}>
          <RotateCcw size={14} className="mr-1.5 inline" /> Refresh
        </Button>
      </div>

      {/* Stat cards */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {STAT_CARDS.map((c) => (
          <div key={c.label} className="rounded-2xl bg-white p-4 shadow-soft">
            <div className={`mb-2 inline-flex h-9 w-9 items-center justify-center rounded-full ${c.color}`}>
              <c.icon size={16} />
            </div>
            <p className="text-xs font-medium uppercase tracking-wide text-bamboo-400">{c.label}</p>
            <p className="mt-1 text-lg font-bold text-bamboo-800">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Status tabs */}
      <div className="mt-6 flex flex-wrap gap-2 border-b border-sand-200 pb-3">
        {QUICK_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setPage(1); }}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              activeTab === tab.key
                ? 'bg-bamboo-700 text-white'
                : 'bg-sand-100 text-bamboo-600 hover:bg-sand-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filter bar */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-bamboo-400" />
          <input
            value={rawSearch}
            onChange={(e) => setRawSearch(e.target.value)}
            placeholder="Search order #, customer, email..."
            className="input-field !w-72 !py-2 pl-9 text-sm"
          />
        </div>

        <select value={datePreset} onChange={(e) => { setDatePreset(e.target.value); setPage(1); }} className="input-field !w-40 !py-2 text-sm">
          {DATE_PRESETS.map((d) => <option key={d.key} value={d.key}>{d.label}</option>)}
        </select>

        {datePreset === 'custom' && (
          <>
            <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} className="input-field !w-40 !py-2 text-sm" />
            <span className="text-bamboo-400">to</span>
            <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} className="input-field !w-40 !py-2 text-sm" />
          </>
        )}

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input-field !w-48 !py-2 text-sm">
          <option value="date_desc">Newest First</option>
          <option value="date_asc">Oldest First</option>
          <option value="amount_desc">Amount: High to Low</option>
          <option value="amount_asc">Amount: Low to High</option>
        </select>

        {(rawSearch || activeTab !== 'all' || datePreset !== 'all' || sortBy !== 'date_desc') && (
          <button onClick={clearFilters} className="flex items-center gap-1 text-xs font-semibold text-bamboo-500 hover:text-bamboo-700">
            <X size={14} /> Clear filters
          </button>
        )}

        <span className="ml-auto text-xs text-bamboo-400">{filtered.length} order(s)</span>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl bg-bamboo-50 px-4 py-3">
          <span className="text-sm font-semibold text-bamboo-700">{selected.size} selected</span>
          <button
            onClick={() => openPrintWindow(buildInvoiceHTML(selectedOrders))}
            className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-bamboo-700 shadow-sm hover:bg-sand-50"
          >
            <FileText size={13} /> Print Invoices
          </button>
          <button
            onClick={() => openPrintWindow(buildLabelHTML(selectedOrders))}
            className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-bamboo-700 shadow-sm hover:bg-sand-50"
          >
            <Printer size={13} /> Print Shipping Labels
          </button>
          <div className="relative">
            <select
              onChange={(e) => e.target.value && handleBulkStatusUpdate(e.target.value)}
              defaultValue=""
              className="input-field !w-52 !py-1.5 text-xs"
            >
              <option value="" disabled>Bulk update status to...</option>
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
            </select>
          </div>
          <button onClick={() => setSelected(new Set())} className="ml-auto text-xs font-semibold text-bamboo-500 hover:underline">
            Clear selection
          </button>
        </div>
      )}

      {/* Table */}
      <div className="mt-4 overflow-x-auto rounded-2xl bg-white shadow-soft">
        <table className="w-full text-left text-sm">
          <thead className="bg-sand-100 text-xs uppercase text-bamboo-500">
            <tr>
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={pageData.length > 0 && pageData.every((o) => selected.has(o._id))}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="px-4 py-3">Order #</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand-200">
            {isLoading ? (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-bamboo-400">Loading...</td></tr>
            ) : !pageData.length ? (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-bamboo-400">No orders found</td></tr>
            ) : (
              pageData.map((order) => {
                const meta = STATUS_META[order.orderStatus] || { label: order.orderStatus, badge: 'bg-gray-100 text-gray-700' };
                const today = isSameDay(new Date(order.createdAt), new Date());
                return (
                  <tr key={order._id} className={selected.has(order._id) ? 'bg-bamboo-50/50' : ''}>
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected.has(order._id)} onChange={() => toggleSelectOne(order._id)} />
                    </td>
                    <td className="px-4 py-3 font-medium text-bamboo-800">
                      {order.orderNumber}
                      {today && <span className="ml-2 rounded-full bg-bamboo-700 px-2 py-0.5 text-[10px] font-semibold text-white">TODAY</span>}
                    </td>
                    <td className="px-4 py-3 text-bamboo-600">{order.customer?.firstName} {order.customer?.lastName}</td>
                    <td className="px-4 py-3 text-bamboo-600">{order.items?.length || 0}</td>
                    <td className="px-4 py-3 font-medium text-bamboo-700">{formatMoney(order.grandTotal)}</td>
                    <td className="px-4 py-3 capitalize text-bamboo-600">{order.paymentStatus}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${meta.badge}`}>{meta.label}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-bamboo-400">{formatDateTime(order.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openStatusModal(order)} className="text-xs font-semibold text-bamboo-600 hover:underline">
                          Update
                        </button>
                        <button
                          title="Print Invoice"
                          onClick={() => openPrintWindow(buildInvoiceHTML([order]))}
                          className="rounded-md p-1.5 text-bamboo-500 hover:bg-sand-100"
                        >
                          <FileText size={14} />
                        </button>
                        <button
                          title="Print Shipping Label"
                          onClick={() => openPrintWindow(buildLabelHTML([order]))}
                          className="rounded-md p-1.5 text-bamboo-500 hover:bg-sand-100"
                        >
                          <Printer size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-bamboo-500">
          <span>Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="rounded-lg border border-sand-200 px-3 py-1.5 disabled:opacity-40">
              Prev
            </button>
            <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-lg border border-sand-200 px-3 py-1.5 disabled:opacity-40">
              Next
            </button>
          </div>
        </div>
      )}

      {/* Status update modal */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <h2 className="font-display text-lg font-semibold text-bamboo-800">Update Order {editingOrder.orderNumber}</h2>

            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Status</label>
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="input-field">
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Tracking Number</label>
                <input value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Shipping Partner</label>
                <input value={shippingPartner} onChange={(e) => setShippingPartner(e.target.value)} className="input-field" />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setEditingOrder(null)}>Cancel</Button>
              <Button className="flex-1" onClick={handleUpdateStatus} isLoading={isSaving}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;