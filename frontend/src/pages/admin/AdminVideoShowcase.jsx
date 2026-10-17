import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiX, FiEdit2, FiTrash2, FiPlus, FiAlertTriangle } from 'react-icons/fi';
import { adminVideoShowcaseApi } from '../../services/videoShowcaseApi';

const EMPTY_FORM = {
  heading: '',
  subheading: '',
  description: '',
  videoUrl: '',
  videoType: 'upload',
  videoThumbnail: '',
  ctaLabel: '',
  ctaLink: '',
  videoPosition: 'left',
  order: 0,
  status: 'active',
};

const toForm = (item) => ({
  heading: item.heading || '',
  subheading: item.subheading || '',
  description: item.description || '',
  videoUrl: item.video?.url || '',
  videoType: item.video?.type || 'upload',
  videoThumbnail: item.video?.thumbnail || '',
  ctaLabel: item.ctaLabel || '',
  ctaLink: item.ctaLink || '',
  videoPosition: item.videoPosition || 'left',
  order: item.order ?? 0,
  status: item.status || 'active',
});

const toPayload = (form) => ({
  heading: form.heading.trim(),
  subheading: form.subheading.trim(),
  description: form.description.trim(),
  video: {
    url: form.videoUrl.trim(),
    type: form.videoType,
    thumbnail: form.videoThumbnail.trim(),
  },
  ctaLabel: form.ctaLabel.trim(),
  ctaLink: form.ctaLink.trim(),
  videoPosition: form.videoPosition,
  order: Number(form.order) || 0,
  status: form.status,
});

