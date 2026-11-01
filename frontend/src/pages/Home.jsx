// import { Link } from 'react-router-dom';
// import { useQuery, useQueryClient } from '@tanstack/react-query';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Autoplay, Pagination } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/pagination';
// import { motion } from 'framer-motion';
// import { FiArrowRight, FiGift } from 'react-icons/fi';
// import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// //import {  AnimatePresence } from 'framer-motion';
// import toast from 'react-hot-toast';
// import GovernmentAffiliations from '../components/GovernmentAffiliations';
// import { cmsApi } from '../services/cmsApi';
// import { categoryApi, productApi } from '../services/productApi';
// import { promotionApi } from '../services/growthApi';
// import ProductCard from '../components/product/ProductCard';
// import { ProductGridSkeleton } from '../components/product/ProductCardSkeleton';
// import Button from '../components/ui/Button';
// import { featureApi } from '../services/featureApi';
// import PromoBanners from '../components/PromoBanners';

// // const FEATURES = [
// //   { title: '100% Bamboo', desc: 'Crafted from sustainably harvested bamboo' },
// //   { title: 'Handcrafted', desc: 'Made by skilled artisans across India' },
// //   { title: 'Eco Friendly', desc: 'Biodegradable & plastic-free packaging' },
// //   { title: 'Fast Shipping', desc: 'Delivered across India in 5-7 days' },
// // ];

// // const Hero = () => {
// //   const { data: banners = [], isLoading } = useQuery({
// //     queryKey: ['banners', 'hero_slider'],
// //     queryFn: () => cmsApi.getBanners('hero_slider'),
// //     select: (res) => res.data.data.banners,
// //   });

// //   if (isLoading) return <div className="h-[70vh] animate-pulse bg-sand-200 sm:h-[85vh]" />;

// //   if (!banners.length) {
// //     return (
// //       <div className="flex h-[70vh] flex-col items-center justify-center bg-gradient-to-br from-bamboo-700 to-bamboo-800 px-4 text-center text-white sm:h-[85vh]">
// //         <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-semibold uppercase tracking-[0.3em] text-sand-300">
// //           Wa-Kriti
// //         </motion.span>
// //         <motion.h1
// //           initial={{ opacity: 0, y: 20 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           transition={{ delay: 0.1 }}
// //           className="mt-3 max-w-2xl font-display text-4xl font-bold sm:text-5xl"
// //         >
// //           Bring Nature Home
// //         </motion.h1>
// //         <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-3 max-w-lg text-sand-200">
// //           Discover handcrafted bamboo furniture, decor, and lifestyle products made by skilled artisans.
// //         </motion.p>
// //         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-6 flex gap-3">
// //           <Link to="/shop" className="btn-primary">Shop Now</Link>
// //           <Link to="/sustainability" className="rounded-xl border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
// //             Learn More
// //           </Link>
// //         </motion.div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <Swiper modules={[Autoplay, Pagination]} autoplay={{ delay: 2000 }} pagination={{ clickable: true }} loop className="h-[70vh] sm:h-[85vh]">
// //       {banners.map((banner) => (
// //         <SwiperSlide key={banner._id}>
// //           <div
// //             className="relative flex h-full items-center bg-cover bg-center px-6 sm:px-16"
// //             style={{ backgroundImage: `url(${banner.image.url})` }}
// //           >
// //             <div className="absolute inset-0 bg-black/40" />
// //             <div className="relative max-w-lg text-white">
// //               <span className="text-xs font-semibold uppercase tracking-[0.3em] text-sand-300">{banner.subtitle}</span>
// //               <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">{banner.title}</h1>
// //               <p className="mt-3 text-sand-100">{banner.description}</p>
// //               <div className="mt-6 flex gap-3">
// //                 {banner.ctaPrimaryLabel && (
// //                   <Link to={banner.ctaPrimaryLink || '/shop'} className="btn-primary">
// //                     {banner.ctaPrimaryLabel}
// //                   </Link>
// //                 )}
// //                 {banner.ctaSecondaryLabel && (
// //                   <Link to={banner.ctaSecondaryLink || '/shop'} className="rounded-xl border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
// //                     {banner.ctaSecondaryLabel}
// //                   </Link>
// //                 )}
// //               </div>
// //             </div>
// //           </div>
// //         </SwiperSlide>
// //       ))}
// //     </Swiper>
// //   );
// // };

// import { Helmet } from 'react-helmet-async';
// //import { FiPlus,FiArrowUpRight } from 'react-icons/fi';
// import { useEffect, useState } from 'react';
// import { useSwiperSlide } from 'swiper/react';
// import Testimonials from '../components/Testimonials';
// import Sustainability from './content/Sustainability'
// import VideoShowcase from '../components/VideoShowcase';
// import VideoShowcase2 from '../components/Video'
// /* ── Continuous typewriter: types the full text, pauses, deletes, pauses, retypes ── */
// function useTypewriterLoop(
//   text,
//   { typeSpeed = 28, deleteSpeed = 14, pauseAfterType = 2200, pauseAfterDelete = 400 } = {}
// ) {
//   const [displayed, setDisplayed] = useState('');
//   const [phase, setPhase] = useState('typing'); // 'typing' | 'deleting'

//   // reset whenever the source text changes (e.g. slide changed)
//   useEffect(() => {
//     setDisplayed('');
//     setPhase('typing');
//   }, [text]);

//   useEffect(() => {
//     if (!text) return undefined;
//     let timeout;

//     if (phase === 'typing') {
//       if (displayed.length < text.length) {
//         timeout = setTimeout(() => setDisplayed(text.slice(0, displayed.length + 1)), typeSpeed);
//       } else {
//         timeout = setTimeout(() => setPhase('deleting'), pauseAfterType);
//       }
//     } else {
//       if (displayed.length > 0) {
//         timeout = setTimeout(() => setDisplayed(text.slice(0, displayed.length - 1)), deleteSpeed);
//       } else {
//         timeout = setTimeout(() => setPhase('typing'), pauseAfterDelete);
//       }
//     }

//     return () => clearTimeout(timeout);
//   }, [displayed, phase, text, typeSpeed, deleteSpeed, pauseAfterType, pauseAfterDelete]);

//   return displayed;
// }

// /* ── Shared keyframes used by both hero states (Ken Burns zoom, shimmer, cursor blink) ── */
// const GlobalHeroStyles = () => (
//   <style>{`
//     @keyframes wk-kenburns {
//       0%   { transform: scale(1); }
//       100% { transform: scale(1.12); }
//     }
//     .wk-kenburns {
//       animation: wk-kenburns 12s ease-out infinite alternate;
//     }
//     @keyframes wk-shimmer {
//       0%   { background-position: 0% 50%; }
//       100% { background-position: 200% 50%; }
//     }
//     .wk-shimmer {
//       background-size: 200% auto;
//       animation: wk-shimmer 3.5s linear infinite;
//     }
//     @keyframes wk-blink {
//       0%, 45% { opacity: 1; }
//       50%, 100% { opacity: 0; }
//     }
//     .wk-cursor {
//       animation: wk-blink 0.9s steps(1) infinite;
//     }
//   `}</style>
// );

