// import { useState } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
// import { useSelector } from 'react-redux';
// import toast from 'react-hot-toast';
// import { FiEdit2, FiTrash2, FiX } from 'react-icons/fi';

// import Button from '../ui/Button';
// import StarRating from './StarRating';
// import ReviewCard from './ReviewCard';
// import ReviewForm from './ReviewForm';
// import DeleteReviewDialog from './DeleteReviewDialog';
// import { useMyReviews } from '../../hooks/useMyReviews';
// import { reviewApi, getReviewErrorMessage } from '../../services/reviewApi';
// import { getReviewStatus } from './reviewStatus';

// const ORDERS_PATH = '/dashboard/orders';
// const LOGIN_PATH = '/login';
// const PAGE_SIZE = 10;

// const ReviewSection = ({ product }) => {
//   const { isAuthenticated, user } = useSelector((state) => state.auth);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const queryClient = useQueryClient();
//   const currentUserId = user?._id || user?.id;

//   const { getReviewForProduct } = useMyReviews();
//   const myReview = isAuthenticated ? getReviewForProduct(product._id) : null;

//   const [editOpen, setEditOpen] = useState(false);
//   const [deleteOpen, setDeleteOpen] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [lightboxUrl, setLightboxUrl] = useState(null);

//   const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
//     queryKey: ['product-reviews', product._id],
//     initialPageParam: 1,
//     queryFn: async ({ pageParam = 1 }) => {
//       const res = await reviewApi.getProductReviews(product._id, { page: pageParam, limit: PAGE_SIZE });
//       const body = res.data;
//       const meta = body.meta || body.pagination || {};
//       const reviews = body.data?.reviews || [];
//       const page = meta.page || pageParam;
//       return {
//         reviews,
//         ratingDistribution: body.data?.ratingDistribution || {},
//         page,
//         hasMore: meta.totalPages ? page < meta.totalPages : reviews.length === PAGE_SIZE,
//       };
//     },
//     getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
//   });

//   const reviews = data?.pages.flatMap((p) => p.reviews) || [];
//   const distribution = data?.pages[0]?.ratingDistribution || {};
//   const distributionTotal = [1, 2, 3, 4, 5].reduce((sum, s) => sum + (Number(distribution[s]) || 0), 0);

//   const average = Number(product.ratingsAverage) || 0;
//   const count = product.ratingsCount || 0;

//   const goToLogin = () => {
//     toast('Please log in to continue');
//     navigate(LOGIN_PATH, { state: { from: location } });
//   };

//   const handleDelete = async () => {
//     if (!myReview || isDeleting) return;
//     setIsDeleting(true);
//     try {
//       await reviewApi.deleteReview(myReview._id);
//       toast.success('Your review has been deleted');
//       setDeleteOpen(false);
//       queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
//       queryClient.invalidateQueries({ queryKey: ['product-reviews', product._id] });
//       queryClient.invalidateQueries({ queryKey: ['product'] });
//     } catch (error) {
//       toast.error(getReviewErrorMessage(error, 'Could not delete your review'));
//       if (error?.response?.status === 404) {
//         setDeleteOpen(false);
//         queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
//       }
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   const status = myReview ? getReviewStatus(myReview.status) : null;

//   return (
//     <section id="reviews" className="mt-16 scroll-mt-24">
//       <h2 className="font-display text-xl font-semibold text-bamboo-800">Customer Reviews</h2>

//       {/* Summary + distribution */}
//       <div className="mt-5 grid grid-cols-1 gap-6 rounded-2xl bg-white p-5 shadow-soft sm:p-6 md:grid-cols-2">
//         <div className="flex flex-col items-center justify-center text-center">
//           {count > 0 ? (
//             <>
//               <p className="font-display text-5xl font-bold text-bamboo-800">
//                 {average.toFixed(1)}
//                 <span className="text-xl font-medium text-bamboo-400"> / 5</span>
//               </p>
//               <StarRating value={average} readOnly size={22} className="mt-2" />
//               <p className="mt-1 text-sm text-bamboo-500">
//                 {count} {count === 1 ? 'Review' : 'Reviews'}
//               </p>
//             </>
//           ) : (
//             <>
//               <StarRating value={0} readOnly size={22} />
//               <p className="mt-2 text-sm text-bamboo-500">No reviews yet</p>
//             </>
//           )}
//         </div>

//         <div className="space-y-2">
//           {[5, 4, 3, 2, 1].map((star) => {
//             const n = Number(distribution[star]) || 0;
//             const pct = distributionTotal ? Math.round((n / distributionTotal) * 100) : 0;
//             return (
//               <div key={star} className="flex items-center gap-2 text-xs">
//                 <span className="w-8 shrink-0 text-bamboo-600">{star} ★</span>
//                 <div className="h-2 flex-1 overflow-hidden rounded-full bg-sand-200">
//                   <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
//                 </div>
//                 <span className="w-8 shrink-0 text-right text-bamboo-500">{n}</span>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Your review / call to action */}
//       <div className="mt-4">
//         {!isAuthenticated && (
//           <div className="flex flex-col items-start justify-between gap-3 rounded-2xl bg-white p-5 shadow-soft sm:flex-row sm:items-center">
//             <p className="text-sm text-bamboo-600">Log in to see your review or vote on reviews.</p>
//             <Button variant="secondary" onClick={goToLogin} className="!px-4 !py-2 text-sm">
//               Log In
//             </Button>
//           </div>
//         )}

//         {isAuthenticated && myReview && (
//           <div className="rounded-2xl border border-bamboo-200 bg-bamboo-50/50 p-5">
//             <div className="flex flex-wrap items-center gap-2">
//               <p className="text-sm font-semibold text-bamboo-800">You have already reviewed this product.</p>
//               <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${status.badge}`}>
//                 {status.label}
//               </span>
//             </div>
//             <div className="mt-2 flex items-center gap-2">
//               <StarRating value={myReview.rating} readOnly size={14} />
//               {myReview.title && <span className="text-sm text-bamboo-700">{myReview.title}</span>}
//             </div>
//             <p className="mt-2 text-xs text-bamboo-500">{status.message}</p>
//             <div className="mt-3 flex flex-wrap gap-2">
//               <Button variant="secondary" onClick={() => setEditOpen(true)} className="!px-4 !py-2 text-sm">
//                 <FiEdit2 size={13} className="mr-1.5" /> Edit Review
//               </Button>
//               <Button variant="danger" onClick={() => setDeleteOpen(true)} className="!px-4 !py-2 text-sm">
//                 <FiTrash2 size={13} className="mr-1.5" /> Delete Review
//               </Button>
//             </div>
//           </div>
//         )}

//         {isAuthenticated && !myReview && (
//           <div className="flex flex-col items-start justify-between gap-3 rounded-2xl bg-white p-5 shadow-soft sm:flex-row sm:items-center">
//             <p className="text-sm text-bamboo-600">
//               Bought this product? Once it is delivered, you can review it from your orders.
//             </p>
//             <Link
//               to={ORDERS_PATH}
//               className="shrink-0 rounded-xl border border-sand-400 px-4 py-2 text-sm font-medium text-bamboo-700 hover:bg-sand-100"
//             >
//               Go to My Orders
//             </Link>
//           </div>
//         )}
//       </div>

//       {/* Reviews list */}
//       <div className="mt-6 space-y-4">
//         {isLoading && (
//           <>
//             {[1, 2, 3].map((i) => (
//               <div key={i} className="h-32 animate-pulse rounded-2xl bg-sand-200" />
//             ))}
//           </>
//         )}

//         {isError && !isLoading && (
//           <div className="rounded-2xl bg-white p-6 text-center shadow-soft">
//             <p className="text-sm text-bamboo-600">We couldn&apos;t load reviews right now.</p>
//             <Button variant="secondary" onClick={() => refetch()} className="mt-3 !px-4 !py-2 text-sm">
//               Try Again
//             </Button>
//           </div>
//         )}

//         {!isLoading && !isError && reviews.length === 0 && (
//           <div className="rounded-2xl bg-white p-8 text-center shadow-soft">
//             <p className="text-sm font-medium text-bamboo-700">No reviews yet</p>
//             <p className="mt-1 text-xs text-bamboo-500">Reviews appear here once they have been approved.</p>
//           </div>
//         )}

//         {reviews.map((review) => (
//           <ReviewCard
//             key={review._id}
//             review={review}
//             currentUserId={currentUserId}
//             isAuthenticated={isAuthenticated}
//             onRequireLogin={goToLogin}
//             onOpenImage={setLightboxUrl}
//           />
//         ))}

