// import { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import toast from 'react-hot-toast';
// import { FiStar, FiEdit2, FiTrash2, FiPlus, FiX, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';

// import { testimonialApi } from '../../services/testimonialApi';
// import Button from '../../components/ui/Button';
// import EmptyState from '../../components/ui/EmptyState';

// const MAX_TESTIMONIALS = 2;

// const STATUS_META = {
//   pending: { label: 'Pending Review', icon: FiClock, className: 'bg-amber-50 text-amber-600' },
//   approved: { label: 'Published', icon: FiCheckCircle, className: 'bg-emerald-50 text-emerald-600' },
//   rejected: { label: 'Not Approved', icon: FiXCircle, className: 'bg-red-50 text-red-500' },
// };

// const StatusBadge = ({ status }) => {
//   const meta = STATUS_META[status] || STATUS_META.pending;
//   const Icon = meta.icon;
//   return (
//     <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${meta.className}`}>
//       <Icon size={12} /> {meta.label}
//     </span>
//   );
// };

// const InteractiveStarRow = ({ rating, onChange }) => (
//   <div className="flex items-center gap-1">
//     {[1, 2, 3, 4, 5].map((n) => (
//       <button
//         key={n}
//         type="button"
//         onClick={() => onChange(n)}
//         aria-label={`${n} star${n > 1 ? 's' : ''}`}
//         className="p-0.5 transition-transform hover:scale-110"
//       >
//         <FiStar size={22} className={n <= rating ? 'fill-earth-500 text-earth-500' : 'text-sand-300'} />
//       </button>
//     ))}
//   </div>
// );

// const StarRow = ({ rating }) => (
//   <div className="flex items-center gap-0.5">
//     {[...Array(5)].map((_, i) => (
//       <FiStar key={i} size={13} className={i < rating ? 'fill-earth-500 text-earth-500' : 'text-sand-300'} />
//     ))}
//   </div>
// );

// const TestimonialForm = ({ initialData, onClose }) => {
//   const queryClient = useQueryClient();
//   const isEditing = Boolean(initialData);
//   const [rating, setRating] = useState(initialData?.rating || 5);
//   const [text, setText] = useState(initialData?.text || '');
//   const [location, setLocation] = useState(initialData?.location || '');

//   const { mutate, isPending } = useMutation({
//     mutationFn: () =>
//       isEditing
//         ? testimonialApi.updateTestimonial(initialData._id, { rating, text, location })
//         : testimonialApi.submitTestimonial({ rating, text, location }),
//     onSuccess: (res) => {
//       toast.success(res.data.message || (isEditing ? 'Review updated' : 'Review submitted'));
//       queryClient.invalidateQueries({ queryKey: ['my-testimonials'] });
//       onClose();
//     },
//     onError: (error) => {
//       toast.error(error?.response?.data?.message || 'Something went wrong');
//     },
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!text.trim()) {
//       toast.error('Please write a few words about your experience');
//       return;
//     }
//     mutate();
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, height: 0 }}
//       animate={{ opacity: 1, height: 'auto' }}
//       exit={{ opacity: 0, height: 0 }}
//       transition={{ duration: 0.25 }}
//       className="overflow-hidden"
//     >
//       <form onSubmit={handleSubmit} className="mt-4 rounded-2xl border border-sand-200 bg-white p-5 shadow-soft">
//         <div className="flex items-center justify-between">
//           <h3 className="font-display text-base font-semibold text-bamboo-800">
//             {isEditing ? 'Edit Review' : 'Write a Review'}
//           </h3>
//           <button
//             type="button"
//             onClick={onClose}
//             aria-label="Close"
//             className="flex h-7 w-7 items-center justify-center rounded-full text-bamboo-400 hover:bg-sand-100"
//           >
//             <FiX size={16} />
//           </button>
//         </div>

//         <div className="mt-4">
//           <label className="mb-1.5 block text-xs font-medium text-bamboo-600">Your Rating</label>
//           <InteractiveStarRow rating={rating} onChange={setRating} />
//         </div>

//         <div className="mt-4">
//           <label className="mb-1.5 block text-xs font-medium text-bamboo-600">Your Review</label>
//           <textarea
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//             maxLength={500}
//             rows={4}
//             placeholder="Tell us what you loved about your Wa-Kriti product..."
//             className="input-field text-sm"
//           />
//           <p className="mt-1 text-right text-[11px] text-bamboo-400">{text.length}/500</p>
//         </div>

//         <div className="mt-3">
//           <label className="mb-1.5 block text-xs font-medium text-bamboo-600">City (optional)</label>
//           <input
//             value={location}
//             onChange={(e) => setLocation(e.target.value)}
//             placeholder="e.g. Bengaluru"
//             className="input-field text-sm"
//           />
//         </div>

//         <Button type="submit" isLoading={isPending} fullWidth className="mt-5 !py-2.5 text-sm">
//           {isEditing ? 'Save Changes' : 'Submit Review'}
//         </Button>
//         {isEditing && (
//           <p className="mt-2 text-center text-[11px] text-bamboo-400">
//             Editing sends this review back for re-approval.
//           </p>
//         )}
//       </form>
//     </motion.div>
//   );
// };

// const TestimonialItem = ({ testimonial, onEdit, onDelete }) => (
//   <div className="rounded-2xl bg-white p-5 shadow-soft">
//     <div className="flex items-start justify-between gap-3">
//       <StarRow rating={testimonial.rating} />
//       <StatusBadge status={testimonial.status} />
//     </div>
//     <p className="mt-3 text-sm leading-relaxed text-bamboo-700">{testimonial.text}</p>
//     {testimonial.location && <p className="mt-2 text-xs text-bamboo-400">{testimonial.location}</p>}

//     {testimonial.status === 'rejected' && (
//       <p className="mt-2 text-xs text-red-500">
//         This review was not approved for publishing. You can edit and resubmit it.
//       </p>
//     )}

//     <div className="mt-4 flex gap-2 border-t border-sand-200 pt-3">
//       <button
//         onClick={() => onEdit(testimonial)}
//         className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-bamboo-600 hover:bg-sand-100"
//       >
//         <FiEdit2 size={13} /> Edit
//       </button>
//       <button
//         onClick={() => onDelete(testimonial)}
//         className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50"
//       >
//         <FiTrash2 size={13} /> Delete
//       </button>
//     </div>
//   </div>
// );

// const MyTestimonials = () => {
//   const queryClient = useQueryClient();
//   const [formMode, setFormMode] = useState(null); // null | 'new' | testimonial object being edited

//   const { data: testimonials = [], isLoading } = useQuery({
//     queryKey: ['my-testimonials'],
//     queryFn: () => testimonialApi.getMyTestimonials(),
//     select: (res) => res.data.data.testimonials,
//   });

//   const { mutate: deleteTestimonial } = useMutation({
//     mutationFn: (id) => testimonialApi.deleteTestimonial(id),
//     onSuccess: () => {
//       toast.success('Review deleted');
//       queryClient.invalidateQueries({ queryKey: ['my-testimonials'] });
//     },
//     onError: (error) => {
//       toast.error(error?.response?.data?.message || 'Could not delete review');
//     },
//   });

//   const handleDelete = (testimonial) => {
//     if (window.confirm('Delete this review? This cannot be undone.')) {
//       deleteTestimonial(testimonial._id);
//     }
//   };

//   const activeCount = testimonials.filter((t) => t.status !== 'rejected').length;
//   const canAddMore = activeCount < MAX_TESTIMONIALS;

//   return (
//     <div className="mx-auto max-w-2xl px-4 py-10 sm:py-12">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="font-display text-2xl font-semibold text-bamboo-800">My Reviews</h1>
//           <p className="mt-1 text-sm text-bamboo-500">
//             Share your experience with Wa-Kriti. You can have up to {MAX_TESTIMONIALS} reviews at a time.
//           </p>
//         </div>
//       </div>

//       {canAddMore && formMode !== 'new' && (
//         <button
//           onClick={() => setFormMode('new')}
//           className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-bamboo-300 py-4 text-sm font-semibold text-bamboo-600 transition-colors hover:bg-bamboo-50"
//         >
//           <FiPlus size={16} /> Write a Review
//         </button>
//       )}

