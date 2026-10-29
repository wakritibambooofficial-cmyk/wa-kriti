
// import { useEffect, useRef, useState } from 'react';
// import { createPortal } from 'react-dom';
// import { Link, useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { useQuery } from '@tanstack/react-query';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   FiSearch, FiHeart, FiShoppingBag, FiMenu, FiX,
//   FiChevronRight, FiChevronDown, FiGrid, FiPackage, FiLogOut,
// } from 'react-icons/fi';

// import { categoryApi } from '../../services/productApi';
// import { useAuth } from '../../hooks/useAuth';
// import { useCart } from '../../hooks/useCart';
// import NotificationBell from './NotificationBell';
// import { cmsApi } from '../../services/cmsApi';
// import { useWishlist } from '../../hooks/useWishlist';

// const NAV_LINKS = [
//   { label: 'Home', to: '/' },
//   { label: 'Festive Gifting', to: '/festive-gifting' },
//   { label: 'Bulk-Order', to: '/festive-gifting#bulk-order-enquiry' },
//   { label: 'Knowledge Center', to: '/knowledge-center' },
//   { label: 'Blogs', to: '/blog' },
//   { label: 'About-Us', to: '/about' },
//   { label: 'Contact-Us', to: '/contact' },
//  // { label: 'Founder', to: '/founder' },
// ];

// const Navbar = () => {
//   const navigate = useNavigate();
//   const [scrolled, setScrolled] = useState(false);
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [mobileShopOpen, setMobileShopOpen] = useState(false);
//   const [shopMenuOpen, setShopMenuOpen] = useState(false);
//   const [panelTop, setPanelTop] = useState(0);
//   const [searchOpen, setSearchOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [profileOpen, setProfileOpen] = useState(false);

//   const profileRef = useRef(null);
//   const shopRef = useRef(null);
//   const searchInputRef = useRef(null);

//   const { isAuthenticated, user } = useSelector((state) => state.auth);
//   const { count: wishlistCount } = useWishlist();
//   const { logout } = useAuth();
//   const { items: cartItems } = useCart();

//   const { data: settings } = useQuery({
//     queryKey: ['website-settings'],
//     queryFn: () => cmsApi.getSettings(),
//     select: (res) => res.data.data.settings,
//     staleTime: 5 * 60 * 1000,
//   });

//   const { data: categories = [] } = useQuery({
//     queryKey: ['categories', 'all'],
//     queryFn: () => categoryApi.getCategories(),
//     select: (res) => res.data.data.categories,
//     staleTime: 5 * 60 * 1000,
//   });

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 20);
//     window.addEventListener('scroll', onScroll);
//     return () => window.removeEventListener('scroll', onScroll);
//   }, []);

//   useEffect(() => {
//     document.body.style.overflow = mobileOpen ? 'hidden' : '';
//     return () => { document.body.style.overflow = ''; };
//   }, [mobileOpen]);

//   useEffect(() => {
//     if (!mobileOpen) setMobileShopOpen(false);
//   }, [mobileOpen]);

//   useEffect(() => {
//     const onClickOutside = (e) => {
//       if (profileRef.current && !profileRef.current.contains(e.target)) {
//         setProfileOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', onClickOutside);
//     return () => document.removeEventListener('mousedown', onClickOutside);
//   }, []);

//   useEffect(() => {
//     if (searchOpen) {
//       const t = setTimeout(() => searchInputRef.current?.focus(), 150);
//       return () => clearTimeout(t);
//     }
//   }, [searchOpen]);

//   // Measure the exact bottom edge of the Shop link so the panel sits
//   // flush underneath it — no CSS padding gap, no drift on scroll/resize.
//   useEffect(() => {
//     if (!shopMenuOpen) return;
//     const measure = () => {
//       if (shopRef.current) {
//         setPanelTop(shopRef.current.getBoundingClientRect().bottom);
//       }
//     };
//     measure();
//     window.addEventListener('resize', measure);
//     window.addEventListener('scroll', measure, true);
//     return () => {
//       window.removeEventListener('resize', measure);
//       window.removeEventListener('scroll', measure, true);
//     };
//   }, [shopMenuOpen, scrolled]);

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
//     setSearchOpen(false);
//   };

//   const userInitial = (user?.name || user?.email || 'U').trim().charAt(0).toUpperCase();

//   return (
//     <header className={`sticky top-0 z-40 transition-shadow duration-300 ${scrolled ? 'shadow-soft' : ''}`}>
//       {/* ── Main bar: logo block on the left, actions on the right ── */}
//       <div className={`bg-white transition-[padding] duration-300 ${scrolled ? 'py-2.5' : 'py-4'}`}>
//         <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 lg:px-8">
//           {/* Left cell — mobile menu + logo + brand + tagline */}
//           <div className="flex min-w-0 items-center gap-3">
//             <button
//               onClick={() => setMobileOpen(true)}
//               className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-bamboo-700 hover:bg-sand-100 lg:hidden"
//               aria-label="Menu"
//             >
//               <FiMenu size={20} />
//             </button>

//             <Link to="/" className="flex min-w-0 items-center gap-3">
//               {settings?.logo?.url && (
//                 <img
//                   src={settings.logo.url}
//                   alt={settings.websiteName}
//                   className={`w-auto shrink-0 object-contain transition-all duration-300 ${scrolled ? 'h-11' : 'h-16'}`}
//                 />
//               )}

//               <div className="flex min-w-0 flex-col justify-center leading-tight">
//                 <span
//   className={`flex items-start font-display font-extrabold tracking-wide text-bamboo-700 transition-all duration-300 ${scrolled ? 'text-xl' : 'text-2xl'}`}
// >
//   <span className="truncate">{settings?.websiteName || 'WA-KRITI'}</span>
//   <sup className="ml-0.5 mt-0.5 text-[9px] font-semibold leading-none tracking-normal">TM</sup>
// </span>
//                 <span className="mt-0.5 max-w-[11rem] truncate text-[10px] font-medium tracking-wide text-earth-500 sm:max-w-[16rem] sm:whitespace-normal sm:leading-snug">
//                   {settings?.tagline || 'Wa-Kriti Premium Bamboo Living Products'}
//                 </span>
//               </div>
//             </Link>
//           </div>

//           {/* Right cell */}
//           <div className="flex shrink-0 items-center justify-end gap-1.5">
//             <button
//               onClick={() => setSearchOpen((o) => !o)}
//               className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 ${
//                 searchOpen ? 'bg-bamboo-700 text-white' : 'text-bamboo-600 hover:bg-sand-100'
//               }`}
//               aria-label="Search"
//             >
//               <FiSearch size={17} className={`transition-transform duration-300 ${searchOpen ? 'rotate-90' : ''}`} />
//             </button>


            

//             <Link
//               to="/wishlist"
//               className="relative hidden h-9 w-9 items-center justify-center rounded-full text-bamboo-600 hover:bg-sand-100 sm:flex"
//               aria-label="Wishlist"
//             >
//               <FiHeart size={17} />
//               {wishlistCount > 0 && (
//                 <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-earth-500 text-[9px] font-bold text-white animate-[scaleIn_0.2s_ease-out]">
//                   {wishlistCount}
//                 </span>
//               )}
//             </Link>

//             <Link
//               to="/cart"
//               className="flex items-center gap-1.5 rounded-full border border-bamboo-200 px-3 py-1.5 text-xs font-semibold text-bamboo-700 hover:border-bamboo-700 hover:bg-bamboo-700 hover:text-white"
//             >
//               <FiShoppingBag size={15} />
//               <span>{cartItems.length}</span>
//             </Link>

//             {isAuthenticated && <NotificationBell />}

//             {isAuthenticated ? (
//               <div className="relative" ref={profileRef}>
//                 <button
//                   onClick={() => setProfileOpen((o) => !o)}
//                   onMouseEnter={() => setProfileOpen(true)}
//                   className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold uppercase transition-all duration-200 active:scale-95 ${
//                     profileOpen
//                       ? 'bg-bamboo-700 text-white shadow-md shadow-bamboo-600/30'
//                       : 'bg-bamboo-100 text-bamboo-700 hover:bg-bamboo-200'
//                   }`}
//                   aria-label="Account"
//                   aria-expanded={profileOpen}
//                 >
//                   {userInitial}
//                 </button>

//                 <div
//                   onMouseLeave={() => setProfileOpen(false)}
//                   className={`absolute right-0 z-50 mt-3 w-64 origin-top-right overflow-hidden rounded-2xl border border-sand-200/70 bg-white shadow-soft-lg transition-all duration-200 ease-out ${
//                     profileOpen
//                       ? 'visible translate-y-0 scale-100 opacity-100'
//                       : 'invisible translate-y-1 scale-95 opacity-0'
//                   }`}
//                 >
//                   <div className="flex items-center gap-3 bg-gradient-to-br from-bamboo-50 to-sand-50 px-4 py-4">
//                     <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-bamboo-700 text-base font-bold text-white shadow-sm">
//                       {userInitial}
//                     </div>
//                     <div className="min-w-0">
//                       <p className="truncate font-display text-sm font-semibold text-bamboo-800">
//                         {user?.name || 'My Account'}
//                       </p>
//                       <p className="truncate text-xs text-bamboo-500">{user?.email}</p>
//                     </div>
//                   </div>

//                   <div className="p-2">
//                     <Link
//                       to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
//                       onClick={() => setProfileOpen(false)}
//                       className="group/link flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-bamboo-700 hover:bg-bamboo-50"
//                     >
//                       <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sand-100 text-bamboo-500 group-hover/link:bg-bamboo-100 group-hover/link:text-bamboo-700">
//                         <FiGrid size={15} />
//                       </span>
//                       Dashboard
//                       <FiChevronRight size={14} className="ml-auto text-bamboo-300 group-hover/link:translate-x-0.5" />
//                     </Link>

//                     <Link
//                       to="/dashboard/orders"
//                       onClick={() => setProfileOpen(false)}
//                       className="group/link flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-bamboo-700 hover:bg-bamboo-50"
//                     >
//                       <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sand-100 text-bamboo-500 group-hover/link:bg-bamboo-100 group-hover/link:text-bamboo-700">
//                         <FiPackage size={15} />
//                       </span>
//                       My Orders
//                       <FiChevronRight size={14} className="ml-auto text-bamboo-300 group-hover/link:translate-x-0.5" />
//                     </Link>

//                     <div className="my-1.5 border-t border-sand-200" />

//                     <button
//                       onClick={() => {
//                         logout();
//                         setProfileOpen(false);
//                       }}
//                       className="group/link flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-red-500 hover:bg-red-50"
//                     >
//                       <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-400 group-hover/link:bg-red-100">
//                         <FiLogOut size={15} />
//                       </span>
//                       Logout
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <Link
//                 to="/login"
//                 className="ml-1 hidden rounded-full bg-bamboo-700 px-4 py-2 text-xs font-semibold text-white hover:bg-bamboo-800 active:scale-95 sm:block"
//               >
//                 Login
//               </Link>
//             )}
//           </div>
//         </div>

//         {/* ── Secondary link row ── */}
//         <nav className="mx-auto hidden max-w-7xl items-center justify-center gap-0 border-t border-sand-200/80 px-8 pt-4 lg:flex">
//           <span className="flex items-center">
//             <div
//               ref={shopRef}
//               onMouseEnter={() => setShopMenuOpen(true)}
//               onMouseLeave={() => setShopMenuOpen(false)}
//             >
//               <Link
//                 to="/shop"
//                 onClick={() => setShopMenuOpen(false)}
//                 className="nav-link flex items-center gap-2 py-2 text-sm font-medium tracking-wide text-bamboo-600 hover:text-bamboo-900"
//               >
//                 <FiGrid size={14} />
//                 Shop
//                 <FiChevronDown size={13} />
//               </Link>
//             </div>
//             <span className="mx-9 h-4 w-px bg-sand-200" />
//           </span>

//           {NAV_LINKS.map((link, i) => (
//             <span key={link.to} className="flex items-center">
//               {i > 0 && <span className="mx-9 h-4 w-px bg-sand-200" />}
//               <Link
//                 to={link.to}
//                 className="nav-link py-2 text-sm font-medium tracking-wide text-bamboo-600 hover:text-bamboo-900"
//               >
//                 {link.label}
//               </Link>
//             </span>
//           ))}
//         </nav>
//       </div>

//       {/* ── Shop mega panel — fixed & measured, so it sits flush with zero gap ── */}
//       {createPortal(
//         <AnimatePresence>
//           {shopMenuOpen && (
//             <motion.div
//               onMouseEnter={() => setShopMenuOpen(true)}
//               onMouseLeave={() => setShopMenuOpen(false)}
//               initial={{ opacity: 0, y: -8 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -8 }}
//               transition={{ duration: 0.2, ease: 'easeOut' }}
//               style={{ top: panelTop }}
//               className="fixed left-0 right-0 z-40 border-t border-sand-200 bg-white shadow-soft-lg"
//             >
//               <div className="mx-auto grid max-w-7xl grid-cols-[2fr_3fr] gap-10 px-8 py-8">
//                 <div>
//                   <p className="mb-3 font-display text-xs font-semibold text-bamboo-400">Shop by category</p>
//                   {categories.length > 0 ? (
//                     <div className="grid grid-cols-2 gap-x-6 gap-y-1">
//                       {categories.map((cat) => (
//                         <Link
//                           key={cat._id}
//                           to={`/shop?category=${cat._id}`}
//                           onClick={() => setShopMenuOpen(false)}
//                           className="group/item flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-bamboo-700 hover:bg-sand-100 hover:text-bamboo-900"
//                         >
//                           <span className="whitespace-normal break-words leading-snug">{cat.name}</span>
//                           <FiChevronRight size={13} className="shrink-0 text-bamboo-300 opacity-0 group-hover/item:translate-x-0.5 group-hover/item:opacity-100" />
//                         </Link>
//                       ))}
//                     </div>
//                   ) : (
//                     <p className="px-2.5 py-2 text-sm text-bamboo-400">No categories yet.</p>
//                   )}
//                   <Link
//                     to="/shop"
//                     onClick={() => setShopMenuOpen(false)}
//                     className="mt-4 flex w-fit items-center gap-1.5 rounded-full border border-bamboo-200 px-4 py-2 text-xs font-semibold text-bamboo-700 hover:border-bamboo-700 hover:bg-bamboo-700 hover:text-white"
//                   >
//                     View all products
//                     <FiChevronRight size={12} />
//                   </Link>
//                 </div>

//                 <Link
//                   to="/festive-gifting"
//                   onClick={() => setShopMenuOpen(false)}
//                   className="festive-panel group/promo relative flex flex-col justify-center overflow-hidden rounded-2xl p-8 text-white"
//                 >
//                   <span className="mb-3 w-fit rounded-full border border-white/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white/90">
//                     Festive Season
//                   </span>
//                   <h3 className="font-display text-3xl font-bold leading-tight">
//                     Festive
//                     <br />
//                     Gifting
//                   </h3>
//                   <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/85">
//                     Curated bamboo gifts for every celebration, handcrafted by artisans in Tripura.
//                   </p>
//                   <span className="mt-6 flex items-center gap-1.5 text-sm font-semibold text-white group-hover/promo:text-white">
//                     Explore the collection
//                     <FiChevronRight size={15} className="transition-transform duration-200 group-hover/promo:translate-x-1" />
//                   </span>
//                 </Link>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>,
//         document.body  
//       )}

