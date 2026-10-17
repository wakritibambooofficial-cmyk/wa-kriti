// import { useEffect, useState } from 'react';
// import toast from 'react-hot-toast';
// import { FiCheckCircle, FiThumbsUp } from 'react-icons/fi';

// import StarRating from './StarRating';
// import { reviewApi, getReviewErrorMessage } from '../../services/reviewApi';

// const getAvatarUrl = (avatar) => (typeof avatar === 'string' ? avatar : avatar?.url);

// const getDisplayName = (user) => {
//   const first = user?.firstName?.trim() || '';
//   const lastInitial = user?.lastName?.trim()?.[0];
//   const name = `${first}${lastInitial ? ` ${lastInitial}.` : ''}`.trim();
//   return name || 'Wa-Kriti Customer';
// };

// const hasVoted = (review, userId) =>
//   Boolean(userId && review.helpfulUsers?.some((id) => String(id) === String(userId)));

// const ReviewCard = ({ review, currentUserId, isAuthenticated, onRequireLogin, onOpenImage }) => {
//   const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount || 0);
//   const [voted, setVoted] = useState(() => hasVoted(review, currentUserId));
//   const [isVoting, setIsVoting] = useState(false);

//   useEffect(() => {
//     setHelpfulCount(review.helpfulCount || 0);
//     setVoted(hasVoted(review, currentUserId));
//   }, [review, currentUserId]);

//   const name = getDisplayName(review.user);
//   const avatarUrl = getAvatarUrl(review.user?.avatar);
//   const isOwn = Boolean(currentUserId && String(review.user?._id) === String(currentUserId));

//   const handleHelpful = async () => {
//     if (!isAuthenticated) {
//       onRequireLogin();
//       return;
//     }
//     if (isVoting || isOwn) return;

//     setIsVoting(true);
//     try {
//       const res = await reviewApi.toggleHelpful(review._id);
//       const data = res.data.data;
//       setHelpfulCount(data.helpfulCount);
//       setVoted(Boolean(data.voted));
//     } catch (error) {
//       toast.error(getReviewErrorMessage(error, 'Could not record your vote'));
//     } finally {
//       setIsVoting(false);
//     }
//   };

//   return (
//     <article className="rounded-2xl bg-white p-5 shadow-soft">
//       <div className="flex items-start gap-3">
//         {avatarUrl ? (
//           <img src={avatarUrl} alt={name} className="h-10 w-10 shrink-0 rounded-full object-cover" />
//         ) : (
//           <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bamboo-100 text-sm font-semibold text-bamboo-700">
//             {name[0]?.toUpperCase()}
//           </div>
//         )}
//         <div className="min-w-0 flex-1">
//           <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
//             <p className="text-sm font-semibold text-bamboo-800">{name}</p>
//             {review.isVerifiedPurchase === true && (
//               <span className="inline-flex items-center gap-1 rounded-full bg-bamboo-100 px-2 py-0.5 text-[11px] font-semibold text-bamboo-700">
//                 <FiCheckCircle size={11} /> Verified Purchase
//               </span>
//             )}
//           </div>
//           <div className="mt-1 flex items-center gap-2">
//             <StarRating value={review.rating} readOnly size={14} />
//             <span className="text-xs text-bamboo-400">
//               {new Date(review.createdAt).toLocaleDateString('en-IN', {
//                 day: 'numeric',
//                 month: 'short',
//                 year: 'numeric',
//               })}
//             </span>
//           </div>
//         </div>
//       </div>

//       {review.title && <h3 className="mt-3 text-sm font-semibold text-bamboo-800">{review.title}</h3>}
//       {review.description && (
//         <p className="mt-1.5 whitespace-pre-line break-words text-sm leading-relaxed text-bamboo-600">
//           {review.description}
//         </p>
//       )}

//       {review.images?.length > 0 && (
//         <div className="mt-3 flex flex-wrap gap-2">
//           {review.images.map((img) => (
//             <button
//               key={img.publicId || img.url}
//               type="button"
//               onClick={() => onOpenImage(img.url)}
//               className="overflow-hidden rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-bamboo-500"
//               aria-label="View review photo"
//             >
//               <img src={img.url} alt="Customer review" className="h-16 w-16 object-cover sm:h-20 sm:w-20" />
//             </button>
//           ))}
//         </div>
//       )}

//       {review.adminReply?.message && (
//         <div className="mt-4 rounded-xl bg-sand-100 p-3">
//           <p className="text-xs font-semibold text-bamboo-700">Response from Wa-Kriti</p>
//           <p className="mt-1 whitespace-pre-line text-sm text-bamboo-600">{review.adminReply.message}</p>
//           {review.adminReply.repliedAt && (
//             <p className="mt-1 text-xs text-bamboo-400">
//               {new Date(review.adminReply.repliedAt).toLocaleDateString('en-IN', {
//                 day: 'numeric',
//                 month: 'short',
//                 year: 'numeric',
//               })}
//             </p>
//           )}
//         </div>
//       )}

//       <div className="mt-4">
//         <button
//           type="button"
//           onClick={handleHelpful}
//           disabled={isVoting || isOwn}
//           title={isOwn ? "You can't vote on your own review" : undefined}
//           aria-pressed={voted}
//           className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
//             voted
//               ? 'border-bamboo-600 bg-bamboo-100 text-bamboo-700'
//               : 'border-sand-400 text-bamboo-600 hover:bg-sand-100'
//           }`}
//         >
//           <FiThumbsUp size={13} className={voted ? 'fill-bamboo-600' : ''} />
//           Helpful ({helpfulCount})
//         </button>
//       </div>
//     </article>
//   );
// };

// export default ReviewCard;


import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiCheckCircle, FiThumbsUp } from 'react-icons/fi';

import StarRating from './StarRating';
import { reviewApi, getReviewErrorMessage } from '../../services/reviewApi';

const SHORT_LENGTH = 180;
const COMPACT_IMAGE_LIMIT = 3;

const getAvatarUrl = (avatar) => (typeof avatar === 'string' ? avatar : avatar?.url);

const getDisplayName = (user) => {
  const first = user?.firstName?.trim() || '';
  const lastInitial = user?.lastName?.trim()?.[0];
  const name = `${first}${lastInitial ? ` ${lastInitial}.` : ''}`.trim();
  return name || 'Wa-Kriti Customer';
};

const hasVoted = (review, userId) =>
  Boolean(userId && review.helpfulUsers?.some((id) => String(id) === String(userId)));

/**
 * compact: used in the product page row. Long text is shortened behind "Read more" and photos are limited.
 */
const ReviewCard = ({ review, currentUserId, isAuthenticated, onRequireLogin, onOpenImage, compact = false }) => {
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount || 0);
  const [voted, setVoted] = useState(() => hasVoted(review, currentUserId));
  const [isVoting, setIsVoting] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setHelpfulCount(review.helpfulCount || 0);
    setVoted(hasVoted(review, currentUserId));
  }, [review, currentUserId]);

  const name = getDisplayName(review.user);
  const avatarUrl = getAvatarUrl(review.user?.avatar);
  const isOwn = Boolean(currentUserId && String(review.user?._id) === String(currentUserId));

  const description = review.description || '';
  const isLong = compact && description.length > SHORT_LENGTH;
  const shownDescription = isLong && !expanded ? `${description.slice(0, SHORT_LENGTH).trimEnd()}…` : description;

  const images = review.images || [];
  const shownImages = compact && !expanded ? images.slice(0, COMPACT_IMAGE_LIMIT) : images;
  const hiddenImageCount = images.length - shownImages.length;

  const handleHelpful = async () => {
    if (!isAuthenticated) {
      onRequireLogin();
      return;
    }
    if (isVoting || isOwn) return;

    setIsVoting(true);
    try {
      const res = await reviewApi.toggleHelpful(review._id);
      const data = res.data.data;
      setHelpfulCount(data.helpfulCount);
      setVoted(Boolean(data.voted));
    } catch (error) {
      toast.error(getReviewErrorMessage(error, 'Could not record your vote'));
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <article className={`rounded-2xl bg-white p-4 shadow-soft sm:p-5 ${compact ? 'flex h-full flex-col' : ''}`}>
      <div className="flex items-start gap-3">
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="h-10 w-10 shrink-0 rounded-full object-cover" />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bamboo-100 text-sm font-semibold text-bamboo-700">
            {name[0]?.toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="text-sm font-semibold text-bamboo-800">{name}</p>
            {review.isVerifiedPurchase === true && (
              <span className="inline-flex items-center gap-1 rounded-full bg-bamboo-100 px-2 py-0.5 text-[11px] font-semibold text-bamboo-700">
                <FiCheckCircle size={11} /> Verified Purchase
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <StarRating value={review.rating} readOnly size={14} />
            <span className="text-xs text-bamboo-400">
              {new Date(review.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>

      {review.title && <h3 className="mt-3 text-sm font-semibold text-bamboo-800">{review.title}</h3>}
      {shownDescription && (
        <p className="mt-1.5 whitespace-pre-line break-words text-sm leading-relaxed text-bamboo-600">
          {shownDescription}
        </p>
      )}
      {compact && (isLong || images.length > COMPACT_IMAGE_LIMIT) && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 self-start text-xs font-semibold text-bamboo-600 hover:underline"
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}

      {shownImages.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {shownImages.map((img) => (
            <button
              key={img.publicId || img.url}
              type="button"
              onClick={() => onOpenImage(img.url)}
              className="overflow-hidden rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-bamboo-500"
              aria-label="View review photo"
            >
              <img src={img.url} alt="Customer review" className="h-16 w-16 object-cover sm:h-20 sm:w-20" />
            </button>
          ))}
          {hiddenImageCount > 0 && <span className="text-xs text-bamboo-400">+{hiddenImageCount} more</span>}
        </div>
      )}

      {review.adminReply?.message && (
        <div className="mt-4 rounded-xl bg-sand-100 p-3">
          <p className="text-xs font-semibold text-bamboo-700">Response from Wa-Kriti</p>
          <p className="mt-1 whitespace-pre-line text-sm text-bamboo-600">
            {compact && !expanded && review.adminReply.message.length > SHORT_LENGTH
              ? `${review.adminReply.message.slice(0, SHORT_LENGTH).trimEnd()}…`
              : review.adminReply.message}
          </p>
        </div>
      )}

      <div className="mt-auto pt-4">
        <button
          type="button"
          onClick={handleHelpful}
          disabled={isVoting || isOwn}
          title={isOwn ? "You can't vote on your own review" : undefined}
          aria-pressed={voted}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
            voted
              ? 'border-bamboo-600 bg-bamboo-100 text-bamboo-700'
              : 'border-sand-400 text-bamboo-600 hover:bg-sand-100'
          }`}
        >
          <FiThumbsUp size={13} className={voted ? 'fill-bamboo-600' : ''} />
          Helpful ({helpfulCount})
        </button>
      </div>
    </article>
  );
};

export default ReviewCard;