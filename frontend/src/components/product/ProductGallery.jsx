import { useState, useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const ProductGallery = ({ images = [], productName }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef(null);

  if (!images.length) {
    return <div className="aspect-square w-full rounded-2xl bg-sand-200" />;
  }

  const active = images[activeIndex];

  const goPrev = () => setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const goNext = () => setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (deltaX > 50) goPrev();
    else if (deltaX < -50) goNext();
    touchStartX.current = null;
  };

  return (
    <div>
      <div
        className="group relative aspect-square w-full overflow-hidden rounded-2xl bg-sand-100"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={active.url}
          alt={active.altText || productName}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={goPrev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-bamboo-700 shadow-soft hover:bg-white"
            >
              <FiChevronLeft size={18} />
            </button>
            <button
              onClick={goNext}
              aria-label="Next image"
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-bamboo-700 shadow-soft hover:bg-white"
            >
              <FiChevronRight size={18} />
            </button>

            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Go to image ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === activeIndex ? 'w-5 bg-bamboo-600' : 'w-1.5 bg-white/80'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Fixed 4-slot thumbnail row */}
      <div className="mt-4 grid grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, idx) => {
          const img = images[idx];
          if (!img) {
            return <div key={idx} className="aspect-square rounded-xl bg-sand-100" />;
          }
          return (
            <button
              key={img._id || idx}
              onClick={() => setActiveIndex(idx)}
              className={`aspect-square overflow-hidden rounded-xl border-2 transition-colors ${
                idx === activeIndex ? 'border-bamboo-600' : 'border-transparent hover:border-sand-300'
              }`}
            >
              <img src={img.url} alt={`${productName} thumbnail ${idx + 1}`} className="h-full w-full object-cover" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProductGallery;