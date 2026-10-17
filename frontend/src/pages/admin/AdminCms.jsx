

// import { useState } from 'react';
// import { useQuery, useQueryClient } from '@tanstack/react-query';
// import { Helmet } from 'react-helmet-async';
// import toast from 'react-hot-toast';
// import { FiPlus, FiTrash2, FiEdit2, FiExternalLink, FiX } from 'react-icons/fi';
// import { adminCmsApi } from '../../services/adminApi';
// import Button from '../../components/ui/Button';
// import FormInput from '../../components/ui/FormInput';

// const emptyForm = { title: '', subtitle: '', description: '', ctaPrimaryLabel: 'Shop Now', ctaPrimaryLink: '/shop', placement: 'hero_slider' };

// // Maps each fixed slug (matches the CMSPage model's enum) to a friendly
// // label and its live public route, for display in the Pages tab.
// const STATIC_PAGES_META = {
//   'about-us': { label: 'About Us', path: '/about' },
//   founder: { label: 'Founder', path: '/founder' },
//   'privacy-policy': { label: 'Privacy Policy', path: '/privacy-policy' },
//   'refund-policy': { label: 'Refund Policy', path: '/refund-policy' },
//   'shipping-policy': { label: 'Shipping Policy', path: '/shipping-policy' },
//   'cancellation-policy': { label: 'Cancellation Policy', path: '/cancellation-policy' },
//   'terms-and-conditions': { label: 'Terms & Conditions', path: '/terms-and-conditions' },
//   'accessibility-statement': { label: 'Accessibility Statement', path: '/accessibility-statement' },
// };

// //const emptyPageForm = { title: '', content: '', metaTitle: '', metaDescription: '' };

// const AdminCms = () => {
//   const [activeTab, setActiveTab] = useState('banners'); // 'banners' | 'pages'

//   return (
//     <div className="px-6 py-8">
//       <Helmet><title>CMS</title></Helmet>

//       <div className="flex items-center justify-between">
//         <h1 className="font-display text-2xl font-bold text-bamboo-800">Content Management</h1>
//       </div>

//       <div className="mt-5 flex gap-1 border-b border-sand-200">
//         <button
//           onClick={() => setActiveTab('banners')}
//           className={`px-4 py-2.5 text-sm font-semibold transition-colors ${
//             activeTab === 'banners'
//               ? 'border-b-2 border-bamboo-700 text-bamboo-800'
//               : 'text-bamboo-400 hover:text-bamboo-600'
//           }`}
//         >
//           Homepage Banners
//         </button>
//         <button
//           onClick={() => setActiveTab('pages')}
//           className={`px-4 py-2.5 text-sm font-semibold transition-colors ${
//             activeTab === 'pages'
//               ? 'border-b-2 border-bamboo-700 text-bamboo-800'
//               : 'text-bamboo-400 hover:text-bamboo-600'
//           }`}
//         >
//           Static Pages
//         </button>
//       </div>

//       <div className="mt-6">
//         {activeTab === 'banners' ? <BannersTab /> : <PagesTab />}
//       </div>
//     </div>
//   );
// };

// /* ------------------------------ Banners tab (unchanged) ------------------------------ */

// const BannersTab = () => {
//   const queryClient = useQueryClient();
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [form, setForm] = useState(emptyForm);
//   const [imageFile, setImageFile] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const { data: banners, isLoading } = useQuery({
//     queryKey: ['admin-banners'],
//     queryFn: () => adminCmsApi.getBanners(),
//     select: (res) => res.data.data.banners,
//   });

