import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { adminBlogApi } from '../../services/adminApi';
import Button from '../../components/ui/Button';
import FormInput from '../../components/ui/FormInput';

const emptyForm = { title: '', excerpt: '', content: '', status: 'draft' };

const AdminBlogs = () => {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: blogs, isLoading } = useQuery({
    queryKey: ['admin-blogs'],
    queryFn: () => adminBlogApi.getAll(),
    select: (res) => res.data.data.blogs,
  });

  const handleChange = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('featuredImage', imageFile);

      if (editing) {
        await adminBlogApi.update(editing._id, fd);
        toast.success('Blog updated');
      } else {
        await adminBlogApi.create(fd);
        toast.success('Blog created');
      }
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
      setIsFormOpen(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not save blog');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    await adminBlogApi.delete(id);
    toast.success('Blog deleted');
    queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
  };

  return (
    <div className="px-6 py-8">
      <Helmet><title>Manage Blog</title></Helmet>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-bamboo-800">Blog Posts</h1>
        <Button onClick={() => { setEditing(null); setForm(emptyForm); setImageFile(null); setIsFormOpen(true); }} className="!px-4 !py-2 text-sm">
          <FiPlus size={14} className="mr-1.5" /> New Post
        </Button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-soft">
        <table className="w-full text-left text-sm">
          <thead className="bg-sand-100 text-xs uppercase text-bamboo-500">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Views</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand-200">
            {isLoading ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-bamboo-400">Loading...</td></tr>
            ) : !blogs?.length ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-bamboo-400">No blog posts yet</td></tr>
            ) : (
              blogs.map((b) => (
                <tr key={b._id}>
                  <td className="px-4 py-3 font-medium text-bamboo-800">{b.title}</td>
                  <td className="px-4 py-3"><span className="rounded-full bg-bamboo-100 px-2.5 py-1 text-xs font-semibold capitalize text-bamboo-700">{b.status}</span></td>
                  <td className="px-4 py-3 text-bamboo-500">{b.viewCount}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3 text-xs font-semibold">
                      <button
                        onClick={() => { setEditing(b); setForm({ title: b.title, excerpt: b.excerpt, content: b.content, status: b.status }); setImageFile(null); setIsFormOpen(true); }}
                        className="flex items-center gap-1 text-bamboo-600 hover:underline"
                      >
                        <FiEdit2 size={12} /> Edit
                      </button>
                      <button onClick={() => handleDelete(b._id)} className="flex items-center gap-1 text-red-500 hover:underline"><FiTrash2 size={12} /> Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-4 py-8">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6">
            <h2 className="font-display text-lg font-semibold text-bamboo-800">{editing ? 'Edit' : 'New'} Blog Post</h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <FormInput label="Title" value={form.title} onChange={(e) => handleChange('title', e.target.value)} required />
              <FormInput label="Excerpt" value={form.excerpt} onChange={(e) => handleChange('excerpt', e.target.value)} />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Content (HTML supported)</label>
                <textarea value={form.content} onChange={(e) => handleChange('content', e.target.value)} className="input-field min-h-[160px]" required />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Featured Image</label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="text-sm" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Status</label>
                <select value={form.status} onChange={(e) => handleChange('status', e.target.value)} className="input-field">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
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

export default AdminBlogs;
