


// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { Helmet } from 'react-helmet-async';
// import toast from 'react-hot-toast';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   FiMinus,
//   FiPlus,
//   FiTrash2,
//   FiBookmark,
//   FiTag,
//   FiGift,
//   FiShoppingBag,
//   FiTruck,
//   FiCheck,
//   FiArrowRight,
//   FiShield,
//   FiPackage,
//   FiRotateCcw,
//   FiAlertCircle,
//   FiZap,
//   FiAward,
// } from 'react-icons/fi';

// import { useCart } from '../../hooks/useCart';
// import Button from '../../components/ui/Button';
// import EmptyState from '../../components/ui/EmptyState';

// const FREE_SHIPPING_THRESHOLD = 999;
// const FLAT_SHIPPING_COST = 79;
// // Minimum order value required to check out. Keep this in sync with any
// // server-side minimum-order enforcement (e.g. backend/controllers/orderController.js)
// // if/when one is added there — this is a client-side gate only.
// const MIN_CART_ORDER = 499;

// /* ------------------------------------------------------------------ */
// /* Trust strip                                                         */
// /* ------------------------------------------------------------------ */

// const TRUST_HIGHLIGHTS = [
//   {
//     icon: FiTruck,
//     title: 'Free Delivery',
//     subtitle: `On orders over ₹${FREE_SHIPPING_THRESHOLD}`,
//   },
//   {
//     icon: FiTag,
//     title: `Min. Order ₹${MIN_CART_ORDER}`,
//     subtitle: 'Applicable for checkout',
//   },
//   {
//     icon: FiZap,
//     title: 'Speed Post Dispatch',
//     subtitle: 'Fast, tracked shipping',
//   },
//   {
//     icon: FiShield,
//     title: 'Secure Checkout',
//     subtitle: '100% safe payments',
//   },
//   {
//     icon: FiAward,
//     title: 'Trusted by 12,000+',
//     subtitle: 'Happy customers',
//   },
//   {
//     icon: FiRotateCcw,
//     title: '7-Day Easy Returns',
//     subtitle: 'Hassle-free process',
//   },
// ];

// const TrustStrip = () => (
//   <div className="mt-5 grid grid-cols-2 gap-2.5 border-y border-sand-300 py-4 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6">
//     {TRUST_HIGHLIGHTS.map((item) => (
//       <div
//         key={item.title}
//         className="flex items-center gap-2.5 rounded-xl bg-sand-50 px-3 py-2.5 sm:flex-col sm:items-start sm:gap-2"
//       >
//         <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bamboo-100 text-bamboo-600">
//           <item.icon size={15} />
//         </span>
//         <div className="min-w-0">
//           <p className="truncate text-xs font-semibold text-bamboo-800">{item.title}</p>
//           <p className="truncate text-[10.5px] text-bamboo-500">{item.subtitle}</p>
//         </div>
//       </div>
//     ))}
//   </div>
// );

// /* ------------------------------------------------------------------ */
// /* Single cart row                                                     */
// /* ------------------------------------------------------------------ */

// const CartLine = ({ item, onQtyChange, onRemove, onSaveForLater, showSaveForLater }) => {
//   // Bundle / buy-x-get-y / hamper items only make sense as a complete
//   // group — the backend now rejects quantity edits on individual members
//   // of a comboGroupId and cascades any removal to the whole group. Reflect
//   // that here instead of showing controls that will just error.
//   const isComboItem = Boolean(item.comboGroupId);

//   return (
//     <motion.div
//       layout
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
//       transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
//       className="group flex gap-4 border-b border-sand-300 py-6 last:border-0"
//     >
//       <Link to={`/product/${item.slug}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-sand-200">
//         {item.image ? (
//           <img
//             src={item.image}
//             alt={item.name}
//             className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
//           />
//         ) : (
//           <div className="flex h-full w-full items-center justify-center text-xs text-bamboo-300">No Image</div>
//         )}
//       </Link>

//       <div className="flex flex-1 flex-col justify-between sm:flex-row sm:items-start sm:justify-between">
//         <div>
//           <div className="flex flex-wrap items-center gap-2">
//             <Link to={`/product/${item.slug}`} className="font-medium text-bamboo-800 hover:underline">
//               {item.name}
//             </Link>
//             {isComboItem && (
//               <span className="inline-flex items-center gap-1 rounded-full bg-bamboo-700 px-2 py-0.5 text-[10px] font-semibold text-sand-100">
//                 <FiGift size={10} /> Bundle offer
//               </span>
//             )}
//           </div>
//           {item.sku && <p className="mt-0.5 text-xs text-bamboo-400">SKU: {item.sku}</p>}

//           <div className="mt-3 flex items-center gap-4 sm:hidden">
//             <QuantityStepper item={item} isComboItem={isComboItem} onQtyChange={onQtyChange} />
//           </div>

//           <div className="mt-3 flex items-center gap-4 text-xs">
//             {showSaveForLater && (
//               <button
//                 onClick={onSaveForLater}
//                 className="flex items-center gap-1 font-medium text-bamboo-500 hover:text-bamboo-700 hover:underline"
//               >
//                 <FiBookmark size={13} /> {isComboItem ? 'Save bundle' : 'Save for later'}
//               </button>
//             )}
//             <button onClick={onRemove} className="flex items-center gap-1 font-medium text-red-500 hover:text-red-600 hover:underline">
//               <FiTrash2 size={13} /> {isComboItem ? 'Remove bundle' : 'Remove'}
//             </button>
//           </div>
//         </div>

//         <div className="mt-3 hidden shrink-0 items-center gap-6 sm:mt-0 sm:flex">
//           <QuantityStepper item={item} isComboItem={isComboItem} onQtyChange={onQtyChange} />
//           <p className="w-20 text-right font-display text-lg font-semibold text-bamboo-800">
//             {item.price === 0 ? 'Free' : `₹${item.price * item.quantity}`}
//           </p>
//         </div>

//         <p className="mt-2 font-display text-lg font-semibold text-bamboo-800 sm:hidden">
//           {item.price === 0 ? 'Free' : `₹${item.price * item.quantity}`}
//         </p>
//       </div>
//     </motion.div>
//   );
// };

// const QuantityStepper = ({ item, isComboItem, onQtyChange }) => {
//   if (isComboItem) {
//     return <span className="rounded-full bg-sand-200 px-3 py-1 text-xs text-bamboo-500">Qty: {item.quantity}</span>;
//   }
//   return (
//     <div className="flex items-center rounded-full border border-sand-400">
//       <button
//         onClick={() => onQtyChange(item.quantity - 1)}
//         className="flex h-7 w-7 items-center justify-center text-bamboo-600 hover:bg-sand-100 active:scale-90"
//         aria-label="Decrease quantity"
//       >
//         <FiMinus size={12} />
//       </button>
//       <AnimatePresence mode="popLayout" initial={false}>
//         <motion.span
//           key={item.quantity}
//           initial={{ y: 6, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           exit={{ y: -6, opacity: 0 }}
//           transition={{ duration: 0.12 }}
//           className="w-6 text-center text-sm tabular-nums"
//         >
//           {item.quantity}
//         </motion.span>
//       </AnimatePresence>
//       <button
//         onClick={() => onQtyChange(item.quantity + 1)}
//         className="flex h-7 w-7 items-center justify-center text-bamboo-600 hover:bg-sand-100 active:scale-90"
//         aria-label="Increase quantity"
//       >
//         <FiPlus size={12} />
//       </button>
//     </div>
//   );
// };

// /* ------------------------------------------------------------------ */
// /* Saved-for-later shelf (horizontal, distinct from the cart list)     */
// /* ------------------------------------------------------------------ */

// const SavedShelf = ({ items, onMove }) => (
//   <div className="mt-10">
//     <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-bamboo-800">
//       <FiBookmark size={16} className="text-bamboo-400" /> Saved For Later
//     </h2>
//     <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2">
//       <AnimatePresence initial={false}>
//         {items.map((item) => (
//           <motion.div
//             key={item._id}
//             layout
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.9 }}
//             className="w-36 shrink-0 rounded-2xl border border-sand-300 bg-white p-3"
//           >
//             <img src={item.image} alt={item.name} className="h-24 w-full rounded-xl object-cover" />
//             <p className="mt-2 line-clamp-2 text-xs font-medium text-bamboo-800">{item.name}</p>
//             <p className="mt-0.5 text-xs text-bamboo-500">{item.price === 0 ? 'Free' : `₹${item.price}`}</p>
//             <button
//               onClick={() => onMove(item)}
//               className="mt-2 w-full rounded-full border border-bamboo-600 py-1 text-[11px] font-semibold text-bamboo-600 hover:bg-bamboo-600 hover:text-white"
//             >
//               Move to Cart
//             </button>
//           </motion.div>
//         ))}
//       </AnimatePresence>
//     </div>
//   </div>
// );

// /* ------------------------------------------------------------------ */
// /* Order summary — dark ticket panel                                   */
// /* ------------------------------------------------------------------ */

// const ShippingRing = ({ subtotal }) => {
//   const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
//   const pct = Math.min(1, subtotal / FREE_SHIPPING_THRESHOLD);
//   const unlocked = remaining === 0;
//   const r = 22;
//   const circumference = 2 * Math.PI * r;

