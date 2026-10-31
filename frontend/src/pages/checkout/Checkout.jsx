

// import { useEffect, useState } from 'react';
// import { Navigate, useNavigate } from 'react-router-dom';
// import { useQuery, useQueryClient } from '@tanstack/react-query';
// import { Helmet } from 'react-helmet-async';
// import toast from 'react-hot-toast';
// import { AnimatePresence, motion } from 'framer-motion';
// import {
//   FiCheck,
//   FiPlus,
//   FiLock,
//   FiShield,
//   FiTruck,
//   FiMapPin,
//   FiCreditCard,
//   FiEdit2,
//   FiChevronDown,
//   FiTag,
// } from 'react-icons/fi';
// import { FaWhatsapp } from 'react-icons/fa';
// import { useSelector } from 'react-redux';

// import { addressApi, orderApi } from '../../services/commerceApi';
// import { cmsApi } from '../../services/cmsApi';
// import { useCart } from '../../hooks/useCart';
// import { loadRazorpayScript } from '../../utils/loadRazorpay';
// import Button from '../../components/ui/Button';
// import AddressForm from '../../components/checkout/AddressForm';

// /* ---------- Config (adjust to your real policies) ---------- */
// const FREE_SHIPPING_THRESHOLD = 999;
// const FLAT_SHIPPING_COST = 79;
// const DELIVERY_DAYS = { min: 4, max: 7 }; // estimated delivery window in days
// const PAYMENT_METHOD = 'razorpay';

// const STEPS = [
//   { key: 'address', label: 'Delivery', icon: FiMapPin },
//   { key: 'pay', label: 'Review & pay', icon: FiCreditCard },
// ];

// const EASE = [0.22, 1, 0.36, 1];

// const listContainer = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
// const listItem = {
//   hidden: { opacity: 0, y: 8 },
//   show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: EASE } },
// };

// /* ---------- Helpers ---------- */
// const formatINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

// const formatDate = (date) =>
//   date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

// const getDeliveryWindow = () => {
//   const from = new Date();
//   const to = new Date();
//   from.setDate(from.getDate() + DELIVERY_DAYS.min);
//   to.setDate(to.getDate() + DELIVERY_DAYS.max);
//   return `${formatDate(from)} – ${formatDate(to)}`;
// };

// // Builds a wa.me link from any phone format (digits only, defaults to +91 for 10-digit numbers)
// const buildWhatsAppLink = (rawNumber, message) => {
//   let digits = String(rawNumber || '').replace(/\D/g, '');
//   if (!digits) return null;
//   if (digits.length === 10) digits = `91${digits}`;
//   return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
// };

// const PriceRow = ({ label, value, highlight, muted }) => (
//   <div className="flex items-center justify-between text-sm">
//     <span className={muted ? 'text-bamboo-400' : 'text-bamboo-600'}>{label}</span>
//     <span className={`tabular-nums ${highlight ? 'font-medium text-green-600' : 'text-bamboo-800'}`}>{value}</span>
//   </div>
// );

// const Checkout = () => {
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();
//   const { user } = useSelector((state) => state.auth);
//   const { items, subtotal, coupon } = useCart();

//   const [step, setStep] = useState(0);
//   const [selectedAddressId, setSelectedAddressId] = useState(null);
//   const [isAddingAddress, setIsAddingAddress] = useState(false);
//   const [notes, setNotes] = useState('');
//   const [isPlacingOrder, setIsPlacingOrder] = useState(false);
//   const [showSummary, setShowSummary] = useState(false);

//   const { data: addresses = [], isLoading: addressesLoading } = useQuery({
//     queryKey: ['addresses'],
//     queryFn: () => addressApi.getAddresses(),
//     select: (res) => res.data.data.addresses,
//   });

//   // Website settings (same query key as the Contact page, so the cache is shared)
//   const { data: settings } = useQuery({
//     queryKey: ['website-settings'],
//     queryFn: () => cmsApi.getSettings(),
//     select: (res) => res.data.data.settings,
//   });

//   // Preselect default address so the customer can continue with one tap
//   useEffect(() => {
//     if (!selectedAddressId && addresses.length) {
//       const def = addresses.find((a) => a.isDefault) || addresses[0];
//       setSelectedAddressId(def._id);
//     }
//   }, [addresses, selectedAddressId]);

//   const goToStep = (n) => {
//     setStep(n);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const selectedAddress = addresses.find((a) => a._id === selectedAddressId);
//   const showAddressForm = isAddingAddress || (!addressesLoading && addresses.length === 0);

//   /* ---------- Pricing ---------- */
//   const discount = coupon?.discountAmount || 0;
//   const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_COST;
//   const grandTotal = Math.max(0, subtotal - discount) + shippingCost;
//   const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
//   const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
//   const totalSavings = discount + (shippingCost === 0 ? FLAT_SHIPPING_COST : 0);
//   const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
//   const deliveryWindow = getDeliveryWindow();

//   // Prefer a dedicated WhatsApp number from settings, fall back to the contact phone
//   const whatsappNumber = settings?.whatsappNumber || settings?.contactPhone;
//   const whatsappLink = buildWhatsAppLink(
//     settings?.whatsappNumber || settings?.contactPhone,
//     'Hi Wa-Kriti, I have a query regarding my order/product.'
//   );
  

//   if (items.length === 0) return <Navigate to="/cart" replace />;

//   /* ---------- Actions ---------- */
//   const handleAddAddress = async (values) => {
//     try {
//       const { data } = await addressApi.createAddress(values);
//       queryClient.invalidateQueries({ queryKey: ['addresses'] });
//       setSelectedAddressId(data.data.address._id);
//       setIsAddingAddress(false);
//       toast.success('Address saved');
//     } catch (error) {
//       toast.error(error?.response?.data?.message || 'Could not save address');
//     }
//   };

//   const handlePlaceOrder = async () => {
//     if (isPlacingOrder) return;
//     if (!selectedAddressId) {
//       toast.error('Please choose where we should deliver your order');
//       goToStep(0);
//       return;
//     }

//     setIsPlacingOrder(true);
//     try {
//       const { data } = await orderApi.checkout({
//         shippingAddressId: selectedAddressId,
//         paymentMethod: PAYMENT_METHOD,
//         notes,
//       });

//       const scriptLoaded = await loadRazorpayScript();
//       if (!scriptLoaded) {
//         toast.error('Could not load the payment window. Please check your connection and try again.');
//         setIsPlacingOrder(false);
//         return;
//       }

//       const { razorpay: rzp, order } = data.data;
//       let completed = false;

