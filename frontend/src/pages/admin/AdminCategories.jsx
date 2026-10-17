import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { categoryApi } from '../../services/productApi';
import { adminCategoryApi } from '../../services/adminApi';
import Button from '../../components/ui/Button';
import FormInput from '../../components/ui/FormInput';

const emptyForm = { name: '', description: '', isFeatured: false, status: 'active' };

const AdminCategories = () => {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories', 'admin-manage'],
    queryFn: () => categoryApi.getCategories({ status: 'all' }),
    select: (res) => res.data.data.categories,
  });

  const handleChange = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);

      if (editing) {
        await adminCategoryApi.update(editing._id, fd);
        toast.success('Category updated');
      } else {
        await adminCategoryApi.create(fd);
        toast.success('Category created');
      }
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsFormOpen(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not save category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminCategoryApi.delete(id);
      toast.success('Category deleted');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not delete category');
    }
  };

  return (
    <div className="px-6 py-8">
      <Helmet><title>Manage Categories</title></Helmet>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-bamboo-800">Categories</h1>
        <Button
          onClick={() => { setEditing(null); setForm(emptyForm); setImageFile(null); setIsFormOpen(true); }}
          className="!px-4 !py-2 text-sm"
        >
          <FiPlus size={14} className="mr-1.5" /> Add Category
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <p className="text-bamboo-400">Loading...</p>
        ) : (
          categories?.map((cat) => (
            <div key={cat._id} className="card flex items-center gap-3 p-4">
              {cat.image?.url && <img src={cat.image.url} alt={cat.name} className="h-12 w-12 rounded-lg object-cover" />}
              <div className="flex-1">
                <p className="font-medium text-bamboo-800">{cat.name}</p>
                <p className="text-xs capitalize text-bamboo-400">{cat.status}</p>
              </div>
              <div className="flex gap-2 text-xs font-semibold">
                <button
                  onClick={() => { setEditing(cat); setForm({ name: cat.name, description: cat.description, isFeatured: cat.isFeatured, status: cat.status }); setImageFile(null); setIsFormOpen(true); }}
                  className="text-bamboo-600 hover:underline"
                >
                  <FiEdit2 size={13} />
                </button>
                <button onClick={() => handleDelete(cat._id)} className="text-red-500 hover:underline">
                  <FiTrash2 size={13} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <h2 className="font-display text-lg font-semibold text-bamboo-800">{editing ? 'Edit' : 'Add'} Category</h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <FormInput label="Name" value={form.name} onChange={(e) => handleChange('name', e.target.value)} required />
              <FormInput label="Description" value={form.description} onChange={(e) => handleChange('description', e.target.value)} />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Category Image</label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="text-sm" />
              </div>
              <label className="flex items-center gap-2 text-sm text-bamboo-600">
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => handleChange('isFeatured', e.target.checked)} />
                Featured Category
              </label>
              <div className="flex gap-3">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                <Button type="submit" className="flex-1" isLoading={isSubmitting}>Save</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