//   return (
//     <div className="flex items-center gap-3">
//       <div className="relative h-14 w-14 shrink-0">
//         <svg viewBox="0 0 56 56" className="h-14 w-14 -rotate-90">
//           <circle cx="28" cy="28" r={r} fill="none" stroke="#e7ddc9" strokeWidth="4" />
//           <motion.circle
//             cx="28"
//             cy="28"
//             r={r}
//             fill="none"
//             stroke="#3f6b4f"
//             strokeWidth="4"
//             strokeLinecap="round"
//             strokeDasharray={circumference}
//             initial={{ strokeDashoffset: circumference }}
//             animate={{ strokeDashoffset: circumference * (1 - pct) }}
//             transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
//           />
//         </svg>
//         <div className="absolute inset-0 flex items-center justify-center text-bamboo-700">
//           {unlocked ? <FiCheck size={18} /> : <FiTruck size={16} />}
//         </div>
//       </div>
//       <p className="text-xs leading-snug text-bamboo-600">
//         {unlocked ? (
//           <>Free shipping unlocked</>
//         ) : (
//           <>
//             Add <span className="font-semibold text-bamboo-800">₹{remaining}</span> more for free shipping
//           </>
//         )}
//       </p>
//     </div>
//   );
// };

// /* ------------------------------------------------------------------ */
// /* Minimum order notice                                                */
// /* ------------------------------------------------------------------ */

// const MinOrderNotice = ({ subtotal }) => {
//   if (subtotal >= MIN_CART_ORDER) return null;
//   const remaining = MIN_CART_ORDER - subtotal;
//   return (
//     <div className="mt-5 flex items-start gap-2.5 rounded-2xl bg-red-50 p-4">
//       <FiAlertCircle size={16} className="mt-0.5 shrink-0 text-red-500" />
//       <p className="text-xs leading-snug text-red-600">
//         Minimum order value is ₹{MIN_CART_ORDER}. Add <span className="font-semibold">₹{remaining}</span> more to
//         checkout.
//       </p>
//     </div>
//   );
// };

// const SummaryRow = ({ label, value, strike }) => (
//   <div className="flex items-baseline gap-2 py-1 text-sm">
//     <span className="text-bamboo-500">{label}</span>
//     <span className="h-px flex-1 border-b border-dotted border-sand-400" />
//     <span className={`tabular-nums ${strike ? 'text-red-500' : 'text-bamboo-800'}`}>{value}</span>
//   </div>
// );

// const OrderSummary = ({
//   subtotal,
//   discount,
//   shippingCost,
//   grandTotal,
//   coupon,
//   couponInput,
//   setCouponInput,
//   isApplyingCoupon,
//   onApplyCoupon,
//   onRemoveCoupon,
//   isAuthenticated,
//   onCheckout,
//   belowMinOrder,
// }) => (
//   <div className="relative overflow-hidden rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-sand-300 sm:p-7">
//     {/* corner notch, tag-style */}
//     <span className="absolute right-0 top-0 h-10 w-10 bg-sand-100" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />
//     <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-white ring-1 ring-sand-300" />

//     <h2 className="font-display text-lg font-semibold text-bamboo-800">Order Summary</h2>

//     <div className="mt-4">
//       <ShippingRing subtotal={subtotal} />
//     </div>

//     <MinOrderNotice subtotal={subtotal} />

//     {isAuthenticated && (
//       <div className="mt-5">
//         <label className="mb-1.5 block text-xs font-medium text-bamboo-600">Coupon Code</label>
//         <div className="flex gap-2">
//           <div className="relative flex-1">
//             <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-bamboo-400" size={14} />
//             <input
//               value={couponInput}
//               onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
//               placeholder="e.g. WELCOME10"
//               className="input-field !py-2 !pl-9 text-sm transition-shadow focus:shadow-md"
//             />
//           </div>
//           <Button onClick={onApplyCoupon} isLoading={isApplyingCoupon} className="!px-4 !py-2 text-xs">
//             Apply
//           </Button>
//         </div>
//         <AnimatePresence>
//           {coupon?.code && (
//             <motion.div
//               initial={{ opacity: 0, height: 0, marginTop: 0 }}
//               animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
//               exit={{ opacity: 0, height: 0, marginTop: 0 }}
//               className="flex items-center justify-between overflow-hidden rounded-lg bg-bamboo-50 px-3 py-2 text-xs"
//             >
//               <span className="flex items-center gap-1.5 font-medium text-bamboo-700">
//                 <FiCheck size={13} /> {coupon.code} applied
//               </span>
//               <button onClick={onRemoveCoupon} className="text-red-500 hover:underline">
//                 Remove
//               </button>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     )}

//     <div className="mt-6 space-y-0.5 border-t border-dashed border-sand-300 pt-4">
//       <SummaryRow label="Subtotal" value={`₹${subtotal}`} />
//       {discount > 0 && <SummaryRow label="Discount" value={`- ₹${discount}`} strike />}
//       <SummaryRow label="Shipping" value={shippingCost === 0 ? 'Free' : `₹${shippingCost}`} />
//     </div>

//     <div className="mt-4 flex items-baseline justify-between border-t border-dashed border-sand-300 pt-4">
//       <span className="font-display text-base font-medium text-bamboo-700">Total</span>
//       <motion.span key={grandTotal} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} className="font-display text-2xl font-bold tabular-nums text-bamboo-800">
//         ₹{grandTotal}
//       </motion.span>
//     </div>