//       const razorpayCheckout = new window.Razorpay({
//         key: rzp.keyId,
//         amount: rzp.amount,
//         currency: rzp.currency,
//         order_id: rzp.orderId,
//         name: 'Wa-Kriti',
//         description: `Order ${order.orderNumber}`,
//         theme: { color: '#3F5B3E' },
//         prefill: {
//           name: user?.fullName,
//           email: user?.email,
//           contact: user?.phone || '',
//         },
//         handler: async (response) => {
//           completed = true;
//           try {
//             await orderApi.verifyPayment({
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature,
//             });
//             queryClient.invalidateQueries({ queryKey: ['cart'] });
//             toast.success('Payment successful! Your order is confirmed.');
//             navigate('/order-success', {
//               state: {
//                 orderNumber: order.orderNumber,
//                 orderId: order._id,
//                 shippingAddress: selectedAddress,
//               },
//             });
//           } catch (error) {
//             navigate('/order-failed', { state: { message: error?.response?.data?.message } });
//           }
//         },
//         modal: {
//           ondismiss: async () => {
//             if (completed) return;
//             try {
//               await orderApi.paymentFailed({
//                 razorpay_order_id: rzp.orderId,
//                 error: { description: 'Payment cancelled by user' },
//               });
//             } catch (_) {
//               /* ignore – customer just closed the window */
//             }
//             setIsPlacingOrder(false);
//             toast('Payment cancelled. Your items are still in your cart.', { icon: '⚠️' });
//           },
//         },
//       });

//       razorpayCheckout.on('payment.failed', async (response) => {
//         completed = true;
//         try {
//           await orderApi.paymentFailed({
//             razorpay_order_id: rzp.orderId,
//             error: response.error,
//           });
//         } catch (_) {
//           /* ignore */
//         }
//         navigate('/order-failed', { state: { message: response.error?.description } });
//       });

//       razorpayCheckout.open();
//       // Button stays in loading state while the payment window is open (prevents duplicate orders)
//     } catch (error) {
//       toast.error(error?.response?.data?.message || 'Could not place your order. Please try again.');
//       setIsPlacingOrder(false);
//     }
//   };

//   /* ---------- Primary action (used by desktop card + mobile sticky bar) ---------- */
//   const primaryAction =
//     step === 0
//       ? { label: 'Deliver to this address', onClick: () => goToStep(1), disabled: !selectedAddressId || showAddressForm }
//       : { label: `Pay ${formatINR(grandTotal)} securely`, onClick: handlePlaceOrder, disabled: false };

//   /* ---------- UI ---------- */
//   return (
//     <div className="min-h-screen bg-[#F7F4EC] pb-32 lg:pb-16">
//       <Helmet><title>Secure Checkout | Wa-Kriti</title></Helmet>

//       {/* Top bar */}
//       <div className="border-b border-bamboo-200/60 bg-white/80 backdrop-blur">
//         <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
//           <h1 className="font-display text-xl font-bold text-bamboo-900 sm:text-2xl">Checkout</h1>
//           <span className="flex items-center gap-1.5 text-xs font-medium text-green-700 sm:text-sm">
//             <FiLock size={14} /> 100% secure checkout
//           </span>
//         </div>
//       </div>

//       <div className="mx-auto max-w-6xl px-4 pt-6 sm:pt-8">
//         {/* Progress */}
//         <div className="mb-6 flex items-center gap-3 sm:mb-8">
//           {STEPS.map(({ key, label }, idx) => {
//             const done = idx < step;
//             const active = idx === step;
//             return (
//               <div key={key} className="flex flex-1 items-center gap-3">
//                 <button
//                   type="button"
//                   disabled={!done}
//                   onClick={() => done && goToStep(idx)}
//                   className="flex items-center gap-2 disabled:cursor-default"
//                 >
//                   <span
//                     className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
//                       done
//                         ? 'bg-bamboo-600 text-white'
//                         : active
//                         ? 'border-2 border-bamboo-600 bg-white text-bamboo-700'
//                         : 'border-2 border-bamboo-200 bg-white text-bamboo-300'
//                     }`}
//                   >
//                     {done ? <FiCheck size={14} /> : idx + 1}
//                   </span>
//                   <span className={`text-sm font-medium ${active || done ? 'text-bamboo-900' : 'text-bamboo-300'}`}>
//                     {label}
//                   </span>
//                 </button>
//                 {idx < STEPS.length - 1 && (
//                   <div className={`h-0.5 flex-1 rounded ${done ? 'bg-bamboo-600' : 'bg-bamboo-200'}`} />
//                 )}
//               </div>
//             );
//           })}
//         </div>

//         <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px] lg:gap-10">
//           {/* ================= MAIN ================= */}
//           <div className="lg:order-1">
//             <AnimatePresence mode="wait" initial={false}>
//               {step === 0 && (
//                 <motion.div
//                   key="address-step"
//                   initial={{ opacity: 0, x: -12 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: 12 }}
//                   transition={{ duration: 0.25, ease: EASE }}
//                   className="space-y-5"
//                 >
//                   <div className="rounded-2xl border border-bamboo-200/70 bg-white p-5 sm:p-6">
//                     <h2 className="font-display text-lg font-semibold text-bamboo-900">Where should we deliver?</h2>
//                     <p className="mb-4 mt-1 text-sm text-bamboo-500">Choose a saved address or add a new one.</p>

//                     {addressesLoading ? (
//                       <div className="space-y-3">
//                         {[0, 1].map((i) => (
//                           <div
//                             key={i}
//                             className="h-20 rounded-xl bg-gradient-to-r from-sand-200 via-sand-100 to-sand-200 bg-[length:200%_100%]"
//                             style={{ animation: 'shimmer 1.6s ease-in-out infinite' }}
//                           />
//                         ))}
//                       </div>
//                     ) : (
//                       <motion.div variants={listContainer} initial="hidden" animate="show" className="space-y-3">
//                         {addresses.map((addr) => {
//                           const isSelected = selectedAddressId === addr._id;
//                           return (
//                             <motion.label
//                               key={addr._id}
//                               variants={listItem}
//                               whileTap={{ scale: 0.99 }}
//                               className={`block cursor-pointer rounded-xl border-2 p-4 transition-colors duration-200 ${
//                                 isSelected ? 'border-bamboo-600 bg-bamboo-50' : 'border-bamboo-100 hover:border-bamboo-300'
//                               }`}
//                             >
//                               <div className="flex items-start gap-3">
//                                 <input
//                                   type="radio"
//                                   name="shipping-address"
//                                   checked={isSelected}
//                                   onChange={() => setSelectedAddressId(addr._id)}
//                                   className="mt-1.5 accent-bamboo-600"
//                                 />
//                                 <div className="min-w-0 flex-1">
//                                   <div className="flex flex-wrap items-center gap-2">
//                                     <p className="font-semibold text-bamboo-900">{addr.fullName}</p>
//                                     {addr.label && (
//                                       <span className="rounded-full bg-bamboo-100 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-bamboo-600">
//                                         {addr.label}
//                                       </span>
//                                     )}
//                                     {addr.isDefault && (
//                                       <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-700">
//                                         Default
//                                       </span>
//                                     )}
//                                   </div>
//                                   <p className="mt-1 text-sm text-bamboo-600">
//                                     {addr.addressLine1}
//                                     {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}, {addr.city}, {addr.state} - {addr.pincode}
//                                   </p>
//                                   <p className="mt-0.5 text-sm text-bamboo-500">Phone: {addr.phone}</p>
//                                 </div>
//                               </div>
//                             </motion.label>
//                           );
//                         })}
//                       </motion.div>
//                     )}

//                     <AnimatePresence initial={false} mode="wait">
//                       {showAddressForm ? (
//                         <motion.div
//                           key="form"
//                           initial={{ opacity: 0, height: 0 }}
//                           animate={{ opacity: 1, height: 'auto' }}
//                           exit={{ opacity: 0, height: 0 }}
//                           transition={{ duration: 0.3, ease: EASE }}
//                           className="mt-4 overflow-hidden rounded-xl border border-bamboo-200 bg-bamboo-50/40 p-4"
//                         >
//                           <p className="mb-3 text-sm font-semibold text-bamboo-800">
//                             {addresses.length === 0 ? 'Add your delivery address' : 'New address'}
//                           </p>
//                           <AddressForm onSubmit={handleAddAddress} onCancel={() => setIsAddingAddress(false)} />
//                         </motion.div>
//                       ) : (
//                         <motion.button
//                           key="add-btn"
//                           type="button"
//                           onClick={() => setIsAddingAddress(true)}
//                           className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-bamboo-200 py-3 text-sm font-semibold text-bamboo-600 transition-colors hover:border-bamboo-400 hover:bg-bamboo-50"
//                         >
//                           <FiPlus size={16} /> Add a new address
//                         </motion.button>
//                       )}
//                     </AnimatePresence>
//                   </div>

//                   <div className="rounded-2xl border border-bamboo-200/70 bg-white p-5 sm:p-6">
//                     <label className="mb-1.5 block text-sm font-semibold text-bamboo-800">
//                       Delivery instructions <span className="font-normal text-bamboo-400">(optional)</span>
//                     </label>
//                     <textarea
//                       value={notes}
//                       onChange={(e) => setNotes(e.target.value)}
//                       placeholder="e.g. Call before delivery, leave with security, landmark near gate…"
//                       className="input-field min-h-[80px]"
//                       maxLength={300}
//                     />
//                   </div>

//                   <div className="hidden lg:block">
//                     <Button fullWidth disabled={primaryAction.disabled} onClick={primaryAction.onClick}>
//                       {primaryAction.label}
//                     </Button>
//                   </div>
//                 </motion.div>
//               )}

//               {step === 1 && (
//                 <motion.div
//                   key="pay-step"
//                   initial={{ opacity: 0, x: 12 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -12 }}
//                   transition={{ duration: 0.25, ease: EASE }}
//                   className="space-y-5"
//                 >
//                   {/* Delivery summary */}
//                   <div className="rounded-2xl border border-bamboo-200/70 bg-white p-5 sm:p-6">
//                     <div className="flex items-start justify-between gap-3">
//                       <div className="flex items-start gap-3">
//                         <FiMapPin className="mt-1 shrink-0 text-bamboo-500" />
//                         <div>
//                           <p className="text-xs font-semibold uppercase tracking-wide text-bamboo-400">Delivering to</p>
//                           <p className="mt-0.5 font-semibold text-bamboo-900">{selectedAddress?.fullName}</p>
//                           <p className="text-sm text-bamboo-600">
//                             {selectedAddress?.addressLine1}, {selectedAddress?.city}, {selectedAddress?.state} -{' '}
//                             {selectedAddress?.pincode}
//                           </p>
//                           <p className="text-sm text-bamboo-500">{selectedAddress?.phone}</p>
//                           {notes && <p className="mt-2 text-sm italic text-bamboo-500">“{notes}”</p>}
//                         </div>
//                       </div>
//                       <button
//                         type="button"
//                         onClick={() => goToStep(0)}
//                         className="flex shrink-0 items-center gap-1 text-sm font-medium text-bamboo-600 hover:text-bamboo-800"
//                       >
//                         <FiEdit2 size={13} /> Change
//                       </button>
//                     </div>

//                     <div className="mt-4 flex items-center gap-3 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">
//                       <FiTruck className="shrink-0" size={18} />
//                       <span>
//                         Estimated delivery: <strong>{deliveryWindow}</strong>
//                       </span>
//                     </div>
//                   </div>

//                   {/* Items */}
//                   <div className="rounded-2xl border border-bamboo-200/70 bg-white p-5 sm:p-6">
//                     <h2 className="font-display text-lg font-semibold text-bamboo-900">
//                       Your items ({itemCount})
//                     </h2>
//                     <div className="mt-4 divide-y divide-bamboo-100">
//                       {items.map((item) => (
//                         <div key={item._id || item.productId} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
//                           <img src={item.image} alt={item.name} className="h-16 w-16 rounded-lg object-cover" />
//                           <div className="min-w-0 flex-1">
//                             <p className="line-clamp-2 text-sm font-medium text-bamboo-900">{item.name}</p>
//                             <p className="mt-0.5 text-xs text-bamboo-500">Qty: {item.quantity}</p>
//                           </div>
//                           <span className="shrink-0 text-sm font-semibold tabular-nums text-bamboo-800">
//                             {formatINR(item.price * item.quantity)}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Payment */}
//                   <div className="rounded-2xl border border-bamboo-200/70 bg-white p-5 sm:p-6">
//                     <h2 className="font-display text-lg font-semibold text-bamboo-900">Payment</h2>
//                     <div className="mt-4 flex items-start gap-3 rounded-xl border-2 border-bamboo-600 bg-bamboo-50 p-4">
//                       <FiCreditCard className="mt-0.5 shrink-0 text-bamboo-600" size={20} />
//                       <div>
//                         <p className="font-semibold text-bamboo-900">Pay online</p>
//                         <p className="mt-0.5 text-sm text-bamboo-600">UPI, Debit/Credit cards, Netbanking & Wallets</p>
//                         <p className="mt-2 flex items-center gap-1.5 text-xs text-bamboo-500">
//                           <FiShield size={12} /> Secured by Razorpay. We never store your card details.
//                         </p>
//                       </div>
//                     </div>
//                     <p className="mt-3 text-xs text-bamboo-400">
//                       You’ll choose your payment method in the next window. Your order is confirmed only after payment succeeds.
//                     </p>
//                   </div>

