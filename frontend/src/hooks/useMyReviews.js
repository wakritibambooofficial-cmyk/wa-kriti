import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';

import { reviewApi } from '../services/reviewApi';

export const useMyReviews = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const query = useQuery({
    queryKey: ['my-reviews'],
    queryFn: () => reviewApi.getMyReviews(),
    select: (res) => res.data.data.reviews,
    enabled: Boolean(isAuthenticated),
    retry: false,
    staleTime: 60 * 1000,
  });

  const reviews = query.data || [];

  const getReviewForProduct = (productId) =>
    reviews.find((r) => String(r.product?._id || r.product) === String(productId)) || null;

  return {
    reviews,
    getReviewForProduct,
    isLoading: query.isLoading,
    // true when the endpoint is missing or failed; callers fall back to backend validation (409)
    isUnavailable: query.isError,
  };
};