//     <motion.div whileTap={{ scale: belowMinOrder ? 1 : 0.98 }}>
//       <Button
//         fullWidth
//         disabled={belowMinOrder}
//         className="group mt-6 !flex !items-center !justify-center !gap-2 disabled:cursor-not-allowed disabled:opacity-50"
//         onClick={onCheckout}
//       >
//         {belowMinOrder ? `Add ₹${MIN_CART_ORDER - subtotal} more to checkout` : 'Proceed to Checkout'}
//         {!belowMinOrder && <FiArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />}
//       </Button>
//     </motion.div>
//     <Link to="/shop" className="mt-3 block text-center text-sm font-medium text-bamboo-600 hover:text-bamboo-800 hover:underline">
//       Continue Shopping
//     </Link>
//   </div>
// );

// /* ------------------------------------------------------------------ */
// /* Main cart page                                                       */
// /* ------------------------------------------------------------------ */

// const Cart = () => {
//   const navigate = useNavigate();
//   const { isAuthenticated } = useSelector((state) => state.auth);
//   const {
//     items,
//     savedForLater,
//     subtotal,
//     coupon,
//     isLoading,
//     updateItemQuantity,
//     removeItem,
//     toggleSaveForLater,
//     applyCoupon,
//     removeCoupon,
//   } = useCart();
//   const [couponInput, setCouponInput] = useState('');
//   const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

//   const discount = coupon?.discountAmount || 0;
//   const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : FLAT_SHIPPING_COST;
//   const grandTotal = Math.max(0, subtotal - discount + shippingCost);
//   const belowMinOrder = subtotal < MIN_CART_ORDER;

//   const handleApplyCoupon = async () => {
//     if (!couponInput.trim()) return;
//     setIsApplyingCoupon(true);
//     try {
//       await applyCoupon(couponInput.trim());
//       toast.success('Coupon applied successfully');
//       setCouponInput('');
//     } catch (error) {
//       toast.error(error?.response?.data?.message || 'Invalid coupon code');
//     } finally {
//       setIsApplyingCoupon(false);
//     }
//   };

//   const handleQtyChange = async (item, quantity) => {
//     try {
//       await updateItemQuantity(item, quantity);
//     } catch (error) {
//       // Backend rejects individual quantity edits on bundle/combo items —
//       // surface that message instead of failing silently.
//       toast.error(error?.response?.data?.message || 'Could not update quantity');
//     }
//   };

//   const handleRemove = async (item) => {
//     try {
//       await removeItem(item);
//       if (item.comboGroupId) toast('Bundle removed from cart', { icon: '🎁' });
//     } catch (error) {
//       toast.error(error?.response?.data?.message || 'Could not remove item');
//     }
//   };

//   const handleCheckout = () => {
//     if (belowMinOrder) {
//       toast.error(`Minimum order value is ₹${MIN_CART_ORDER}`);
//       return;
//     }
//     if (!isAuthenticated) {
//       toast('Please log in to continue', { icon: '🔒' });
//       navigate('/login', { state: { from: { pathname: '/checkout' } } });
//       return;
//     }
//     navigate('/checkout');
//   };

//   if (isLoading) {
//     return (
//       <div className="mx-auto max-w-5xl px-4 py-12">
//         <div className="h-8 w-40 animate-pulse rounded-lg bg-sand-200" />
//         <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
//           <div className="h-64 animate-pulse rounded-2xl bg-sand-200 lg:col-span-2" />
//           <div className="h-64 animate-pulse rounded-[28px] bg-white ring-1 ring-sand-200" />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-sand-100 pb-20">
//       <Helmet>
//         <title>Your Cart</title>
//       </Helmet>

//       <div className="mx-auto max-w-5xl px-4 py-10">
//         <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
//           <div className="flex items-baseline justify-between">
//             <h1 className="font-display text-3xl font-bold tracking-tight text-bamboo-800">Your Cart</h1>
//             {items.length > 0 && (
//               <span className="text-sm text-bamboo-500">
//                 {items.length} {items.length === 1 ? 'item' : 'items'}
//               </span>
//             )}
//           </div>
//           {items.length > 0 && <TrustStrip />}
//         </motion.div>

//         <AnimatePresence mode="wait">
//           {items.length === 0 ? (
//             <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="mt-8">
//               <div className="flex flex-col items-center rounded-3xl border border-sand-300 px-6 py-16 text-center">
//                 <motion.div
//                   initial={{ scale: 0.8, opacity: 0 }}
//                   animate={{ scale: 1, opacity: 1 }}
//                   transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
//                   className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-bamboo-50 text-bamboo-500"
//                 >
//                   <FiShoppingBag size={28} />
//                 </motion.div>
//                 <EmptyState
//                   title="Your cart is empty"
//                   message="Looks like you haven't added anything yet. Explore our bamboo collection."
//                   actionLabel="Continue Shopping"
//                   actionTo="/shop"
//                 />
//               </div>
//             </motion.div>
//           ) : (
//             <motion.div key="filled" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-3">
//               <div className="lg:col-span-2">
//                 <AnimatePresence initial={false}>
//                   {items.map((item) => (
//                     <CartLine
//                       key={item._id || `${item.productId}-${item.variantId}`}
//                       item={item}
//                       onQtyChange={(q) => handleQtyChange(item, q)}
//                       onRemove={() => handleRemove(item)}
//                       onSaveForLater={isAuthenticated ? () => toggleSaveForLater(item) : undefined}
//                       showSaveForLater={isAuthenticated}
//                     />
//                   ))}
//                 </AnimatePresence>