//       {/* ── Search reveal ── */}
//       <div
//         className={`overflow-hidden border-t transition-all duration-300 ease-out ${
//           searchOpen ? 'max-h-24 border-sand-200 bg-sand-50 opacity-100' : 'max-h-0 border-t-0 opacity-0'
//         }`}
//       >
//         <div className="px-4 py-4">
//           <form onSubmit={handleSearchSubmit} className="mx-auto flex max-w-2xl items-center gap-2">
//             <div className="relative flex-1">
//               <FiSearch size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-bamboo-400" />
//               <input
//                 ref={searchInputRef}
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search for bamboo products..."
//                 className="w-full rounded-full border border-bamboo-200 bg-white py-2.5 pl-10 pr-10 text-sm text-bamboo-800 shadow-sm outline-none focus:border-bamboo-400 focus:ring-2 focus:ring-bamboo-100"
//               />
//               {searchQuery && (
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setSearchQuery('');
//                     searchInputRef.current?.focus();
//                   }}
//                   aria-label="Clear search"
//                   className="absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-bamboo-100 text-bamboo-500 hover:bg-bamboo-200 hover:text-bamboo-700"
//                 >
//                   <FiX size={12} />
//                 </button>
//               )}
//             </div>
//             <button
//               type="submit"
//               className="shrink-0 rounded-full bg-bamboo-700 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-bamboo-800 active:scale-95"
//             >
//               Search
//             </button>
//           </form>
//         </div>
//       </div>

//       {/* ── Mobile drawer — unchanged ── */}
//       {createPortal(
//         <div
//           className={`fixed inset-0 z-[100] lg:hidden ${mobileOpen ? '' : 'pointer-events-none'}`}
//           aria-hidden={!mobileOpen}
//         >
//           <div
//             onClick={() => setMobileOpen(false)}
//             className={`absolute inset-0 bg-bamboo-900/60 backdrop-blur-sm transition-opacity duration-300 ${
//               mobileOpen ? 'opacity-100' : 'opacity-0'
//             }`}
//           />
//           <div
//             className={`absolute left-0 top-0 flex h-full w-[85vw] max-w-sm flex-col bg-white shadow-soft-lg transition-transform duration-300 ease-out ${
//               mobileOpen ? 'translate-x-0' : '-translate-x-full'
//             }`}
//           >
//             <div className="flex items-center justify-between px-6 py-5">
//               <span className="font-display text-lg font-bold text-bamboo-700">
//                 {settings?.websiteName || 'Wa-Kriti'}
//               </span>
//               <button
//                 onClick={() => setMobileOpen(false)}
//                 aria-label="Close menu"
//                 className="flex h-9 w-9 items-center justify-center rounded-full text-bamboo-600 hover:bg-sand-100"
//               >
//                 <FiX size={18} />
//               </button>
//             </div>

//             <div className="flex items-center gap-3 px-6 pb-4">
//               <Link
//                 to="/wishlist"
//                 onClick={() => setMobileOpen(false)}
//                 className="relative flex h-10 w-10 items-center justify-center rounded-full bg-sand-100 text-bamboo-600"
//                 aria-label="Wishlist"
//               >
//                 <FiHeart size={16} />
//                 {wishlistCount > 0 && (
//                   <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-earth-500 text-[9px] font-bold text-white">
//                     {wishlistCount}
//                   </span>
//                 )}
//               </Link>
//               <Link
//                 to="/cart"
//                 onClick={() => setMobileOpen(false)}
//                 className="flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-bamboo-700 text-sm font-semibold text-white"
//               >
//                 <FiShoppingBag size={16} /> Bag · {cartItems.length}
//               </Link>
//             </div>

//             <div className="mx-6 h-px bg-sand-200" />

//             <nav className="flex flex-1 flex-col overflow-y-auto px-3 py-3">
//               <div>
//                 <div className="flex items-center rounded-lg hover:bg-sand-100">
//                   <Link
//                     to="/shop"
//                     onClick={() => setMobileOpen(false)}
//                     className="flex-1 px-4 py-3.5 text-base font-medium text-bamboo-800"
//                   >
//                     Shop
//                   </Link>
//                   <button
//                     onClick={() => setMobileShopOpen((o) => !o)}
//                     aria-label="Toggle shop categories"
//                     aria-expanded={mobileShopOpen}
//                     className="flex h-12 w-12 items-center justify-center text-bamboo-400"
//                   >
//                     <FiChevronDown
//                       size={16}
//                       className={`transition-transform duration-300 ${mobileShopOpen ? 'rotate-180 text-bamboo-700' : ''}`}
//                     />
//                   </button>
//                 </div>

//                 <div
//                   className={`overflow-hidden transition-all duration-300 ease-out ${
//                     mobileShopOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
//                   }`}
//                 >
//                   <div className="ml-4 flex flex-col gap-0.5 border-l-2 border-sand-200 py-1 pl-4">
//                     {categories.length > 0 ? (
//                       categories.map((cat) => (
//                         <Link
//                           key={cat._id}
//                           to={`/shop?category=${cat._id}`}
//                           onClick={() => setMobileOpen(false)}
//                           className="rounded-lg px-3 py-2 text-sm text-bamboo-600 hover:bg-sand-100 hover:text-bamboo-800"
//                         >
//                           {cat.name}
//                         </Link>
//                       ))
//                     ) : (
//                       <span className="px-3 py-2 text-sm text-bamboo-400">No categories yet.</span>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {NAV_LINKS.map((link) => (
//                 <Link
//                   key={link.to}
//                   to={link.to}
//                   onClick={() => setMobileOpen(false)}
//                   className="group flex items-center justify-between rounded-lg px-4 py-3.5 text-base font-medium text-bamboo-800 hover:bg-sand-100"
//                 >
//                   {link.label}
//                   <FiChevronRight size={16} className="text-bamboo-300 transition-transform duration-200 group-hover:translate-x-0.5" />
//                 </Link>
//               ))}
//             </nav>