//         {hasNextPage && (
//           <div className="pt-2 text-center">
//             <Button
//               variant="secondary"
//               onClick={() => fetchNextPage()}
//               isLoading={isFetchingNextPage}
//               className="!px-6 !py-2 text-sm"
//             >
//               Load More Reviews
//             </Button>
//           </div>
//         )}
//       </div>

//       {/* Edit form */}
//       {myReview && (
//         <ReviewForm
//           isOpen={editOpen}
//           onClose={() => setEditOpen(false)}
//           product={{ _id: product._id, name: product.name, image: product.images?.[0]?.url }}
//           review={myReview}
//         />
//       )}

//       <DeleteReviewDialog
//         isOpen={deleteOpen}
//         onCancel={() => setDeleteOpen(false)}
//         onConfirm={handleDelete}
//         isLoading={isDeleting}
//       />

//       {/* Image lightbox */}
//       {lightboxUrl && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
//           onClick={() => setLightboxUrl(null)}
//           role="dialog"
//           aria-modal="true"
//         >
//           <button
//             type="button"
//             aria-label="Close image"
//             onClick={() => setLightboxUrl(null)}
//             className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-bamboo-800"
//           >
//             <FiX size={18} />
//           </button>
//           <img
//             src={lightboxUrl}
//             alt="Customer review"
//             className="max-h-[85vh] max-w-full rounded-xl object-contain"
//             onClick={(e) => e.stopPropagation()}
//           />
//         </div>
//       )}
//     </section>
//   );
// };

// export default ReviewSection;


import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { FiArrowRight, FiEdit2, FiTrash2 } from 'react-icons/fi';

import Button from '../ui/Button';
import StarRating from './StarRating';
import RatingSummary from './RatingSummary';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import DeleteReviewDialog from './DeleteReviewDialog';
import ImageLightbox from './ImageLightbox';
import { useMyReviews } from '../../hooks/useMyReviews';
import { reviewApi, getReviewErrorMessage } from '../../services/reviewApi';
import { getReviewStatus } from './reviewStatus';
import { normalizeReviewsPage } from './reviewUtils';

const ORDERS_PATH = '/dashboard/orders';
const LOGIN_PATH = '/login';
const PREVIEW_COUNT = 4;

