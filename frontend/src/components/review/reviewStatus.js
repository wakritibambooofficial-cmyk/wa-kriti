export const REVIEW_STATUS = {
  pending: {
    label: 'Pending approval',
    badge: 'bg-amber-100 text-amber-700',
    message: 'Your review is waiting for approval. It will appear on the product page once approved.',
  },
  approved: {
    label: 'Published',
    badge: 'bg-bamboo-100 text-bamboo-700',
    message: 'Your review is live on the product page.',
  },
  rejected: {
    label: 'Not approved',
    badge: 'bg-red-100 text-red-600',
    message: 'Your review was not approved. You can edit it and it will be reviewed again.',
  },
  hidden: {
    label: 'Hidden',
    badge: 'bg-sand-200 text-bamboo-600',
    message: 'Your review is currently hidden from the product page.',
  },
};

export const getReviewStatus = (status) => REVIEW_STATUS[status] || REVIEW_STATUS.pending;