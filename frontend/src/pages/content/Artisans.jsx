// import { Link } from 'react-router-dom';
// import { useQuery } from '@tanstack/react-query';
// import { Helmet } from 'react-helmet-async';
// import { contentApi } from '../../services/growthApi';
// import EmptyState from '../../components/ui/EmptyState';

// const Artisans = () => {
//   const { data: artisans = [], isLoading } = useQuery({
//     queryKey: ['artisans'],
//     queryFn: () => contentApi.getArtisans(),
//     select: (res) => res.data.data.artisans,
//   });

//   return (
//     <div className="min-h-screen bg-sand-100 pb-20">
//       <Helmet><title>Meet Our Artisans</title></Helmet>
//       <div className="bg-bamboo-700 px-4 py-14 text-center text-white">
//         <h1 className="font-display text-3xl font-bold">Meet Our Artisans</h1>
//         <p className="mx-auto mt-2 max-w-xl text-sand-200">
//           Every Wa-Kriti product is handcrafted by skilled artisans across India, preserving traditional bamboo craftsmanship.
//         </p>
//       </div>

//       <div className="mx-auto max-w-6xl px-4 py-10">
//         {isLoading ? (
//           <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
//             {[1, 2, 3].map((i) => <div key={i} className="h-72 animate-pulse rounded-2xl bg-sand-200" />)}
//           </div>
//         ) : artisans.length === 0 ? (
//           <EmptyState title="No artisan profiles yet" message="Check back soon to meet the makers behind our products." />
//         ) : (
//           <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
//             {artisans.map((a) => (
//               <Link key={a._id} to={`/artisans/${a.slug}`} className="card overflow-hidden">
//                 <div className="aspect-square bg-sand-100">
//                   {a.photo?.url && <img src={a.photo.url} alt={a.name} className="h-full w-full object-cover" />}
//                 </div>
//                 <div className="p-4">
//                   <p className="font-display text-lg font-semibold text-bamboo-800">{a.name}</p>
//                   <p className="text-xs text-bamboo-500">{a.village}, {a.state}</p>
//                   <p className="mt-1 text-xs text-bamboo-400">{a.experienceYears}+ years of experience</p>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Artisans;


import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiArrowRight, FiMapPin } from 'react-icons/fi';
import { contentApi } from '../../services/growthApi';
import EmptyState from '../../components/ui/EmptyState';

const Artisans = () => {
  const { data: artisans = [], isLoading } = useQuery({
    queryKey: ['artisans'],
    queryFn: () => contentApi.getArtisans(),
    select: (res) => res.data.data.artisans,
  });

  return (
    <div className="min-h-screen bg-sand-100 pb-20">
      <Helmet><title>Meet Our Artisans</title></Helmet>

      {/* ── Header ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-bamboo-700 to-bamboo-800 px-4 py-16 text-center text-white">
        <div
          className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-bamboo-500/20 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-sand-200/80">
            The hands behind the craft
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
            Meet Our Artisans
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-sand-200">
            Every Wa-Kriti product is handcrafted by skilled artisans across India, preserving
            traditional bamboo craftsmanship passed down through generations of makers.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/knowledge-center"
              className="rounded-full bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-bamboo-800 transition-all duration-200 hover:bg-sand-100 hover:shadow-md active:scale-95"
            >
              Know about species of bamboo
            </Link>
            <Link
              to="/sustainability"
              className="group flex items-center gap-1.5 rounded-full border border-white/40 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-all duration-200 hover:border-white hover:bg-white/10 active:scale-95"
            >
              Check sustainability
              <FiArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-72 animate-pulse rounded-2xl bg-sand-200" />)}
          </div>
        ) : artisans.length === 0 ? (
          <EmptyState title="No artisan profiles yet" message="Check back soon to meet the makers behind our products." />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {artisans.map((a, idx) => (
              <motion.div
                key={a._id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link
                  to={`/artisans/${a.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-bamboo-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* accent bar that slides in on hover, matching the rest of the site */}
                  <span className="absolute inset-x-0 top-0 z-10 h-1 origin-left scale-x-0 bg-bamboo-700 transition-transform duration-300 ease-out group-hover:scale-x-100" />

                  <div className="aspect-square overflow-hidden bg-sand-100">
                    {a.photo?.url ? (
                      <img
                        src={a.photo.url}
                        alt={a.name}
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-4xl text-bamboo-200">
                        🎋
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <p className="font-display text-lg font-semibold text-bamboo-800 transition-colors duration-200 group-hover:text-bamboo-900">
                      {a.name}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-bamboo-500">
                      <FiMapPin size={12} className="shrink-0 text-bamboo-400" />
                      {a.village}, {a.state}
                    </p>

                    <div className="mt-3 flex-1">
                      <span className="inline-block rounded-full bg-bamboo-50 px-2.5 py-1 text-[11px] font-medium text-bamboo-700">
                        {a.experienceYears}+ years of experience
                      </span>
                    </div>

                    <span className="mt-4 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-bamboo-700">
                      View profile
                      <FiArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Artisans;