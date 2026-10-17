import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiX } from 'react-icons/fi';
import { cmsApi } from '../services/cmsApi';

const SESSION_KEY_PREFIX = 'wakriti_announcement_seen_';

const isWithinDateRange = (banner) => {
  const now = new Date();
  if (banner.startDate && new Date(banner.startDate) > now) return false;
  if (banner.endDate && new Date(banner.endDate) < now) return false;
  return true;
};

const AnnouncementPopup = () => {
  const [visible, setVisible] = useState(false);
  const [activeBanner, setActiveBanner] = useState(null);

  const { data: banners = [] } = useQuery({
    queryKey: ['banners', 'announcement_popup'],
    queryFn: () => cmsApi.getBanners('announcement_popup'),
    select: (res) => res.data.data.banners,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!banners.length) return;

    // first active, in-date-range banner — backend already sorts by sortOrder
    const banner = banners.find(isWithinDateRange);
    if (!banner) return;

    const sessionKey = `${SESSION_KEY_PREFIX}${banner._id}`;
    if (sessionStorage.getItem(sessionKey)) return; // already shown this session

    setActiveBanner(banner);

    // small delay so it doesn't flash in before the page has settled
    const timer = setTimeout(() => {
      setVisible(true);
      sessionStorage.setItem(sessionKey, 'true');
    }, 900);

    return () => clearTimeout(timer);
  }, [banners]);

  const close = () => setVisible(false);

  if (!activeBanner) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <button
              onClick={close}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition-colors hover:bg-black/60"
            >
              <FiX size={16} />
            </button>

            {activeBanner.image?.url && (
              <div className="aspect-[4/3] w-full bg-sand-100">
                <img src={activeBanner.image.url} alt={activeBanner.title} className="h-full w-full object-cover" />
              </div>
            )}

            <div className="p-6 text-center">
              {activeBanner.subtitle && (
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-bamboo-400">
                  {activeBanner.subtitle}
                </span>
              )}
              <h2 className="mt-1.5 font-display text-xl font-bold text-bamboo-800 sm:text-2xl">
                {activeBanner.title}
              </h2>
              {activeBanner.description && (
                <p className="mt-2 text-sm leading-relaxed text-bamboo-600">{activeBanner.description}</p>
              )}

              <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
                {activeBanner.ctaPrimaryLabel && (
                  <Link to={activeBanner.ctaPrimaryLink || '/shop'} onClick={close} className="btn-primary">
                    {activeBanner.ctaPrimaryLabel}
                  </Link>
                )}
                {activeBanner.ctaSecondaryLabel && (
                  <Link
                    to={activeBanner.ctaSecondaryLink || '/shop'}
                    onClick={close}
                    className="rounded-xl border border-bamboo-300 px-6 py-3 text-sm font-semibold text-bamboo-700 hover:bg-bamboo-50"
                  >
                    {activeBanner.ctaSecondaryLabel}
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnnouncementPopup;