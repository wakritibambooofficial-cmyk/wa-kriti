import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiX, FiEdit2, FiTrash2, FiPlus, FiAlertTriangle, FiUploadCloud, FiFilm } from 'react-icons/fi';
import { adminVideoApi } from '../../services/adminApi';

const EMPTY_FORM = {
  title: '',
  order: 0,
  status: 'active',
};

const formatDuration = (seconds = 0) => {
  const s = Math.round(seconds);
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}:${String(rem).padStart(2, '0')}`;
};

const buildFormData = (form, file) => {
  const fd = new FormData();
  fd.append('title', form.title.trim());
  fd.append('order', String(Number(form.order) || 0));
  fd.append('status', form.status);
  if (file) fd.append('video', file);
  return fd;
};

const AdminVideos = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); // null = create mode
  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [formError, setFormError] = useState('');

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ['admin-videos'],
    queryFn: () => adminVideoApi.getAll(),
    select: (res) => res.data.data.videos,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin-videos'] });

  const createMutation = useMutation({
    mutationFn: (formData) => adminVideoApi.create(formData),
    onSuccess: () => {
      invalidate();
      closeModal();
    },
    onError: (err) => {
      setFormError(err?.response?.data?.message || 'Failed to upload video.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }) => adminVideoApi.update(id, formData),
    onSuccess: () => {
      invalidate();
      closeModal();
    },
    onError: (err) => {
      setFormError(err?.response?.data?.message || 'Failed to update video.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminVideoApi.delete(id),
    onSuccess: () => {
      invalidate();
      setDeletingId(null);
      setDeleteTarget(null);
    },
    onError: () => {
      setDeletingId(null);
    },
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const isUploadPending = isSaving && (createMutation.isPending ? !editingId : true);

  const openAddModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFile(null);
    setPreviewUrl('');
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (video) => {
    setEditingId(video._id);
    setForm({
      title: video.title || '',
      order: video.order ?? 0,
      status: video.status || 'active',
    });
    setFile(null);
    setPreviewUrl(video.videoUrl || '');
    setFormError('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFile(null);
    setPreviewUrl('');
    setFormError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleChange = (field) => (e) => {
    const value = field === 'order' ? Number(e.target.value) : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const allowed = ['video/mp4', 'video/webm', 'video/quicktime'];
    if (!allowed.includes(selected.type)) {
      setFormError('Only MP4, WEBM, and MOV videos are allowed.');
      return;
    }
    if (selected.size > 50 * 1024 * 1024) {
      setFormError('Video must be under 50MB.');
      return;
    }

    setFormError('');
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!editingId && !file) {
      setFormError('Please choose a video file to upload.');
      return;
    }

    const formData = buildFormData(form, file);

    if (editingId) {
      updateMutation.mutate({ id: editingId, formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const requestDelete = (video) => setDeleteTarget(video);
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
          <h1 className="font-display text-3xl font-bold text-bamboo-800">
            Showcase Videos
          </h1>
          <p className="mt-1 text-sm text-earth-500">
            These play in the Experience Before You Buy slider on the homepage.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-lg bg-bamboo-700 px-4 py-2 text-white transition-colors hover:bg-bamboo-800"
        >
          <FiPlus size={16} />
          Add Video
        </button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : videos.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-white p-10 text-center text-sm text-earth-500">
          No videos yet. Click Add Video to upload one.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {videos.map((video) => (
            <div key={video._id} className="overflow-hidden rounded-xl border bg-white">
              <div className="relative aspect-[9/16] bg-sand-100">
                {video.thumbnailUrl ? (
                  <img src={video.thumbnailUrl} alt={video.title || 'Video thumbnail'} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-earth-400">
                    <FiFilm size={28} />
                  </div>
                )}
                <span className="absolute bottom-2 right-2 rounded bg-black/60 px-1.5 py-0.5 text-[11px] font-medium text-white">
                  {formatDuration(video.duration)}
                </span>
                <span
                  className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    video.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {video.status}
                </span>
              </div>

              <div className="p-3">
                <p className="truncate text-sm font-medium text-bamboo-800">
                  {video.title || <span className="italic text-earth-400">Untitled</span>}
                </p>
                <p className="mt-0.5 text-xs text-earth-500">Order: {video.order}</p>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => openEditModal(video)}
                    className="flex flex-1 items-center justify-center gap-1 rounded bg-blue-500 px-2 py-1.5 text-xs text-white transition-colors hover:bg-blue-600"
                  >
                    <FiEdit2 size={12} />
                    Edit
                  </button>
                  <button
                    onClick={() => requestDelete(video)}
                    disabled={deletingId === video._id}
                    className="flex flex-1 items-center justify-center gap-1 rounded bg-red-500 px-2 py-1.5 text-xs text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <FiTrash2 size={12} />
                    {deletingId === video._id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-bamboo-800">
                {editingId ? 'Edit Video' : 'Add Video'}
              </h2>
              <button
                onClick={closeModal}
                className="rounded-full p-1 text-earth-500 hover:bg-sand-100"
                aria-label="Close"
              >
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-bamboo-700">
                  Video file {editingId && <span className="font-normal text-earth-400">(optional — leave empty to keep current)</span>}
                </label>

                {previewUrl ? (
                  <div className="relative overflow-hidden rounded-lg border border-sand-300 bg-black">
                    <video src={previewUrl} className="max-h-56 w-full" controls muted />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-sand-300 py-8 text-earth-500 hover:border-bamboo-400 hover:text-bamboo-600"
                  >
                    <FiUploadCloud size={22} />
                    <span className="text-sm">Click to choose a video (MP4/WEBM/MOV, max 50MB)</span>
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={handleFileSelect}
                  className="mt-2 w-full text-xs"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-bamboo-700">
                  Title <span className="font-normal text-earth-400">(optional, for your reference)</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={handleChange('title')}
                  className="w-full rounded-lg border border-sand-300 px-3 py-2 text-sm focus:border-bamboo-500 focus:outline-none focus:ring-1 focus:ring-bamboo-500"
                  placeholder="e.g. Customer unboxing candle"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-bamboo-700">
                    Order
                  </label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={handleChange('order')}
                    className="w-full rounded-lg border border-sand-300 px-3 py-2 text-sm focus:border-bamboo-500 focus:outline-none focus:ring-1 focus:ring-bamboo-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-bamboo-700">
                    Status
                  </label>
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
                  {isSaving ? (isUploadPending ? 'Uploading...' : 'Saving...') : editingId ? 'Save Changes' : 'Add Video'}
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
                <h3 className="font-display text-lg font-bold text-bamboo-800">Delete Video</h3>
                <p className="mt-1 text-sm text-earth-600">
                  Are you sure you want to delete{' '}
                  <span className="font-medium text-bamboo-700">{deleteTarget.title || 'this video'}</span>? This
                  action cannot be undone.
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

export default AdminVideos;