const ReviewSection = ({ product }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const currentUserId = user?._id || user?.id;

  const { getReviewForProduct } = useMyReviews();
  const myReview = isAuthenticated ? getReviewForProduct(product._id) : null;

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['product-reviews', product._id, 'preview'],
    queryFn: async () => {
      const res = await reviewApi.getProductReviews(product._id, { page: 1, limit: PREVIEW_COUNT });
      return normalizeReviewsPage(res, 1, PREVIEW_COUNT);
    },
  });

  const reviews = data?.reviews || [];
  const distribution = data?.ratingDistribution || {};
  const average = Number(product.ratingsAverage) || 0;
  const count = product.ratingsCount || 0;
  const showViewAll = Boolean(data?.hasMore) || count > reviews.length;
  const allReviewsPath = `/product/${product.slug}/reviews`;

  const goToLogin = () => {
    toast('Please log in to continue');
    navigate(LOGIN_PATH, { state: { from: location } });
  };

  const handleDelete = async () => {
    if (!myReview || isDeleting) return;
    setIsDeleting(true);
    try {
      await reviewApi.deleteReview(myReview._id);
      toast.success('Your review has been deleted');
      setDeleteOpen(false);
      queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['product-reviews', product._id] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
    } catch (error) {
      toast.error(getReviewErrorMessage(error, 'Could not delete your review'));
      if (error?.response?.status === 404) {
        setDeleteOpen(false);
        queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const status = myReview ? getReviewStatus(myReview.status) : null;

  // Desktop: 4 equal columns, plus a narrow arrow column when there are more reviews
  const rowClass = showViewAll
    ? 'lg:grid-cols-[repeat(4,minmax(0,1fr))_auto]'
    : 'lg:grid-cols-4';

  return (
    <section id="reviews" className="mt-14 scroll-mt-24">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold text-bamboo-800">Customer Reviews</h2>
        {showViewAll && (
          <Link
            to={allReviewsPath}
            className="inline-flex items-center gap-1 text-sm font-semibold text-bamboo-600 hover:underline"
          >
            View all {count > 0 ? count : ''} reviews <FiArrowRight size={14} />
          </Link>
        )}
      </div>

      <div className="mt-4">
        <RatingSummary average={average} count={count} distribution={distribution} />
      </div>

      {/* Your review / call to action */}
      <div className="mt-4">
        {!isAuthenticated && (
          <div className="flex flex-col items-start justify-between gap-3 rounded-2xl bg-white p-4 shadow-soft sm:flex-row sm:items-center">
            <p className="text-sm text-bamboo-600">Log in to see your review or vote on reviews.</p>
            <Button variant="secondary" onClick={goToLogin} className="!px-4 !py-2 text-sm">
              Log In
            </Button>
          </div>
        )}

        {isAuthenticated && myReview && (
          <div className="rounded-2xl border border-bamboo-200 bg-bamboo-50/50 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-bamboo-800">You have already reviewed this product.</p>
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${status.badge}`}>
                {status.label}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <StarRating value={myReview.rating} readOnly size={14} />
              {myReview.title && <span className="text-sm text-bamboo-700">{myReview.title}</span>}
            </div>
            <p className="mt-2 text-xs text-bamboo-500">{status.message}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => setEditOpen(true)} className="!px-4 !py-2 text-sm">
                <FiEdit2 size={13} className="mr-1.5" /> Edit Review
              </Button>
              <Button variant="danger" onClick={() => setDeleteOpen(true)} className="!px-4 !py-2 text-sm">
                <FiTrash2 size={13} className="mr-1.5" /> Delete Review
              </Button>
            </div>
          </div>
        )}

        {isAuthenticated && !myReview && (
          <div className="flex flex-col items-start justify-between gap-3 rounded-2xl bg-white p-4 shadow-soft sm:flex-row sm:items-center">
            <p className="text-sm text-bamboo-600">
              Bought this product? Once it is delivered, you can review it from your orders.
            </p>
            <Link
              to={ORDERS_PATH}
              className="shrink-0 rounded-xl border border-sand-400 px-4 py-2 text-sm font-medium text-bamboo-700 hover:bg-sand-100"
            >
              Go to My Orders
            </Link>
          </div>
        )}
      </div>

      {/* Reviews row */}
      <div className="mt-5">
        {isLoading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 animate-pulse rounded-2xl bg-sand-200" />
            ))}
          </div>
        )}

        {isError && !isLoading && (
          <div className="rounded-2xl bg-white p-6 text-center shadow-soft">
            <p className="text-sm text-bamboo-600">We couldn&apos;t load reviews right now.</p>
            <Button variant="secondary" onClick={() => refetch()} className="mt-3 !px-4 !py-2 text-sm">
              Try Again
            </Button>
          </div>
        )}

        {!isLoading && !isError && reviews.length === 0 && (
          <div className="rounded-2xl bg-white p-8 text-center shadow-soft">
            <p className="text-sm font-medium text-bamboo-700">No reviews yet</p>
            <p className="mt-1 text-xs text-bamboo-500">Reviews appear here once they have been approved.</p>
          </div>
        )}

        {reviews.length > 0 && (
          <div
            className={`-mx-4 flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:grid lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-0 ${rowClass}`}
          >
            {reviews.map((review) => (
              <div key={review._id} className="w-[82%] shrink-0 snap-start sm:w-[46%] lg:w-auto">
                <ReviewCard
                  review={review}
                  compact
                  currentUserId={currentUserId}
                  isAuthenticated={isAuthenticated}
                  onRequireLogin={goToLogin}
                  onOpenImage={setLightboxUrl}
                />
              </div>
            ))}

            {showViewAll && (
              <Link
                to={allReviewsPath}
                aria-label="View all reviews"
                className="flex w-32 shrink-0 snap-start flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-bamboo-300 bg-white text-bamboo-600 transition-colors hover:bg-bamboo-50 lg:w-auto lg:border-0 lg:bg-transparent lg:hover:bg-transparent"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-bamboo-100 text-bamboo-700 shadow-soft transition-transform hover:scale-105">
                  <FiArrowRight size={20} />
                </span>
                <span className="text-xs font-semibold lg:hidden">View all reviews</span>
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Edit form */}
      {myReview && (
        <ReviewForm
          isOpen={editOpen}
          onClose={() => setEditOpen(false)}
          product={{ _id: product._id, name: product.name, image: product.images?.[0]?.url }}
          review={myReview}
        />
      )}

      <DeleteReviewDialog
        isOpen={deleteOpen}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />

      <ImageLightbox url={lightboxUrl} onClose={() => setLightboxUrl(null)} />
    </section>
  );
};

export default ReviewSection;