//             <div className="border-t border-sand-200 px-6 py-4">
//               {!isAuthenticated ? (
//                 <Link
//                   to="/login"
//                   onClick={() => setMobileOpen(false)}
//                   className="block w-full rounded-full bg-bamboo-700 px-3 py-3 text-center text-sm font-semibold text-white hover:bg-bamboo-800 active:scale-[0.98]"
//                 >
//                   Login
//                 </Link>
//               ) : (
//                 <button
//                   onClick={() => {
//                     logout();
//                     setMobileOpen(false);
//                   }}
//                   className="flex w-full items-center justify-center gap-2 rounded-full border border-red-200 px-3 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 active:scale-[0.98]"
//                 >
//                   <FiLogOut size={15} /> Logout
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>,
//         document.body
//       )}

//       <style>{`
//         @keyframes scaleIn {
//           from { transform: scale(0); opacity: 0; }
//           to { transform: scale(1); opacity: 1; }
//         }

//         .nav-link {
//           position: relative;
//           display: inline-flex;
//         }
//         .nav-link::after {
//           content: '';
//           position: absolute;
//           left: 0;
//           bottom: -3px;
//           width: 0;
//           height: 1.5px;
//           background-color: currentColor;
//           transition: width 0.25s ease;
//         }
//         .nav-link:hover::after {
//           width: 100%;
//         }

//         /* Animated color-shifting background for the Festive Gifting panel */
//         .festive-panel {
//           background-image: linear-gradient(
//             120deg,
//             #3f6b3f 0%,
//             #6ea05e 25%,
//             #d9a441 50%,
//             #b8622f 75%,
//             #3f6b3f 100%
//           );
//           background-size: 300% 300%;
//           animation: festiveShift 8s ease infinite;
//         }

//         @keyframes festiveShift {
//           0% { background-position: 0% 50%; }
//           50% { background-position: 100% 50%; }
//           100% { background-position: 0% 50%; }
//         }
//       `}</style>
//     </header>
//   );
// };

// export default Navbar;


import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch, FiHeart, FiShoppingBag, FiMenu, FiX,
  FiChevronRight, FiChevronDown, FiGrid, FiPackage, FiLogOut, FiUser,
} from 'react-icons/fi';

import { categoryApi } from '../../services/productApi';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import NotificationBell from './NotificationBell';
import { cmsApi } from '../../services/cmsApi';
import { useWishlist } from '../../hooks/useWishlist';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Festive Gifting', to: '/festive-gifting' },
  { label: 'Bulk-Order', to: '/festive-gifting#bulk-order-enquiry' },
  { label: 'Knowledge Center', to: '/knowledge-center' },
  { label: 'Blogs', to: '/blog' },
  { label: 'About-Us', to: '/about' },
  { label: 'Contact-Us', to: '/contact' },
 // { label: 'Founder', to: '/founder' },
];

const Navbar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const [panelTop, setPanelTop] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);
  const shopRef = useRef(null);
  const searchInputRef = useRef(null);
  const mobileSearchRef = useRef(null);

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { count: wishlistCount } = useWishlist();
  const { logout } = useAuth();
  const { items: cartItems } = useCart();

  const { data: settings } = useQuery({
    queryKey: ['website-settings'],
    queryFn: () => cmsApi.getSettings(),
    select: (res) => res.data.data.settings,
    staleTime: 5 * 60 * 1000,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories', 'all'],
    queryFn: () => categoryApi.getCategories(),
    select: (res) => res.data.data.categories,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) setMobileShopOpen(false);
  }, [mobileOpen]);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      const t = setTimeout(() => searchInputRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }
  }, [searchOpen]);

  // Measure the exact bottom edge of the Shop link so the panel sits
  // flush underneath it — no CSS padding gap, no drift on scroll/resize.
  useEffect(() => {
    if (!shopMenuOpen) return;
    const measure = () => {
      if (shopRef.current) {
        setPanelTop(shopRef.current.getBoundingClientRect().bottom);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
    };
  }, [shopMenuOpen, scrolled]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
  };

  const userInitial = (user?.name || user?.email || 'U').trim().charAt(0).toUpperCase();

  return (
    <header className={`sticky top-0 z-40 transition-shadow duration-300 ${scrolled ? 'shadow-soft' : ''}`}>
      {/* ── Main bar: logo block on the left, actions on the right ── */}
      <div className={`bg-white transition-[padding] duration-300 ${scrolled ? 'py-2.5' : 'py-2 sm:py-4'}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 sm:gap-4 lg:px-8">
          {/* Left cell — mobile menu + logo + brand + tagline */}
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-bamboo-700 hover:bg-sand-100 lg:hidden"
              aria-label="Menu"
            >
              <FiMenu size={20} />
            </button>

            <Link to="/" className="flex min-w-0 items-center gap-3">
              {settings?.logo?.url && (
                <img
                  src={settings.logo.url}
                  alt={settings.websiteName}
                  className={`w-auto shrink-0 object-contain transition-all duration-300 ${scrolled ? 'h-9 sm:h-11' : 'h-10 sm:h-16'}`}
                />
              )}

              {/* Brand text + tagline: hidden on mobile when a logo exists */}
              <div className={`min-w-0 flex-col justify-center leading-tight ${settings?.logo?.url ? 'hidden sm:flex' : 'flex'}`}>
                <span
                  className={`flex items-start font-display font-extrabold tracking-wide text-bamboo-700 transition-all duration-300 ${scrolled ? 'text-xl' : 'text-2xl'}`}
                >
                  <span className="truncate">{settings?.websiteName || 'WA-KRITI'}</span>
                  <sup className="ml-0.5 mt-0.5 text-[9px] font-semibold leading-none tracking-normal">TM</sup>
                </span>
                <span className="mt-0.5 max-w-[11rem] truncate text-[10px] font-medium tracking-wide text-earth-500 sm:max-w-[16rem] sm:whitespace-normal sm:leading-snug">
                  {settings?.tagline || 'Wa-Kriti Premium Bamboo Living Products'}
                </span>
              </div>
            </Link>
          </div>

          {/* Right cell */}
          <div className="flex shrink-0 items-center justify-end gap-0.5 sm:gap-1.5">
            {/* Search toggle: desktop/tablet only (mobile has an always-visible search bar) */}
            <button
              onClick={() => setSearchOpen((o) => !o)}
              className={`hidden h-9 w-9 items-center justify-center rounded-full transition-all duration-300 sm:flex ${
                searchOpen ? 'bg-bamboo-700 text-white' : 'text-bamboo-600 hover:bg-sand-100'
              }`}
              aria-label="Search"
            >
              <FiSearch size={17} className={`transition-transform duration-300 ${searchOpen ? 'rotate-90' : ''}`} />
            </button>

            <Link
              to="/wishlist"
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-bamboo-600 hover:bg-sand-100"
              aria-label="Wishlist"
            >
              <FiHeart size={17} />
              {wishlistCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-earth-500 text-[9px] font-bold text-white animate-[scaleIn_0.2s_ease-out]">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="flex items-center gap-1.5 rounded-full border border-bamboo-200 px-3 py-1.5 text-xs font-semibold text-bamboo-700 hover:border-bamboo-700 hover:bg-bamboo-700 hover:text-white"
            >
              <FiShoppingBag size={15} />
              <span>{cartItems.length}</span>
            </Link>

            {isAuthenticated && <NotificationBell />}

            {isAuthenticated ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen((o) => !o)}
                  onMouseEnter={() => setProfileOpen(true)}
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold uppercase transition-all duration-200 active:scale-95 ${
                    profileOpen
                      ? 'bg-bamboo-700 text-white shadow-md shadow-bamboo-600/30'
                      : 'bg-bamboo-100 text-bamboo-700 hover:bg-bamboo-200'
                  }`}
                  aria-label="Account"
                  aria-expanded={profileOpen}
                >
                  {userInitial}
                </button>

                <div
                  onMouseLeave={() => setProfileOpen(false)}
                  className={`absolute right-0 z-50 mt-3 w-64 origin-top-right overflow-hidden rounded-2xl border border-sand-200/70 bg-white shadow-soft-lg transition-all duration-200 ease-out ${
                    profileOpen
                      ? 'visible translate-y-0 scale-100 opacity-100'
                      : 'invisible translate-y-1 scale-95 opacity-0'
                  }`}
                >
                  <div className="flex items-center gap-3 bg-gradient-to-br from-bamboo-50 to-sand-50 px-4 py-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-bamboo-700 text-base font-bold text-white shadow-sm">
                      {userInitial}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-display text-sm font-semibold text-bamboo-800">
                        {user?.name || 'My Account'}
                      </p>
                      <p className="truncate text-xs text-bamboo-500">{user?.email}</p>
                    </div>
                  </div>

                  <div className="p-2">
                    <Link
                      to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                      onClick={() => setProfileOpen(false)}
                      className="group/link flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-bamboo-700 hover:bg-bamboo-50"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sand-100 text-bamboo-500 group-hover/link:bg-bamboo-100 group-hover/link:text-bamboo-700">
                        <FiGrid size={15} />
                      </span>
                      Dashboard
                      <FiChevronRight size={14} className="ml-auto text-bamboo-300 group-hover/link:translate-x-0.5" />
                    </Link>

                    <Link
                      to="/dashboard/orders"
                      onClick={() => setProfileOpen(false)}
                      className="group/link flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-bamboo-700 hover:bg-bamboo-50"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sand-100 text-bamboo-500 group-hover/link:bg-bamboo-100 group-hover/link:text-bamboo-700">
                        <FiPackage size={15} />
                      </span>
                      My Orders
                      <FiChevronRight size={14} className="ml-auto text-bamboo-300 group-hover/link:translate-x-0.5" />
                    </Link>

                    <div className="my-1.5 border-t border-sand-200" />

                    <button
                      onClick={() => {
                        logout();
                        setProfileOpen(false);
                      }}
                      className="group/link flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-red-500 hover:bg-red-50"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-400 group-hover/link:bg-red-100">
                        <FiLogOut size={15} />
                      </span>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="ml-1 hidden rounded-full bg-bamboo-700 px-4 py-2 text-xs font-semibold text-white hover:bg-bamboo-800 active:scale-95 sm:block"
                >
                  Login
                </Link>
                {/* Mobile-only login icon */}
                <Link
                  to="/login"
                  aria-label="Login"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-bamboo-600 hover:bg-sand-100 sm:hidden"
                >
                  <FiUser size={18} />
                </Link>
              </>
            )}
          </div>
        </div>

        {/* ── Mobile search bar (mobile only, always visible) ── */}
        <form onSubmit={handleSearchSubmit} className="px-4 pb-2.5 pt-1 sm:hidden">
          <div className="relative">
            <FiSearch size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-bamboo-400" />
            <input
              ref={mobileSearchRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for bamboo products..."
              className="w-full rounded-lg border border-sand-200 bg-sand-50 py-2.5 pl-10 pr-10 text-sm text-bamboo-800 outline-none focus:border-bamboo-400 focus:bg-white focus:ring-2 focus:ring-bamboo-100"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  mobileSearchRef.current?.focus();
                }}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-bamboo-100 text-bamboo-500"
              >
                <FiX size={12} />
              </button>
            )}
          </div>
        </form>

        {/* ── Secondary link row ── */}
        <nav className="mx-auto hidden max-w-7xl items-center justify-center gap-0 border-t border-sand-200/80 px-8 pt-4 lg:flex">
          <span className="flex items-center">
            <div
              ref={shopRef}
              onMouseEnter={() => setShopMenuOpen(true)}
              onMouseLeave={() => setShopMenuOpen(false)}
            >
              <Link
                to="/shop"
                onClick={() => setShopMenuOpen(false)}
                className="nav-link flex items-center gap-2 py-2 text-sm font-medium tracking-wide text-bamboo-600 hover:text-bamboo-900"
              >
                <FiGrid size={14} />
                Shop
                <FiChevronDown size={13} />
              </Link>
            </div>
            <span className="mx-9 h-4 w-px bg-sand-200" />
          </span>

          {NAV_LINKS.map((link, i) => (
            <span key={link.to} className="flex items-center">
              {i > 0 && <span className="mx-9 h-4 w-px bg-sand-200" />}
              <Link
                to={link.to}
                className="nav-link py-2 text-sm font-medium tracking-wide text-bamboo-600 hover:text-bamboo-900"
              >
                {link.label}
              </Link>
            </span>
          ))}
        </nav>
      </div>

      {/* ── Shop mega panel — fixed & measured, so it sits flush with zero gap ── */}
      {createPortal(
        <AnimatePresence>
          {shopMenuOpen && (
            <motion.div
              onMouseEnter={() => setShopMenuOpen(true)}
              onMouseLeave={() => setShopMenuOpen(false)}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              style={{ top: panelTop }}
              className="fixed left-0 right-0 z-40 border-t border-sand-200 bg-white shadow-soft-lg"
            >
              <div className="mx-auto grid max-w-7xl grid-cols-[2fr_3fr] gap-10 px-8 py-8">
                <div>
                  <p className="mb-3 font-display text-xs font-semibold text-bamboo-400">Shop by category</p>
                  {categories.length > 0 ? (
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                      {categories.map((cat) => (
                        <Link
                          key={cat._id}
                          to={`/shop?category=${cat._id}`}
                          onClick={() => setShopMenuOpen(false)}
                          className="group/item flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-bamboo-700 hover:bg-sand-100 hover:text-bamboo-900"
                        >
                          <span className="whitespace-normal break-words leading-snug">{cat.name}</span>
                          <FiChevronRight size={13} className="shrink-0 text-bamboo-300 opacity-0 group-hover/item:translate-x-0.5 group-hover/item:opacity-100" />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="px-2.5 py-2 text-sm text-bamboo-400">No categories yet.</p>
                  )}
                  <Link
                    to="/shop"
                    onClick={() => setShopMenuOpen(false)}
                    className="mt-4 flex w-fit items-center gap-1.5 rounded-full border border-bamboo-200 px-4 py-2 text-xs font-semibold text-bamboo-700 hover:border-bamboo-700 hover:bg-bamboo-700 hover:text-white"
                  >
                    View all products
                    <FiChevronRight size={12} />
                  </Link>
                </div>

                <Link
                  to="/festive-gifting"
                  onClick={() => setShopMenuOpen(false)}
                  className="festive-panel group/promo relative flex flex-col justify-center overflow-hidden rounded-2xl p-8 text-white"
                >
                  <span className="mb-3 w-fit rounded-full border border-white/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white/90">
                    Festive Season
                  </span>
                  <h3 className="font-display text-3xl font-bold leading-tight">
                    Festive
                    <br />
                    Gifting
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/85">
                    Curated bamboo gifts for every celebration, handcrafted by artisans in Tripura.
                  </p>
                  <span className="mt-6 flex items-center gap-1.5 text-sm font-semibold text-white group-hover/promo:text-white">
                    Explore the collection
                    <FiChevronRight size={15} className="transition-transform duration-200 group-hover/promo:translate-x-1" />
                  </span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* ── Search reveal (tablet/desktop only) ── */}
      <div
        className={`hidden overflow-hidden border-t transition-all duration-300 ease-out sm:block ${
          searchOpen ? 'max-h-24 border-sand-200 bg-sand-50 opacity-100' : 'max-h-0 border-t-0 opacity-0'
        }`}
      >
        <div className="px-4 py-4">
          <form onSubmit={handleSearchSubmit} className="mx-auto flex max-w-2xl items-center gap-2">
            <div className="relative flex-1">
              <FiSearch size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-bamboo-400" />
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for bamboo products..."
                className="w-full rounded-full border border-bamboo-200 bg-white py-2.5 pl-10 pr-10 text-sm text-bamboo-800 shadow-sm outline-none focus:border-bamboo-400 focus:ring-2 focus:ring-bamboo-100"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    searchInputRef.current?.focus();
                  }}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-bamboo-100 text-bamboo-500 hover:bg-bamboo-200 hover:text-bamboo-700"
                >
                  <FiX size={12} />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="shrink-0 rounded-full bg-bamboo-700 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-bamboo-800 active:scale-95"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* ── Mobile drawer — unchanged ── */}
      {createPortal(
        <div
          className={`fixed inset-0 z-[100] lg:hidden ${mobileOpen ? '' : 'pointer-events-none'}`}
          aria-hidden={!mobileOpen}
        >
          <div
            onClick={() => setMobileOpen(false)}
            className={`absolute inset-0 bg-bamboo-900/60 backdrop-blur-sm transition-opacity duration-300 ${
              mobileOpen ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <div
            className={`absolute left-0 top-0 flex h-full w-[85vw] max-w-sm flex-col bg-white shadow-soft-lg transition-transform duration-300 ease-out ${
              mobileOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="flex items-center justify-between px-6 py-5">
              <span className="font-display text-lg font-bold text-bamboo-700">
                {settings?.websiteName || 'Wa-Kriti'}
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-full text-bamboo-600 hover:bg-sand-100"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="flex items-center gap-3 px-6 pb-4">
              <Link
                to="/wishlist"
                onClick={() => setMobileOpen(false)}
                className="relative flex h-10 w-10 items-center justify-center rounded-full bg-sand-100 text-bamboo-600"
                aria-label="Wishlist"
              >
                <FiHeart size={16} />
                {wishlistCount > 0 && (
                  <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-earth-500 text-[9px] font-bold text-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link
                to="/cart"
                onClick={() => setMobileOpen(false)}
                className="flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-bamboo-700 text-sm font-semibold text-white"
              >
                <FiShoppingBag size={16} /> Bag · {cartItems.length}
              </Link>
            </div>

            <div className="mx-6 h-px bg-sand-200" />

            <nav className="flex flex-1 flex-col overflow-y-auto px-3 py-3">
              <div>
                <div className="flex items-center rounded-lg hover:bg-sand-100">
                  <Link
                    to="/shop"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 px-4 py-3.5 text-base font-medium text-bamboo-800"
                  >
                    Shop
                  </Link>
                  <button
                    onClick={() => setMobileShopOpen((o) => !o)}
                    aria-label="Toggle shop categories"
                    aria-expanded={mobileShopOpen}
                    className="flex h-12 w-12 items-center justify-center text-bamboo-400"
                  >
                    <FiChevronDown
                      size={16}
                      className={`transition-transform duration-300 ${mobileShopOpen ? 'rotate-180 text-bamboo-700' : ''}`}
                    />
                  </button>
                </div>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-out ${
                    mobileShopOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="ml-4 flex flex-col gap-0.5 border-l-2 border-sand-200 py-1 pl-4">
                    {categories.length > 0 ? (
                      categories.map((cat) => (
                        <Link
                          key={cat._id}
                          to={`/shop?category=${cat._id}`}
                          onClick={() => setMobileOpen(false)}
                          className="rounded-lg px-3 py-2 text-sm text-bamboo-600 hover:bg-sand-100 hover:text-bamboo-800"
                        >
                          {cat.name}
                        </Link>
                      ))
                    ) : (
                      <span className="px-3 py-2 text-sm text-bamboo-400">No categories yet.</span>
                    )}
                  </div>
                </div>
              </div>

              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="group flex items-center justify-between rounded-lg px-4 py-3.5 text-base font-medium text-bamboo-800 hover:bg-sand-100"
                >
                  {link.label}
                  <FiChevronRight size={16} className="text-bamboo-300 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              ))}
            </nav>

            <div className="border-t border-sand-200 px-6 py-4">
              {!isAuthenticated ? (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full rounded-full bg-bamboo-700 px-3 py-3 text-center text-sm font-semibold text-white hover:bg-bamboo-800 active:scale-[0.98]"
                >
                  Login
                </Link>
              ) : (
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-red-200 px-3 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 active:scale-[0.98]"
                >
                  <FiLogOut size={15} /> Logout
                </button>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .nav-link {
          position: relative;
          display: inline-flex;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -3px;
          width: 0;
          height: 1.5px;
          background-color: currentColor;
          transition: width 0.25s ease;
        }
        .nav-link:hover::after {
          width: 100%;
        }

        /* Animated color-shifting background for the Festive Gifting panel */
        .festive-panel {
          background-image: linear-gradient(
            120deg,
            #3f6b3f 0%,
            #6ea05e 25%,
            #d9a441 50%,
            #b8622f 75%,
            #3f6b3f 100%
          );
          background-size: 300% 300%;
          animation: festiveShift 8s ease infinite;
        }

        @keyframes festiveShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;