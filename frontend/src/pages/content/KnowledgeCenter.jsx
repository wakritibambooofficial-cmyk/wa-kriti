import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { contentApi } from '../../services/growthApi';
import EmptyState from '../../components/ui/EmptyState';

const KnowledgeCenter = () => {
  const { data: species = [], isLoading } = useQuery({
    queryKey: ['bamboo-species'],
    queryFn: () => contentApi.getBambooSpecies(),
    select: (res) => res.data.data.species,
  });

  return (
    <div className="min-h-screen bg-sand-100 pb-20">
      <Helmet><title>Knowledge Center — Bamboo Species</title></Helmet>

      {/* ── Header ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-bamboo-700 to-bamboo-800 px-4 py-16 text-center text-white">
        <div
          className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-bamboo-500/20 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-sand-200/80">
            The material, the makers
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
            Bamboo Knowledge Center
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-sand-200">
            Bamboo isn&apos;t one plant, it&apos;s a family of species, each with its own grain, strength, and
            growth pattern. This is where we document what makes every one we work with different, and
            what that means for the pieces we build from it.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/artisans"
              className="rounded-full bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-bamboo-800 transition-all duration-200 hover:bg-sand-100 hover:shadow-md active:scale-95"
            >
              Meet our artisans
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
            {[1, 2, 3].map((i) => <div key={i} className="h-64 animate-pulse rounded-2xl bg-sand-200" />)}
          </div>
        ) : species.length === 0 ? (
          <EmptyState title="No articles yet" message="Check back soon for bamboo species guides." />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {species.map((s, idx) => (
              <motion.div
                key={s._id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link
                  to={`/knowledge-center/${s.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-bamboo-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* accent bar that slides in on hover, matching the feature grid */}
                  <span className="absolute inset-x-0 top-0 z-10 h-1 origin-left scale-x-0 bg-bamboo-700 transition-transform duration-300 ease-out group-hover:scale-x-100" />

                  <div className="aspect-video overflow-hidden bg-sand-100">
                    {s.image?.url ? (
                      <img
                        src={s.image.url}
                        alt={s.name}
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
                      {s.name}
                    </p>
                    {s.scientificName && (
                      <p className="mt-0.5 text-xs italic text-bamboo-400">{s.scientificName}</p>
                    )}
                    <p className="mt-2.5 flex-1 line-clamp-2 text-sm leading-relaxed text-bamboo-600">
                      {s.description}
                    </p>
                    <span className="mt-4 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-bamboo-700">
                      Read more
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

export default KnowledgeCenter;