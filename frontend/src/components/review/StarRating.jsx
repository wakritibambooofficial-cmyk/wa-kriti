import { useState } from 'react';
import { FiStar } from 'react-icons/fi';

const LABELS = ['Poor', 'Fair', 'Good', 'Very good', 'Excellent'];

const StarRating = ({ value = 0, onChange, size = 16, readOnly = false, showLabel = false, className = '' }) => {
  const [hover, setHover] = useState(0);

  if (readOnly) {
    return (
      <span
        className={`inline-flex items-center gap-0.5 ${className}`}
        role="img"
        aria-label={`Rated ${value} out of 5`}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            size={size}
            className={star <= Math.round(value) ? 'fill-amber-400 text-amber-400' : 'text-sand-400'}
          />
        ))}
      </span>
    );
  }

  const display = hover || value;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        role="radiogroup"
        aria-label="Rating"
        className="flex items-center gap-1"
        onMouseLeave={() => setHover(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => setHover(star)}
            onFocus={() => setHover(star)}
            onBlur={() => setHover(0)}
            className="rounded p-1 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-bamboo-500"
          >
            <FiStar size={size} className={star <= display ? 'fill-amber-400 text-amber-400' : 'text-sand-400'} />
          </button>
        ))}
      </div>
      {showLabel && display > 0 && <span className="text-sm font-medium text-bamboo-600">{LABELS[display - 1]}</span>}
    </div>
  );
};

export default StarRating;