//       {!canAddMore && (
//         <div className="mt-5 rounded-xl bg-sand-100 px-4 py-3 text-center text-xs text-bamboo-500">
//           You have reached the limit of {MAX_TESTIMONIALS} reviews. Delete one to add a new review.
//         </div>
//       )}

//       <AnimatePresence>
//         {formMode === 'new' && <TestimonialForm onClose={() => setFormMode(null)} />}
//         {formMode && formMode !== 'new' && (
//           <TestimonialForm initialData={formMode} onClose={() => setFormMode(null)} />
//         )}
//       </AnimatePresence>

//       <div className="mt-6 space-y-4">
//         {isLoading ? (
//           [...Array(2)].map((_, i) => <div key={i} className="h-32 animate-pulse rounded-2xl bg-white shadow-soft" />)
//         ) : testimonials.length === 0 ? (
//           <EmptyState
//             title="No reviews yet"
//             message="Share your experience with Wa-Kriti and it may be featured on our homepage."
//           />
//         ) : (
//           testimonials.map((t) => (
//             <TestimonialItem key={t._id} testimonial={t} onEdit={setFormMode} onDelete={handleDelete} />
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default MyTestimonials;



import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence, useAnimation, useDragControls } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FiStar, FiEdit2, FiTrash2, FiPlus, FiX, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';

import { testimonialApi } from '../../services/testimonialApi';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import MyProductReviews from '../../components/review/MyProductReviews';
import { useMyReviews } from '../../hooks/useMyReviews';

const MAX_TESTIMONIALS = 2;

const TABS = [
  { key: 'testimonials', label: 'Testimonials' },
  { key: 'products', label: 'Product Reviews' },
];

const SUBTITLES = {
  testimonials: `Share your experience with Wa-Kriti. You can have up to ${MAX_TESTIMONIALS} reviews at a time.`,
  products: 'Reviews you wrote for products you bought. They appear on the product page once approved.',
};

const STATUS_META = {
  pending: { label: 'Pending Review', icon: FiClock, className: 'bg-amber-50 text-amber-600' },
  approved: { label: 'Published', icon: FiCheckCircle, className: 'bg-emerald-50 text-emerald-600' },
  rejected: { label: 'Not Approved', icon: FiXCircle, className: 'bg-red-50 text-red-500' },
};

