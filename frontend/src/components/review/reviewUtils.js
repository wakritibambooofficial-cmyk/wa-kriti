export const normalizeReviewsPage = (res, pageParam, limit) => {
  const body = res.data;
  const meta = body.meta || body.pagination || {};
  const reviews = body.data?.reviews || [];
  const page = meta.page || pageParam;
  return {
    reviews,
    ratingDistribution: body.data?.ratingDistribution || {},
    page,
    total: meta.total,
    hasMore: meta.totalPages ? page < meta.totalPages : reviews.length === limit,
  };
};