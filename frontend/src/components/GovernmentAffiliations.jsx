// /**
//  * Government Affiliations – continuous, auto-scrolling logo slider
//  * with the name shown to the right of each logo.
//  *
//  * File location: src/components/GovernmentAffiliations.jsx
//  * Images go in:  public/affiliations/
//  */

// // ── Edit this list: `name` is shown next to the logo, `src` is a file in /public ──
// const LOGOS = [
//   { name: 'MSME', src: '/affiliations/msme.PNG' },
//   { name: 'FSAAI', src: '/affiliations/fssai.WEBP' },
//   { name: 'TRADEMARK', src: '/affiliations/r.PNG' },
//   { name: 'ISO Certified', src: '/affiliations/iso.jpeg' },
//   { name: 'Trade License', src: '/affiliations/Trade.jpeg' },
//   { name: 'Tripura Bamboo Mission', src: '/affiliations/tri.jpeg' },
// ];

// // Slider settings
// const DIRECTION = 'right'; // 'right' or 'left'
// const SECONDS_PER_LOGO = 6; // higher = slower
// const REPEATS = 3; // copies of the list per half, so short lists still fill wide screens

// const GovernmentAffiliations = ({ title = 'Government Affiliations' }) => {
//   if (!LOGOS.length) return null;

//   // One "half" of the track. Two identical halves scroll by -50% for a seamless loop.
//   const half = Array.from({ length: REPEATS }, () => LOGOS).flat();
//   const duration = LOGOS.length * REPEATS * SECONDS_PER_LOGO;

//   const renderHalf = (hidden) => (
//     <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
//       {half.map((logo, i) => (
//         <li
//           key={`${logo.name}-${i}`}
//           className="mx-6 flex h-20 shrink-0 items-center gap-3 sm:mx-10"
//         >
//           <img
//             src={logo.src}
//             alt=""
//             loading="lazy"
//             draggable="false"
//             className="h-16 w-16 shrink-0 object-contain sm:h-20 sm:w-20"
//           />
//           <span className="max-w-[9rem] text-sm font-semibold leading-snug text-bamboo-800 sm:text-base">
//             {logo.name}
//           </span>
//         </li>
//       ))}
//     </ul>
//   );

//   return (
//     <section className="py-12" aria-label={title}>
//       <style>{`
//         @keyframes wk-marquee {
//           from { transform: translateX(0); }
//           to   { transform: translateX(-50%); }
//         }
//         .wk-marquee-track {
//           animation: wk-marquee var(--wk-marquee-duration, 30s) linear infinite;
//           animation-direction: var(--wk-marquee-direction, normal);
//           will-change: transform;
//         }
//         .wk-marquee:hover .wk-marquee-track,
//         .wk-marquee:focus-within .wk-marquee-track {
//           animation-play-state: paused;
//         }
//         @media (prefers-reduced-motion: reduce) {
//           .wk-marquee-track { animation: none; }
//         }
//       `}</style>

//       <h2 className="text-center font-display text-2xl font-bold text-bamboo-800 sm:text-3xl">
//         {title}
//       </h2>

//       <div className="wk-marquee relative mx-auto mt-8 max-w-7xl overflow-hidden">
//         {/* soft fade on both edges */}
//         <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent sm:w-32" />
//         <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent sm:w-32" />

//         <div
//           className="wk-marquee-track flex w-max"
//           style={{
//             '--wk-marquee-duration': `${duration}s`,
//             '--wk-marquee-direction': DIRECTION === 'right' ? 'reverse' : 'normal',
//           }}
//         >
//           {renderHalf(false)}
//           {renderHalf(true)}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default GovernmentAffiliations;



/**
 * Government Affiliations – continuous, auto-scrolling logo slider
 * with the name shown to the right of each logo.
 *
 * File location: src/components/GovernmentAffiliations.jsx
 * Images go in:  public/affiliations/
 */

// ── Edit this list: `name` is shown next to the logo, `src` is a file in /public ──
const LOGOS = [
  { name: 'MSME Registered', src: '/affiliations/msme.PNG' },
  { name: 'FSSAI Certified', src: '/affiliations/fssai.WEBP' },
  { name: 'Trademark Registered', src: '/affiliations/r.PNG' },
  { name: 'ISO 9001:2015 Certified', src: '/affiliations/iso.jpeg' },
  { name: 'Government Trade License', src: '/affiliations/Trade.jpeg' },
  { name: 'Tripura Bamboo Mission', src: '/affiliations/tri.jpeg' },
  { name: 'Make In India', src: '/affiliations/make.jpeg' },
  { name: 'Start-Up India', src: '/affiliations/startin.PNG' },
  { name: 'Start-Up Tripura', src: '/affiliations/starttri.jpeg' },
  { name: 'National Bamboo Mission', src: '/affiliations/nat.PNG' },
  { name: 'Life Style For Environment', src: '/affiliations/life.jpeg' },
  { name: 'One District, One Product', src: '/affiliations/one_d_one_pro.PNG' },
];

// Slider settings
const DIRECTION = 'right'; // 'right' or 'left'
const SECONDS_PER_LOGO = 2; // higher = slower
const REPEATS = 3; // copies of the list per half, so short lists still fill wide screens

const GovernmentAffiliations = ({ title = 'Government Affiliations' }) => {
  if (!LOGOS.length) return null;

  // One "half" of the track. Two identical halves scroll by -50% for a seamless loop.
  const half = Array.from({ length: REPEATS }, () => LOGOS).flat();
  const duration = LOGOS.length * REPEATS * SECONDS_PER_LOGO;

  const renderHalf = (hidden) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {half.map((logo, i) => (
        <li
          key={`${logo.name}-${i}`}
          className="mx-6 flex h-20 shrink-0 items-center gap-3 rounded-xl bg-white px-4 shadow-sm ring-1 ring-bamboo-100 sm:mx-10 sm:px-5"
        >
          <img
            src={logo.src}
            alt=""
            loading="lazy"
            draggable="false"
            className="h-16 w-16 shrink-0 object-contain sm:h-20 sm:w-20"
          />
          <span className="max-w-[9rem] text-sm font-semibold leading-snug text-bamboo-800 sm:text-base">
            {logo.name}
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <section className="bg-bamboo-50/60 py-12" aria-label={title}>
      <style>{`
        @keyframes wk-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .wk-marquee-track {
          animation: wk-marquee var(--wk-marquee-duration, 30s) linear infinite;
          animation-direction: var(--wk-marquee-direction, normal);
          will-change: transform;
        }
        .wk-marquee:hover .wk-marquee-track,
        .wk-marquee:focus-within .wk-marquee-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .wk-marquee-track { animation: none; }
        }
      `}</style>

      {/* Highlighted rectangle box, bordered top & bottom like a banner strip */}
      <div className="mx-auto max-w-7xl border-y-2 border-bamboo-300 px-4 py-10 sm:px-6">
        <h2 className="text-center font-display text-2xl font-bold text-bamboo-800 sm:text-3xl">
          {title}
        </h2>

        <div className="wk-marquee relative mx-auto mt-8 max-w-7xl overflow-hidden">
          {/* soft fade on both edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-bamboo-50 to-transparent sm:w-32" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-bamboo-50 to-transparent sm:w-32" />

          <div
            className="wk-marquee-track flex w-max"
            style={{
              '--wk-marquee-duration': `${duration}s`,
              '--wk-marquee-direction': DIRECTION === 'right' ? 'reverse' : 'normal',
            }}
          >
            {renderHalf(false)}
            {renderHalf(true)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GovernmentAffiliations;