const StatusBadge = ({ status }) => {
  const meta = STATUS_META[status] || STATUS_META.pending;
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${meta.className}`}>
      <Icon size={12} /> {meta.label}
    </span>
  );
};

const InteractiveStarRow = ({ rating, onChange }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        onClick={() => onChange(n)}
        aria-label={`${n} star${n > 1 ? 's' : ''}`}
        className="p-0.5 transition-transform hover:scale-110"
      >
        <FiStar size={22} className={n <= rating ? 'fill-earth-500 text-earth-500' : 'text-sand-300'} />
      </button>
    ))}
  </div>
);

const StarRow = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <FiStar key={i} size={13} className={i < rating ? 'fill-earth-500 text-earth-500' : 'text-sand-300'} />
    ))}
  </div>
);

const TestimonialForm = ({ initialData, onClose }) => {
  const queryClient = useQueryClient();
  const isEditing = Boolean(initialData);
  const [rating, setRating] = useState(initialData?.rating || 5);
  const [text, setText] = useState(initialData?.text || '');
  const [location, setLocation] = useState(initialData?.location || '');

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      isEditing
        ? testimonialApi.updateTestimonial(initialData._id, { rating, text, location })
        : testimonialApi.submitTestimonial({ rating, text, location }),
    onSuccess: (res) => {
      toast.success(res.data.message || (isEditing ? 'Review updated' : 'Review submitted'));
      queryClient.invalidateQueries({ queryKey: ['my-testimonials'] });
      onClose();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) {
      toast.error('Please write a few words about your experience');
      return;
    }
    mutate();
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25 }}
      className="overflow-hidden"
    >
      <form onSubmit={handleSubmit} className="mt-4 rounded-2xl border border-sand-200 bg-white p-5 shadow-soft">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base font-semibold text-bamboo-800">
            {isEditing ? 'Edit Review' : 'Write a Review'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-7 w-7 items-center justify-center rounded-full text-bamboo-400 hover:bg-sand-100"
          >
            <FiX size={16} />
          </button>
        </div>

        <div className="mt-4">
          <label className="mb-1.5 block text-xs font-medium text-bamboo-600">Your Rating</label>
          <InteractiveStarRow rating={rating} onChange={setRating} />
        </div>

        <div className="mt-4">
          <label className="mb-1.5 block text-xs font-medium text-bamboo-600">Your Review</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={500}
            rows={4}
            placeholder="Tell us what you loved about your Wa-Kriti product..."
            className="input-field text-sm"
          />
          <p className="mt-1 text-right text-[11px] text-bamboo-400">{text.length}/500</p>
        </div>

        <div className="mt-3">
          <label className="mb-1.5 block text-xs font-medium text-bamboo-600">City (optional)</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Bengaluru"
            className="input-field text-sm"
          />
        </div>

        <Button type="submit" isLoading={isPending} fullWidth className="mt-5 !py-2.5 text-sm">
          {isEditing ? 'Save Changes' : 'Submit Review'}
        </Button>
        {isEditing && (
          <p className="mt-2 text-center text-[11px] text-bamboo-400">
            Editing sends this review back for re-approval.
          </p>
        )}
      </form>
    </motion.div>
  );
};

const TestimonialItem = ({ testimonial, onEdit, onDelete }) => (
  <div className="rounded-2xl bg-white p-5 shadow-soft">
    <div className="flex items-start justify-between gap-3">
      <StarRow rating={testimonial.rating} />
      <StatusBadge status={testimonial.status} />
    </div>
    <p className="mt-3 text-sm leading-relaxed text-bamboo-700">{testimonial.text}</p>
    {testimonial.location && <p className="mt-2 text-xs text-bamboo-400">{testimonial.location}</p>}

    {testimonial.status === 'rejected' && (
      <p className="mt-2 text-xs text-red-500">
        This review was not approved for publishing. You can edit and resubmit it.
      </p>
    )}

    <div className="mt-4 flex gap-2 border-t border-sand-200 pt-3">
      <button
        onClick={() => onEdit(testimonial)}
        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-bamboo-600 hover:bg-sand-100"
      >
        <FiEdit2 size={13} /> Edit
      </button>
      <button
        onClick={() => onDelete(testimonial)}
        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50"
      >
        <FiTrash2 size={13} /> Delete
      </button>
    </div>
  </div>
);

const MyTestimonials = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get('tab') === 'products' ? 'products' : 'testimonials');
  const [formMode, setFormMode] = useState(null); // null | 'new' | testimonial object being edited

  const panelControls = useAnimation();
  const dragControls = useDragControls();
  const directionRef = useRef(1);
  const isFirstRender = useRef(true);

  const { reviews: productReviews } = useMyReviews();

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ['my-testimonials'],
    queryFn: () => testimonialApi.getMyTestimonials(),
    select: (res) => res.data.data.testimonials,
  });

  const { mutate: deleteTestimonial } = useMutation({
    mutationFn: (id) => testimonialApi.deleteTestimonial(id),
    onSuccess: () => {
      toast.success('Review deleted');
      queryClient.invalidateQueries({ queryKey: ['my-testimonials'] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Could not delete review');
    },
  });

  const handleDelete = (testimonial) => {
    if (window.confirm('Delete this review? This cannot be undone.')) {
      deleteTestimonial(testimonial._id);
    }
  };

  const changeTab = (next) => {
    if (next === tab) return;
    directionRef.current =
      TABS.findIndex((t) => t.key === next) > TABS.findIndex((t) => t.key === tab) ? 1 : -1;
    setTab(next);
    setSearchParams(next === 'testimonials' ? {} : { tab: next }, { replace: true });
  };

  // Slide-in animation for the newly active panel
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    panelControls.start({
      x: [directionRef.current * 40, 0],
      opacity: [0, 1],
      transition: { duration: 0.25, ease: 'easeOut' },
    });
  }, [tab, panelControls]);

  // Swipe between tabs (touch only, and never when starting on form controls or dialogs)
  const handlePointerDown = (e) => {
    if (e.pointerType !== 'touch') return;
    if (e.target.closest('input, textarea, button, a, select, [role="dialog"], [role="alertdialog"]')) return;
    dragControls.start(e);
  };

  const handleDragEnd = (_, info) => {
    const isSwipe = Math.abs(info.offset.x) > 80 || Math.abs(info.velocity.x) > 500;
    if (!isSwipe) return;
    if (info.offset.x < 0 && tab === 'testimonials') changeTab('products');
    else if (info.offset.x > 0 && tab === 'products') changeTab('testimonials');
  };

  const activeCount = testimonials.filter((t) => t.status !== 'rejected').length;
  const canAddMore = activeCount < MAX_TESTIMONIALS;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-bamboo-800">My Reviews</h1>
          <p className="mt-1 text-sm text-bamboo-500">{SUBTITLES[tab]}</p>
        </div>
      </div>

      {/* Tab switcher */}
      <div role="tablist" aria-label="Review type" className="mt-5 flex rounded-2xl bg-sand-100 p-1">
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => changeTab(t.key)}
              className={`relative flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                active ? 'text-bamboo-800' : 'text-bamboo-500 hover:text-bamboo-700'
              }`}
            >
              {active && (
                <motion.span
                  layoutId="my-reviews-tab-pill"
                  className="absolute inset-0 rounded-xl bg-white shadow-soft"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative z-10 inline-flex items-center justify-center gap-1.5">
                {t.label}
                {t.key === 'products' && productReviews.length > 0 && (
                  <span className="rounded-full bg-bamboo-100 px-1.5 text-[11px] font-semibold text-bamboo-700">
                    {productReviews.length}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Swipe area */}
      <motion.div
        drag="x"
        dragControls={dragControls}
        dragListener={false}
        dragDirectionLock
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        dragSnapToOrigin
        onDragEnd={handleDragEnd}
        onPointerDown={handlePointerDown}
        style={{ touchAction: 'pan-y' }}
      >
        {/* Testimonials panel */}
        <motion.div initial={false} animate={panelControls} className={tab === 'testimonials' ? '' : 'hidden'}>
          {canAddMore && formMode !== 'new' && (
            <button
              onClick={() => setFormMode('new')}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-bamboo-300 py-4 text-sm font-semibold text-bamboo-600 transition-colors hover:bg-bamboo-50"
            >
              <FiPlus size={16} /> Write a Review
            </button>
          )}

          {!canAddMore && (
            <div className="mt-5 rounded-xl bg-sand-100 px-4 py-3 text-center text-xs text-bamboo-500">
              You have reached the limit of {MAX_TESTIMONIALS} reviews. Delete one to add a new review.
            </div>
          )}

          <AnimatePresence>
            {formMode === 'new' && <TestimonialForm onClose={() => setFormMode(null)} />}
            {formMode && formMode !== 'new' && (
              <TestimonialForm initialData={formMode} onClose={() => setFormMode(null)} />
            )}
          </AnimatePresence>

          <div className="mt-6 space-y-4">
            {isLoading ? (
              [...Array(2)].map((_, i) => <div key={i} className="h-32 animate-pulse rounded-2xl bg-white shadow-soft" />)
            ) : testimonials.length === 0 ? (
              <EmptyState
                title="No reviews yet"
                message="Share your experience with Wa-Kriti and it may be featured on our homepage."
              />
            ) : (
              testimonials.map((t) => (
                <TestimonialItem key={t._id} testimonial={t} onEdit={setFormMode} onDelete={handleDelete} />
              ))
            )}
          </div>
        </motion.div>

        {/* Product reviews panel */}
        <motion.div initial={false} animate={panelControls} className={tab === 'products' ? '' : 'hidden'}>
          <MyProductReviews />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MyTestimonials;