//                   {/* Help / WhatsApp (number comes from website settings) */}
//                  {whatsappLink && (
//   <div className="flex flex-wrap items-center gap-3">
//     <p className="text-base text-bamboo-600">
//       For any query related to product or Bulk-order, please connect
//     </p>
//     <a
//       href={whatsappLink}
//       target="_blank"
//       rel="noopener noreferrer"
//       aria-label="Chat with us on WhatsApp"
//       className="flex items-center gap-2"
//     >
//       <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-md transition-transform hover:scale-105">
//         <FaWhatsapp size={24} />
//       </span>
//       <span className="text-base font-semibold tabular-nums text-bamboo-800">
//         {whatsappNumber}
//       </span>
//     </a>
//   </div>
// )}

//                   <div className="hidden gap-3 lg:flex">
//                     <Button variant="secondary" onClick={() => goToStep(0)}>
//                       Back
//                     </Button>
//                     <Button className="flex-1" onClick={primaryAction.onClick} isLoading={isPlacingOrder}>
//                       <span className="flex items-center justify-center gap-2">
//                         <FiLock size={15} /> {primaryAction.label}
//                       </span>
//                     </Button>
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>

//           {/* ================= SUMMARY ================= */}
//           <aside className="order-first lg:order-2">
//             <div className="lg:sticky lg:top-6">
//               {/* Mobile toggle */}
//               <button
//                 type="button"
//                 onClick={() => setShowSummary((s) => !s)}
//                 className="flex w-full items-center justify-between rounded-2xl border border-bamboo-200/70 bg-white px-4 py-3 lg:hidden"
//               >
//                 <span className="flex items-center gap-2 text-sm font-medium text-bamboo-700">
//                   Order summary ({itemCount} item{itemCount > 1 ? 's' : ''})
//                   <FiChevronDown className={`transition-transform ${showSummary ? 'rotate-180' : ''}`} />
//                 </span>
//                 <span className="font-semibold tabular-nums text-bamboo-900">{formatINR(grandTotal)}</span>
//               </button>

//               <div
//                 className={`${showSummary ? 'mt-3 block' : 'hidden'} rounded-2xl border border-bamboo-200/70 bg-white p-5 lg:mt-0 lg:block`}
//               >
//                 <h2 className="font-display text-lg font-semibold text-bamboo-900">Order summary</h2>

//                 {step === 0 && (
//                   <div className="mt-4 max-h-56 space-y-3 overflow-y-auto pr-1">
//                     {items.map((item) => (
//                       <div key={item._id || item.productId} className="flex items-center gap-3">
//                         <div className="relative">
//                           <img src={item.image} alt={item.name} className="h-12 w-12 rounded-md object-cover" />
//                           <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-bamboo-700 px-1 text-[10px] font-semibold text-white">
//                             {item.quantity}
//                           </span>
//                         </div>
//                         <p className="line-clamp-2 min-w-0 flex-1 text-sm text-bamboo-800">{item.name}</p>
//                         <span className="shrink-0 text-sm tabular-nums text-bamboo-700">
//                           {formatINR(item.price * item.quantity)}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 <div className={`space-y-2.5 ${step === 0 ? 'mt-4 border-t border-bamboo-100 pt-4' : 'mt-4'}`}>
//                   <PriceRow label={`Subtotal (${itemCount} item${itemCount > 1 ? 's' : ''})`} value={formatINR(subtotal)} />
//                   {discount > 0 && (
//                     <PriceRow
//                       label={coupon?.code ? `Coupon (${coupon.code})` : 'Discount'}
//                       value={`− ${formatINR(discount)}`}
//                       highlight
//                     />
//                   )}
//                   <PriceRow
//                     label="Delivery"
//                     value={shippingCost === 0 ? 'FREE' : formatINR(shippingCost)}
//                     highlight={shippingCost === 0}
//                   />
//                 </div>

//                 {/* Free shipping nudge */}
//                 {amountToFreeShipping > 0 ? (
//                   <div className="mt-4 rounded-xl bg-amber-50 p-3">
//                     <p className="text-xs font-medium text-amber-800">
//                       Add <strong>{formatINR(amountToFreeShipping)}</strong> more to get FREE delivery
//                     </p>
//                     <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-amber-100">
//                       <motion.div
//                         className="h-full rounded-full bg-amber-500"
//                         initial={{ width: 0 }}
//                         animate={{ width: `${freeShippingProgress}%` }}
//                         transition={{ duration: 0.6, ease: EASE }}
//                       />
//                     </div>
//                   </div>
//                 ) : (
//                   <p className="mt-4 flex items-center gap-2 rounded-xl bg-green-50 p-3 text-xs font-medium text-green-700">
//                     <FiCheck /> You’ve unlocked FREE delivery
//                   </p>
//                 )}

//                 <div className="mt-4 flex items-baseline justify-between border-t border-bamboo-100 pt-4">
//                   <span className="font-display text-base font-semibold text-bamboo-900">Total</span>
//                   <motion.span
//                     key={grandTotal}
//                     initial={{ opacity: 0, y: -4 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.25, ease: EASE }}
//                     className="font-display text-2xl font-bold tabular-nums text-bamboo-900"
//                   >
//                     {formatINR(grandTotal)}
//                   </motion.span>
//                 </div>
//                 <p className="mt-1 text-right text-[11px] text-bamboo-400">Inclusive of all taxes</p>

//                 {totalSavings > 0 && (
//                   <p className="mt-3 flex items-center gap-2 rounded-xl bg-green-50 p-3 text-sm font-medium text-green-700">
//                     <FiTag size={14} /> You’re saving {formatINR(totalSavings)} on this order
//                   </p>
//                 )}

//                 <div className="mt-4 flex items-center gap-2 border-t border-bamboo-100 pt-4 text-xs text-bamboo-500">
//                   <FiShield className="shrink-0 text-green-600" size={16} />
//                   Payments are encrypted and processed securely by Razorpay.
//                 </div>
//               </div>
//             </div>
//           </aside>
//         </div>
//       </div>

