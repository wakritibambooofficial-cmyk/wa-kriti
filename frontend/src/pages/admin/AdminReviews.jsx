// import { useState } from 'react';
// import { useQuery, useQueryClient } from '@tanstack/react-query';
// import { Helmet } from 'react-helmet-async';
// import toast from 'react-hot-toast';
// import { adminReviewApi } from '../../services/adminApi';

// const AdminReviews = () => {
//   const queryClient = useQueryClient();
//   const [statusFilter, setStatusFilter] = useState('pending');

//   const { data: reviews, isLoading } = useQuery({
//     queryKey: ['admin-reviews', statusFilter],
//     queryFn: () => adminReviewApi.getAll({ status: statusFilter || undefined }),
//     select: (res) => res.data.data.reviews,
//   });

//   const handleUpdateStatus = async (id, status) => {
//     try {
//       await adminReviewApi.updateStatus(id, status);
//       toast.success(`Review ${status}`);
//       queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
//     } catch (error) {
//       toast.error(error?.response?.data?.message || 'Could not update review');
//     }
//   };

//   const handleDelete = async (id) => {
//     await adminReviewApi.delete(id);
//     toast.success('Review deleted');
//     queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
//   };

//   return (
//     <div className="px-6 py-8">
//       <Helmet><title>Manage Reviews</title></Helmet>
//       <h1 className="font-display text-2xl font-bold text-bamboo-800">Reviews</h1>

//       <div className="mt-5 flex gap-2">
//         {['pending', 'approved', 'rejected', 'hidden', ''].map((s) => (
//           <button
//             key={s || 'all'}
//             onClick={() => setStatusFilter(s)}
//             className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize ${statusFilter === s ? 'bg-bamboo-600 text-white' : 'bg-white text-bamboo-600'}`}
//           >
//             {s || 'All'}
//           </button>
//         ))}
//       </div>

//       <div className="mt-6 space-y-4">
//         {isLoading ? (
//           <p className="text-bamboo-400">Loading...</p>
//         ) : !reviews?.length ? (
//           <p className="text-bamboo-400">No reviews found</p>
//         ) : (
//           reviews.map((r) => (
//             <div key={r._id} className="card p-5">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="font-medium text-bamboo-800">{r.product?.name}</p>
//                   <p className="text-xs text-bamboo-400">by {r.user?.firstName} {r.user?.lastName} · ★ {r.rating}</p>
//                 </div>
//                 <span className="rounded-full bg-sand-200 px-2.5 py-1 text-xs font-semibold capitalize text-bamboo-600">{r.status}</span>
//               </div>
//               {r.title && <p className="mt-2 text-sm font-medium text-bamboo-700">{r.title}</p>}
//               <p className="mt-1 text-sm text-bamboo-600">{r.description}</p>

//               <div className="mt-3 flex gap-3 text-xs font-semibold">
//                 {r.status !== 'approved' && (
//                   <button onClick={() => handleUpdateStatus(r._id, 'approved')} className="text-green-600 hover:underline">Approve</button>
//                 )}
//                 {r.status !== 'rejected' && (
//                   <button onClick={() => handleUpdateStatus(r._id, 'rejected')} className="text-orange-500 hover:underline">Reject</button>
//                 )}
//                 <button onClick={() => handleDelete(r._id)} className="text-red-500 hover:underline">Delete</button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminReviews;



import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { FiCheckCircle, FiX } from 'react-icons/fi';
import { adminReviewApi } from '../../services/adminApi';

const AdminReviews = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('pending');
  const [lightboxUrl, setLightboxUrl] = useState(null);

  const { data: reviews, isLoading } = useQuery({
    queryKey: ['admin-reviews', statusFilter],
    queryFn: () => adminReviewApi.getAll({ status: statusFilter || undefined }),
    select: (res) => res.data.data.reviews,
  });

  const handleUpdateStatus = async (id, status) => {
    try {
      await adminReviewApi.updateStatus(id, status);
      toast.success(`Review ${status}`);
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not update review');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review permanently? This cannot be undone.')) return;
    try {
      await adminReviewApi.delete(id);
      toast.success('Review deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not delete review');
    }
  };

  return (
    <div className="px-6 py-8">
      <Helmet><title>Manage Reviews</title></Helmet>
      <h1 className="font-display text-2xl font-bold text-bamboo-800">Reviews</h1>

      <div className="mt-5 flex flex-wrap gap-2">
        {['pending', 'approved', 'rejected', 'hidden', ''].map((s) => (
          <button
            key={s || 'all'}
            onClick={() => setStatusFilter(s)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize ${statusFilter === s ? 'bg-bamboo-600 text-white' : 'bg-white text-bamboo-600'}`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {isLoading ? (
          <p className="text-bamboo-400">Loading...</p>
        ) : !reviews?.length ? (
          <p className="text-bamboo-400">No reviews found</p>
        ) : (
          reviews.map((r) => (
            <div key={r._id} className="card p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-bamboo-800">{r.product?.name}</p>
                  <p className="text-xs text-bamboo-400">
                    by {r.user?.firstName} {r.user?.lastName}
                    {r.user?.email ? ` (${r.user.email})` : ''} · ★ {r.rating}
                  </p>
                  {r.isVerifiedPurchase && (
                    <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-bamboo-100 px-2 py-0.5 text-[11px] font-semibold text-bamboo-700">
                      <FiCheckCircle size={11} /> Verified Purchase
                    </span>
                  )}
                </div>
                <span className="shrink-0 rounded-full bg-sand-200 px-2.5 py-1 text-xs font-semibold capitalize text-bamboo-600">{r.status}</span>
              </div>
              {r.title && <p className="mt-2 text-sm font-medium text-bamboo-700">{r.title}</p>}
              <p className="mt-1 text-sm text-bamboo-600">{r.description}</p>

              {r.images?.length > 0 && (
                <div className="mt-3">
                  <p className="mb-1.5 text-xs font-medium text-bamboo-500">
                    Customer photos ({r.images.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {r.images.map((img) => (
                      <button
                        key={img.publicId || img.url}
                        type="button"
                        onClick={() => setLightboxUrl(img.url)}
                        aria-label="View customer photo"
                        className="overflow-hidden rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-bamboo-500"
                      >
                        <img src={img.url} alt="Customer review" className="h-20 w-20 object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold">
                {r.status !== 'approved' && (
                  <button onClick={() => handleUpdateStatus(r._id, 'approved')} className="text-green-600 hover:underline">Approve</button>
                )}
                {r.status !== 'rejected' && (
                  <button onClick={() => handleUpdateStatus(r._id, 'rejected')} className="text-orange-500 hover:underline">Reject</button>
                )}
                {r.status !== 'hidden' && (
                  <button onClick={() => handleUpdateStatus(r._id, 'hidden')} className="text-bamboo-500 hover:underline">Hide</button>
                )}
                <button onClick={() => handleDelete(r._id)} className="text-red-500 hover:underline">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightboxUrl(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            aria-label="Close image"
            onClick={() => setLightboxUrl(null)}
            className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-bamboo-800"
          >
            <FiX size={18} />
          </button>
          <img
            src={lightboxUrl}
            alt="Customer review"
            className="max-h-[85vh] max-w-full rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default AdminReviews;