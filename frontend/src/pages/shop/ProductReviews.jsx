import { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { FiArrowLeft } from 'react-icons/fi';

import { productApi } from '../../services/productApi';
import { reviewApi } from '../../services/reviewApi';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import RatingSummary from '../../components/review/RatingSummary';
import ReviewCard from '../../components/review/ReviewCard';
import ImageLightbox from '../../components/review/ImageLightbox';
import { normalizeReviewsPage } from '../../components/review/reviewUtils';

const LOGIN_PATH = '/login';
const PAGE_SIZE = 10;

const ProductReviews = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const currentUserId = user?._id || user?.id;
  const [lightboxUrl, setLightboxUrl] = useState(null);

  const { data: product, isLoading: productLoading, isError: productError } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productApi.getProductBySlug(slug),
    select: (res) => res.data.data.product,
  });

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['product-reviews', product?._id, 'all'],
    enabled: Boolean(product?._id),
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const res = await reviewApi.getProductReviews(product._id, { page: pageParam, limit: PAGE_SIZE });
      return normalizeReviewsPage(res, pageParam, PAGE_SIZE);
    },
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
  });

  const goToLogin = () => {
    toast('Please log in to continue');
    navigate(LOGIN_PATH, { state: { from: location } });
  };

  if (productLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="h-40 animate-pulse rounded-2xl bg-sand-200" />
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <EmptyState
          title="Product Not Found"
          message="This product may have been removed or the link is incorrect."
          actionLabel="Continue Shopping"
          actionTo="/shop"
        />
      </div>
    );
  }

  const reviews = data?.pages.flatMap((p) => p.reviews) || [];
  const distribution = data?.pages[0]?.ratingDistribution || {};

  return (
    <div className="min-h-screen bg-sand-100 pb-20">
      <Helmet><title>Reviews for {product.name}</title></Helmet>

      <div className="mx-auto max-w-3xl px-4 py-8">
        <Link
          to={`/product/${product.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-bamboo-600 hover:underline"
        >
          <FiArrowLeft size={14} /> Back to product
        </Link>

        <div className="mt-4 flex items-center gap-3">
          {product.images?.[0]?.url && (
            <img src={product.images[0].url} alt={product.name} className="h-14 w-14 rounded-lg object-cover" />
          )}
          <div className="min-w-0">
            <h1 className="font-display text-xl font-bold text-bamboo-800 sm:text-2xl">Customer Reviews</h1>
            <p className="truncate text-sm text-bamboo-500">{product.name}</p>
          </div>
        </div>

        <div className="mt-5">
          <RatingSummary
            average={Number(product.ratingsAverage) || 0}
            count={product.ratingsCount || 0}
            distribution={distribution}
          />
        </div>

        <div className="mt-6 space-y-4">
          {isLoading && (
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 animate-pulse rounded-2xl bg-sand-200" />
              ))}
            </>
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
            </div>
          )}

          {reviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              currentUserId={currentUserId}
              isAuthenticated={isAuthenticated}
              onRequireLogin={goToLogin}
              onOpenImage={setLightboxUrl}
            />
          ))}

          {hasNextPage && (
            <div className="pt-2 text-center">
              <Button
                variant="secondary"
                onClick={() => fetchNextPage()}
                isLoading={isFetchingNextPage}
                className="!px-6 !py-2 text-sm"
              >
                Load More Reviews
              </Button>
            </div>
          )}
        </div>
      </div>

      <ImageLightbox url={lightboxUrl} onClose={() => setLightboxUrl(null)} />
    </div>
  );
};

export default ProductReviews;