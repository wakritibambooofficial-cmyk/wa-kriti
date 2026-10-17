import { FiX } from 'react-icons/fi';

const ImageLightbox = ({ url, onClose }) => {
  if (!url) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        aria-label="Close image"
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-bamboo-800"
      >
        <FiX size={18} />
      </button>
      <img
        src={url}
        alt="Customer review"
        className="max-h-[85vh] max-w-full rounded-xl object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export default ImageLightbox;