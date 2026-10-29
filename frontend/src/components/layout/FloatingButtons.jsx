

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FiArrowUp } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { cmsApi } from '../../services/cmsApi';

const FloatingButtons = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ['website-settings'],
    queryFn: () => cmsApi.getSettings(),
    select: (res) => res.data.data.settings,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const whatsappNumber = settings?.whatsappNumber || settings?.contactPhone;

  return (
    // bottom-24 lifts this stack above the Wa-Kriti Assistant pill (which sits at bottom-6)
    <div className="fixed bottom-24 right-5 z-30 flex flex-col items-end gap-3">
      {/* Back to top: appears on scroll, always the top-most button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-bamboo-700 text-white shadow-soft-lg transition-transform hover:scale-105"
          aria-label="Back to top"
        >
          <FiArrowUp size={18} />
        </button>
      )}

      {/* WhatsApp: sits just above the Assistant pill */}
      {whatsappNumber && (
        <a
          href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
            'Hi Wa-Kriti team, I need help.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-soft-lg transition-transform hover:scale-105"
          aria-label="Chat on WhatsApp"
        >
          <FaWhatsapp size={22} />
        </a>
      )}
    </div>
  );
};

export default FloatingButtons;
