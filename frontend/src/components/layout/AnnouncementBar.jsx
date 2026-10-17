

// import { useEffect, useRef, useState } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { FiX } from 'react-icons/fi';
// import { cmsApi } from '../../services/cmsApi';

// const DEFAULT_MESSAGES = [
//   '🌱 Every Order Plants One Bamboo',
//   '🎉 Free Shipping Above ₹999',
// ];

// // Higher = faster. This is px/sec, so speed stays constant
// // no matter how much text is in the ticker.
// const SPEED_PX_PER_SEC = 60;

// const AnnouncementBar = () => {
//   const [isClosed, setIsClosed] = useState(false);
//   const [duration, setDuration] = useState(20);

//   const trackRef = useRef(null);
//   const singleSetRef = useRef(null);

//   const { data: settings } = useQuery({
//     queryKey: ['website-settings'],
//     queryFn: () => cmsApi.getSettings(),
//     select: (res) => res.data.data.settings,
//     staleTime: 1 * 60 * 1000,
//   });

//   const bar = settings?.announcementBar;
//   const messages = bar?.messages?.length > 0 ? bar.messages : DEFAULT_MESSAGES;
//   const isEnabled = bar?.isEnabled !== false;

//   // Repeat messages enough times to fill the widest screen at least twice,
//   // so the loop never shows a gap, then measure one "set" to get exact width.
//   const tickerMessages = [...messages, ...messages, ...messages, ...messages];

//   useEffect(() => {
//     if (!singleSetRef.current) return;

//     const measure = () => {
//       const setWidth = singleSetRef.current?.getBoundingClientRect().width || 0;
//       if (setWidth > 0) {
//         setDuration(setWidth / SPEED_PX_PER_SEC);
//       }
//     };

//     measure();

//     const resizeObserver = new ResizeObserver(measure);
//     resizeObserver.observe(singleSetRef.current);

//     return () => resizeObserver.disconnect();
//   }, [messages]);

//   if (isClosed || !isEnabled) return null;

//   return (
//     <div className="relative overflow-hidden bg-bamboo-700 py-2 text-sand-100">
//       <div
//         ref={trackRef}
//         className="flex whitespace-nowrap"
//         style={{
//           animation: `ticker ${duration}s linear infinite`,
//           width: 'max-content',
//         }}
//       >
//         {/* First set — measured to determine exact scroll distance */}
//         <span ref={singleSetRef} className="flex shrink-0">
//           {messages.map((msg, index) => (
//             <span key={`a-${index}`} className="mx-12 text-sm font-medium sm:text-base">
//               {msg}
//             </span>
//           ))}
//         </span>

//         {/* Repeated sets to keep the ticker visually full */}
//         {tickerMessages.map((msg, index) => (
//           <span key={`b-${index}`} className="mx-12 shrink-0 text-sm font-medium sm:text-base">
//             {msg}
//           </span>
//         ))}
//       </div>

//       <button
//         onClick={() => setIsClosed(true)}
//         className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-sand-200 hover:text-white"
//       >
//         <FiX size={14} />
//       </button>

//       <style>{`
//         @keyframes ticker {
//           from {
//             transform: translateX(0);
//           }
//           to {
//             transform: translateX(-${100 / (tickerMessages.length / messages.length + 1)}%);
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AnnouncementBar;



import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FiX } from 'react-icons/fi';
import { cmsApi } from '../../services/cmsApi';

const DEFAULT_MESSAGES = [
  '🌱 Every Order Plants One Bamboo',
  ' Free Shipping Above ₹999',
];

// Higher = faster. This is px/sec, so speed stays constant
// no matter how much text is in the ticker.
const SPEED_PX_PER_SEC = 60;

const AnnouncementBar = () => {
  const [isClosed, setIsClosed] = useState(false);
  const [duration, setDuration] = useState(20);

  const trackRef = useRef(null);
  const singleSetRef = useRef(null);

  const { data: settings } = useQuery({
    queryKey: ['website-settings'],
    queryFn: () => cmsApi.getSettings(),
    select: (res) => res.data.data.settings,
    staleTime: 1 * 60 * 1000,
  });

  const bar = settings?.announcementBar;
  const messages = bar?.messages?.length > 0 ? bar.messages : DEFAULT_MESSAGES;
  const isEnabled = bar?.isEnabled !== false;

  const tickerMessages = [...messages, ...messages, ...messages, ...messages];

  useEffect(() => {
    if (!singleSetRef.current) return;

    const measure = () => {
      const setWidth = singleSetRef.current?.getBoundingClientRect().width || 0;
      if (setWidth > 0) {
        setDuration(setWidth / SPEED_PX_PER_SEC);
      }
    };

    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(singleSetRef.current);

    return () => resizeObserver.disconnect();
  }, [messages]);

  if (isClosed || !isEnabled) return null;

  const renderMessage = (msg, key) => (
    <span key={key} className="flex shrink-0 items-center">
      <span className="mx-6 text-xs font-semibold tracking-wide text-sand-50 sm:text-sm">
        {msg}
      </span>
      <span className="h-1 w-1 rounded-full bg-sand-200/40" aria-hidden="true" />
    </span>
  );

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-bamboo-800 via-bamboo-700 to-bamboo-800 shadow-sm">
      {/* subtle top highlight for depth */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10" />

      <div className="flex items-center py-2.5">
        <div
          ref={trackRef}
          className="flex whitespace-nowrap"
          style={{
            animation: `ticker ${duration}s linear infinite`,
            width: 'max-content',
          }}
        >
          <span ref={singleSetRef} className="flex shrink-0 items-center">
            {messages.map((msg, index) => renderMessage(msg, `a-${index}`))}
          </span>

          {tickerMessages.map((msg, index) => renderMessage(msg, `b-${index}`))}
        </div>

        {/* fade edges so the ticker doesn't cut text abruptly */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-bamboo-800 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-bamboo-800 to-transparent" />

        <button
          onClick={() => setIsClosed(true)}
          aria-label="Dismiss announcement"
          className="absolute right-2.5 top-1/2 z-10 -translate-y-1/2 rounded-full p-1.5 text-sand-200/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          <FiX size={13} />
        </button>
      </div>

      <style>{`
        @keyframes ticker {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-${100 / (tickerMessages.length / messages.length + 1)}%);
          }
        }
      `}</style>
    </div>
  );
};

export default AnnouncementBar;