const AdminVideoShowcase = () => {
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['admin-video-showcase'],
    queryFn: () => adminVideoShowcaseApi.getAll(),
    select: (res) => res.data.data.videoShowcases,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin-video-showcase'] });

  const createMutation = useMutation({
    mutationFn: (payload) => adminVideoShowcaseApi.create(payload),
    onSuccess: () => {
      invalidate();
      closeModal();
    },
    onError: (err) => setFormError(err?.response?.data?.message || 'Failed to create.'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => adminVideoShowcaseApi.update(id, payload),
    onSuccess: () => {
      invalidate();
      closeModal();
    },
    onError: (err) => setFormError(err?.response?.data?.message || 'Failed to update.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminVideoShowcaseApi.delete(id),
    onSuccess: () => {
      invalidate();
      setDeletingId(null);
      setDeleteTarget(null);
    },
    onError: () => setDeletingId(null),
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const openAddModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item._id);
    setForm(toForm(item));
    setFormError('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError('');
  };

  const handleChange = (field) => (e) => {
    const value = field === 'order' ? Number(e.target.value) : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!form.heading.trim()) return setFormError('Heading is required.');
    if (!form.description.trim()) return setFormError('Description is required.');
    if (!form.videoUrl.trim()) return setFormError('Video URL is required.');

    const payload = toPayload(form);

    if (editingId) {
      updateMutation.mutate({ id: editingId, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const requestDelete = (item) => setDeleteTarget(item);
  const cancelDelete = () => {
    if (deletingId) return;
    setDeleteTarget(null);
  };
  const confirmDelete = () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget._id);
    deleteMutation.mutate(deleteTarget._id);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-bamboo-800">Video Showcase</h1>
          <p className="mt-1 text-sm text-earth-500">
            Video + heading/paragraph blocks shown on the homepage.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-lg bg-bamboo-700 px-4 py-2 text-white transition-colors hover:bg-bamboo-800"
        >
          <FiPlus size={16} />
          Add Block
        </button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-white p-10 text-center text-sm text-earth-500">
          No video blocks yet. Click Add Block to create one.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-white">
          <table className="min-w-full">
            <thead className="bg-sand-100">
              <tr>
                <th className="px-4 py-3 text-left">Heading</th>
                <th className="px-4 py-3 text-left">Video</th>
                <th className="px-4 py-3 text-center">Position</th>
                <th className="px-4 py-3 text-center">Order</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr key={item._id} className="border-t">
                  <td className="px-4 py-3">
                    <p className="font-medium text-bamboo-800">{item.heading}</p>
                    {item.subheading && <p className="text-xs text-earth-500">{item.subheading}</p>}
                  </td>
                  <td className="max-w-[220px] truncate px-4 py-3 text-sm text-earth-600">
                    {item.video?.url}
                    <span className="ml-1 text-xs text-earth-400">({item.video?.type})</span>
                  </td>
                  <td className="px-4 py-3 text-center capitalize">{item.videoPosition}</td>
                  <td className="px-4 py-3 text-center">{item.order}</td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="space-x-2 px-4 py-3 text-center">
                    <button
                      onClick={() => openEditModal(item)}
                      className="inline-flex items-center gap-1 rounded bg-blue-500 px-3 py-1 text-white transition-colors hover:bg-blue-600"
                    >
                      <FiEdit2 size={13} />
                      Edit
                    </button>
                    <button
                      onClick={() => requestDelete(item)}
                      disabled={deletingId === item._id}
                      className="inline-flex items-center gap-1 rounded bg-red-500 px-3 py-1 text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <FiTrash2 size={13} />
                      {deletingId === item._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-4 py-8">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-bamboo-800">
                {editingId ? 'Edit Video Block' : 'Add Video Block'}
              </h2>
              <button onClick={closeModal} className="rounded-full p-1 text-earth-500 hover:bg-sand-100" aria-label="Close">
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-bamboo-700">Heading (H1)</label>
                <input
                  type="text"
                  value={form.heading}
                  onChange={handleChange('heading')}
                  className="w-full rounded-lg border border-sand-300 px-3 py-2 text-sm focus:border-bamboo-500 focus:outline-none focus:ring-1 focus:ring-bamboo-500"
                  placeholder="e.g. Crafted by Hand, Built to Last"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-bamboo-700">Subheading (H2, optional)</label>
                <input
                  type="text"
                  value={form.subheading}
                  onChange={handleChange('subheading')}
                  className="w-full rounded-lg border border-sand-300 px-3 py-2 text-sm focus:border-bamboo-500 focus:outline-none focus:ring-1 focus:ring-bamboo-500"
                  placeholder="e.g. Our Process"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-bamboo-700">Description / Paragraph</label>
                <textarea
                  value={form.description}
                  onChange={handleChange('description')}
                  rows={4}
                  className="w-full rounded-lg border border-sand-300 px-3 py-2 text-sm focus:border-bamboo-500 focus:outline-none focus:ring-1 focus:ring-bamboo-500"
                  placeholder="Tell customers the story behind this video"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-bamboo-700">Video URL</label>
                  <input
                    type="text"
                    value={form.videoUrl}
                    onChange={handleChange('videoUrl')}
                    className="w-full rounded-lg border border-sand-300 px-3 py-2 text-sm focus:border-bamboo-500 focus:outline-none focus:ring-1 focus:ring-bamboo-500"
                    placeholder="https://... .mp4 or YouTube/Vimeo link"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-bamboo-700">Video Type</label>
                  <select
                    value={form.videoType}
                    onChange={handleChange('videoType')}
                    className="w-full rounded-lg border border-sand-300 px-3 py-2 text-sm focus:border-bamboo-500 focus:outline-none focus:ring-1 focus:ring-bamboo-500"
                  >
                    <option value="upload">Direct file (mp4/webm)</option>
                    <option value="youtube">YouTube</option>
                    <option value="vimeo">Vimeo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-bamboo-700">
                  Thumbnail / Poster URL (optional, direct file only)
                </label>
                <input
                  type="text"
                  value={form.videoThumbnail}
                  onChange={handleChange('videoThumbnail')}
                  className="w-full rounded-lg border border-sand-300 px-3 py-2 text-sm focus:border-bamboo-500 focus:outline-none focus:ring-1 focus:ring-bamboo-500"
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-bamboo-700">CTA Label (optional)</label>
                  <input
                    type="text"
                    value={form.ctaLabel}
                    onChange={handleChange('ctaLabel')}
                    className="w-full rounded-lg border border-sand-300 px-3 py-2 text-sm focus:border-bamboo-500 focus:outline-none focus:ring-1 focus:ring-bamboo-500"
                    placeholder="e.g. Meet Our Artisans"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-bamboo-700">CTA Link (optional)</label>
                  <input
                    type="text"
                    value={form.ctaLink}
                    onChange={handleChange('ctaLink')}
                    className="w-full rounded-lg border border-sand-300 px-3 py-2 text-sm focus:border-bamboo-500 focus:outline-none focus:ring-1 focus:ring-bamboo-500"
                    placeholder="/artisans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-bamboo-700">Video Position</label>
                  <select
                    value={form.videoPosition}
                    onChange={handleChange('videoPosition')}
                    className="w-full rounded-lg border border-sand-300 px-3 py-2 text-sm focus:border-bamboo-500 focus:outline-none focus:ring-1 focus:ring-bamboo-500"
                  >
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-bamboo-700">Order</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={handleChange('order')}
                    className="w-full rounded-lg border border-sand-300 px-3 py-2 text-sm focus:border-bamboo-500 focus:outline-none focus:ring-1 focus:ring-bamboo-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-bamboo-700">Status</label>
                  <select
                    value={form.status}
                    onChange={handleChange('status')}
                    className="w-full rounded-lg border border-sand-300 px-3 py-2 text-sm focus:border-bamboo-500 focus:outline-none focus:ring-1 focus:ring-bamboo-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {formError && <p className="text-sm text-red-500">{formError}</p>}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-sand-300 px-4 py-2 text-sm text-bamboo-700 hover:bg-sand-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-lg bg-bamboo-700 px-4 py-2 text-sm text-white hover:bg-bamboo-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Block'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4" onClick={cancelDelete}>
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-500">
                <FiAlertTriangle size={18} />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-bamboo-800">Delete Video Block</h3>
                <p className="mt-1 text-sm text-earth-600">
                  Are you sure you want to delete{' '}
                  <span className="font-medium text-bamboo-700">{deleteTarget.heading}</span>? This action cannot be
                  undone.
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={cancelDelete}
                disabled={!!deletingId}
                className="rounded-lg border border-sand-300 px-4 py-2 text-sm text-bamboo-700 hover:bg-sand-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={!!deletingId}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingId ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVideoShowcase;