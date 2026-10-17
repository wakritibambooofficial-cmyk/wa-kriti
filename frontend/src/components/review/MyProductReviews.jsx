import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

import Button from '../ui/Button';
import EmptyState from '../ui/EmptyState';
import StarRating from './StarRating';
import ReviewForm from './ReviewForm';
import DeleteReviewDialog from './DeleteReviewDialog';
import { getReviewStatus } from './reviewStatus';
import { useMyReviews } from '../../hooks/useMyReviews';
import { reviewApi, getReviewErrorMessage } from '../../services/reviewApi';

const ORDERS_PATH = '/dashboard/orders';

const getProductInfo = (review) => {
  const p = review.product;
  if (p && typeof p === 'object') {
    return { _id: p._id, name: p.name || 'Product', slug: p.slug, image: p.images?.[0]?.url };
  }
  return { _id: p, name: 'Product', slug: null, image: null };
};

const MyProductReviews = () => {
  const queryClient = useQueryClient();
  const { reviews, isLoading, isUnavailable } = useMyReviews();
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleting || isDeleting) return;
    setIsDeleting(true);
    try {
      const productId = getProductInfo(deleting)._id;
      await reviewApi.deleteReview(deleting._id);
      toast.success('Your review has been deleted');
      setDeleting(null);
      queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['product-reviews', productId] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
    } catch (error) {
      toast.error(getReviewErrorMessage(error, 'Could not delete your review'));
      if (error?.response?.status === 404) {
        setDeleting(null);
        queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <div className="mt-5 rounded-xl bg-sand-100 px-4 py-3 text-center text-xs text-bamboo-500">
        Want to review another product? Open a delivered order in{' '}
        <Link to={ORDERS_PATH} className="font-semibold text-bamboo-700 underline underline-offset-2">
          My Orders
        </Link>
        .
      </div>

      <div className="mt-6 space-y-4">
        {isLoading &&
          [...Array(2)].map((_, i) => <div key={i} className="h-36 animate-pulse rounded-2xl bg-white shadow-soft" />)}

        {!isLoading && isUnavailable && (
          <div className="rounded-2xl bg-white p-6 text-center text-sm text-bamboo-600 shadow-soft">
            We couldn&apos;t load your product reviews right now. Please try again later.
          </div>
        )}

        {!isLoading && !isUnavailable && reviews.length === 0 && (
          <EmptyState
            title="No product reviews yet"
            message="Once an order is delivered, you can review the items from your order page."
          />
        )}

        {reviews.map((review) => {
          const product = getProductInfo(review);
          const status = getReviewStatus(review.status);
          return (
            <article key={review._id} className="rounded-2xl bg-white p-5 shadow-soft">
              <div className="flex items-start gap-3">
                {product.image && (
                  <img src={product.image} alt={product.name} className="h-14 w-14 shrink-0 rounded-lg object-cover" />
                )}
                <div className="min-w-0 flex-1">
                  {product.slug ? (
                    <Link to={`/product/${product.slug}`} className="text-sm font-semibold text-bamboo-800 hover:underline">
                      {product.name}
                    </Link>
                  ) : (
                    <p className="text-sm font-semibold text-bamboo-800">{product.name}</p>
                  )}
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <StarRating value={review.rating} readOnly size={14} />
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${status.badge}`}>
                      {status.label}
                    </span>
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
              {review.description && (
                <p className="mt-1.5 whitespace-pre-line break-words text-sm leading-relaxed text-bamboo-600">
                  {review.description}
                </p>
              )}

              {review.images?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {review.images.map((img) => (
                    <a key={img.publicId || img.url} href={img.url} target="_blank" rel="noreferrer">
                      <img src={img.url} alt="Your review" className="h-16 w-16 rounded-lg object-cover" />
                    </a>
                  ))}
                </div>
              )}

              <p className="mt-3 text-xs text-bamboo-500">{status.message}</p>

              {review.adminReply?.message && (
                <div className="mt-3 rounded-xl bg-sand-100 p-3">
                  <p className="text-xs font-semibold text-bamboo-700">Response from Wa-Kriti</p>
                  <p className="mt-1 whitespace-pre-line text-sm text-bamboo-600">{review.adminReply.message}</p>
                </div>
              )}

              <div className="mt-4 flex gap-2 border-t border-sand-200 pt-3">
                <Button variant="secondary" onClick={() => setEditing(review)} className="!px-4 !py-2 text-sm">
                  <FiEdit2 size={13} className="mr-1.5" /> Edit
                </Button>
                <Button variant="danger" onClick={() => setDeleting(review)} className="!px-4 !py-2 text-sm">
                  <FiTrash2 size={13} className="mr-1.5" /> Delete
                </Button>
              </div>
            </article>
          );
        })}
      </div>

      {createPortal(
        <>
          {editing && (
            <ReviewForm isOpen onClose={() => setEditing(null)} product={getProductInfo(editing)} review={editing} />
          )}
          <DeleteReviewDialog
            isOpen={Boolean(deleting)}
            onCancel={() => setDeleting(null)}
            onConfirm={handleDelete}
            isLoading={isDeleting}
          />
        </>,
        document.body
      )}
    </div>
  );
};

export default MyProductReviews;