// /* ── Headline that reveals word by word, replaying whenever `text` changes ── */
// const AnimatedHeadline = ({ text, className }) => {
//   const words = text.split(' ');
//   return (
//     <h1 className={className}>
//       {words.map((word, i) => (
//         <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
//           <motion.span
//             initial={{ y: '110%', opacity: 0 }}
//             animate={{ y: '0%', opacity: 1 }}
//             transition={{ delay: 0.15 + i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
//             className="inline-block"
//           >
//             {word}
//             {i < words.length - 1 ? '\u00A0' : ''}
//           </motion.span>
//         </span>
//       ))}
//     </h1>
//   );
// };

// /* ── Eyebrow with flanking lines + shimmering gradient text ── */
// const Eyebrow = ({ text }) => (
//   <div className="flex items-center justify-center gap-3">
//     <span className="h-px w-8 bg-gradient-to-r from-transparent to-sand-300/80" />
//     <span className="wk-shimmer bg-gradient-to-r from-sand-200 via-white to-sand-300 bg-clip-text text-xs font-semibold uppercase tracking-[0.35em] text-transparent">
//       {text}
//     </span>
//     <span className="h-px w-8 bg-gradient-to-l from-transparent to-sand-300/80" />
//   </div>
// );

// /* ── CTA button with lift + shine-sweep hover, wraps existing className untouched ── */
// const CtaButton = ({ to, className, children }) => (
//   <Link
//     to={to}
//     className={`group relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.04] active:scale-95 ${className}`}
//   >
//     <span className="relative z-10">{children}</span>
//     <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
//   </Link>
// );

// /* ── Live slide content: only types while its slide is the active one ── */
// const SlideContent = ({ banner }) => {
//   const swiperSlide = useSwiperSlide();
//   const isActive = swiperSlide?.isActive ?? true;
//   const typed = useTypewriterLoop(isActive ? banner.description : '');

//   return (
//     <div className="relative mx-auto max-w-lg text-white">
//       <Eyebrow text={banner.subtitle} />

//       <AnimatedHeadline
//         key={banner._id}
//         text={banner.title}
//         className="mt-4 font-display text-4xl font-bold tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.4)] sm:text-5xl"
//       />

//       <p className="mt-3 min-h-[3.5rem] text-sand-100/90 leading-relaxed drop-shadow-sm">
//         {typed}
//         <span className="wk-cursor ml-0.5 inline-block w-[2px] translate-y-[2px] bg-white/90" style={{ height: '1em' }} />
//       </p>

//       <div className="mt-7 flex justify-center gap-3">
//         {banner.ctaPrimaryLabel && (
//           <CtaButton to={banner.ctaPrimaryLink || '/shop'} className="btn-primary hover:shadow-xl hover:shadow-bamboo-900/40">
//             {banner.ctaPrimaryLabel}
//           </CtaButton>
//         )}
//         {banner.ctaSecondaryLabel && (
//           <CtaButton
//             to={banner.ctaSecondaryLink || '/shop'}
//             className="rounded-xl border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:border-white/70 hover:bg-white/10 hover:shadow-lg hover:shadow-black/20"
//           >
//             {banner.ctaSecondaryLabel}
//           </CtaButton>
//         )}
//       </div>
//     </div>
//   );
// };

// const FALLBACK_DESCRIPTION =
//   'Discover handcrafted bamboo furniture, decor, and lifestyle products made by skilled artisans.';

// const Hero = () => {
//   const { data: banners = [], isLoading } = useQuery({
//     queryKey: ['banners', 'hero_slider'],
//     queryFn: () => cmsApi.getBanners('hero_slider'),
//     select: (res) => res.data.data.banners,
//   });

//   // Hooks must run unconditionally every render — compute this regardless of
//   // which branch below actually ends up using it.
//   const typedFallback = useTypewriterLoop(!isLoading && banners.length === 0 ? FALLBACK_DESCRIPTION : '');

//   if (isLoading) return <div className="h-[70vh] animate-pulse bg-sand-200 sm:h-[85vh]" />;

//   if (!banners.length) {
//     return (
//       <div className="relative flex h-[70vh] flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-bamboo-700 to-bamboo-800 px-4 text-center text-white sm:h-[85vh]">
//         <GlobalHeroStyles />

//         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
//           <Eyebrow text="Wa-Kriti" />
//         </motion.div>

//         <AnimatedHeadline
//           text="Bring Nature Home"
//           className="mt-4 max-w-2xl font-display text-4xl font-bold tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.35)] sm:text-5xl"
//         />

//         <p className="mt-3 min-h-[3.5rem] max-w-lg text-sand-100/90 leading-relaxed drop-shadow-sm">
//           {typedFallback}
//           <span className="wk-cursor ml-0.5 inline-block w-[2px] translate-y-[2px] bg-white/90" style={{ height: '1em' }} />
//         </p>

//         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-7 flex gap-3">
//           <CtaButton to="/shop" className="btn-primary hover:shadow-xl hover:shadow-bamboo-900/40">
//             Shop Now
//           </CtaButton>
//           <CtaButton
//             to="/sustainability"
//             className="rounded-xl border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:border-white/70 hover:bg-white/10 hover:shadow-lg hover:shadow-black/20"
//           >
//             Learn More
//           </CtaButton>
//         </motion.div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <GlobalHeroStyles />
//       <Swiper modules={[Autoplay, Pagination]} autoplay={{ delay: 9000 }} pagination={{ clickable: true }} loop className="h-[70vh] sm:h-[85vh]">
//         {banners.map((banner) => (
//           <SwiperSlide key={banner._id}>
//             <div className="relative flex h-full items-center justify-center overflow-hidden px-6 text-center sm:px-16">
//               <div
//                 className="wk-kenburns absolute inset-0 bg-cover bg-center"
//                 style={{ backgroundImage: `url(${banner.image.url})` }}
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/35 to-black/25" />
//               <SlideContent banner={banner} />
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </>
//   );
// };







// import { useRef, useCallback } from 'react';
// //import { useQuery } from '@tanstack/react-query';
// //import { Link } from 'react-router-dom';
// import { ChevronLeft, ChevronRight } from 'lucide-react';

// const CategoryStrip = () => {
//   const scrollRef = useRef(null);
//   const [canScrollLeft, setCanScrollLeft] = useState(false);
//   const [canScrollRight, setCanScrollRight] = useState(false);

//   const { data: categories = [] } = useQuery({
//     queryKey: ['categories', 'home'],
//     queryFn: () => categoryApi.getCategories({ featured: 'true' }),
//     select: (res) => res.data.data.categories,
//   });

//   const updateScrollButtons = useCallback(() => {
//     const el = scrollRef.current;
//     if (!el) return;
//     setCanScrollLeft(el.scrollLeft > 4);
//     setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
//   }, []);

//   useEffect(() => {
//     const el = scrollRef.current;
//     if (!el) return;
//     updateScrollButtons();

//     el.addEventListener('scroll', updateScrollButtons, { passive: true });
//     window.addEventListener('resize', updateScrollButtons);

//     return () => {
//       el.removeEventListener('scroll', updateScrollButtons);
//       window.removeEventListener('resize', updateScrollButtons);
//     };
//   }, [categories, updateScrollButtons]);

//   const scrollByAmount = (direction) => {
//     const el = scrollRef.current;
//     if (!el) return;
//     const amount = el.clientWidth * 0.7;
//     el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
//   };

//   if (!categories.length) return null;

//   return (
//     <section className="mx-auto max-w-7xl px-4 py-12">
//       <h2 className="font-display text-2xl font-bold text-bamboo-800">Shop by Category</h2>

//       <div className="relative mt-6">
//         {/* Left button - desktop only */}
//         {canScrollLeft && (
//           <button
//             type="button"
//             onClick={() => scrollByAmount('left')}
//             aria-label="Scroll categories left"
//             className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 -translate-x-3 items-center justify-center rounded-full bg-white p-2 text-bamboo-700 shadow-soft ring-1 ring-bamboo-200 transition-all hover:bg-bamboo-50 hover:text-bamboo-900 hover:scale-105 md:flex"
//           >
//             <ChevronLeft className="h-5 w-5" />
//           </button>
//         )}

//         {/* Right button - desktop only */}
//         {canScrollRight && (
//           <button
//             type="button"
//             onClick={() => scrollByAmount('right')}
//             aria-label="Scroll categories right"
//             className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 translate-x-3 items-center justify-center rounded-full bg-white p-2 text-bamboo-700 shadow-soft ring-1 ring-bamboo-200 transition-all hover:bg-bamboo-50 hover:text-bamboo-900 hover:scale-105 md:flex"
//           >
//             <ChevronRight className="h-5 w-5" />
//           </button>
//         )}

//         {/* Left/right fade edges to hint scrollability */}
//         <div className="pointer-events-none absolute inset-y-0 left-0 z-[5] hidden w-10 bg-gradient-to-r from-white to-transparent md:block" />
//         <div className="pointer-events-none absolute inset-y-0 right-0 z-[5] hidden w-10 bg-gradient-to-l from-white to-transparent md:block" />

//         <div
//           ref={scrollRef}
//           className="flex gap-4 overflow-x-auto scroll-smooth pb-2 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
//         >
//           {categories.map((cat) => (
//             <Link
//               key={cat._id}
//               to={`/shop?category=${cat._id}`}
//               className="group flex w-40 shrink-0 flex-col items-center gap-2 rounded-2xl p-3 text-center transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-bamboo-50/60"
//             >
//               <div className="relative h-24 w-24 overflow-hidden rounded-full bg-sand-100 shadow-soft ring-2 ring-transparent transition-all duration-300 ease-out group-hover:scale-105 group-hover:shadow-[0_10px_30px_-6px_rgba(63,91,62,0.45)] group-hover:ring-bamboo-300">
//                 {cat.image?.url && (
//                   <img
//                     src={cat.image.url}
//                     alt={cat.name}
//                     className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
//                   />
//                 )}
//                 <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
//                 <span className="pointer-events-none absolute inset-0 bg-bamboo-900/0 transition-colors duration-300 group-hover:bg-bamboo-900/10" />
//               </div>

//               <span className="relative text-sm font-semibold text-bamboo-700 transition-colors duration-300 group-hover:text-bamboo-900">
//                 {cat.name}
//                 <span className="absolute -bottom-0.5 left-1/2 h-px w-0 -translate-x-1/2 bg-bamboo-600 transition-all duration-300 ease-out group-hover:w-full" />
//               </span>

//               {cat.description && (
//                 <p className="line-clamp-2 text-xs leading-5 text-bamboo-500 transition-colors duration-300 group-hover:text-bamboo-600">
//                   {cat.description}
//                 </p>
//               )}
//             </Link>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// const ProductRail = ({ title, queryKey, params, viewAllHref }) => {
//   const { data, isLoading } = useQuery({
//     queryKey: ['home-products', queryKey],
//     queryFn: () => productApi.getProducts({ limit: 8, ...params }),
//     select: (res) => res.data.data.products,
//   });

//   return (
//     <section className="mx-auto max-w-7xl px-4 py-10">
//       <div className="flex items-center justify-between">
//         <h2 className="font-display text-2xl font-bold text-bamboo-800">{title}</h2>
//         <Link to={viewAllHref} className="flex items-center gap-1 text-sm font-semibold text-bamboo-600 hover:underline">
//           View All <FiArrowRight size={14} />
//         </Link>
//       </div>
//       <div className="mt-6">
//         {isLoading ? (
//           <ProductGridSkeleton count={4} />
//         ) : (
//           <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//             {(data || []).map((p) => (
//               <ProductCard key={p._id} product={p} />
//             ))}
//           </div>
//         )}
//       </div>
//     </section>
//   );
// };

// // const WhyChooseUs = () => (
// //   <section className="bg-bamboo-50 py-14">
// //     <div className="mx-auto max-w-7xl px-4">
// //       <h2 className="text-center font-display text-2xl font-bold text-bamboo-800">Why Choose Wa-Kriti</h2>
// //       <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
// //         {FEATURES.map((f) => (
// //           <div key={f.title} className="rounded-2xl bg-white p-5 text-center shadow-soft">
// //             <h3 className="font-display text-base font-semibold text-bamboo-800">{f.title}</h3>
// //             <p className="mt-1.5 text-xs text-bamboo-500">{f.desc}</p>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   </section>
// // );

// const DEFAULT_FEATURES = [
//   { title: '100% Bamboo', desc: 'Crafted from sustainably harvested bamboo' },
//   { title: 'Handcrafted', desc: 'Made by skilled artisans across India' },
//   { title: 'Eco Friendly', desc: 'Biodegradable & plastic-free packaging' },
//   { title: 'Fast Shipping', desc: 'Delivered across India in 5-7 days' },
// ];

// // const WhyChooseUs = () => {
// //   const { data: features = [], isLoading } = useQuery({
// //   queryKey: ['website-features'],
// //   queryFn: () => featureApi.getFeatures(),
// //   select: (res) => res.data.data.features,
// //   staleTime: 5 * 60 * 1000,
// // });

// //   // If database has data, use it. Otherwise use default hardcoded features.
// //   const displayFeatures =
// //     features.length > 0 ? features : DEFAULT_FEATURES;

// //   return (
// //     <section className="bg-bamboo-50 py-14">
// //       <div className="mx-auto max-w-7xl px-4">
// //         <h2 className="text-center font-display text-2xl font-bold text-bamboo-800">
// //           Why Choose Wa-Kriti
// //         </h2>

// //         <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
// //           {isLoading
// //             ? [...Array(4)].map((_, index) => (
// //                 <div
// //                   key={index}
// //                   className="h-28 animate-pulse rounded-2xl bg-white shadow-soft"
// //                 />
// //               ))
// //             : displayFeatures.map((feature) => (
// //                 <div
// //                   key={feature.title}
// //                   className="rounded-2xl bg-white p-5 text-center shadow-soft"
// //                 >
// //                   <h3 className="font-display text-base font-semibold text-bamboo-800">
// //                     {feature.title}
// //                   </h3>
// //                   <p className="mt-1.5 text-xs text-bamboo-500">
// //                     {feature.description}
// //                   </p>
// //                 </div>
// //               ))}
// //         </div>
// //       </div>
// //     </section>
// //   );
// // };

// const NodeMark = ({ className = '' }) => (
//   <svg viewBox="0 0 40 40" className={className} fill="none">
//     <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
//     <circle cx="20" cy="20" r="11" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
//     <circle cx="20" cy="20" r="4" fill="currentColor" />
//   </svg>
// );

// // const ACCENTS = ['text-bamboo-700', 'text-bamboo-500', 'text-bamboo-800'];
// const ACCENTS = ['text-bamboo-700', 'text-earth-600', 'text-bamboo-500', 'text-earth-500'];
// //const BORDER_ACCENTS = ['bg-bamboo-600', 'bg-earth-500', 'bg-bamboo-400', 'bg-earth-400'];

// const WhyChooseUs = () => {
//   const { data: features = [], isLoading } = useQuery({
//     queryKey: ['website-features'],
//     queryFn: () => featureApi.getFeatures(),
//     select: (res) => res.data.data.features,
//     staleTime: 5 * 60 * 1000,
//   });
 
//   const displayFeatures = features.length > 0 ? features : DEFAULT_FEATURES;
 
//   return (
//     <section className="relative overflow-hidden py-20">
//       {/* ── Decorative background blobs ── */}
//       <div className="pointer-events-none absolute inset-0 -z-10">
//         <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-bamboo-200/30 blur-3xl" />
//         <div className="absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-earth-300/20 blur-3xl" />
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,theme(colors.bamboo.200)_1px,transparent_0)] bg-[size:28px_28px] opacity-[0.15]" />
//       </div>
 
//       <div className="relative mx-auto max-w-7xl px-4">
 
//         {/* ── Header — colored background only behind this block ── */}
// <div className="mx-auto rounded-3xl   bg-white px-6 py-8 text-center shadow-sm sm:px-10">
//   <span className="inline-flex items-center gap-2 rounded-full  px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-black">
//     <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-earth-500" />
//     The Wa-Kriti difference
//   </span>
//   <h2 className="mt-4 font-display text-3xl font-bold text-black sm:text-4xl">
//     Why Choose{' '}
//     <span className="bg-gradient-to-r from-bamboo-600 to-earth-500 bg-clip-text text-transparent">
//       Wa-Kriti
//     </span>
//   </h2>
//   <p className="mx-auto mt-3 text-sm leading-relaxed text-gray-600">
//     Every piece we make sits at the intersection of tradition and durability —
//     here&apos;s what that actually means for you as a customer.
//   </p>
// </div>
 
//         {/* ── Feature grid ── */}
//         <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-4 ">
//           {isLoading
//             ? [...Array(4)].map((_, index) => (
//                 <div
//                   key={index}
//                   className="h-40 animate-pulse rounded-3xl bg-gradient-to-br from-sand-200 to-sand-100"
//                 />
//               ))
//             : displayFeatures.map((feature, idx) => {
//                 const accent = ACCENTS[idx % ACCENTS.length];
//                 return (
//                   <motion.div
//                     key={feature.title}
//                     initial={{ opacity: 0, y: 24 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     viewport={{ once: true }}
//                     transition={{ delay: idx * 0.08, duration: 0.5, ease: 'easeOut' }}
//                     whileHover={{ y: -8 }}
//                     className="group relative overflow-hidden rounded-3xl border border-bamboo-100/70 bg-white/70 p-6 text-center shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-transparent hover:shadow-2xl hover:shadow-bamboo-200/50"
//                   >
//                     {/* animated gradient ring on hover */}
//                     <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-bamboo-400/0 via-transparent to-earth-400/0 opacity-0 transition-opacity duration-500 group-hover:from-bamboo-400/10 group-hover:to-earth-400/10 group-hover:opacity-100" />
 
//                     {/* index number, subtle */}
//                     <span className="absolute right-4 top-3 font-display text-3xl font-bold text-bamboo-50 transition-colors duration-300 group-hover:text-bamboo-100">
//                       {String(idx + 1).padStart(2, '0')}
//                     </span>
 
//                     {/* icon badge */}
//                     <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center">
//                       <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-bamboo-100 to-sand-100 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" />
//                       <NodeMark className={`relative h-7 w-7 ${accent}`} />
//                     </div>
 
//                     <p className={`relative font-display text-base font-semibold ${accent}`}>
//                       {feature.title}
//                     </p>
//                     <p className="relative mt-1.5 text-sm leading-relaxed text-black">
//                       {feature.description}
//                     </p>
 
//                     {/* bottom accent line that grows on hover */}
//                     <span className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-gradient-to-r from-bamboo-500 to-earth-500 transition-all duration-500 group-hover:w-2/3" />
//                   </motion.div>
//                 );
//               })}
//         </div>
//       </div>
//     </section>
//   );
// };
 

// import {  FiX } from 'react-icons/fi';
// const ComboOffers = () => {
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();
//   const { isAuthenticated } = useSelector((state) => state.auth);
//   const [selectedOffer, setSelectedOffer] = useState(null);

//   const { data: offers = [] } = useQuery({
//     queryKey: ['combo-offers'],
//     queryFn: () => promotionApi.getComboOffers(),
//     select: (res) => res.data.data.offers,
//   });

//   if (!offers.length) return null;

//   const handleAddToCart = async (offer) => {
//     if (!isAuthenticated) {
//       toast('Please log in to grab this offer', { icon: '🔒' });
//       navigate('/login');
//       return;
//     }
//     try {
//       await promotionApi.addComboToCart(offer._id);
//       queryClient.invalidateQueries({ queryKey: ['cart'] });
//       toast.success('Offer added to cart!');
//       setSelectedOffer(null);
//     } catch (error) {
//       toast.error(error?.response?.data?.message || 'Could not add offer to cart');
//     }
//   };

//   return (
//     <section className="bg-earth-500/5 py-14">
//       <div className="mx-auto max-w-7xl px-4">
//         <div className="flex items-center gap-2">
//           <FiGift className="text-earth-500" size={22} />
//           <h2 className="font-display text-2xl font-bold text-bamboo-800">Combo Offers & Bundles</h2>
//         </div>
//         <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
//           {offers.map((offer) => (
//             <div
//               key={offer._id}
//               className="card group cursor-pointer overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-xl"
//               onClick={() => setSelectedOffer(offer)}
//             >
//               {offer.image?.url && (
//                 <div className="aspect-video overflow-hidden bg-sand-100">
//                   <img
//                     src={offer.image.url}
//                     alt={offer.title}
//                     className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
//                   />
//                 </div>
//               )}
//               <div className="p-5">
//                 <h3 className="font-display text-lg font-semibold text-bamboo-800">{offer.title}</h3>
//                 <p className="mt-1 text-sm text-bamboo-500">{offer.description}</p>
//                 {offer.promotionType === 'bundle_discount' && offer.bundlePrice && (
//                   <p className="mt-2 font-display text-xl font-bold text-bamboo-700">₹{offer.bundlePrice}</p>
//                 )}
//                 {offer.promotionType === 'buy_x_get_y' && (
//                   <p className="mt-2 text-sm font-semibold text-earth-600">
//                     Buy {offer.buyQuantity}, Get {offer.getQuantity} Free
//                   </p>
//                 )}
//                 <Button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleAddToCart(offer);
//                   }}
//                   className="mt-4 !py-2 text-sm transition-all duration-200 hover:scale-[1.03] hover:shadow-lg active:scale-95"
//                   fullWidth
//                 >
//                   Grab This Offer
//                 </Button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Details Modal */}
//       {selectedOffer && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
//           onClick={() => setSelectedOffer(null)}
//         >
//           <div
//             className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               onClick={() => setSelectedOffer(null)}
//               className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-1.5 text-bamboo-700 shadow transition-transform duration-200 hover:scale-110 hover:bg-white"
//               aria-label="Close"
//             >
//               <FiX size={20} />
//             </button>

//             {selectedOffer.image?.url && (
//               <div className="aspect-video bg-sand-100">
//                 <img
//                   src={selectedOffer.image.url}
//                   alt={selectedOffer.title}
//                   className="h-full w-full object-cover"
//                 />
//               </div>
//             )}

//             <div className="p-6">
//               <h3 className="font-display text-2xl font-bold text-bamboo-800">{selectedOffer.title}</h3>
//               <p className="mt-2 text-sm text-bamboo-500">{selectedOffer.description}</p>

//               {selectedOffer.promotionType === 'bundle_discount' && selectedOffer.bundlePrice && (
//                 <div className="mt-4">
//                   <p className="font-display text-3xl font-bold text-bamboo-700">
//                     ₹{selectedOffer.bundlePrice}
//                   </p>
//                   {selectedOffer.originalPrice && (
//                     <p className="text-sm text-bamboo-400 line-through">₹{selectedOffer.originalPrice}</p>
//                   )}
//                 </div>
//               )}

//               {selectedOffer.promotionType === 'buy_x_get_y' && (
//                 <p className="mt-4 text-base font-semibold text-earth-600">
//                   Buy {selectedOffer.buyQuantity}, Get {selectedOffer.getQuantity} Free
//                 </p>
//               )}

//               {selectedOffer.products?.length > 0 && (
//                 <div className="mt-5">
//                   <p className="text-sm font-semibold text-bamboo-700">Included Items</p>
//                   <ul className="mt-2 space-y-1">
//                     {selectedOffer.products.map((p) => (
//                       <li key={p._id || p.product?._id} className="text-sm text-bamboo-500">
//                         • {p.product?.name || p.name}
//                         {p.quantity ? ` × ${p.quantity}` : ''}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}

//               <Button
//                 onClick={() => handleAddToCart(selectedOffer)}
//                 className="mt-6 !py-2.5 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-95"
//                 fullWidth
//               >
//                 Grab This Offer
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// };

// const Home = () => {
//   return (
//     <div>
//        <Helmet>
//         <title>Home </title>
//       </Helmet>
//       <Hero />
//       <CategoryStrip />
//       <PromoBanners />
//       <ProductRail title="Best Sellers" queryKey="best-sellers" params={{ bestSeller: 'true' }} viewAllHref="/shop?bestSeller=true" />
//        <VideoShowcase2 />
//      <Sustainability isStandalonePage={false} />
//       <ComboOffers />
//        <ProductRail title="New Arrivals" queryKey="new-arrivals" params={{ newArrival: 'true' }} viewAllHref="/shop?newArrival=true" />
//       <WhyChooseUs />
     
//       <VideoShowcase />
//        <GovernmentAffiliations />  
//        <Testimonials />
//     </div>
//   );
// };

// export default Home;


import { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Swiper, SwiperSlide, useSwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { motion } from 'framer-motion';
import { FiArrowRight, FiGift, FiX } from 'react-icons/fi';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';

import GovernmentAffiliations from '../components/GovernmentAffiliations';
import { cmsApi } from '../services/cmsApi';
import { categoryApi, productApi } from '../services/productApi';
import { promotionApi } from '../services/growthApi';
import ProductCard from '../components/product/ProductCard';
import { ProductGridSkeleton } from '../components/product/ProductCardSkeleton';
import Button from '../components/ui/Button';
import { featureApi } from '../services/featureApi';
import PromoBanners from '../components/PromoBanners';
import Testimonials from '../components/Testimonials';
import Sustainability from './content/Sustainability';
import VideoShowcase from '../components/VideoShowcase';
import VideoShowcase2 from '../components/Video';

/* ── Continuous typewriter: types the full text, pauses, deletes, pauses, retypes ── */
function useTypewriterLoop(
  text,
  { typeSpeed = 28, deleteSpeed = 14, pauseAfterType = 2200, pauseAfterDelete = 400 } = {}
) {
  const [displayed, setDisplayed] = useState('');
  const [phase, setPhase] = useState('typing'); // 'typing' | 'deleting'

  // reset whenever the source text changes (e.g. slide changed)
  useEffect(() => {
    setDisplayed('');
    setPhase('typing');
  }, [text]);

  useEffect(() => {
    if (!text) return undefined;
    let timeout;

    if (phase === 'typing') {
      if (displayed.length < text.length) {
        timeout = setTimeout(() => setDisplayed(text.slice(0, displayed.length + 1)), typeSpeed);
      } else {
        timeout = setTimeout(() => setPhase('deleting'), pauseAfterType);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(text.slice(0, displayed.length - 1)), deleteSpeed);
      } else {
        timeout = setTimeout(() => setPhase('typing'), pauseAfterDelete);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayed, phase, text, typeSpeed, deleteSpeed, pauseAfterType, pauseAfterDelete]);

  return displayed;
}

/* ── Shared keyframes used by both hero states ── */
const GlobalHeroStyles = () => (
  <style>{`
    @keyframes wk-kenburns {
      0%   { transform: scale(1); }
      100% { transform: scale(1.12); }
    }
    .wk-kenburns {
      animation: wk-kenburns 12s ease-out infinite alternate;
    }
    @keyframes wk-shimmer {
      0%   { background-position: 0% 50%; }
      100% { background-position: 200% 50%; }
    }
    .wk-shimmer {
      background-size: 200% auto;
      animation: wk-shimmer 3.5s linear infinite;
    }
    @keyframes wk-blink {
      0%, 45% { opacity: 1; }
      50%, 100% { opacity: 0; }
    }
    .wk-cursor {
      animation: wk-blink 0.9s steps(1) infinite;
    }
    /* Mobile only: dark pagination dots because the text panel is white */
    @media (max-width: 639px) {
      .wk-hero-swiper .swiper-pagination-bullet { background: #000; opacity: 0.25; }
      .wk-hero-swiper .swiper-pagination-bullet-active { background: #000; opacity: 1; }
    }
  `}</style>
);

/* ── Headline that reveals word by word ── */
const AnimatedHeadline = ({ text, className }) => {
  const words = text.split(' ');
  return (
    <h1 className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
          <motion.span
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{ delay: 0.15 + i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block"
          >
            {word}
            {i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </h1>
  );
};

/* ── Eyebrow with flanking lines + shimmering gradient text ── */
const Eyebrow = ({ text }) => (
  <div className="flex items-center justify-center gap-2 sm:gap-3">
    <span className="h-px w-5 bg-gradient-to-r from-transparent to-sand-300/80 sm:w-8" />
    <span className="wk-shimmer bg-gradient-to-r from-sand-200 via-white to-sand-300 bg-clip-text text-[11px] font-semibold uppercase tracking-[0.2em] text-transparent sm:text-xs sm:tracking-[0.35em]">
      {text}
    </span>
    <span className="h-px w-5 bg-gradient-to-l from-transparent to-sand-300/80 sm:w-8" />
  </div>
);

/* ── CTA button with lift + shine-sweep hover ── */
const CtaButton = ({ to, className, children }) => (
  <Link
    to={to}
    className={`group relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.04] active:scale-95 ${className}`}
  >
    <span className="relative z-10">{children}</span>
    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
  </Link>
);

/* ── Live slide content:
      Mobile  -> clean solid text panel BELOW the full banner image (full text, no clipping)
      Desktop -> centered hero text over the image (unchanged) ── */
const SlideContent = ({ banner }) => {
  const swiperSlide = useSwiperSlide();
  const isActive = swiperSlide?.isActive ?? true;
  const typed = useTypewriterLoop(isActive ? banner.description : '');

  return (
    <div className="relative w-full flex-none overflow-hidden bg-gradient-to-b from-white to-sand-50 px-5 pb-10 pt-5 text-left text-black sm:mx-auto sm:max-w-lg sm:flex-none sm:overflow-visible sm:bg-none sm:p-0 sm:text-center sm:text-white">
      {/* Mobile-only top accent strip (sits below the image, never covers it) */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-bamboo-600 via-earth-500 to-bamboo-600 sm:hidden" />

      {/* Mobile-only decorative glows */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-bamboo-200/50 blur-2xl sm:hidden" />
      <div className="pointer-events-none absolute -left-8 bottom-0 h-24 w-24 rounded-full bg-earth-300/30 blur-2xl sm:hidden" />

      {/* Eyebrow: desktop only (unchanged) */}
      <div className="hidden sm:block">
        <Eyebrow text={banner.subtitle} />
      </div>

      {/* Mobile-only pill label (fixed-height slot so layout never shifts) */}
      <div className="relative flex h-6 items-center sm:hidden">
        {banner.subtitle && (
          <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-bamboo-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-bamboo-800 ring-1 ring-bamboo-200">
            <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-earth-500" />
            <span className="truncate">{banner.subtitle}</span>
          </span>
        )}
      </div>

      {/* Title: fixed 2-line slot on mobile */}
      <div className="relative mt-2 h-[3.5rem] overflow-hidden sm:mt-4 sm:h-auto sm:overflow-visible">
        <AnimatedHeadline
          key={banner._id}
          text={banner.title}
          className="line-clamp-2 font-display text-xl font-bold leading-snug tracking-tight text-black sm:text-5xl sm:leading-tight sm:text-white sm:drop-shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
        />
      </div>

      {/* Mobile-only accent bar */}
      <div className="relative mt-1.5 h-1 w-12 rounded-full bg-gradient-to-r from-bamboo-600 to-earth-500 sm:hidden" />

      {/* Description: typewriter on both; fixed-height slot on mobile */}
      <p className="relative mt-3 h-[5.75rem] overflow-hidden border-l-2 border-bamboo-200 pl-3 text-sm leading-relaxed text-gray-800 sm:mt-3 sm:h-auto sm:min-h-[3.5rem] sm:border-0 sm:p-0 sm:text-base sm:text-sand-100/90 sm:drop-shadow-sm">
        {typed}
        <span className="wk-cursor ml-0.5 inline-block w-[2px] translate-y-[2px] bg-bamboo-700 sm:bg-white/90" style={{ height: '1em' }} />
      </p>

      <div className="relative mt-3 flex gap-2.5 sm:mt-7 sm:justify-center sm:gap-3">
        {banner.ctaPrimaryLabel && (
          <CtaButton
            to={banner.ctaPrimaryLink || '/shop'}
            className="btn-primary flex-1 rounded-xl px-4 py-3 text-center text-sm font-semibold shadow-lg shadow-bamboo-900/20 hover:shadow-xl hover:shadow-bamboo-900/40 sm:flex-none sm:px-6"
          >
            <span className="inline-flex items-center justify-center gap-1.5">
              {banner.ctaPrimaryLabel}
              <FiArrowRight size={14} className="sm:hidden" />
            </span>
          </CtaButton>
        )}
        {banner.ctaSecondaryLabel && (
          <CtaButton
            to={banner.ctaSecondaryLink || '/shop'}
            className="inline-flex flex-1 items-center justify-center rounded-xl border-[1.5px] border-bamboo-700 bg-white px-4 py-3 text-center text-sm font-semibold text-bamboo-800 hover:bg-bamboo-50 sm:flex-none sm:border sm:border-white/40 sm:bg-transparent sm:px-6 sm:text-white sm:hover:border-white/70 sm:hover:bg-white/10 sm:hover:shadow-lg sm:hover:shadow-black/20"
          >
            {banner.ctaSecondaryLabel}
          </CtaButton>
        )}
      </div>
    </div>
  );
};

const FALLBACK_DESCRIPTION =
  'Discover handcrafted bamboo furniture, decor, and lifestyle products made by skilled artisans.';

// Mobile: height comes from the full (uncropped) banner image + text panel. Desktop: original full-height hero.
const BANNER_BOX = 'relative w-full sm:h-[85vh]';
const SKELETON_BOX = 'relative w-full aspect-[16/10] sm:aspect-auto sm:h-[85vh]';
const FALLBACK_BOX = 'relative flex w-full min-h-[420px] sm:h-[85vh] sm:min-h-0';

const Hero = () => {
  const { data: banners = [], isLoading } = useQuery({
    queryKey: ['banners', 'hero_slider'],
    queryFn: () => cmsApi.getBanners('hero_slider'),
    select: (res) => res.data.data.banners,
  });

  // Hooks must run unconditionally every render
  const typedFallback = useTypewriterLoop(!isLoading && banners.length === 0 ? FALLBACK_DESCRIPTION : '');

  if (isLoading) return <div className={`${SKELETON_BOX} animate-pulse bg-sand-200`} />;

  if (!banners.length) {
    return (
      <div
        className={`${FALLBACK_BOX} flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-bamboo-700 to-bamboo-800 px-6 py-10 text-center text-white`}
      >
        <GlobalHeroStyles />

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Eyebrow text="Wa-Kriti" />
        </motion.div>

        <AnimatedHeadline
          text="Bring Nature Home"
          className="mt-3 max-w-2xl font-display text-[1.85rem] font-bold leading-[1.15] tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.35)] sm:mt-4 sm:text-5xl sm:leading-tight"
        />

        <p className="mx-auto mt-2.5 min-h-[3rem] max-w-md text-sm leading-relaxed text-sand-100/90 drop-shadow-sm sm:mt-3 sm:min-h-[3.5rem] sm:text-base">
          {typedFallback}
          <span className="wk-cursor ml-0.5 inline-block w-[2px] translate-y-[2px] bg-white/90" style={{ height: '1em' }} />
        </p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-5 flex flex-wrap justify-center gap-2.5 sm:mt-7 sm:gap-3"
        >
          <CtaButton to="/shop" className="btn-primary px-5 py-2.5 text-xs hover:shadow-xl hover:shadow-bamboo-900/40 sm:px-6 sm:py-3 sm:text-sm">
            Shop Now
          </CtaButton>
          <CtaButton
            to="/sustainability"
            className="rounded-xl border border-white/40 px-5 py-2.5 text-xs font-semibold text-white hover:border-white/70 hover:bg-white/10 hover:shadow-lg hover:shadow-black/20 sm:px-6 sm:py-3 sm:text-sm"
          >
            Learn More
          </CtaButton>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <GlobalHeroStyles />
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 9000 }}
        pagination={{ clickable: true }}
        loop
        className={`${BANNER_BOX} wk-hero-swiper`}
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner._id}>
            {/* Mobile: full banner image (nothing cropped) on top, text panel below.
                Desktop: centered text over a cover image, as before. */}
            <div className="flex h-full w-full flex-col sm:relative sm:flex-row sm:items-center sm:justify-center sm:overflow-hidden sm:px-16 sm:text-center">
              {/* Mobile image: natural aspect ratio, fully visible */}
              <img
                src={banner.image.url}
                alt={banner.title}
                className="block h-auto w-full sm:hidden"
              />

              {/* Desktop background image + overlay (unchanged) */}
              <div
                className="wk-kenburns absolute inset-0 hidden bg-cover bg-center sm:block"
                style={{ backgroundImage: `url(${banner.image.url})` }}
              />
              <div className="absolute inset-0 hidden sm:block sm:bg-gradient-to-t sm:from-black/60 sm:via-black/35 sm:to-black/25" />

              <SlideContent banner={banner} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

/* ── Category strip: Amazon/Flipkart style scroller on mobile ── */
const CategoryStrip = () => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const { data: categories = [] } = useQuery({
    queryKey: ['categories', 'home'],
    queryFn: () => categoryApi.getCategories({ featured: 'true' }),
    select: (res) => res.data.data.categories,
  });

  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollButtons();

    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    window.addEventListener('resize', updateScrollButtons);

    return () => {
      el.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, [categories, updateScrollButtons]);

  const scrollByAmount = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.7;
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  if (!categories.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
      <h2 className="font-display text-xl font-bold text-bamboo-800 sm:text-2xl">Shop by Category</h2>

      <div className="relative mt-4 sm:mt-6">
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scrollByAmount('left')}
            aria-label="Scroll categories left"
            className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 -translate-x-3 items-center justify-center rounded-full bg-white p-2 text-bamboo-700 shadow-soft ring-1 ring-bamboo-200 transition-all hover:bg-bamboo-50 hover:text-bamboo-900 hover:scale-105 md:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}

        {canScrollRight && (
          <button
            type="button"
            onClick={() => scrollByAmount('right')}
            aria-label="Scroll categories right"
            className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 translate-x-3 items-center justify-center rounded-full bg-white p-2 text-bamboo-700 shadow-soft ring-1 ring-bamboo-200 transition-all hover:bg-bamboo-50 hover:text-bamboo-900 hover:scale-105 md:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}

        <div className="pointer-events-none absolute inset-y-0 left-0 z-[5] hidden w-10 bg-gradient-to-r from-white to-transparent md:block" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-[5] hidden w-10 bg-gradient-to-l from-white to-transparent md:block" />

        <div
          ref={scrollRef}
          className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-4 pb-2 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] sm:mx-0 sm:snap-none sm:gap-4 sm:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/shop?category=${cat._id}`}
              className="group flex w-[30%] shrink-0 snap-start flex-col items-center gap-1.5 rounded-2xl p-1.5 text-center transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-bamboo-50/60 sm:w-40 sm:gap-2 sm:p-3"
            >
              <div className="relative h-[4.5rem] w-[4.5rem] overflow-hidden rounded-full bg-sand-100 shadow-soft ring-2 ring-transparent transition-all duration-300 ease-out group-hover:scale-105 group-hover:shadow-[0_10px_30px_-6px_rgba(63,91,62,0.45)] group-hover:ring-bamboo-300 sm:h-24 sm:w-24">
                {cat.image?.url && (
                  <img
                    src={cat.image.url}
                    alt={cat.name}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  />
                )}
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
                <span className="pointer-events-none absolute inset-0 bg-bamboo-900/0 transition-colors duration-300 group-hover:bg-bamboo-900/10" />
              </div>

              <span className="relative text-xs font-semibold leading-tight text-bamboo-700 transition-colors duration-300 group-hover:text-bamboo-900 sm:text-sm">
                {cat.name}
                <span className="absolute -bottom-0.5 left-1/2 h-px w-0 -translate-x-1/2 bg-bamboo-600 transition-all duration-300 ease-out group-hover:w-full" />
              </span>

              {cat.description && (
                <p className="hidden line-clamp-2 text-xs leading-5 text-bamboo-500 transition-colors duration-300 group-hover:text-bamboo-600 sm:block">
                  {cat.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProductRail = ({ title, queryKey, params, viewAllHref }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['home-products', queryKey],
    queryFn: () => productApi.getProducts({ limit: 8, ...params }),
    select: (res) => res.data.data.products,
  });

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-bamboo-800 sm:text-2xl">{title}</h2>
        <Link to={viewAllHref} className="flex items-center gap-1 text-sm font-semibold text-bamboo-600 hover:underline">
          View All <FiArrowRight size={14} />
        </Link>
      </div>
      <div className="mt-4 sm:mt-6">
        {isLoading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {(data || []).map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const DEFAULT_FEATURES = [
  { title: '100% Bamboo', desc: 'Crafted from sustainably harvested bamboo' },
  { title: 'Handcrafted', desc: 'Made by skilled artisans across India' },
  { title: 'Eco Friendly', desc: 'Biodegradable & plastic-free packaging' },
  { title: 'Fast Shipping', desc: 'Delivered across India in 5-7 days' },
];

const NodeMark = ({ className = '' }) => (
  <svg viewBox="0 0 40 40" className={className} fill="none">
    <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
    <circle cx="20" cy="20" r="11" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
    <circle cx="20" cy="20" r="4" fill="currentColor" />
  </svg>
);

const ACCENTS = ['text-bamboo-700', 'text-earth-600', 'text-bamboo-500', 'text-earth-500'];

/* ── Why Choose Us: compact, card-grid look on mobile (Amazon/Flipkart style) ── */
const WhyChooseUs = () => {
  const { data: features = [], isLoading } = useQuery({
    queryKey: ['website-features'],
    queryFn: () => featureApi.getFeatures(),
    select: (res) => res.data.data.features,
    staleTime: 5 * 60 * 1000,
  });

  const displayFeatures = features.length > 0 ? features : DEFAULT_FEATURES;

  return (
    <section className="relative overflow-hidden bg-sand-50/60 py-10 sm:py-20">
      {/* Decorative background (desktop only) */}
      <div className="pointer-events-none absolute inset-0 -z-10 hidden sm:block">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-bamboo-200/30 blur-3xl" />
        <div className="absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-earth-300/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,theme(colors.bamboo.200)_1px,transparent_0)] bg-[size:28px_28px] opacity-[0.15]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mx-auto rounded-2xl bg-white px-4 py-5 text-center shadow-sm sm:rounded-3xl sm:px-10 sm:py-8">
          <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-black sm:px-4 sm:py-1.5 sm:text-xs sm:tracking-[0.2em]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-earth-500" />
            The Wa-Kriti difference
          </span>
          <h2 className="mt-3 font-display text-2xl font-bold text-black sm:mt-4 sm:text-4xl">
            Why Choose{' '}
            <span className="bg-gradient-to-r from-bamboo-600 to-earth-500 bg-clip-text text-transparent">
              Wa-Kriti
            </span>
          </h2>
          <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-gray-600 sm:mt-3 sm:text-sm">
            Every piece we make sits at the intersection of tradition and durability —
            here&apos;s what that actually means for you as a customer.
          </p>
        </div>

        {/* Feature grid */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-5 sm:grid-cols-4">
          {isLoading
            ? [...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="h-32 animate-pulse rounded-2xl bg-gradient-to-br from-sand-200 to-sand-100 sm:h-40 sm:rounded-3xl"
                />
              ))
            : displayFeatures.map((feature, idx) => {
                const accent = ACCENTS[idx % ACCENTS.length];
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08, duration: 0.5, ease: 'easeOut' }}
                    className="group relative overflow-hidden rounded-2xl border border-bamboo-100/70 bg-white p-4 text-center shadow-sm transition-all duration-300 hover:border-transparent hover:shadow-2xl hover:shadow-bamboo-200/50 sm:rounded-3xl sm:bg-white/70 sm:p-6 sm:backdrop-blur-sm sm:hover:-translate-y-2"
                  >
                    <div className="pointer-events-none absolute inset-0 hidden rounded-3xl bg-gradient-to-br from-bamboo-400/0 via-transparent to-earth-400/0 opacity-0 transition-opacity duration-500 group-hover:from-bamboo-400/10 group-hover:to-earth-400/10 group-hover:opacity-100 sm:block" />

                    <span className="absolute right-4 top-3 hidden font-display text-3xl font-bold text-bamboo-50 transition-colors duration-300 group-hover:text-bamboo-100 sm:block">
                      {String(idx + 1).padStart(2, '0')}
                    </span>

                    <div className="relative mx-auto mb-3 flex h-11 w-11 items-center justify-center sm:mb-4 sm:h-14 sm:w-14">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-bamboo-100 to-sand-100 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" />
                      <NodeMark className={`relative h-5 w-5 sm:h-7 sm:w-7 ${accent}`} />
                    </div>

                    <p className={`relative font-display text-sm font-semibold sm:text-base ${accent}`}>
                      {feature.title}
                    </p>
                    <p className="relative mt-1 text-xs leading-relaxed text-black sm:mt-1.5 sm:text-sm">
                      {feature.description}
                    </p>

                    <span className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-gradient-to-r from-bamboo-500 to-earth-500 transition-all duration-500 group-hover:w-2/3" />
                  </motion.div>
                );
              })}
        </div>
      </div>
    </section>
  );
};

const ComboOffers = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [selectedOffer, setSelectedOffer] = useState(null);

  const { data: offers = [] } = useQuery({
    queryKey: ['combo-offers'],
    queryFn: () => promotionApi.getComboOffers(),
    select: (res) => res.data.data.offers,
  });

  if (!offers.length) return null;

  const handleAddToCart = async (offer) => {
    if (!isAuthenticated) {
      toast('Please log in to grab this offer', { icon: '🔒' });
      navigate('/login');
      return;
    }
    try {
      await promotionApi.addComboToCart(offer._id);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Offer added to cart!');
      setSelectedOffer(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not add offer to cart');
    }
  };

  return (
    <section className="bg-earth-500/5 py-8 sm:py-14">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center gap-2">
          <FiGift className="text-earth-500" size={20} />
          <h2 className="font-display text-xl font-bold text-bamboo-800 sm:text-2xl">Combo Offers & Bundles</h2>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:mt-6 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {offers.map((offer) => (
            <div
              key={offer._id}
              className="card group cursor-pointer overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-xl"
              onClick={() => setSelectedOffer(offer)}
            >
              {offer.image?.url && (
                <div className="aspect-video overflow-hidden bg-sand-100">
                  <img
                    src={offer.image.url}
                    alt={offer.title}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  />
                </div>
              )}
              <div className="p-4 sm:p-5">
                <h3 className="font-display text-base font-semibold text-bamboo-800 sm:text-lg">{offer.title}</h3>
                <p className="mt-1 text-sm text-bamboo-500">{offer.description}</p>
                {offer.promotionType === 'bundle_discount' && offer.bundlePrice && (
                  <p className="mt-2 font-display text-xl font-bold text-bamboo-700">₹{offer.bundlePrice}</p>
                )}
                {offer.promotionType === 'buy_x_get_y' && (
                  <p className="mt-2 text-sm font-semibold text-earth-600">
                    Buy {offer.buyQuantity}, Get {offer.getQuantity} Free
                  </p>
                )}
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(offer);
                  }}
                  className="mt-4 !py-2 text-sm transition-all duration-200 hover:scale-[1.03] hover:shadow-lg active:scale-95"
                  fullWidth
                >
                  Grab This Offer
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Details Modal */}
      {selectedOffer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedOffer(null)}
        >
          <div
            className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedOffer(null)}
              className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-1.5 text-bamboo-700 shadow transition-transform duration-200 hover:scale-110 hover:bg-white"
              aria-label="Close"
            >
              <FiX size={20} />
            </button>

            {selectedOffer.image?.url && (
              <div className="aspect-video bg-sand-100">
                <img
                  src={selectedOffer.image.url}
                  alt={selectedOffer.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div className="p-6">
              <h3 className="font-display text-2xl font-bold text-bamboo-800">{selectedOffer.title}</h3>
              <p className="mt-2 text-sm text-bamboo-500">{selectedOffer.description}</p>

              {selectedOffer.promotionType === 'bundle_discount' && selectedOffer.bundlePrice && (
                <div className="mt-4">
                  <p className="font-display text-3xl font-bold text-bamboo-700">
                    ₹{selectedOffer.bundlePrice}
                  </p>
                  {selectedOffer.originalPrice && (
                    <p className="text-sm text-bamboo-400 line-through">₹{selectedOffer.originalPrice}</p>
                  )}
                </div>
              )}

              {selectedOffer.promotionType === 'buy_x_get_y' && (
                <p className="mt-4 text-base font-semibold text-earth-600">
                  Buy {selectedOffer.buyQuantity}, Get {selectedOffer.getQuantity} Free
                </p>
              )}

              {selectedOffer.products?.length > 0 && (
                <div className="mt-5">
                  <p className="text-sm font-semibold text-bamboo-700">Included Items</p>
                  <ul className="mt-2 space-y-1">
                    {selectedOffer.products.map((p) => (
                      <li key={p._id || p.product?._id} className="text-sm text-bamboo-500">
                        • {p.product?.name || p.name}
                        {p.quantity ? ` × ${p.quantity}` : ''}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Button
                onClick={() => handleAddToCart(selectedOffer)}
                className="mt-6 !py-2.5 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-95"
                fullWidth
              >
                Grab This Offer
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const Home = () => {
  return (
    <div>
      <Helmet>
        <title>Home </title>
      </Helmet>
      <Hero />
      <CategoryStrip />
      <PromoBanners />
      <ProductRail title="Best Sellers" queryKey="best-sellers" params={{ bestSeller: 'true' }} viewAllHref="/shop?bestSeller=true" />
      <VideoShowcase2 />
      <Sustainability isStandalonePage={false} />
      <ComboOffers />
      <ProductRail title="New Arrivals" queryKey="new-arrivals" params={{ newArrival: 'true' }} viewAllHref="/shop?newArrival=true" />
      <WhyChooseUs />
      <VideoShowcase />
      <GovernmentAffiliations />
      <Testimonials />
    </div>
  );
};

export default Home;