//   const handleChange = (key, value) => setForm((f) => ({ ...f, [key]: value }));

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!imageFile) {
//       toast.error('Please select a banner image');
//       return;
//     }
//     setIsSubmitting(true);
//     try {
//       const fd = new FormData();
//       Object.entries(form).forEach(([k, v]) => fd.append(k, v));
//       fd.append('image', imageFile);
//       await adminCmsApi.createBanner(fd);
//       toast.success('Banner created');
//       queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
//       setIsFormOpen(false);
//       setForm(emptyForm);
//       setImageFile(null);
//     } catch (error) {
//       toast.error(error?.response?.data?.message || 'Could not create banner');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     await adminCmsApi.deleteBanner(id);
//     toast.success('Banner deleted');
//     queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
//   };

//   return (
//     <>
//       <div className="flex items-center justify-end">
//         <Button onClick={() => setIsFormOpen(true)} className="!px-4 !py-2 text-sm"><FiPlus size={14} className="mr-1.5" /> Add Banner</Button>
//       </div>

//       <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//         {isLoading ? (
//           <p className="text-bamboo-400">Loading...</p>
//         ) : !banners?.length ? (
//           <p className="text-bamboo-400">No banners yet — add one to populate the homepage hero slider.</p>
//         ) : (
//           banners.map((b) => (
//             <div key={b._id} className="card overflow-hidden">
//               <div className="aspect-video bg-sand-100">
//                 <img src={b.image.url} alt={b.title} className="h-full w-full object-cover" />
//               </div>
//               <div className="p-3">
//                 <p className="font-medium text-bamboo-800">{b.title}</p>
//                 <p className="text-xs capitalize text-bamboo-400">{b.placement.replace(/_/g, ' ')} · {b.status}</p>
//                 <button onClick={() => handleDelete(b._id)} className="mt-2 flex items-center gap-1 text-xs font-semibold text-red-500 hover:underline">
//                   <FiTrash2 size={12} /> Delete
//                 </button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {isFormOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
//           <div className="w-full max-w-md rounded-2xl bg-white p-6">
//             <h2 className="font-display text-lg font-semibold text-bamboo-800">Add Banner</h2>
//             <form onSubmit={handleSubmit} className="mt-4 space-y-4">
//               <FormInput label="Title" value={form.title} onChange={(e) => handleChange('title', e.target.value)} required />
//               <FormInput label="Subtitle" value={form.subtitle} onChange={(e) => handleChange('subtitle', e.target.value)} />
//               <FormInput label="Description" value={form.description} onChange={(e) => handleChange('description', e.target.value)} />
//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Placement</label>
//                 <select value={form.placement} onChange={(e) => handleChange('placement', e.target.value)} className="input-field">
//                   <option value="hero_slider">Hero Slider</option>
//                   <option value="festival_offer">Festival Offer</option>
//                   <option value="limited_edition">Daily Update</option>
//                   <option value="announcement_popup">Announcement Popup</option>
//                   {/* <option value="category_banner">Category Banner</option> */}
//                 </select>
//               </div>
//               <FormInput label="CTA Label" value={form.ctaPrimaryLabel} onChange={(e) => handleChange('ctaPrimaryLabel', e.target.value)} />
//               <FormInput label="CTA Link" value={form.ctaPrimaryLink} onChange={(e) => handleChange('ctaPrimaryLink', e.target.value)} />
//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Banner Image</label>
//                 <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="text-sm" required />
//               </div>
//               <div className="flex gap-3">
//                 <Button type="button" variant="secondary" className="flex-1" onClick={() => setIsFormOpen(false)}>Cancel</Button>
//                 <Button type="submit" className="flex-1" isLoading={isSubmitting}>Save</Button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// /* ------------------------------ Pages tab (new) ------------------------------ */

// const PagesTab = () => {
//   const queryClient = useQueryClient();
//   const [editingSlug, setEditingSlug] = useState(null);

//   const { data: pages, isLoading } = useQuery({
//     queryKey: ['admin-cms-pages'],
//     queryFn: () => adminCmsApi.getPages(),
//     select: (res) => res.data.data.pages,
//   });

//   const editingPage = pages?.find((p) => p.slug === editingSlug) || null;

//   return (
//     <>
//       <p className="text-sm text-bamboo-500">
//         These 8 pages are fixed to your sites routes (About, Privacy Policy, etc.). Edit each one to publish its content —
//         pages left empty show a not published yet message to visitors.
//       </p>

//       <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
//         {isLoading ? (
//           [...Array(8)].map((_, i) => <div key={i} className="h-20 animate-pulse rounded-xl bg-sand-100" />)
//         ) : (
//           pages?.map((page) => {
//             const meta = STATIC_PAGES_META[page.slug];
//             const isPublished = Boolean(page.title?.trim() && page.content?.trim());
//             return (
//               <div key={page.slug} className="card flex items-center justify-between p-4">
//                 <div className="min-w-0">
//                   <p className="truncate font-medium text-bamboo-800">{meta?.label ?? page.slug}</p>
//                   <span
//                     className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
//                       isPublished ? 'bg-emerald-50 text-emerald-600' : 'bg-sand-100 text-bamboo-400'
//                     }`}
//                   >
//                     {isPublished ? 'Published' : 'Not published'}
//                   </span>
//                 </div>
//                 <div className="flex shrink-0 items-center gap-2">
//                   <a
//                     href={meta?.path ?? '#'}
//                     target="_blank"
//                     rel="noreferrer"
//                     aria-label="View live page"
//                     className="flex h-8 w-8 items-center justify-center rounded-lg text-bamboo-400 transition-colors hover:bg-sand-50 hover:text-bamboo-700"
//                   >
//                     <FiExternalLink size={15} />
//                   </a>
//                   <button
//                     onClick={() => setEditingSlug(page.slug)}
//                     aria-label="Edit page"
//                     className="flex h-8 w-8 items-center justify-center rounded-lg text-bamboo-400 transition-colors hover:bg-sand-50 hover:text-bamboo-700"
//                   >
//                     <FiEdit2 size={15} />
//                   </button>
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>

//       {editingPage && (
//         <EditPageModal
//           page={editingPage}
//           label={STATIC_PAGES_META[editingPage.slug]?.label ?? editingPage.slug}
//           onClose={() => setEditingSlug(null)}
//           onSaved={() => {
//             queryClient.invalidateQueries({ queryKey: ['admin-cms-pages'] });
//             setEditingSlug(null);
//           }}
//         />
//       )}
//     </>
//   );
// };

// const EditPageModal = ({ page, label, onClose, onSaved }) => {
//   const [form, setForm] = useState({
//     title: page.title ?? '',
//     content: page.content ?? '',
//     metaTitle: page.metaTitle ?? '',
//     metaDescription: page.metaDescription ?? '',
//   });
//   const [heroImageFile, setHeroImageFile] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleChange = (key, value) => setForm((f) => ({ ...f, [key]: value }));

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     try {
//       const fd = new FormData();
//       Object.entries(form).forEach(([k, v]) => fd.append(k, v));
//       if (heroImageFile) fd.append('heroImage', heroImageFile);
//       await adminCmsApi.updatePage(page.slug, fd);
//       toast.success('Page saved');
//       onSaved();
//     } catch (error) {
//       toast.error(error?.response?.data?.message || 'Could not save page');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
//       <div className="max-h-full w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6">
//         <div className="flex items-center justify-between">
//           <h2 className="font-display text-lg font-semibold text-bamboo-800">Edit — {label}</h2>
//           <button onClick={onClose} aria-label="Close" className="text-bamboo-400 hover:text-bamboo-700">
//             <FiX size={20} />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="mt-4 space-y-4">
//           <FormInput label="Page Title" value={form.title} onChange={(e) => handleChange('title', e.target.value)} required />

//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Content (HTML)</label>
//             <textarea
//               value={form.content}
//               onChange={(e) => handleChange('content', e.target.value)}
//               rows={8}
//               className="input-field font-mono text-xs"
//               placeholder="<p>Your page content...</p>"
//             />
//             <p className="mt-1 text-xs text-bamboo-400">
//               Rendered as raw HTML on the live page. Swap this for a rich-text editor later if you want a WYSIWYG experience.
//             </p>
//           </div>

//           <FormInput label="Meta Title" value={form.metaTitle} onChange={(e) => handleChange('metaTitle', e.target.value)} />
//           <FormInput
//             label="Meta Description"
//             value={form.metaDescription}
//             onChange={(e) => handleChange('metaDescription', e.target.value)}
//           />

//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Hero Image (optional)</label>
//             {page.heroImage?.url && !heroImageFile && (
//               <img src={page.heroImage.url} alt="" className="mb-2 h-24 w-full rounded-lg object-cover" />
//             )}
//             <input type="file" accept="image/*" onChange={(e) => setHeroImageFile(e.target.files[0])} className="text-sm" />
//           </div>

//           <div className="flex gap-3 pt-2">
//             <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
//             <Button type="submit" className="flex-1" isLoading={isSubmitting}>Save</Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AdminCms;

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import {
  FiPlus, FiTrash2, FiEdit2, FiExternalLink, FiX, FiEye, FiEyeOff,
  FiArrowUp, FiArrowDown, FiImage,
} from 'react-icons/fi';
import { adminCmsApi } from '../../services/adminApi';
import Button from '../../components/ui/Button';
import FormInput from '../../components/ui/FormInput';

const emptyForm = {
  title: '', subtitle: '', description: '',
  ctaPrimaryLabel: 'Shop Now', ctaPrimaryLink: '/shop',
  placement: 'hero_slider', status: 'active',
};

const PLACEMENT_META = {
  hero_slider: 'Hero Slider',
  festival_offer: 'Festival Offer',
  limited_edition: 'Daily Update',
  announcement_popup: 'Announcement Popup',
};

const PLACEMENT_TABS = [{ key: 'all', label: 'All' }, ...Object.entries(PLACEMENT_META).map(([key, label]) => ({ key, label }))];

// Maps each fixed slug (matches the CMSPage model's enum) to a friendly
// label and its live public route, for display in the Pages tab.
const STATIC_PAGES_META = {
  'about-us': { label: 'About Us', path: '/about' },
  founder: { label: 'Founder', path: '/founder' },
  'privacy-policy': { label: 'Privacy Policy', path: '/privacy-policy' },
  'refund-policy': { label: 'Refund Policy', path: '/refund-policy' },
  'shipping-policy': { label: 'Shipping Policy', path: '/shipping-policy' },
  'cancellation-policy': { label: 'Cancellation Policy', path: '/cancellation-policy' },
  'terms-and-conditions': { label: 'Terms & Conditions', path: '/terms-and-conditions' },
  'accessibility-statement': { label: 'Accessibility Statement', path: '/accessibility-statement' },
};

const AdminCms = () => {
  const [activeTab, setActiveTab] = useState('banners'); // 'banners' | 'pages'

  return (
    <div className="px-6 py-8">
      <Helmet><title>CMS</title></Helmet>

      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-bamboo-800">Content Management</h1>
      </div>

      <div className="mt-5 flex gap-1 border-b border-sand-200">
        <button
          onClick={() => setActiveTab('banners')}
          className={`px-4 py-2.5 text-sm font-semibold transition-colors ${
            activeTab === 'banners'
              ? 'border-b-2 border-bamboo-700 text-bamboo-800'
              : 'text-bamboo-400 hover:text-bamboo-600'
          }`}
        >
          Homepage Banners
        </button>
        <button
          onClick={() => setActiveTab('pages')}
          className={`px-4 py-2.5 text-sm font-semibold transition-colors ${
            activeTab === 'pages'
              ? 'border-b-2 border-bamboo-700 text-bamboo-800'
              : 'text-bamboo-400 hover:text-bamboo-600'
          }`}
        >
          Static Pages
        </button>
      </div>

      <div className="mt-6">
        {activeTab === 'banners' ? <BannersTab /> : <PagesTab />}
      </div>
    </div>
  );
};

/* ------------------------------ Banners tab ------------------------------ */

const BannersTab = () => {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null); // null = create mode
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placementFilter, setPlacementFilter] = useState('all');

  const { data: banners, isLoading } = useQuery({
    queryKey: ['admin-banners'],
    queryFn: () => adminCmsApi.getBanners(),
    select: (res) => res.data.data.banners,
  });

  const filteredBanners = (banners || []).filter(
    (b) => placementFilter === 'all' || b.placement === placementFilter
  );

  const handleChange = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const openCreateForm = () => {
    setEditingBanner(null);
    setForm(emptyForm);
    setImageFile(null);
    setIsFormOpen(true);
  };

  const openEditForm = (banner) => {
    setEditingBanner(banner);
    setForm({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      description: banner.description || '',
      ctaPrimaryLabel: banner.ctaPrimaryLabel || 'Shop Now',
      ctaPrimaryLink: banner.ctaPrimaryLink || '/shop',
      placement: banner.placement || 'hero_slider',
      status: banner.status || 'active',
    });
    setImageFile(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingBanner(null);
    setForm(emptyForm);
    setImageFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingBanner && !imageFile) {
      toast.error('Please select a banner image');
      return;
    }
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);

      if (editingBanner) {
        await adminCmsApi.updateBanner(editingBanner._id, fd);
        toast.success('Banner updated');
      } else {
        await adminCmsApi.createBanner(fd);
        toast.success('Banner created');
      }
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
      closeForm();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not save banner');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this banner? This cannot be undone.')) return;
    try {
      await adminCmsApi.deleteBanner(id);
      toast.success('Banner deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not delete banner');
    }
  };

  const handleToggleStatus = async (banner) => {
    const nextStatus = banner.status === 'active' ? 'inactive' : 'active';
    try {
      const fd = new FormData();
      fd.append('status', nextStatus);
      await adminCmsApi.updateBanner(banner._id, fd);
      toast.success(nextStatus === 'active' ? 'Banner activated' : 'Banner deactivated');
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not update status');
    }
  };

  const handleReorder = async (banner, direction) => {
    // Assumes each banner has a `priority` / `order` field; adjust key to match your schema.
    const list = [...(banners || [])].sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
    const idx = list.findIndex((b) => b._id === banner._id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= list.length) return;

    const a = list[idx];
    const b = list[swapIdx];
    try {
      await Promise.all([
        adminCmsApi.updateBanner(a._id, (() => { const fd = new FormData(); fd.append('priority', b.priority ?? swapIdx); return fd; })()),
        adminCmsApi.updateBanner(b._id, (() => { const fd = new FormData(); fd.append('priority', a.priority ?? idx); return fd; })()),
      ]);
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
    } catch {
      toast.error('Could not reorder banners');
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {PLACEMENT_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setPlacementFilter(tab.key)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                placementFilter === tab.key
                  ? 'bg-bamboo-700 text-white'
                  : 'bg-sand-100 text-bamboo-600 hover:bg-sand-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <Button onClick={openCreateForm} className="!px-4 !py-2 text-sm">
          <FiPlus size={14} className="mr-1.5" /> Add Banner
        </Button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          [...Array(3)].map((_, i) => <div key={i} className="h-64 animate-pulse rounded-2xl bg-sand-100" />)
        ) : !filteredBanners.length ? (
          <p className="col-span-full py-8 text-center text-bamboo-400">
            {placementFilter === 'all'
              ? 'No banners yet — add one to populate the homepage hero slider.'
              : 'No banners for this placement yet.'}
          </p>
        ) : (
          filteredBanners.map((b, i) => (
            <div key={b._id} className="card overflow-hidden">
              <div className="relative aspect-video bg-sand-100">
                <img src={b.image?.url} alt={b.title} className="h-full w-full object-cover" />
                <span
                  className={`absolute left-2 top-2 flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold shadow-sm ${
                    b.status === 'active' ? 'bg-emerald-500 text-white' : 'bg-gray-400 text-white'
                  }`}
                >
                  {b.status === 'active' ? <FiEye size={11} /> : <FiEyeOff size={11} />}
                  {b.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="p-3">
                <p className="truncate font-medium text-bamboo-800">{b.title}</p>
                <p className="text-xs capitalize text-bamboo-400">{PLACEMENT_META[b.placement] || b.placement}</p>

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => openEditForm(b)}
                    className="flex items-center gap-1 text-xs font-semibold text-bamboo-600 hover:underline"
                  >
                    <FiEdit2 size={12} /> Edit
                  </button>
                  <button
                    onClick={() => handleToggleStatus(b)}
                    className="flex items-center gap-1 text-xs font-semibold text-amber-600 hover:underline"
                  >
                    {b.status === 'active' ? <FiEyeOff size={12} /> : <FiEye size={12} />}
                    {b.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                  {b.ctaPrimaryLink && (
                    <a
                      href={b.ctaPrimaryLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-xs font-semibold text-bamboo-600 hover:underline"
                    >
                      <FiExternalLink size={12} /> Preview
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete(b._id)}
                    className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:underline"
                  >
                    <FiTrash2 size={12} /> Delete
                  </button>
                  <div className="ml-auto flex items-center gap-1">
                    <button
                      onClick={() => handleReorder(b, 'up')}
                      disabled={i === 0}
                      title="Move up"
                      className="rounded p-1 text-bamboo-400 hover:bg-sand-100 disabled:opacity-30"
                    >
                      <FiArrowUp size={13} />
                    </button>
                    <button
                      onClick={() => handleReorder(b, 'down')}
                      disabled={i === filteredBanners.length - 1}
                      title="Move down"
                      className="rounded p-1 text-bamboo-400 hover:bg-sand-100 disabled:opacity-30"
                    >
                      <FiArrowDown size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
          <div className="max-h-full w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-bamboo-800">
                {editingBanner ? 'Edit Banner' : 'Add Banner'}
              </h2>
              <button onClick={closeForm} aria-label="Close" className="text-bamboo-400 hover:text-bamboo-700">
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <FormInput label="Title" value={form.title} onChange={(e) => handleChange('title', e.target.value)} required />
              <FormInput label="Subtitle" value={form.subtitle} onChange={(e) => handleChange('subtitle', e.target.value)} />
              <FormInput label="Description" value={form.description} onChange={(e) => handleChange('description', e.target.value)} />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Placement</label>
                  <select value={form.placement} onChange={(e) => handleChange('placement', e.target.value)} className="input-field">
                    <option value="hero_slider">Hero Slider</option>
                    <option value="festival_offer">Festival Offer</option>
                    <option value="limited_edition">Daily Update</option>
                    <option value="announcement_popup">Announcement Popup</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Status</label>
                  <select value={form.status} onChange={(e) => handleChange('status', e.target.value)} className="input-field">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <FormInput label="CTA Label" value={form.ctaPrimaryLabel} onChange={(e) => handleChange('ctaPrimaryLabel', e.target.value)} />
              <FormInput label="CTA Link" value={form.ctaPrimaryLink} onChange={(e) => handleChange('ctaPrimaryLink', e.target.value)} />

              <div>
                <label className="mb-1.5 block text-sm font-medium text-bamboo-700">
                  Banner Image {editingBanner && <span className="font-normal text-bamboo-400">(leave blank to keep current)</span>}
                </label>
                {editingBanner?.image?.url && !imageFile && (
                  <div className="mb-2 flex items-center gap-2">
                    <img src={editingBanner.image.url} alt="" className="h-16 w-28 rounded-lg object-cover" />
                    <span className="flex items-center gap-1 text-xs text-bamboo-400"><FiImage size={12} /> Current image</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="text-sm"
                  required={!editingBanner}
                />
              </div>

              <div className="flex gap-3 pt-1">
                <Button type="button" variant="secondary" className="flex-1" onClick={closeForm}>Cancel</Button>
                <Button type="submit" className="flex-1" isLoading={isSubmitting}>
                  {editingBanner ? 'Save Changes' : 'Create Banner'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

/* ------------------------------ Pages tab ------------------------------ */

const PagesTab = () => {
  const queryClient = useQueryClient();
  const [editingSlug, setEditingSlug] = useState(null);

  const { data: pages, isLoading } = useQuery({
    queryKey: ['admin-cms-pages'],
    queryFn: () => adminCmsApi.getPages(),
    select: (res) => res.data.data.pages,
  });

  const editingPage = pages?.find((p) => p.slug === editingSlug) || null;

  return (
    <>
      <p className="text-sm text-bamboo-500">
        These 8 pages are fixed to your sites routes (About, Privacy Policy, etc.). Edit each one to publish its content —
        pages left empty show a not published yet message to visitors.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {isLoading ? (
          [...Array(8)].map((_, i) => <div key={i} className="h-20 animate-pulse rounded-xl bg-sand-100" />)
        ) : (
          pages?.map((page) => {
            const meta = STATIC_PAGES_META[page.slug];
            const isPublished = Boolean(page.title?.trim() && page.content?.trim());
            return (
              <div key={page.slug} className="card flex items-center justify-between p-4">
                <div className="min-w-0">
                  <p className="truncate font-medium text-bamboo-800">{meta?.label ?? page.slug}</p>
                  <span
                    className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
                      isPublished ? 'bg-emerald-50 text-emerald-600' : 'bg-sand-100 text-bamboo-400'
                    }`}
                  >
                    {isPublished ? 'Published' : 'Not published'}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <a
                    href={meta?.path ?? '#'}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="View live page"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-bamboo-400 transition-colors hover:bg-sand-50 hover:text-bamboo-700"
                  >
                    <FiExternalLink size={15} />
                  </a>
                  <button
                    onClick={() => setEditingSlug(page.slug)}
                    aria-label="Edit page"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-bamboo-400 transition-colors hover:bg-sand-50 hover:text-bamboo-700"
                  >
                    <FiEdit2 size={15} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {editingPage && (
        <EditPageModal
          page={editingPage}
          label={STATIC_PAGES_META[editingPage.slug]?.label ?? editingPage.slug}
          onClose={() => setEditingSlug(null)}
          onSaved={() => {
            queryClient.invalidateQueries({ queryKey: ['admin-cms-pages'] });
            setEditingSlug(null);
          }}
        />
      )}
    </>
  );
};

const EditPageModal = ({ page, label, onClose, onSaved }) => {
  const [form, setForm] = useState({
    title: page.title ?? '',
    content: page.content ?? '',
    metaTitle: page.metaTitle ?? '',
    metaDescription: page.metaDescription ?? '',
  });
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (heroImageFile) fd.append('heroImage', heroImageFile);
      await adminCmsApi.updatePage(page.slug, fd);
      toast.success('Page saved');
      onSaved();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not save page');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
      <div className="max-h-full w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-bamboo-800">Edit — {label}</h2>
          <button onClick={onClose} aria-label="Close" className="text-bamboo-400 hover:text-bamboo-700">
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <FormInput label="Page Title" value={form.title} onChange={(e) => handleChange('title', e.target.value)} required />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Content (HTML)</label>
            <textarea
              value={form.content}
              onChange={(e) => handleChange('content', e.target.value)}
              rows={8}
              className="input-field font-mono text-xs"
              placeholder="<p>Your page content...</p>"
            />
            <p className="mt-1 text-xs text-bamboo-400">
              Rendered as raw HTML on the live page. Swap this for a rich-text editor later if you want a WYSIWYG experience.
            </p>
          </div>

          <FormInput label="Meta Title" value={form.metaTitle} onChange={(e) => handleChange('metaTitle', e.target.value)} />
          <FormInput
            label="Meta Description"
            value={form.metaDescription}
            onChange={(e) => handleChange('metaDescription', e.target.value)}
          />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Hero Image (optional)</label>
            {page.heroImage?.url && !heroImageFile && (
              <img src={page.heroImage.url} alt="" className="mb-2 h-24 w-full rounded-lg object-cover" />
            )}
            <input type="file" accept="image/*" onChange={(e) => setHeroImageFile(e.target.files[0])} className="text-sm" />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="flex-1" isLoading={isSubmitting}>Save</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCms;