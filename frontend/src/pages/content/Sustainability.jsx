// import { useEffect, useRef, useState } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { Helmet } from 'react-helmet-async';
// import { motion, useInView, useReducedMotion } from 'framer-motion';
// import { contentApi } from '../../services/growthApi';

// // ── Count-up number, starts once the card scrolls into view ──────────────
// const CountUpValue = ({ value = 0, duration = 1.4 }) => {
//   const ref = useRef(null);
//   const isInView = useInView(ref, { once: true, margin: '-40px' });
//   const prefersReducedMotion = useReducedMotion();
//   const [display, setDisplay] = useState(0);

//   useEffect(() => {
//     if (!isInView) return;
//     if (prefersReducedMotion) {
//       setDisplay(value);
//       return;
//     }
//     let frame;
//     const start = performance.now();
//     const tick = (now) => {
//       const progress = Math.min((now - start) / (duration * 1000), 1);
//       const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress); // ease-out-expo
//       setDisplay(Math.round(value * eased));
//       if (progress < 1) frame = requestAnimationFrame(tick);
//     };
//     frame = requestAnimationFrame(tick);
//     return () => cancelAnimationFrame(frame);
//   }, [isInView, value, duration, prefersReducedMotion]);

//   return <span ref={ref}>{display.toLocaleString('en-IN')}</span>;
// };

// // ── Small bamboo cross-section mark used on each stat card ───────────────
// const NodeMark = ({ className = '' }) => (
//   <svg viewBox="0 0 40 40" className={className} fill="none">
//     <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
//     <circle cx="20" cy="20" r="11" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
//     <circle cx="20" cy="20" r="4" fill="currentColor" />
//   </svg>
// );

// // ── Decorative bamboo silhouette that seams the hero into the page ───────
// const BambooDivider = () => (
//   <svg
//     viewBox="0 0 1440 120"
//     className="block w-full text-sand-100"
//     preserveAspectRatio="none"
//     aria-hidden="true"
//   >
//     <path
//       fill="currentColor"
//       d="M0,64 C240,110 480,20 720,48 C960,76 1200,20 1440,56 L1440,120 L0,120 Z"
//     />
//     {/* three stylised stalks rising from the seam */}
//     {[220, 720, 1180].map((x, i) => (
//       <g key={x} opacity="0.5">
//         <rect x={x - 6} y={20 + i * 4} width="12" height="60" rx="6" fill="currentColor" />
//         <rect x={x - 9} y={38 + i * 4} width="18" height="4" rx="2" fill="#F4F1EA" opacity="0.7" />
//         <rect x={x - 9} y={58 + i * 4} width="18" height="4" rx="2" fill="#F4F1EA" opacity="0.7" />
//       </g>
//     ))}
//   </svg>
// );

// const ACCENTS = ['text-bamboo-700', 'text-bamboo-500', 'text-bamboo-800'];

// const Sustainability = ({ isStandalonePage = true }) => {
//   const { data: stats = [], isLoading } = useQuery({
//     queryKey: ['sustainability-stats'],
//     queryFn: () => contentApi.getSustainabilityStats(),
//     select: (res) => res.data.data.stats,
//   });
  

  

//   return (
//     <div className="min-h-screen bg-sand-100 pb-20">
//       {/* <Helmet><title>Wa-Kriti</title></Helmet> */}
//        {isStandalonePage && (
//         <Helmet><title>Our Sustainability Impact</title></Helmet>
//       )}

//       {/* ── Hero ── */}
//       <div className="relative overflow-hidden bg-gradient-to-br from-bamboo-700 to-bamboo-800 pb-24 pt-16 text-center text-white">
//         <div
//           className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-bamboo-500/20 blur-3xl"
//           aria-hidden="true"
//         />
//         <div className="relative px-4">
//           <span className="text-xs font-semibold uppercase tracking-[0.2em] text-sand-200/80">
//             Grown, not manufactured
//           </span>
//           <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
//             Our Sustainability Impact
//           </h1>
//           <p className="mx-auto mt-3 max-w-xl text-sand-200">
//             Every Wa-Kriti product is a step toward a more sustainable planet. Here&apos;s our impact so far.
//           </p>
//         </div>
//         <div className="absolute inset-x-0 -bottom-1">
//           <BambooDivider />
//         </div>
//       </div>

//       <div className="mx-auto max-w-5xl px-4 pt-4">
//         {/* ── Stats ── */}
//         {isLoading ? (
//           <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
//             {[1, 2, 3, 4, 5, 6].map((i) => (
//               <div key={i} className="h-32 animate-pulse rounded-2xl bg-sand-200" />
//             ))}
//           </div>
//         ) : (
//           <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
//             {stats.map((stat, idx) => {
//               const accent = ACCENTS[idx % ACCENTS.length];
//               return (
//                 <motion.div
//                   key={stat._id}
//                   initial={{ opacity: 0, y: 15 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ delay: idx * 0.05 }}
//                   whileHover={{ y: -4 }}
//                   className="card relative overflow-hidden rounded-2xl border border-bamboo-100 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-lg"
//                 >
//                   <NodeMark className={`mx-auto mb-2 h-8 w-8 ${accent}`} />
//                   <p className={`font-display text-3xl font-bold ${accent}`}>
//                     <CountUpValue value={stat.value} />
//                   </p>
//                   <p className="mt-1 text-sm text-bamboo-500">{stat.label}</p>
//                 </motion.div>
//               );
//             })}
//           </div>
//         )}

//         {/* ── Seed initiative ── */}
//         <motion.div
//           initial={{ opacity: 0, y: 16 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="relative mt-16 overflow-hidden rounded-3xl border border-bamboo-100 bg-white p-8 sm:p-12"
//         >
//           {/* soft breathing glow, purely decorative */}
//           <motion.div
//             className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-bamboo-200/30 blur-3xl"
//             animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
//             transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
//             aria-hidden="true"
//           />
//           <div
//             className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-earth-200/20 blur-3xl"
//             aria-hidden="true"
//           />

//           <div className="relative grid grid-cols-1 items-center gap-10 sm:grid-cols-[auto_1fr]">
//             {/* animated sprout mark */}
//             <motion.div
//               className="mx-auto flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-bamboo-50 text-bamboo-700 sm:mx-0"
//               animate={{ y: [0, -6, 0] }}
//               transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
//             >
//               <svg viewBox="0 0 48 48" className="h-11 w-11" fill="none">
//                 <path
//                   d="M24 40V24"
//                   stroke="currentColor"
//                   strokeWidth="2.2"
//                   strokeLinecap="round"
//                 />
//                 <path
//                   d="M24 24C24 24 10 24 10 12C22 12 24 24 24 24Z"
//                   fill="currentColor"
//                   opacity="0.85"
//                 />
//                 <path
//                   d="M24 20C24 20 38 20 38 8C26 8 24 20 24 20Z"
//                   fill="currentColor"
//                   opacity="0.5"
//                 />
//                 <ellipse cx="24" cy="42" rx="9" ry="2.5" fill="currentColor" opacity="0.15" />
//               </svg>
//             </motion.div>

//             <div className="text-center sm:text-left">
//               <span className="inline-flex items-center gap-1.5 rounded-full border border-bamboo-200 bg-bamboo-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-bamboo-700">
//                 A Wa-Kriti Initiative
//               </span>
//               <h2 className="relative mt-3 font-display text-2xl font-bold text-bamboo-900 sm:text-3xl">
//                 On Every Order, You Receive a{' '}
//                 <span className="relative inline-block">
//                   <motion.span
//                     className="pointer-events-none absolute -inset-x-2 -inset-y-1 rounded-lg bg-earth-300/40 blur-md"
//                     animate={{ opacity: [0.4, 0.75, 0.4] }}
//                     transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
//                     aria-hidden="true"
//                   />
//                   <span className="relative text-earth-600">Free Plant Seed</span>
//                 </span>
//               </h2>
//               <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-bamboo-600 sm:mx-0">
//                 Every order you receive comes with a packet of native plant seeds — a small gift
//                 that grows into something bigger. It&apos;s our way of improving the environment, one
//                 order and one seed at a time.
//               </p>

//               <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
//                 {[
//                   { title: 'A Free Seed Packet', desc: 'A different native plant with every order, picked by season.' },
//                   { title: 'Zero-Plastic Pouch', desc: 'Packed in a biodegradable sleeve that breaks down with the soil.' },
//                   { title: 'Simple Grow Card', desc: 'Easy instructions included, so anyone can grow it at home.' },
//                 ].map((item, i) => (
//                   <motion.div
//                     key={item.title}
//                     initial={{ opacity: 0, y: 10 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     viewport={{ once: true }}
//                     transition={{ delay: 0.1 + i * 0.08 }}
//                     whileHover={{ y: -3 }}
//                     className="rounded-xl border border-bamboo-100 bg-sand-50 p-4 text-left transition-shadow hover:shadow-sm"
//                   >
//                     <p className="text-sm font-semibold text-bamboo-800">{item.title}</p>
//                     <p className="mt-1 text-xs leading-relaxed text-bamboo-500">{item.desc}</p>
//                   </motion.div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default Sustainability;


import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { contentApi } from '../../services/growthApi';

// ── Count-up number, starts once the card scrolls into view ──────────────
const CountUpValue = ({ value = 0, duration = 1.4 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const prefersReducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    if (prefersReducedMotion) {
      setDisplay(value);
      return;
    }
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress); // ease-out-expo
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isInView, value, duration, prefersReducedMotion]);

  return <span ref={ref}>{display.toLocaleString('en-IN')}</span>;
};

// ── Small bamboo cross-section mark used on each stat card ───────────────
const NodeMark = ({ className = '' }) => (
  <svg viewBox="0 0 40 40" className={className} fill="none">
    <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
    <circle cx="20" cy="20" r="11" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
    <circle cx="20" cy="20" r="4" fill="currentColor" />
  </svg>
);

// ── Decorative bamboo silhouette that seams the hero into the page ───────
const BambooDivider = () => (
  <svg
    viewBox="0 0 1440 120"
    className="block w-full text-white"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <path
      fill="currentColor"
      d="M0,64 C240,110 480,20 720,48 C960,76 1200,20 1440,56 L1440,120 L0,120 Z"
    />
    {/* three stylised stalks rising from the seam */}
    {[220, 720, 1180].map((x, i) => (
      <g key={x} opacity="0.5">
        <rect x={x - 6} y={20 + i * 4} width="12" height="60" rx="6" fill="currentColor" />
        <rect x={x - 9} y={38 + i * 4} width="18" height="4" rx="2" fill="#111111" opacity="0.15" />
        <rect x={x - 9} y={58 + i * 4} width="18" height="4" rx="2" fill="#111111" opacity="0.15" />
      </g>
    ))}
  </svg>
);

const ACCENTS = ['text-bamboo-700', 'text-bamboo-500', 'text-bamboo-800'];

const Sustainability = ({ isStandalonePage = true }) => {
  const { data: stats = [], isLoading } = useQuery({
    queryKey: ['sustainability-stats'],
    queryFn: () => contentApi.getSustainabilityStats(),
    select: (res) => res.data.data.stats,
  });
  

  

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* <Helmet><title>Wa-Kriti</title></Helmet> */}
       {isStandalonePage && (
        <Helmet><title>Our Sustainability Impact</title></Helmet>
      )}

      {/* ── Hero ── */}
      <div className="relative overflow-hidden border-b border-gray-200 bg-white pb-24 pt-16 text-center text-black">
        <div className="relative px-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-black">
            Grown, not manufactured
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
            Our Sustainability Impact
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-gray-600">
            Every Wa-Kriti product is a step toward a more sustainable planet. Here&apos;s our impact so far.
          </p>
        </div>
        <div className="absolute inset-x-0 -bottom-1">
          <BambooDivider />
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 pt-4">
        {/* ── Stats ── */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {stats.map((stat, idx) => {
              const accent = ACCENTS[idx % ACCENTS.length];
              return (
                <motion.div
                  key={stat._id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="card relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-lg"
                >
                  <NodeMark className={`mx-auto mb-2 h-8 w-8 ${accent}`} />
                  <p className={`font-display text-3xl font-bold ${accent}`}>
                    <CountUpValue value={stat.value} />
                  </p>
                  <p className="mt-1 text-sm text-bamboo-500">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ── Seed initiative ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mt-16 overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 sm:p-12"
        >
          <div className="relative grid grid-cols-1 items-center gap-10 sm:grid-cols-[auto_1fr]">
            {/* animated sprout mark */}
            {/* <motion.div
              className="mx-auto flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-black sm:mx-0"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg viewBox="0 0 48 48" className="h-11 w-11" fill="none">
                <path
                  d="M24 40V24"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <path
                  d="M24 24C24 24 10 24 10 12C22 12 24 24 24 24Z"
                  fill="currentColor"
                  opacity="0.85"
                />
                <path
                  d="M24 20C24 20 38 20 38 8C26 8 24 20 24 20Z"
                  fill="currentColor"
                  opacity="0.5"
                />
                <ellipse cx="24" cy="42" rx="9" ry="2.5" fill="currentColor" opacity="0.15" />
              </svg>
            </motion.div> */}
            <img
  src="/seed.jpeg"
  alt="Free plant seed packet"
  className="mx-auto h-40 w-40 shrink-0 rounded-full object-cover sm:mx-0 sm:h-48 sm:w-48"
/>

            <div className="text-center sm:text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-black">
                A Wa-Kriti Initiative
              </span>
              <h2 className="relative mt-3 font-display text-2xl font-bold text-black sm:text-3xl">
                On Every Order, You Receive a{' '}
                <span className="relative text-black underline decoration-2 underline-offset-4">
                  Free Plant Seed
                </span>
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-gray-600 sm:mx-0">
                Every order you receive comes with a packet of native plant seeds — a small gift
                that grows into something bigger. It&apos;s our way of improving the environment, one
                order and one seed at a time.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { title: 'A Free Seed Packet', desc: 'A different native plant with every order, picked by season.' },
                  { title: 'Zero-Plastic Pouch', desc: 'Packed in a biodegradable sleeve that breaks down with the soil.' },
                  { title: 'Simple Grow Card', desc: 'Easy instructions included, so anyone can grow it at home.' },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    whileHover={{ y: -3 }}
                    className="rounded-xl border border-gray-200 bg-white p-4 text-left transition-shadow hover:shadow-sm"
                  >
                    <p className="text-sm font-semibold text-black">{item.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-gray-600">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Sustainability;