//       {/* Mobile sticky action bar */}
//       <div className="fixed inset-x-0 bottom-0 z-30 border-t border-bamboo-200 bg-white px-4 py-3 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.15)] lg:hidden">
//         <div className="mx-auto flex max-w-6xl items-center gap-4">
//           <div className="shrink-0">
//             <p className="text-[11px] text-bamboo-400">Total</p>
//             <p className="font-display text-lg font-bold tabular-nums text-bamboo-900">{formatINR(grandTotal)}</p>
//           </div>
//           <Button
//             className="flex-1"
//             disabled={primaryAction.disabled}
//             onClick={primaryAction.onClick}
//             isLoading={step === 1 && isPlacingOrder}
//           >
//             {primaryAction.label}
//           </Button>
//         </div>
//       </div>

//       <style>{`
//         @keyframes shimmer {
//           0% { background-position: 200% 0; }
//           100% { background-position: -200% 0; }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Checkout;









import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import {
  FiCheck,
  FiPlus,
  FiLock,
  FiShield,
  FiTruck,
  FiMapPin,
  FiCreditCard,
  FiEdit2,
  FiChevronDown,
  FiTag,
  FiX,
  FiSmartphone,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useSelector } from 'react-redux';

import { addressApi, orderApi } from '../../services/commerceApi';
import { cmsApi } from '../../services/cmsApi';
import { useCart } from '../../hooks/useCart';
import Button from '../../components/ui/Button';
import AddressForm from '../../components/checkout/AddressForm';

/* ---------- Config (adjust to your real policies) ---------- */
const FREE_SHIPPING_THRESHOLD = 999;
const FLAT_SHIPPING_COST = 79;
const DELIVERY_DAYS = { min: 4, max: 7 };
const PAYMENT_METHOD = 'upi_qr';

// TEMPORARY: replace with the client's real UPI ID (VPA)
const UPI_ID = 'yourshop@upi';
const PAYEE_NAME = 'Wa-Kriti';

const STEPS = [
  { key: 'address', label: 'Delivery', icon: FiMapPin },
  { key: 'pay', label: 'Review & pay', icon: FiCreditCard },
];

const EASE = [0.22, 1, 0.36, 1];

const listContainer = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const listItem = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: EASE } },
};

/* ---------- Helpers ---------- */
const formatINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

const formatDate = (date) =>
  date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

const getDeliveryWindow = () => {
  const from = new Date();
  const to = new Date();
  from.setDate(from.getDate() + DELIVERY_DAYS.min);
  to.setDate(to.getDate() + DELIVERY_DAYS.max);
  return `${formatDate(from)} – ${formatDate(to)}`;
};

// Builds a wa.me link from any phone format (defaults to +91 for 10-digit numbers)
const buildWhatsAppLink = (rawNumber, message) => {
  let digits = String(rawNumber || '').replace(/\D/g, '');
  if (!digits) return null;
  if (digits.length === 10) digits = `91${digits}`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
};

// Dynamic UPI payment link: amount + order reference are baked into the QR
const buildUpiLink = ({ amount, orderNumber }) => {
  const params = new URLSearchParams({
    pa: UPI_ID,
    pn: PAYEE_NAME,
    am: Number(amount).toFixed(2),
    cu: 'INR',
    tn: `Order ${orderNumber}`,
    tr: String(orderNumber),
  });
  return `upi://pay?${params.toString()}`;
};

const PriceRow = ({ label, value, highlight, muted }) => (
  <div className="flex items-center justify-between text-sm">
    <span className={muted ? 'text-bamboo-400' : 'text-bamboo-600'}>{label}</span>
    <span className={`tabular-nums ${highlight ? 'font-medium text-green-600' : 'text-bamboo-800'}`}>{value}</span>
  </div>
);

const Checkout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useSelector((state) => state.auth);
  const { items, subtotal, coupon } = useCart();

  const [step, setStep] = useState(0);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [notes, setNotes] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  // UPI QR payment modal state
  const [placedOrder, setPlacedOrder] = useState(null); // order created on the server
  const [showPayModal, setShowPayModal] = useState(false);

  const { data: addresses = [], isLoading: addressesLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => addressApi.getAddresses(),
    select: (res) => res.data.data.addresses,
  });

  const { data: settings } = useQuery({
    queryKey: ['website-settings'],
    queryFn: () => cmsApi.getSettings(),
    select: (res) => res.data.data.settings,
  });

  useEffect(() => {
    if (!selectedAddressId && addresses.length) {
      const def = addresses.find((a) => a.isDefault) || addresses[0];
      setSelectedAddressId(def._id);
    }
  }, [addresses, selectedAddressId]);

  // Lock page scroll while the modal is open
  useEffect(() => {
    document.body.style.overflow = showPayModal ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [showPayModal]);

  const goToStep = (n) => {
    setStep(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedAddress = addresses.find((a) => a._id === selectedAddressId);
  const showAddressForm = isAddingAddress || (!addressesLoading && addresses.length === 0);

  /* ---------- Pricing ---------- */
  const discount = coupon?.discountAmount || 0;
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_COST;
  const grandTotal = Math.max(0, subtotal - discount) + shippingCost;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const totalSavings = discount + (shippingCost === 0 ? FLAT_SHIPPING_COST : 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const deliveryWindow = getDeliveryWindow();

  const whatsappNumber = settings?.whatsappNumber || settings?.contactPhone;

  // Amount that goes into the QR: prefer the server's figure, fall back to the client total
  const payableAmount = placedOrder?.totalAmount ?? grandTotal;

  // Pre-filled WhatsApp message with all order details
  const buildOrderMessage = () => {
    const addr = selectedAddress;
    const lines = [
      'Hi Wa-Kriti, I have made the payment. Please confirm my order.',
      '',
      `*Order No:* ${placedOrder?.orderNumber || '-'}`,
      `*Customer:* ${user?.fullName || addr?.fullName || ''}`,
      '',
      '*Items:*',
      ...items.map(
        (item, i) =>
          `${i + 1}. ${item.name} × ${item.quantity} = ${formatINR(item.price * item.quantity)}\n   Image: ${item.image}`
      ),
      '',
      `Subtotal: ${formatINR(subtotal)}`,
      ...(discount > 0 ? [`Discount${coupon?.code ? ` (${coupon.code})` : ''}: -${formatINR(discount)}`] : []),
      `Delivery: ${shippingCost === 0 ? 'FREE' : formatINR(shippingCost)}`,
      `*Total Paid: ${formatINR(payableAmount)}*`,
      '',
      '*Delivery Address:*',
      addr?.fullName,
      `${addr?.addressLine1}${addr?.addressLine2 ? `, ${addr.addressLine2}` : ''}`,
      `${addr?.city}, ${addr?.state} - ${addr?.pincode}`,
      `Phone: ${addr?.phone}`,
      ...(notes ? ['', `*Delivery notes:* ${notes}`] : []),
      '',
      '📎 Payment screenshot attached below.',
    ];
    return lines.filter((l) => l !== undefined).join('\n');
  };

  const confirmationLink = buildWhatsAppLink(whatsappNumber, buildOrderMessage());
  const helpLink = buildWhatsAppLink(whatsappNumber, 'Hi Wa-Kriti, I have a query regarding my order/product.');

  if (items.length === 0 && !placedOrder) return <Navigate to="/cart" replace />;

  /* ---------- Actions ---------- */
  const handleAddAddress = async (values) => {
    try {
      const { data } = await addressApi.createAddress(values);
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      setSelectedAddressId(data.data.address._id);
      setIsAddingAddress(false);
      toast.success('Address saved');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not save address');
    }
  };

  const handlePlaceOrder = async () => {
    if (isPlacingOrder) return;
    if (!selectedAddressId) {
      toast.error('Please choose where we should deliver your order');
      goToStep(0);
      return;
    }

    // Order already created (user closed the modal earlier) – just reopen it, avoid duplicates
    if (placedOrder) {
      setShowPayModal(true);
      return;
    }

    setIsPlacingOrder(true);
    try {
      const { data } = await orderApi.checkout({
        shippingAddressId: selectedAddressId,
        paymentMethod: PAYMENT_METHOD,
        notes,
      });
      setPlacedOrder(data.data.order);
      setShowPayModal(true);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not place your order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleFinish = () => {
    queryClient.invalidateQueries({ queryKey: ['cart'] });
    setShowPayModal(false);
    navigate('/order-success', {
      state: {
        orderNumber: placedOrder.orderNumber,
        orderId: placedOrder._id,
        shippingAddress: selectedAddress,
        paymentPending: true,
      },
    });
  };

  const primaryAction =
    step === 0
      ? { label: 'Deliver to this address', onClick: () => goToStep(1), disabled: !selectedAddressId || showAddressForm }
      : { label: `Pay ${formatINR(grandTotal)} securely`, onClick: handlePlaceOrder, disabled: false };

  const upiLink = placedOrder ? buildUpiLink({ amount: payableAmount, orderNumber: placedOrder.orderNumber }) : '';

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen bg-[#F7F4EC] pb-32 lg:pb-16">
      <Helmet><title>Secure Checkout | Wa-Kriti</title></Helmet>

      {/* Top bar */}
      <div className="border-b border-bamboo-200/60 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <h1 className="font-display text-xl font-bold text-bamboo-900 sm:text-2xl">Checkout</h1>
          <span className="flex items-center gap-1.5 text-xs font-medium text-green-700 sm:text-sm">
            <FiLock size={14} /> 100% secure checkout
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pt-6 sm:pt-8">
        {/* Progress */}
        <div className="mb-6 flex items-center gap-3 sm:mb-8">
          {STEPS.map(({ key, label }, idx) => {
            const done = idx < step;
            const active = idx === step;
            return (
              <div key={key} className="flex flex-1 items-center gap-3">
                <button
                  type="button"
                  disabled={!done}
                  onClick={() => done && goToStep(idx)}
                  className="flex items-center gap-2 disabled:cursor-default"
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                      done
                        ? 'bg-bamboo-600 text-white'
                        : active
                        ? 'border-2 border-bamboo-600 bg-white text-bamboo-700'
                        : 'border-2 border-bamboo-200 bg-white text-bamboo-300'
                    }`}
                  >
                    {done ? <FiCheck size={14} /> : idx + 1}
                  </span>
                  <span className={`text-sm font-medium ${active || done ? 'text-bamboo-900' : 'text-bamboo-300'}`}>
                    {label}
                  </span>
                </button>
                {idx < STEPS.length - 1 && (
                  <div className={`h-0.5 flex-1 rounded ${done ? 'bg-bamboo-600' : 'bg-bamboo-200'}`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px] lg:gap-10">
          {/* ================= MAIN ================= */}
          <div className="lg:order-1">
            <AnimatePresence mode="wait" initial={false}>
              {step === 0 && (
                <motion.div
                  key="address-step"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="space-y-5"
                >
                  <div className="rounded-2xl border border-bamboo-200/70 bg-white p-5 sm:p-6">
                    <h2 className="font-display text-lg font-semibold text-bamboo-900">Where should we deliver?</h2>
                    <p className="mb-4 mt-1 text-sm text-bamboo-500">Choose a saved address or add a new one.</p>

                    {addressesLoading ? (
                      <div className="space-y-3">
                        {[0, 1].map((i) => (
                          <div
                            key={i}
                            className="h-20 rounded-xl bg-gradient-to-r from-sand-200 via-sand-100 to-sand-200 bg-[length:200%_100%]"
                            style={{ animation: 'shimmer 1.6s ease-in-out infinite' }}
                          />
                        ))}
                      </div>
                    ) : (
                      <motion.div variants={listContainer} initial="hidden" animate="show" className="space-y-3">
                        {addresses.map((addr) => {
                          const isSelected = selectedAddressId === addr._id;
                          return (
                            <motion.label
                              key={addr._id}
                              variants={listItem}
                              whileTap={{ scale: 0.99 }}
                              className={`block cursor-pointer rounded-xl border-2 p-4 transition-colors duration-200 ${
                                isSelected ? 'border-bamboo-600 bg-bamboo-50' : 'border-bamboo-100 hover:border-bamboo-300'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <input
                                  type="radio"
                                  name="shipping-address"
                                  checked={isSelected}
                                  onChange={() => setSelectedAddressId(addr._id)}
                                  className="mt-1.5 accent-bamboo-600"
                                />
                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <p className="font-semibold text-bamboo-900">{addr.fullName}</p>
                                    {addr.label && (
                                      <span className="rounded-full bg-bamboo-100 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-bamboo-600">
                                        {addr.label}
                                      </span>
                                    )}
                                    {addr.isDefault && (
                                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-700">
                                        Default
                                      </span>
                                    )}
                                  </div>
                                  <p className="mt-1 text-sm text-bamboo-600">
                                    {addr.addressLine1}
                                    {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}, {addr.city}, {addr.state} - {addr.pincode}
                                  </p>
                                  <p className="mt-0.5 text-sm text-bamboo-500">Phone: {addr.phone}</p>
                                </div>
                              </div>
                            </motion.label>
                          );
                        })}
                      </motion.div>
                    )}

                    <AnimatePresence initial={false} mode="wait">
                      {showAddressForm ? (
                        <motion.div
                          key="form"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: EASE }}
                          className="mt-4 overflow-hidden rounded-xl border border-bamboo-200 bg-bamboo-50/40 p-4"
                        >
                          <p className="mb-3 text-sm font-semibold text-bamboo-800">
                            {addresses.length === 0 ? 'Add your delivery address' : 'New address'}
                          </p>
                          <AddressForm onSubmit={handleAddAddress} onCancel={() => setIsAddingAddress(false)} />
                        </motion.div>
                      ) : (
                        <motion.button
                          key="add-btn"
                          type="button"
                          onClick={() => setIsAddingAddress(true)}
                          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-bamboo-200 py-3 text-sm font-semibold text-bamboo-600 transition-colors hover:border-bamboo-400 hover:bg-bamboo-50"
                        >
                          <FiPlus size={16} /> Add a new address
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="rounded-2xl border border-bamboo-200/70 bg-white p-5 sm:p-6">
                    <label className="mb-1.5 block text-sm font-semibold text-bamboo-800">
                      Delivery instructions <span className="font-normal text-bamboo-400">(optional)</span>
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Call before delivery, leave with security, landmark near gate…"
                      className="input-field min-h-[80px]"
                      maxLength={300}
                    />
                  </div>

                  <div className="hidden lg:block">
                    <Button fullWidth disabled={primaryAction.disabled} onClick={primaryAction.onClick}>
                      {primaryAction.label}
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="pay-step"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="space-y-5"
                >
                  {/* Delivery summary */}
                  <div className="rounded-2xl border border-bamboo-200/70 bg-white p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <FiMapPin className="mt-1 shrink-0 text-bamboo-500" />
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-bamboo-400">Delivering to</p>
                          <p className="mt-0.5 font-semibold text-bamboo-900">{selectedAddress?.fullName}</p>
                          <p className="text-sm text-bamboo-600">
                            {selectedAddress?.addressLine1}, {selectedAddress?.city}, {selectedAddress?.state} -{' '}
                            {selectedAddress?.pincode}
                          </p>
                          <p className="text-sm text-bamboo-500">{selectedAddress?.phone}</p>
                          {notes && <p className="mt-2 text-sm italic text-bamboo-500">“{notes}”</p>}
                        </div>
                      </div>
                      {!placedOrder && (
                        <button
                          type="button"
                          onClick={() => goToStep(0)}
                          className="flex shrink-0 items-center gap-1 text-sm font-medium text-bamboo-600 hover:text-bamboo-800"
                        >
                          <FiEdit2 size={13} /> Change
                        </button>
                      )}
                    </div>

                    <div className="mt-4 flex items-center gap-3 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">
                      <FiTruck className="shrink-0" size={18} />
                      <span>
                        Estimated delivery: <strong>{deliveryWindow}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="rounded-2xl border border-bamboo-200/70 bg-white p-5 sm:p-6">
                    <h2 className="font-display text-lg font-semibold text-bamboo-900">
                      Your items ({itemCount})
                    </h2>
                    <div className="mt-4 divide-y divide-bamboo-100">
                      {items.map((item) => (
                        <div key={item._id || item.productId} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                          <img src={item.image} alt={item.name} className="h-16 w-16 rounded-lg object-cover" />
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-2 text-sm font-medium text-bamboo-900">{item.name}</p>
                            <p className="mt-0.5 text-xs text-bamboo-500">Qty: {item.quantity}</p>
                          </div>
                          <span className="shrink-0 text-sm font-semibold tabular-nums text-bamboo-800">
                            {formatINR(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment */}
                  <div className="rounded-2xl border border-bamboo-200/70 bg-white p-5 sm:p-6">
                    <h2 className="font-display text-lg font-semibold text-bamboo-900">Payment</h2>
                    <div className="mt-4 flex items-start gap-3 rounded-xl border-2 border-bamboo-600 bg-bamboo-50 p-4">
                      <FiSmartphone className="mt-0.5 shrink-0 text-bamboo-600" size={20} />
                      <div>
                        <p className="font-semibold text-bamboo-900">Pay via UPI QR</p>
                        <p className="mt-0.5 text-sm text-bamboo-600">
                          Scan the QR with GPay, PhonePe, Paytm or any UPI app.
                        </p>
                        <p className="mt-2 flex items-center gap-1.5 text-xs text-bamboo-500">
                          <FiShield size={12} /> The amount is fixed in the QR and can’t be changed.
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-bamboo-400">
                      After paying, you’ll share the payment screenshot with us on WhatsApp. Your order is confirmed once we verify the payment.
                    </p>
                  </div>

                  {/* Help / WhatsApp */}
                  {helpLink && (
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-base text-bamboo-600">
                        For any query related to product or Bulk-order, please connect
                      </p>
                      <a
                        href={helpLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Chat with us on WhatsApp"
                        className="flex items-center gap-2"
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-md transition-transform hover:scale-105">
                          <FaWhatsapp size={24} />
                        </span>
                        <span className="text-base font-semibold tabular-nums text-bamboo-800">{whatsappNumber}</span>
                      </a>
                    </div>
                  )}

                  <div className="hidden gap-3 lg:flex">
                    <Button variant="secondary" onClick={() => goToStep(0)} disabled={!!placedOrder}>
                      Back
                    </Button>
                    <Button className="flex-1" onClick={primaryAction.onClick} isLoading={isPlacingOrder}>
                      <span className="flex items-center justify-center gap-2">
                        <FiLock size={15} /> {primaryAction.label}
                      </span>
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ================= SUMMARY ================= */}
          <aside className="order-first lg:order-2">
            <div className="lg:sticky lg:top-6">
              <button
                type="button"
                onClick={() => setShowSummary((s) => !s)}
                className="flex w-full items-center justify-between rounded-2xl border border-bamboo-200/70 bg-white px-4 py-3 lg:hidden"
              >
                <span className="flex items-center gap-2 text-sm font-medium text-bamboo-700">
                  Order summary ({itemCount} item{itemCount > 1 ? 's' : ''})
                  <FiChevronDown className={`transition-transform ${showSummary ? 'rotate-180' : ''}`} />
                </span>
                <span className="font-semibold tabular-nums text-bamboo-900">{formatINR(grandTotal)}</span>
              </button>

              <div
                className={`${showSummary ? 'mt-3 block' : 'hidden'} rounded-2xl border border-bamboo-200/70 bg-white p-5 lg:mt-0 lg:block`}
              >
                <h2 className="font-display text-lg font-semibold text-bamboo-900">Order summary</h2>

                {step === 0 && (
                  <div className="mt-4 max-h-56 space-y-3 overflow-y-auto pr-1">
                    {items.map((item) => (
                      <div key={item._id || item.productId} className="flex items-center gap-3">
                        <div className="relative">
                          <img src={item.image} alt={item.name} className="h-12 w-12 rounded-md object-cover" />
                          <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-bamboo-700 px-1 text-[10px] font-semibold text-white">
                            {item.quantity}
                          </span>
                        </div>
                        <p className="line-clamp-2 min-w-0 flex-1 text-sm text-bamboo-800">{item.name}</p>
                        <span className="shrink-0 text-sm tabular-nums text-bamboo-700">
                          {formatINR(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className={`space-y-2.5 ${step === 0 ? 'mt-4 border-t border-bamboo-100 pt-4' : 'mt-4'}`}>
                  <PriceRow label={`Subtotal (${itemCount} item${itemCount > 1 ? 's' : ''})`} value={formatINR(subtotal)} />
                  {discount > 0 && (
                    <PriceRow
                      label={coupon?.code ? `Coupon (${coupon.code})` : 'Discount'}
                      value={`− ${formatINR(discount)}`}
                      highlight
                    />
                  )}
                  <PriceRow
                    label="Delivery"
                    value={shippingCost === 0 ? 'FREE' : formatINR(shippingCost)}
                    highlight={shippingCost === 0}
                  />
                </div>

                {amountToFreeShipping > 0 ? (
                  <div className="mt-4 rounded-xl bg-amber-50 p-3">
                    <p className="text-xs font-medium text-amber-800">
                      Add <strong>{formatINR(amountToFreeShipping)}</strong> more to get FREE delivery
                    </p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-amber-100">
                      <motion.div
                        className="h-full rounded-full bg-amber-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${freeShippingProgress}%` }}
                        transition={{ duration: 0.6, ease: EASE }}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="mt-4 flex items-center gap-2 rounded-xl bg-green-50 p-3 text-xs font-medium text-green-700">
                    <FiCheck /> You’ve unlocked FREE delivery
                  </p>
                )}

                <div className="mt-4 flex items-baseline justify-between border-t border-bamboo-100 pt-4">
                  <span className="font-display text-base font-semibold text-bamboo-900">Total</span>
                  <motion.span
                    key={grandTotal}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className="font-display text-2xl font-bold tabular-nums text-bamboo-900"
                  >
                    {formatINR(grandTotal)}
                  </motion.span>
                </div>
                <p className="mt-1 text-right text-[11px] text-bamboo-400">Inclusive of all taxes</p>

                {totalSavings > 0 && (
                  <p className="mt-3 flex items-center gap-2 rounded-xl bg-green-50 p-3 text-sm font-medium text-green-700">
                    <FiTag size={14} /> You’re saving {formatINR(totalSavings)} on this order
                  </p>
                )}

                <div className="mt-4 flex items-center gap-2 border-t border-bamboo-100 pt-4 text-xs text-bamboo-500">
                  <FiShield className="shrink-0 text-green-600" size={16} />
                  Pay securely with any UPI app. We never see your bank details.
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-bamboo-200 bg-white px-4 py-3 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.15)] lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-4">
          <div className="shrink-0">
            <p className="text-[11px] text-bamboo-400">Total</p>
            <p className="font-display text-lg font-bold tabular-nums text-bamboo-900">{formatINR(grandTotal)}</p>
          </div>
          <Button
            className="flex-1"
            disabled={primaryAction.disabled}
            onClick={primaryAction.onClick}
            isLoading={step === 1 && isPlacingOrder}
          >
            {primaryAction.label}
          </Button>
        </div>
      </div>

      {/* ================= UPI QR PAYMENT MODAL ================= */}
      <AnimatePresence>
        {showPayModal && placedOrder && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Pay with UPI QR"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-6 sm:rounded-3xl"
            >
              <button
                type="button"
                onClick={() => setShowPayModal(false)}
                aria-label="Close"
                className="absolute right-4 top-4 rounded-full p-1.5 text-bamboo-500 hover:bg-bamboo-50"
              >
                <FiX size={20} />
              </button>

              <h2 className="font-display text-xl font-bold text-bamboo-900">Scan & pay</h2>
              <p className="mt-0.5 text-sm text-bamboo-500">Order {placedOrder.orderNumber}</p>

              {/* Amount card */}
              <div className="mt-4 rounded-2xl bg-bamboo-50 p-4 text-center">
                <p className="text-xs font-medium uppercase tracking-wide text-bamboo-500">Amount to pay</p>
                <p className="font-display text-3xl font-bold tabular-nums text-bamboo-900">
                  {formatINR(payableAmount)}
                </p>
              </div>

              {/* Dynamic QR */}
              <div className="mx-auto mt-4 w-fit rounded-2xl border border-bamboo-200 bg-white p-4">
                <QRCodeSVG value={upiLink} size={208} level="M" includeMargin={false} />
              </div>
              <p className="mt-2 text-center text-xs text-bamboo-500">
                This QR is generated for {formatINR(payableAmount)} only.
              </p>

              {/* Mobile: open UPI app directly */}
              <a
                href={upiLink}
                className="mt-4 flex items-center justify-center gap-2 rounded-xl border-2 border-bamboo-600 py-2.5 text-sm font-semibold text-bamboo-700 lg:hidden"
              >
                <FiSmartphone size={16} /> Open UPI app to pay
              </a>

              {/* Step 2: WhatsApp */}
              <div className="mt-5 rounded-2xl border border-bamboo-200/70 p-4">
                <p className="text-sm font-semibold text-bamboo-900">After paying</p>
                <ol className="mt-1.5 list-decimal space-y-1 pl-5 text-sm text-bamboo-600">
                  <li>Take a screenshot of the successful payment.</li>
                  <li>Tap the button below — your order details are pre-filled.</li>
                  <li>Attach the screenshot in WhatsApp and press send.</li>
                </ol>

                {confirmationLink ? (
                  <a
                    href={confirmationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-sm font-semibold text-white shadow-md transition-transform hover:scale-[1.01]"
                  >
                    <FaWhatsapp size={20} /> Send screenshot on WhatsApp
                  </a>
                ) : (
                  <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
                    WhatsApp number isn’t configured yet. Please contact support with your order number.
                  </p>
                )}
              </div>

              <Button className="mt-4" fullWidth onClick={handleFinish}>
                I’ve sent the screenshot
              </Button>
              <p className="mt-2 text-center text-[11px] text-bamboo-400">
                Your order is confirmed after we verify your payment.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

export default Checkout;