//                 {isAuthenticated && savedForLater.length > 0 && <SavedShelf items={savedForLater} onMove={toggleSaveForLater} />}
//               </div>

//               <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="h-fit lg:sticky lg:top-6">
//                 <OrderSummary
//                   subtotal={subtotal}
//                   discount={discount}
//                   shippingCost={shippingCost}
//                   grandTotal={grandTotal}
//                   coupon={coupon}
//                   couponInput={couponInput}
//                   setCouponInput={setCouponInput}
//                   isApplyingCoupon={isApplyingCoupon}
//                   onApplyCoupon={handleApplyCoupon}
//                   onRemoveCoupon={removeCoupon}
//                   isAuthenticated={isAuthenticated}
//                   onCheckout={handleCheckout}
//                   belowMinOrder={belowMinOrder}
//                 />
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };

// export default Cart;




import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMinus,
  FiPlus,
  FiTrash2,
  FiBookmark,
  FiTag,
  FiGift,
  FiShoppingBag,
  FiTruck,
  FiCheck,
  FiArrowRight,
  FiShield,
  FiRotateCcw,
  FiAlertCircle,
  FiZap,
  FiAward,
  FiLock,
  FiChevronDown,
} from 'react-icons/fi';

import { useCart } from '../../hooks/useCart';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';

const FREE_SHIPPING_THRESHOLD = 999;
const FLAT_SHIPPING_COST = 79;
// Minimum order value required to check out. Keep this in sync with any
// server-side minimum-order enforcement (e.g. backend/controllers/orderController.js)
// if/when one is added there — this is a client-side gate only.
const MIN_CART_ORDER = 499;

const EASE = [0.22, 1, 0.36, 1];

const formatINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

/* ------------------------------------------------------------------ */
/* Trust strip (slim, scrolls sideways on mobile)                      */
/* ------------------------------------------------------------------ */

const TRUST_HIGHLIGHTS = [
  { icon: FiTruck, label: `Free delivery over ${formatINR(FREE_SHIPPING_THRESHOLD)}` },
  { icon: FiZap, label: 'Speed Post dispatch' },
  { icon: FiRotateCcw, label: '7-day easy returns' },
  { icon: FiShield, label: '100% secure payments' },
  { icon: FiAward, label: 'Trusted by 12,000+ customers' },
];

const TrustStrip = () => (
  <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
    {TRUST_HIGHLIGHTS.map(({ icon: Icon, label }) => (
      <span
        key={label}
        className="flex shrink-0 items-center gap-1.5 rounded-full border border-bamboo-200/70 bg-white px-3 py-1.5 text-xs font-medium text-bamboo-700"
      >
        <Icon size={13} className="text-bamboo-500" /> {label}
      </span>
    ))}
  </div>
);

/* ------------------------------------------------------------------ */
/* Progress banner: minimum order first, then free-delivery progress   */
/* ------------------------------------------------------------------ */

const ProgressBanner = ({ subtotal }) => {
  if (subtotal < MIN_CART_ORDER) {
    const remaining = MIN_CART_ORDER - subtotal;
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4">
        <FiAlertCircle size={18} className="mt-0.5 shrink-0 text-red-500" />
        <div className="flex-1">
          <p className="text-sm font-medium text-red-700">
            Add <strong>{formatINR(remaining)}</strong> more to place your order
          </p>
          <p className="mt-0.5 text-xs text-red-500">Minimum order value is {formatINR(MIN_CART_ORDER)}.</p>
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-red-100">
            <motion.div
              className="h-full rounded-full bg-red-400"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (subtotal / MIN_CART_ORDER) * 100)}%` }}
              transition={{ duration: 0.6, ease: EASE }}
            />
          </div>
        </div>
      </div>
    );
  }

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  if (remaining === 0) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-green-100 bg-green-50 p-4 text-sm font-medium text-green-700">
        <FiCheck size={18} className="shrink-0" /> Great! You’ve unlocked FREE delivery 🎉
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
      <p className="flex items-center gap-2 text-sm font-medium text-amber-800">
        <FiTruck size={16} className="shrink-0" />
        Add <strong>{formatINR(remaining)}</strong> more to get FREE delivery
      </p>
      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-amber-100">
        <motion.div
          className="h-full rounded-full bg-amber-500"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
          transition={{ duration: 0.6, ease: EASE }}
        />
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Quantity stepper                                                    */
/* ------------------------------------------------------------------ */

const QuantityStepper = ({ item, isComboItem, onQtyChange }) => {
  // Bundle members can't be edited individually (backend rejects it).
  if (isComboItem) {
    return (
      <span className="rounded-full bg-bamboo-50 px-3 py-1.5 text-xs font-medium text-bamboo-600">
        Qty: {item.quantity}
      </span>
    );
  }
  return (
    <div className="flex items-center rounded-full border border-bamboo-200 bg-white">
      <button
        type="button"
        onClick={() => onQtyChange(item.quantity - 1)}
        className="flex h-9 w-9 items-center justify-center rounded-full text-bamboo-600 transition-colors hover:bg-bamboo-50 active:scale-90"
        aria-label="Decrease quantity"
      >
        <FiMinus size={14} />
      </button>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={item.quantity}
          initial={{ y: 6, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -6, opacity: 0 }}
          transition={{ duration: 0.12 }}
          className="w-7 text-center text-sm font-semibold tabular-nums text-bamboo-900"
        >
          {item.quantity}
        </motion.span>
      </AnimatePresence>
      <button
        type="button"
        onClick={() => onQtyChange(item.quantity + 1)}
        className="flex h-9 w-9 items-center justify-center rounded-full text-bamboo-600 transition-colors hover:bg-bamboo-50 active:scale-90"
        aria-label="Increase quantity"
      >
        <FiPlus size={14} />
      </button>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Single cart row                                                     */
/* ------------------------------------------------------------------ */

const CartLine = ({ item, onQtyChange, onRemove, onSaveForLater, showSaveForLater }) => {
  // Bundle / buy-x-get-y / hamper items only make sense as a complete
  // group — the backend rejects quantity edits on individual members of a
  // comboGroupId and cascades any removal to the whole group.
  const isComboItem = Boolean(item.comboGroupId);
  const isFree = item.price === 0;
  const lineTotal = isFree ? 'Free' : formatINR(item.price * item.quantity);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3, ease: EASE }}
      className="rounded-2xl border border-bamboo-200/70 bg-white p-4 sm:p-5"
    >
      <div className="flex gap-4">
        <Link
          to={`/product/${item.slug}`}
          className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-sand-200 sm:h-28 sm:w-28"
        >
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-bamboo-300">No image</div>
          )}
        </Link>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link
                to={`/product/${item.slug}`}
                className="line-clamp-2 font-medium text-bamboo-900 hover:underline"
              >
                {item.name}
              </Link>
              {isComboItem && (
                <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-bamboo-700 px-2 py-0.5 text-[10px] font-semibold text-white">
                  <FiGift size={10} /> Bundle offer
                </span>
              )}
              {item.sku && <p className="mt-1 text-xs text-bamboo-400">SKU: {item.sku}</p>}
            </div>
            <div className="shrink-0 text-right">
              <p className={`font-display text-lg font-semibold tabular-nums ${isFree ? 'text-green-600' : 'text-bamboo-900'}`}>
                {lineTotal}
              </p>
              {!isFree && item.quantity > 1 && (
                <p className="text-xs text-bamboo-400">{formatINR(item.price)} each</p>
              )}
            </div>
          </div>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
            <QuantityStepper item={item} isComboItem={isComboItem} onQtyChange={onQtyChange} />

            <div className="flex items-center gap-4 text-xs">
              {showSaveForLater && (
                <button
                  type="button"
                  onClick={onSaveForLater}
                  className="flex items-center gap-1 font-medium text-bamboo-500 hover:text-bamboo-700"
                >
                  <FiBookmark size={13} /> {isComboItem ? 'Save bundle' : 'Save for later'}
                </button>
              )}
              <button
                type="button"
                onClick={onRemove}
                className="flex items-center gap-1 font-medium text-red-500 hover:text-red-600"
              >
                <FiTrash2 size={13} /> {isComboItem ? 'Remove bundle' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/* Saved-for-later shelf                                               */
/* ------------------------------------------------------------------ */

const SavedShelf = ({ items, onMove }) => (
  <div className="mt-8">
    <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-bamboo-900">
      <FiBookmark size={16} className="text-bamboo-400" /> Saved for later ({items.length})
    </h2>
    <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2">
      <AnimatePresence initial={false}>
        {items.map((item) => (
          <motion.div
            key={item._id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-40 shrink-0 rounded-2xl border border-bamboo-200/70 bg-white p-3"
          >
            <img src={item.image} alt={item.name} className="h-28 w-full rounded-xl object-cover" />
            <p className="mt-2 line-clamp-2 text-sm font-medium text-bamboo-900">{item.name}</p>
            <p className="mt-0.5 text-sm text-bamboo-600">{item.price === 0 ? 'Free' : formatINR(item.price)}</p>
            <button
              type="button"
              onClick={() => onMove(item)}
              className="mt-2.5 w-full rounded-full border border-bamboo-600 py-1.5 text-xs font-semibold text-bamboo-600 transition-colors hover:bg-bamboo-600 hover:text-white"
            >
              Move to cart
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Coupon box (collapsed by default so it doesn't distract)            */
/* ------------------------------------------------------------------ */

const CouponBox = ({
  isAuthenticated,
  coupon,
  couponInput,
  setCouponInput,
  isApplyingCoupon,
  onApplyCoupon,
  onRemoveCoupon,
}) => {
  const [open, setOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <p className="flex items-center gap-2 rounded-xl bg-bamboo-50 px-3 py-2.5 text-xs text-bamboo-600">
        <FiTag size={14} className="shrink-0" />
        <span>
          <Link to="/login" state={{ from: { pathname: '/cart' } }} className="font-semibold underline">
            Log in
          </Link>{' '}
          to apply coupons and save items for later.
        </span>
      </p>
    );
  }

  if (coupon?.code) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-green-100 bg-green-50 px-3 py-2.5 text-sm">
        <span className="flex items-center gap-2 font-medium text-green-700">
          <FiCheck size={15} /> {coupon.code} applied
        </span>
        <button type="button" onClick={onRemoveCoupon} className="text-xs font-medium text-red-500 hover:underline">
          Remove
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-sm font-medium text-bamboo-700"
      >
        <span className="flex items-center gap-2">
          <FiTag size={14} /> Have a coupon code?
        </span>
        <FiChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="flex gap-2 pt-3">
              <input
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && onApplyCoupon()}
                placeholder="e.g. WELCOME10"
                className="input-field flex-1 !py-2 text-sm"
              />
              <Button onClick={onApplyCoupon} isLoading={isApplyingCoupon} className="!px-5 !py-2 text-sm">
                Apply
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Order summary                                                       */
/* ------------------------------------------------------------------ */

const SummaryRow = ({ label, value, highlight }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-bamboo-600">{label}</span>
    <span className={`tabular-nums ${highlight ? 'font-medium text-green-600' : 'text-bamboo-800'}`}>{value}</span>
  </div>
);

const OrderSummary = ({
  itemCount,
  subtotal,
  discount,
  shippingCost,
  grandTotal,
  totalSavings,
  belowMinOrder,
  onCheckout,
  couponProps,
}) => (
  <div className="rounded-2xl border border-bamboo-200/70 bg-white p-5 sm:p-6">
    <h2 className="font-display text-lg font-semibold text-bamboo-900">Order summary</h2>

    <div className="mt-4 border-b border-bamboo-100 pb-4">
      <CouponBox {...couponProps} />
    </div>

    <div className="mt-4 space-y-2.5">
      <SummaryRow label={`Subtotal (${itemCount} item${itemCount > 1 ? 's' : ''})`} value={formatINR(subtotal)} />
      {discount > 0 && <SummaryRow label="Discount" value={`− ${formatINR(discount)}`} highlight />}
      <SummaryRow
        label="Delivery"
        value={shippingCost === 0 ? 'FREE' : formatINR(shippingCost)}
        highlight={shippingCost === 0}
      />
    </div>

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

    <div className="mt-5 hidden lg:block">
      <Button
        fullWidth
        disabled={belowMinOrder}
        className="group !flex !items-center !justify-center !gap-2 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={onCheckout}
      >
        {belowMinOrder ? `Add ${formatINR(MIN_CART_ORDER - subtotal)} more to checkout` : 'Proceed to checkout'}
        {!belowMinOrder && <FiArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />}
      </Button>
    </div>

    <Link
      to="/shop"
      className="mt-3 block text-center text-sm font-medium text-bamboo-600 hover:text-bamboo-800 hover:underline"
    >
      Continue shopping
    </Link>

    <div className="mt-4 flex items-center justify-center gap-2 border-t border-bamboo-100 pt-4 text-xs text-bamboo-500">
      <FiLock size={13} className="text-green-600" /> Secure checkout · 7-day easy returns
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Main cart page                                                      */
/* ------------------------------------------------------------------ */

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const {
    items,
    savedForLater,
    subtotal,
    coupon,
    isLoading,
    updateItemQuantity,
    removeItem,
    toggleSaveForLater,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const discount = coupon?.discountAmount || 0;
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : FLAT_SHIPPING_COST;
  const grandTotal = Math.max(0, subtotal - discount) + shippingCost;
  const belowMinOrder = subtotal < MIN_CART_ORDER;
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalSavings = discount + (shippingCost === 0 && subtotal > 0 ? FLAT_SHIPPING_COST : 0);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setIsApplyingCoupon(true);
    try {
      await applyCoupon(couponInput.trim());
      toast.success('Coupon applied successfully');
      setCouponInput('');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Invalid coupon code');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleQtyChange = async (item, quantity) => {
    try {
      await updateItemQuantity(item, quantity);
    } catch (error) {
      // Backend rejects individual quantity edits on bundle/combo items —
      // surface that message instead of failing silently.
      toast.error(error?.response?.data?.message || 'Could not update quantity');
    }
  };

  const handleRemove = async (item) => {
    try {
      await removeItem(item);
      if (item.comboGroupId) toast('Bundle removed from cart', { icon: '🎁' });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not remove item');
    }
  };

  const handleCheckout = () => {
    if (belowMinOrder) {
      toast.error(`Minimum order value is ${formatINR(MIN_CART_ORDER)}`);
      return;
    }
    if (!isAuthenticated) {
      toast('Please log in to continue', { icon: '🔒' });
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }
    navigate('/checkout');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F4EC]">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="h-8 w-40 animate-pulse rounded-lg bg-sand-200" />
          <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
            <div className="space-y-4">
              {[0, 1].map((i) => (
                <div key={i} className="h-36 animate-pulse rounded-2xl bg-sand-200" />
              ))}
            </div>
            <div className="h-72 animate-pulse rounded-2xl bg-sand-200" />
          </div>
        </div>
      </div>
    );
  }

  const hasItems = items.length > 0;

  return (
    <div className="min-h-screen bg-[#F7F4EC] pb-32 lg:pb-16">
      <Helmet>
        <title>Your Cart | Wa-Kriti</title>
      </Helmet>

      {/* Top bar */}
      <div className="border-b border-bamboo-200/60 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <h1 className="font-display text-xl font-bold text-bamboo-900 sm:text-2xl">
            Your cart
            {hasItems && (
              <span className="ml-2 text-sm font-normal text-bamboo-500">
                ({itemCount} item{itemCount > 1 ? 's' : ''})
              </span>
            )}
          </h1>
          {hasItems && (
            <span className="flex items-center gap-1.5 text-xs font-medium text-green-700 sm:text-sm">
              <FiLock size={14} /> Secure checkout
            </span>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pt-6 sm:pt-8">
        <AnimatePresence mode="wait">
          {!hasItems ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col items-center rounded-2xl border border-bamboo-200/70 bg-white px-6 py-16 text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                  className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-bamboo-50 text-bamboo-500"
                >
                  <FiShoppingBag size={28} />
                </motion.div>
                <EmptyState
                  title="Your cart is empty"
                  message="Looks like you haven't added anything yet. Explore our bamboo collection."
                  actionLabel="Continue Shopping"
                  actionTo="/shop"
                />
              </div>

              {isAuthenticated && savedForLater.length > 0 && (
                <SavedShelf items={savedForLater} onMove={toggleSaveForLater} />
              )}
            </motion.div>
          ) : (
            <motion.div
              key="filled"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ProgressBanner subtotal={subtotal} />
              <TrustStrip />

              <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px] lg:gap-10">
                <div>
                  <div className="space-y-4">
                    <AnimatePresence initial={false}>
                      {items.map((item) => (
                        <CartLine
                          key={item._id || `${item.productId}-${item.variantId}`}
                          item={item}
                          onQtyChange={(q) => handleQtyChange(item, q)}
                          onRemove={() => handleRemove(item)}
                          onSaveForLater={isAuthenticated ? () => toggleSaveForLater(item) : undefined}
                          showSaveForLater={isAuthenticated}
                        />
                      ))}
                    </AnimatePresence>
                  </div>

                  {isAuthenticated && savedForLater.length > 0 && (
                    <SavedShelf items={savedForLater} onMove={toggleSaveForLater} />
                  )}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1, ease: EASE }}
                  className="h-fit lg:sticky lg:top-6"
                >
                  <OrderSummary
                    itemCount={itemCount}
                    subtotal={subtotal}
                    discount={discount}
                    shippingCost={shippingCost}
                    grandTotal={grandTotal}
                    totalSavings={totalSavings}
                    belowMinOrder={belowMinOrder}
                    onCheckout={handleCheckout}
                    couponProps={{
                      isAuthenticated,
                      coupon,
                      couponInput,
                      setCouponInput,
                      isApplyingCoupon,
                      onApplyCoupon: handleApplyCoupon,
                      onRemoveCoupon: removeCoupon,
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile sticky checkout bar */}
      {hasItems && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-bamboo-200 bg-white px-4 py-3 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.15)] lg:hidden">
          <div className="mx-auto flex max-w-6xl items-center gap-4">
            <div className="shrink-0">
              <p className="text-[11px] text-bamboo-400">Total</p>
              <p className="font-display text-lg font-bold tabular-nums text-bamboo-900">{formatINR(grandTotal)}</p>
            </div>
            <Button
              className="!flex !flex-1 !items-center !justify-center !gap-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={belowMinOrder}
              onClick={handleCheckout}
            >
              {belowMinOrder ? `Add ${formatINR(MIN_CART_ORDER - subtotal)} more` : 'Proceed to checkout'}
              {!belowMinOrder && <FiArrowRight size={15} />}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;