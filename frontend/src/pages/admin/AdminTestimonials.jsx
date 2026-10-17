import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FiStar, FiCheck, FiX, FiTrash2 } from 'react-icons/fi';

import { testimonialApi } from '../../services/testimonialApi';
import EmptyState from '../../components/ui/EmptyState';

const TABS = [
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Published' },
  { key: 'rejected', label: 'Rejected' },
  { key: '', label: 'All' },
];

const StarRow = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <FiStar key={i} size={13} className={i < rating ? 'fill-earth-500 text-earth-500' : 'text-sand-300'} />
    ))}
  </div>
);

const STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-600',
  approved: 'bg-emerald-50 text-emerald-600',
  rejected: 'bg-red-50 text-red-500',
};

const AdminTestimonials = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('pending');

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ['admin-testimonials', activeTab],
    queryFn: () => testimonialApi.getAllTestimonialsAdmin(activeTab || undefined),
    select: (res) => res.data.data.testimonials,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });

  const { mutate: approve } = useMutation({
    mutationFn: (id) => testimonialApi.approveTestimonial(id),
    onSuccess: () => {
      toast.success('Testimonial published');
      invalidate();
    },
    onError: (e) => toast.error(e?.response?.data?.message || 'Could not approve'),
  });

  const { mutate: reject } = useMutation({
    mutationFn: (id) => testimonialApi.rejectTestimonial(id),
    onSuccess: () => {
      toast.success('Testimonial rejected');
      invalidate();
    },
    onError: (e) => toast.error(e?.response?.data?.message || 'Could not reject'),
  });

  const { mutate: remove } = useMutation({
    mutationFn: (id) => testimonialApi.deleteTestimonialAdmin(id),
    onSuccess: () => {
      toast.success('Testimonial deleted');
      invalidate();
    },
    onError: (e) => toast.error(e?.response?.data?.message || 'Could not delete'),
  });

  const handleDelete = (id) => {
    if (window.confirm('Permanently delete this testimonial?')) remove(id);
  };

  return (
    <div className="p-6 sm:p-8">
      <h1 className="font-display text-2xl font-semibold text-bamboo-800">Manage Testimonials</h1>
      <p className="mt-1 text-sm text-bamboo-500">
        Review customer-submitted testimonials before they go live on the homepage.
      </p>

      <div className="mt-6 flex gap-2 border-b border-sand-300">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
              activeTab === tab.key
                ? 'border-bamboo-700 text-bamboo-800'
                : 'border-transparent text-bamboo-400 hover:text-bamboo-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {isLoading ? (
          [...Array(3)].map((_, i) => <div key={i} className="h-28 animate-pulse rounded-2xl bg-white shadow-soft" />)
        ) : testimonials.length === 0 ? (
          <EmptyState title="Nothing here" message="No testimonials found for this filter." />
        ) : (
          testimonials.map((t) => (
            <div key={t._id} className="rounded-2xl bg-white p-5 shadow-soft">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-3">
                    <StarRow rating={t.rating} />
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${STATUS_STYLES[t.status]}`}>
                      {t.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-bamboo-800">{t.name}</p>
                  {t.location && <p className="text-xs text-bamboo-400">{t.location}</p>}
                  {t.submittedBy?.email && (
                    <p className="mt-0.5 text-[11px] text-bamboo-400">
                      Account: {t.submittedBy.firstName} {t.submittedBy.lastName} ({t.submittedBy.email})
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 gap-2">
                  {t.status !== 'approved' && (
                    <button
                      onClick={() => approve(t._id)}
                      className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600 hover:bg-emerald-100"
                    >
                      <FiCheck size={13} /> Approve
                    </button>
                  )}
                  {t.status !== 'rejected' && (
                    <button
                      onClick={() => reject(t._id)}
                      className="flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-600 hover:bg-amber-100"
                    >
                      <FiX size={13} /> Reject
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-100"
                  >
                    <FiTrash2 size={13} /> Delete
                  </button>
                </div>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-bamboo-600">{t.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminTestimonials;