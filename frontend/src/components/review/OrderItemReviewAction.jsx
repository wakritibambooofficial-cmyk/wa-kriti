import { useState } from 'react';
import { useSelector } from 'react-redux';
import { FiCheckCircle, FiEdit2, FiStar } from 'react-icons/fi';

import Button from '../ui/Button';
import ReviewForm from './ReviewForm';
import { useMyReviews } from '../../hooks/useMyReviews';
import { getReviewStatus } from './reviewStatus';

const CLOSED_STATUSES = ['cancelled', 'returned', 'refunded'];

/**
 * Shows the right review action for one order item.
 * order: order object (uses orderStatus), item: order item (uses product, name, image)
 * The backend remains the final authority: it decides verified-purchase and rejects duplicates.
 */
const OrderItemReviewAction = ({ order, item }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { getReviewForProduct, isLoading } = useMyReviews();
  const [open, setOpen] = useState(false);

  const productId = item.product?._id || item.product;
  if (!isAuthenticated || !productId) return null;

  if (CLOSED_STATUSES.includes(order.orderStatus)) return null;

  if (order.orderStatus !== 'delivered') {
    return <p className="text-xs text-bamboo-400">You can review this item once it has been delivered.</p>;
  }

  if (isLoading) {
    return <div className="h-8 w-32 animate-pulse rounded-lg bg-sand-200" />;
  }

  const existing = getReviewForProduct(productId);
  const formProduct = { _id: productId, name: item.name, image: item.image };

  if (existing) {
    const status = getReviewStatus(existing.status);
    return (
      <>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 text-sm font-medium text-bamboo-700">
            <FiCheckCircle size={14} /> Review Submitted
          </span>
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${status.badge}`}>{status.label}</span>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-1 text-xs font-medium text-bamboo-600 underline-offset-2 hover:underline"
          >
            <FiEdit2 size={12} /> Edit
          </button>
        </div>
        <ReviewForm isOpen={open} onClose={() => setOpen(false)} product={formProduct} review={existing} />
      </>
    );
  }

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)} className="!px-4 !py-1.5 text-sm">
        <FiStar size={13} className="mr-1.5" /> Write a Review
      </Button>
      <ReviewForm isOpen={open} onClose={() => setOpen(false)} product={formProduct} />
    </>
  );
};

export default OrderItemReviewAction;