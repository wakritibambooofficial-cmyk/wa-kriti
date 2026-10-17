import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FiImage, FiX } from 'react-icons/fi';

import Button from '../ui/Button';
import StarRating from './StarRating';
import { reviewApi, getReviewErrorMessage } from '../../services/reviewApi';

const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const TITLE_MAX = 100;
const DESCRIPTION_MAX = 1000;

const inputClass =
  'w-full rounded-xl border border-sand-400 bg-white px-3 py-2.5 text-sm text-bamboo-800 placeholder:text-bamboo-300 focus:border-bamboo-500 focus:outline-none focus:ring-1 focus:ring-bamboo-500';

/**
 * product: { _id, name, image }
 * review:  existing review object (edit mode) or null (create mode)
 */
const ReviewForm = ({ isOpen, onClose, product, review = null, onSuccess }) => {
  const isEdit = Boolean(review);
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]); // [{ file, previewUrl }]
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filesRef = useRef([]);
  filesRef.current = files;

  // Reset the form each time it opens (or switches to another review)
  useEffect(() => {
    if (!isOpen) return;
    filesRef.current.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    setRating(review?.rating || 0);
    setTitle(review?.title || '');
    setDescription(review?.description || '');
    setFiles([]);
    setErrors({});
    setApiError('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, review?._id]);

  // Revoke preview URLs on unmount
  useEffect(
    () => () => {
      filesRef.current.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    },
    []
  );

  // Escape to close + lock body scroll
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && !isSubmitting) onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    e.target.value = '';
    if (!selected.length) return;

    const problems = [];
    const accepted = [];
    selected.forEach((file) => {
      if (!file.type.startsWith('image/')) problems.push(`${file.name} is not an image.`);
      else if (file.size > MAX_IMAGE_SIZE) problems.push(`${file.name} is larger than 5 MB.`);
      else accepted.push({ file, previewUrl: URL.createObjectURL(file) });
    });

    const room = MAX_IMAGES - files.length;
    if (accepted.length > room) {
      accepted.slice(room).forEach((a) => URL.revokeObjectURL(a.previewUrl));
      problems.push(`You can upload up to ${MAX_IMAGES} images.`);
    }

    setFiles((prev) => [...prev, ...accepted.slice(0, Math.max(room, 0))]);
    setErrors((prev) => ({ ...prev, images: problems[0] || '' }));
  };

  const removeFile = (index) => {
    setFiles((prev) => {
      const target = prev[index];
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
    setErrors((prev) => ({ ...prev, images: '' }));
  };

  const validate = () => {
    const next = {};
    if (!rating || rating < 1 || rating > 5) next.rating = 'Please select a rating from 1 to 5 stars.';
    if (title.length > TITLE_MAX) next.title = `Title can be at most ${TITLE_MAX} characters.`;
    if (description.length > DESCRIPTION_MAX) next.description = `Review can be at most ${DESCRIPTION_MAX} characters.`;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setApiError('');
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (isEdit) {
        await reviewApi.updateReview(review._id, {
          rating,
          title: title.trim(),
          description: description.trim(),
        });
        toast.success('Your review has been updated and is waiting for approval.');
      } else {
        const formData = new FormData();
        formData.append('rating', String(rating));
        formData.append('title', title.trim());
        formData.append('description', description.trim());
        files.forEach((f) => formData.append('images', f.file));
        await reviewApi.createReview(product._id, formData);
        toast.success('Thanks! Your review was submitted and will appear once it is approved.');
      }

      queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['product-reviews', product._id] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
      onSuccess?.();
      onClose();
    } catch (error) {
      const message = getReviewErrorMessage(error);
      setApiError(message);
      toast.error(message);
      if (error?.response?.status === 409) {
        queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-form-title"
    >
      <div className="absolute inset-0 bg-black/50" onClick={isSubmitting ? undefined : onClose} />

      <form
        onSubmit={handleSubmit}
        noValidate
        className="relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-soft sm:max-w-lg sm:rounded-2xl"
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-sand-300 px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            {product.image && (
              <img src={product.image} alt={product.name} className="h-12 w-12 shrink-0 rounded-lg object-cover" />
            )}
            <div className="min-w-0">
              <h2 id="review-form-title" className="font-display text-lg font-semibold text-bamboo-800">
                {isEdit ? 'Edit Your Review' : 'Write a Review'}
              </h2>
              <p className="truncate text-xs text-bamboo-500">{product.name}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close"
            className="rounded-full p-1.5 text-bamboo-500 hover:bg-sand-100"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
          {apiError && (
            <div role="alert" className="rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-600">
              {apiError}
            </div>
          )}

          {isEdit && (
            <div className="rounded-xl bg-amber-50 px-3 py-2.5 text-xs text-amber-700">
              After you save, your review goes back to pending and will be shown again once it is approved.
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-bamboo-700">
              Your rating <span className="text-red-500">*</span>
            </label>
            <StarRating
              value={rating}
              onChange={(v) => {
                setRating(v);
                setErrors((prev) => ({ ...prev, rating: '' }));
              }}
              size={28}
              showLabel
            />
            {errors.rating && <p className="mt-1 text-xs text-red-500">{errors.rating}</p>}
          </div>

          <div>
            <label htmlFor="review-title" className="mb-1.5 block text-sm font-medium text-bamboo-700">
              Review title
            </label>
            <input
              id="review-title"
              type="text"
              value={title}
              maxLength={TITLE_MAX}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Great quality"
              className={inputClass}
            />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="review-description" className="mb-1.5 block text-sm font-medium text-bamboo-700">
              Your review
            </label>
            <textarea
              id="review-description"
              rows={4}
              value={description}
              maxLength={DESCRIPTION_MAX}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell others what you liked about this product."
              className={inputClass}
            />
            <div className="mt-1 flex justify-between text-xs">
              <span className="text-red-500">{errors.description || ''}</span>
              <span className="text-bamboo-400">
                {description.length}/{DESCRIPTION_MAX}
              </span>
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Photos (optional)</label>

            {isEdit ? (
              <div>
                {review.images?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {review.images.map((img) => (
                      <img
                        key={img.publicId || img.url}
                        src={img.url}
                        alt="Review"
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-bamboo-400">No photos on this review.</p>
                )}
                <p className="mt-2 text-xs text-bamboo-400">
                  Photos can&apos;t be changed while editing. To use different photos, delete this review and submit a
                  new one.
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap gap-2">
                  {files.map((f, index) => (
                    <div key={f.previewUrl} className="relative h-16 w-16">
                      <img src={f.previewUrl} alt="Selected" className="h-16 w-16 rounded-lg object-cover" />
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        aria-label="Remove image"
                        className="absolute -right-1.5 -top-1.5 rounded-full bg-red-500 p-0.5 text-white"
                      >
                        <FiX size={12} />
                      </button>
                    </div>
                  ))}
                  {files.length < MAX_IMAGES && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex h-16 w-16 flex-col items-center justify-center rounded-lg border border-dashed border-sand-400 text-bamboo-400 hover:bg-sand-100"
                    >
                      <FiImage size={18} />
                      <span className="mt-0.5 text-[10px]">Add</span>
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
                <p className="mt-1.5 text-xs text-bamboo-400">Up to {MAX_IMAGES} images, 5 MB each.</p>
                {errors.images && <p className="mt-1 text-xs text-red-500">{errors.images}</p>}
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 justify-end gap-2 border-t border-sand-300 px-5 py-3">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting} className="!px-4 !py-2 text-sm">
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting} className="!px-5 !py-2 text-sm">
            {isEdit ? 'Save Changes' : 'Submit Review'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;