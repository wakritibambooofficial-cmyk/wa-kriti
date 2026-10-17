

// import { useEffect, useRef, useState, useCallback, useLayoutEffect } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { FiChevronLeft, FiChevronRight, FiPlay } from 'react-icons/fi';
// import { motion } from 'framer-motion';

// import { videoApi } from '../services/videoApi';
// import VideoModal from './VideoModal';

// const VISIBLE_COUNT = 4; // how many cards show at once
// const GAP_PX = 16; // must match gap-4

// const formatDuration = (seconds = 0) => {
//   const s = Math.round(seconds);
//   const m = Math.floor(s / 60);
//   const rem = s % 60;
//   return `${m}:${String(rem).padStart(2, '0')}`;
// };

// /**
//  * One card in the row. Plays muted + looped only while it's actually
//  * visible on screen.
//  */
// const VideoCard = ({ video, onClick, width }) => {
//   const videoRef = useRef(null);
//   const wrapperRef = useRef(null);

//   useEffect(() => {
//     const el = videoRef.current;
//     const wrapper = wrapperRef.current;
//     if (!el || !wrapper) return undefined;

//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           el.play().catch(() => {});
//         } else {
//           el.pause();
//         }
//       },
//       { threshold: 0.5 }
//     );

//     observer.observe(wrapper);
//     return () => observer.disconnect();
//   }, []);

//   return (
//     <button
//       ref={wrapperRef}
//       onClick={onClick}
//       style={{ width }}
//       className="group relative aspect-[9/16] shrink-0 overflow-hidden rounded-2xl bg-sand-100 shadow-soft"
//     >
//       <video
//         ref={videoRef}
//         src={video.videoUrl}
//         poster={video.thumbnailUrl}
//         muted
//         loop
//         playsInline
//         preload="metadata"
//         className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
//       />

//       <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

//       <span className="pointer-events-none absolute bottom-3 right-3 rounded bg-black/60 px-1.5 py-0.5 text-[11px] font-medium text-white">
//         {formatDuration(video.duration)}
//       </span>

//       <span className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
//         <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-bamboo-800">
//           <FiPlay size={18} className="translate-x-0.5" />
//         </span>
//       </span>
//     </button>
//   );
// };

// const VideoShowcase2 = () => {
//   const viewportRef = useRef(null);
//   const [activeIndex, setActiveIndex] = useState(null); // null = modal closed
//   const [startIndex, setStartIndex] = useState(0); // first visible card
//   const [cardWidth, setCardWidth] = useState(0);

//   const { data: videos = [], isLoading } = useQuery({
//     queryKey: ['showcase-videos'],
//     queryFn: () => videoApi.getVideos(),
//     select: (res) => res.data.data.videos,
//     staleTime: 5 * 60 * 1000,
//   });

//   // Measure viewport and compute card width so exactly VISIBLE_COUNT cards fit
//   const recalcWidth = useCallback(() => {
//     const el = viewportRef.current;
//     if (!el) return;
//     const totalGap = GAP_PX * (VISIBLE_COUNT - 1);
//     const width = (el.clientWidth - totalGap) / VISIBLE_COUNT;
//     setCardWidth(width);
//   }, []);

//   useLayoutEffect(() => {
//     recalcWidth();
//     window.addEventListener('resize', recalcWidth);
//     return () => window.removeEventListener('resize', recalcWidth);
//   }, [recalcWidth, videos.length]);

//   const maxStartIndex = Math.max(0, videos.length - VISIBLE_COUNT);

//   const goPrev = () => setStartIndex((i) => Math.max(0, i - 1));
//   const goNext = () => setStartIndex((i) => Math.min(maxStartIndex, i + 1));

//   const offset = startIndex * (cardWidth + GAP_PX);

//   if (isLoading) {
//     return (
//       <section className="mx-auto max-w-7xl px-4 py-14">
//         <div className="mx-auto h-8 w-72 animate-pulse rounded bg-sand-200" />
//         <div className="mt-8 flex gap-4">
//           {[...Array(4)].map((_, i) => (
//             <div key={i} className="aspect-[9/16] flex-1 animate-pulse rounded-2xl bg-sand-200" />
//           ))}
//         </div>
//       </section>
//     );
//   }

//   if (!videos.length) return null;

//   return (
//     <section className="mx-auto max-w-7xl px-4 py-14">
//       <h2 className="text-center font-display text-2xl font-bold text-bamboo-800 sm:text-3xl">
//         Experience Before You Buy
//       </h2>

//       <div className="relative mt-8">
//         <button
//           onClick={goPrev}
//           disabled={startIndex === 0}
//           aria-label="Previous"
//           className="absolute left-0 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-2 text-bamboo-700 shadow-soft transition-opacity hover:bg-sand-100 disabled:opacity-0 sm:flex"
//         >
//           <FiChevronLeft size={20} />
//         </button>

//         {/* Fixed-width viewport, overflow hidden — no scrollbar ever shows */}
//         <div ref={viewportRef} className="overflow-hidden">
//           <div
//             className="flex gap-4 transition-transform duration-500 ease-out"
//             style={{ transform: `translateX(-${offset}px)` }}
//           >
//             {videos.map((video, i) => (
//               <motion.div
//                 key={video._id}
//                 initial={{ opacity: 0, y: 15 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: Math.min(i, 3) * 0.04 }}
//                 className="shrink-0"
//               >
//                 <VideoCard
//                   video={video}
//                   width={cardWidth ? `${cardWidth}px` : undefined}
//                   onClick={() => setActiveIndex(i)}
//                 />
//               </motion.div>
//             ))}
//           </div>
//         </div>

//         <button
//           onClick={goNext}
//           disabled={startIndex >= maxStartIndex}
//           aria-label="Next"
//           className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 translate-x-1/2 rounded-full bg-white p-2 text-bamboo-700 shadow-soft transition-opacity hover:bg-sand-100 disabled:opacity-0 sm:flex"
//         >
//           <FiChevronRight size={20} />
//         </button>
//       </div>

//       {activeIndex !== null && (
//         <VideoModal videos={videos} startIndex={activeIndex} onClose={() => setActiveIndex(null)} />
//       )}
//     </section>
//   );
// };

// export default VideoShowcase2;


import { useEffect, useRef, useState, useCallback, useLayoutEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FiChevronLeft, FiChevronRight, FiPlay } from 'react-icons/fi';
import { motion } from 'framer-motion';

import { videoApi } from '../services/videoApi';
import VideoModal from './VideoModal';

const VISIBLE_COUNT = 4; // how many cards show at once
const GAP_PX = 16; // must match gap-4

const formatDuration = (seconds = 0) => {
  const s = Math.round(seconds);
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}:${String(rem).padStart(2, '0')}`;
};

/**
 * One card in the row. Plays muted + looped only while it's actually
 * visible on screen.
 */
const VideoCard = ({ video, onClick, width }) => {
  const videoRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const el = videoRef.current;
    const wrapper = wrapperRef.current;
    if (!el || !wrapper) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  return (
    <button
      ref={wrapperRef}
      onClick={onClick}
      style={{ width }}
      className="group relative aspect-[9/16] shrink-0 overflow-hidden rounded-2xl bg-sand-100 shadow-soft"
    >
      <video
        ref={videoRef}
        src={video.videoUrl}
        poster={video.thumbnailUrl}
        muted
        loop
        playsInline
        preload="metadata"
        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

      <span className="pointer-events-none absolute bottom-3 right-3 rounded bg-black/60 px-1.5 py-0.5 text-[11px] font-medium text-white">
        {formatDuration(video.duration)}
      </span>

      <span className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-bamboo-800">
          <FiPlay size={18} className="translate-x-0.5" />
        </span>
      </span>
    </button>
  );
};

const VideoShowcase2 = () => {
  const viewportRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null); // null = modal closed
  const [cardWidth, setCardWidth] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ['showcase-videos'],
    queryFn: () => videoApi.getVideos(),
    select: (res) => res.data.data.videos,
    staleTime: 5 * 60 * 1000,
  });

  // Measure viewport and compute card width so exactly VISIBLE_COUNT cards fit
  const recalcWidth = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const totalGap = GAP_PX * (VISIBLE_COUNT - 1);
    const width = (el.clientWidth - totalGap) / VISIBLE_COUNT;
    setCardWidth(width);
  }, []);

  const updateScrollButtons = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useLayoutEffect(() => {
    recalcWidth();
    window.addEventListener('resize', recalcWidth);
    return () => window.removeEventListener('resize', recalcWidth);
  }, [recalcWidth, videos.length]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return undefined;
    updateScrollButtons();
    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    window.addEventListener('resize', updateScrollButtons);
    return () => {
      el.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, [videos, cardWidth, updateScrollButtons]);

  const scrollByAmount = (direction) => {
    const el = viewportRef.current;
    if (!el) return;
    const amount = cardWidth + GAP_PX;
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="mx-auto h-8 w-72 animate-pulse rounded bg-sand-200" />
        <div className="mt-8 flex gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-[9/16] flex-1 animate-pulse rounded-2xl bg-sand-200" />
          ))}
        </div>
      </section>
    );
  }

  if (!videos.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-14">
      <h2 className="text-center font-display text-2xl font-bold text-bamboo-800 sm:text-3xl">
        Experience Before You Buy
      </h2>

      <div className="relative mt-8">
        <button
          onClick={() => scrollByAmount('left')}
          disabled={!canScrollLeft}
          aria-label="Previous"
          className="absolute left-0 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-2 text-bamboo-700 shadow-soft transition-opacity hover:bg-sand-100 disabled:opacity-0 sm:flex"
        >
          <FiChevronLeft size={20} />
        </button>

        {/* Scrollable viewport — native touch swipe on mobile, buttons scroll it on desktop */}
        <div
          ref={viewportRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-2 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {videos.map((video, i) => (
            <motion.div
              key={video._id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i, 3) * 0.04 }}
              className="shrink-0"
            >
              <VideoCard
                video={video}
                width={cardWidth ? `${cardWidth}px` : undefined}
                onClick={() => setActiveIndex(i)}
              />
            </motion.div>
          ))}
        </div>

        <button
          onClick={() => scrollByAmount('right')}
          disabled={!canScrollRight}
          aria-label="Next"
          className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 translate-x-1/2 rounded-full bg-white p-2 text-bamboo-700 shadow-soft transition-opacity hover:bg-sand-100 disabled:opacity-0 sm:flex"
        >
          <FiChevronRight size={20} />
        </button>
      </div>

      {activeIndex !== null && (
        <VideoModal videos={videos} startIndex={activeIndex} onClose={() => setActiveIndex(null)} />
      )}
    </section>
  );
};

export default VideoShowcase2;