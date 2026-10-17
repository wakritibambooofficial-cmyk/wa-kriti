// import { useQuery } from '@tanstack/react-query';
// import { adminFeatureApi } from '../../services/adminApi';

// const AdminFeatures = () => {
//   const { data: features = [], isLoading } = useQuery({
//     queryKey: ['admin-features'],
//     queryFn: () => adminFeatureApi.getAll(),
//     select: (res) => res.data.data.features,
//   });

//   return (
//     <div className="p-6">
//       <div className="mb-6 flex items-center justify-between">
//         <h1 className="font-display text-3xl font-bold text-bamboo-800">
//           Homepage Features
//         </h1>

//         <button className="rounded-lg bg-bamboo-700 px-4 py-2 text-white">
//           + Add Feature
//         </button>
//       </div>

//       {isLoading ? (
//         <p>Loading...</p>
//       ) : (
//         <div className="overflow-hidden rounded-xl border bg-white">
//           <table className="min-w-full">
//             <thead className="bg-sand-100">
//               <tr>
//                 <th className="px-4 py-3 text-left">Title</th>
//                 <th className="px-4 py-3 text-left">Description</th>
//                 <th className="px-4 py-3 text-center">Order</th>
//                 <th className="px-4 py-3 text-center">Status</th>
//                 <th className="px-4 py-3 text-center">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {features.map((feature) => (
//                 <tr key={feature._id} className="border-t">
//                   <td className="px-4 py-3">{feature.title}</td>

//                   <td className="px-4 py-3">
//                     {feature.description}
//                   </td>

//                   <td className="px-4 py-3 text-center">
//                     {feature.order}
//                   </td>

//                   <td className="px-4 py-3 text-center">
//                     {feature.status}
//                   </td>

//                   <td className="space-x-2 px-4 py-3 text-center">
//                     <button className="rounded bg-blue-500 px-3 py-1 text-white">
//                       Edit
//                     </button>

//                     <button className="rounded bg-red-500 px-3 py-1 text-white">
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminFeatures;
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiX, FiEdit2, FiTrash2, FiPlus, FiAlertTriangle } from 'react-icons/fi';
import { adminFeatureApi } from '../../services/adminApi';

const EMPTY_FORM = {
  title: '',
  description: '',
  order: 0,
  status: 'active',
};

const AdminFeatures = () => {
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); // null = create mode
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');

  const [deleteTarget, setDeleteTarget] = useState(null); // feature object pending delete
  const [deletingId, setDeletingId] = useState(null);

  const { data: features = [], isLoading } = useQuery({
    queryKey: ['admin-features'],
    queryFn: () => adminFeatureApi.getAll(),
    select: (res) => res.data.data.features,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin-features'] });

  const createMutation = useMutation({
    mutationFn: (payload) => adminFeatureApi.create(payload),
    onSuccess: () => {
      invalidate();
      closeModal();
    },
    onError: (err) => {
      setFormError(err?.response?.data?.message || 'Failed to create feature.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => adminFeatureApi.update(id, payload),
    onSuccess: () => {
      invalidate();
      closeModal();
    },
    onError: (err) => {
      setFormError(err?.response?.data?.message || 'Failed to update feature.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminFeatureApi.delete(id),
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

  const openAddModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (feature) => {
    setEditingId(feature._id);
    setForm({
      title: feature.title || '',
      description: feature.description || '',
      order: feature.order ?? 0,
      status: feature.status || 'active',
    });
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

    if (!form.title.trim()) {
      setFormError('Title is required.');
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      order: Number(form.order) || 0,
      status: form.status,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const requestDelete = (feature) => {
    setDeleteTarget(feature);
  };

  const cancelDelete = () => {
    if (deletingId) return; // don't allow closing mid-request
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
        <h1 className="font-display text-3xl font-bold text-bamboo-800">
          Homepage Features
        </h1>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-lg bg-bamboo-700 px-4 py-2 text-white transition-colors hover:bg-bamboo-800"
        >
          <FiPlus size={16} />
          Add Feature
        </button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : features.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-white p-10 text-center text-sm text-earth-500">
          No features yet. Click Add Feature to create one.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-white">
          <table className="min-w-full">
            <thead className="bg-sand-100">
              <tr>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-center">Order</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {features.map((feature) => (
                <tr key={feature._id} className="border-t">
                  <td className="px-4 py-3">{feature.title}</td>

                  <td className="max-w-xs px-4 py-3 text-sm text-earth-600">
                    {feature.description}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {feature.order}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        feature.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {feature.status}
                    </span>
                  </td>

                  <td className="space-x-2 px-4 py-3 text-center">
                    <button
                      onClick={() => openEditModal(feature)}
                      className="inline-flex items-center gap-1 rounded bg-blue-500 px-3 py-1 text-white transition-colors hover:bg-blue-600"
                    >
                      <FiEdit2 size={13} />
                      Edit
                    </button>

                    <button
                      onClick={() => requestDelete(feature)}
                      disabled={deletingId === feature._id}
                      className="inline-flex items-center gap-1 rounded bg-red-500 px-3 py-1 text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <FiTrash2 size={13} />
                      {deletingId === feature._id ? 'Deleting...' : 'Delete'}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-bamboo-800">
                {editingId ? 'Edit Feature' : 'Add Feature'}
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
                  Title
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={handleChange('title')}
                  className="w-full rounded-lg border border-sand-300 px-3 py-2 text-sm focus:border-bamboo-500 focus:outline-none focus:ring-1 focus:ring-bamboo-500"
                  placeholder="e.g. Eco-Friendly Materials"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-bamboo-700">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={handleChange('description')}
                  rows={3}
                  className="w-full rounded-lg border border-sand-300 px-3 py-2 text-sm focus:border-bamboo-500 focus:outline-none focus:ring-1 focus:ring-bamboo-500"
                  placeholder="Short description shown on the homepage"
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

              {formError && (
                <p className="text-sm text-red-500">{formError}</p>
              )}

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
                  {isSaving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Feature'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4"
          onClick={cancelDelete}
        >
          <div
            className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-500">
                <FiAlertTriangle size={18} />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-bamboo-800">
                  Delete Feature
                </h3>
                <p className="mt-1 text-sm text-earth-600">
                  Are you sure you want to delete{' '}
                  <span className="font-medium text-bamboo-700">
                    {deleteTarget.title}
                  </span>
                  ? This action cannot be undone.
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

export default AdminFeatures;