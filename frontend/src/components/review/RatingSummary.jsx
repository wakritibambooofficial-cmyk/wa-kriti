import StarRating from './StarRating';

const RatingSummary = ({ average = 0, count = 0, distribution = {} }) => {
  const total = [1, 2, 3, 4, 5].reduce((sum, s) => sum + (Number(distribution[s]) || 0), 0);

  return (
    <div className="grid grid-cols-[auto_1fr] items-center gap-5 rounded-2xl bg-white p-4 shadow-soft sm:gap-8 sm:p-5">
      <div className="text-center">
        {count > 0 ? (
          <>
            <p className="font-display text-3xl font-bold text-bamboo-800 sm:text-4xl">
              {Number(average).toFixed(1)}
              <span className="text-sm font-medium text-bamboo-400"> / 5</span>
            </p>
            <StarRating value={average} readOnly size={16} className="mt-1" />
            <p className="mt-0.5 text-xs text-bamboo-500">
              {count} {count === 1 ? 'Review' : 'Reviews'}
            </p>
          </>
        ) : (
          <>
            <StarRating value={0} readOnly size={16} />
            <p className="mt-1 text-xs text-bamboo-500">No reviews yet</p>
          </>
        )}
      </div>

      <div className="space-y-1">
        {[5, 4, 3, 2, 1].map((star) => {
          const n = Number(distribution[star]) || 0;
          const pct = total ? Math.round((n / total) * 100) : 0;
          return (
            <div key={star} className="flex items-center gap-2 text-xs">
              <span className="w-7 shrink-0 text-bamboo-600">{star} ★</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-sand-200">
                <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
              </div>
              <span className="w-7 shrink-0 text-right text-bamboo-500">{n}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RatingSummary;