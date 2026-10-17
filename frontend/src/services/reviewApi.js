import api from './api';

export const reviewApi = {
  getProductReviews: (productId, params) => api.get(`/reviews/product/${productId}`, { params }),
  createReview: (productId, formData) =>
    api.post(`/reviews/product/${productId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateReview: (reviewId, data) => api.put(`/reviews/${reviewId}`, data),
  deleteReview: (reviewId) => api.delete(`/reviews/${reviewId}`),
  toggleHelpful: (reviewId) => api.post(`/reviews/${reviewId}/helpful`),
  // Requires the proposed GET /reviews/mine endpoint
  getMyReviews: () => api.get('/reviews/mine'),
};

export const getReviewErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  if (!error?.response) return 'Network error. Please check your connection and try again.';

  const { status, data } = error.response;
  const message = data?.message;

  if (status === 401) return 'Please log in to continue.';
  if (status === 403) return message || 'You are not eligible to review this product yet.';
  if (status === 404) return message || 'We could not find that product or review.';
  if (status === 409) return message || 'You have already reviewed this product.';
  if (status === 413) return 'One of your images is too large. Please use images under 5 MB.';
  if (status === 400 || status === 422) {
    const first = Array.isArray(data?.errors) ? data.errors[0] : null;
    const detail = typeof first === 'string' ? first : first?.message;
    return detail || message || 'Please check the details you entered.';
  }
  return message || fallback;
};