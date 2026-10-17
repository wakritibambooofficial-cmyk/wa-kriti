// import { useState } from 'react';
// import { useQuery, useQueryClient } from '@tanstack/react-query';
// import { Helmet } from 'react-helmet-async';
// import toast from 'react-hot-toast';
// import { FiPlus, FiTrash2 } from 'react-icons/fi';
// import { contentApi } from '../../services/growthApi';
// import { adminContentApi } from '../../services/adminApi';
// import Button from '../../components/ui/Button';
// import FormInput from '../../components/ui/FormInput';

// const TABS = ['artisans', 'sustainability', 'species', 'certificates'];

// const emptyArtisanForm = { name: '', village: '', state: '', experienceYears: '0', story: '', quote: '', craftSpecialty: '' };
// const emptySpeciesForm = { name: '', scientificName: '', description: '', growthRegion: '', usedFor: '' };
// const emptyCertForm = { title: '', type: 'msme', issuedBy: '' };

// const AdminContent = () => {
//   const queryClient = useQueryClient();
//   const [tab, setTab] = useState('artisans');
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [artisanForm, setArtisanForm] = useState(emptyArtisanForm);
//   const [artisanPhoto, setArtisanPhoto] = useState(null);
//   const [speciesForm, setSpeciesForm] = useState(emptySpeciesForm);
//   const [speciesImage, setSpeciesImage] = useState(null);
//   const [certForm, setCertForm] = useState(emptyCertForm);
//   const [certFile, setCertFile] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const { data: artisans, isLoading: artisansLoading } = useQuery({
//     queryKey: ['admin-artisans'],
//     queryFn: () => adminContentApi.getArtisans(),
//     select: (res) => res.data.data.artisans,
//     enabled: tab === 'artisans',
//   });

//   const { data: stats, isLoading: statsLoading } = useQuery({
//     queryKey: ['admin-sustainability-stats'],
//     queryFn: () => contentApi.getSustainabilityStats(),
//     select: (res) => res.data.data.stats,
//     enabled: tab === 'sustainability',
//   });

//   const { data: species, isLoading: speciesLoading } = useQuery({
//     queryKey: ['admin-bamboo-species'],
//     queryFn: () => contentApi.getBambooSpecies(),
//     select: (res) => res.data.data.species,
//     enabled: tab === 'species',
//   });

//   const { data: certificates, isLoading: certsLoading } = useQuery({
//     queryKey: ['admin-certificates'],
//     queryFn: () => contentApi.getCertificates(),
//     select: (res) => res.data.data.certificates,
//     enabled: tab === 'certificates',
//   });

//   const handleCreateArtisan = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     try {
//       const fd = new FormData();
//       Object.entries(artisanForm).forEach(([k, v]) => fd.append(k, v));
//       if (artisanPhoto) fd.append('photo', artisanPhoto);
//       await adminContentApi.createArtisan(fd);
//       toast.success('Artisan profile created');
//       queryClient.invalidateQueries({ queryKey: ['admin-artisans'] });
//       setIsFormOpen(false);
//       setArtisanForm(emptyArtisanForm);
//     } catch (error) {
//       toast.error(error?.response?.data?.message || 'Could not create artisan');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDeleteArtisan = async (id) => {
//     await adminContentApi.deleteArtisan(id);
//     toast.success('Artisan deleted');
//     queryClient.invalidateQueries({ queryKey: ['admin-artisans'] });
//   };

//   const handleUpdateStat = async (key, value) => {
//     try {
//       await adminContentApi.updateSustainabilityStat(key, { value: Number(value) });
//       toast.success('Stat updated');
//       queryClient.invalidateQueries({ queryKey: ['admin-sustainability-stats'] });
//     } catch (error) {
//       toast.error(error?.response?.data?.message || 'Could not update stat');
//     }
//   };

//   const handleCreateSpecies = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     try {
//       const fd = new FormData();
//       Object.entries(speciesForm).forEach(([k, v]) => fd.append(k, v));
//       if (speciesImage) fd.append('image', speciesImage);
//       await adminContentApi.createBambooSpecies(fd);
//       toast.success('Species added');
//       queryClient.invalidateQueries({ queryKey: ['admin-bamboo-species'] });
//       setIsFormOpen(false);
//       setSpeciesForm(emptySpeciesForm);
//     } catch (error) {
//       toast.error(error?.response?.data?.message || 'Could not add species');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleCreateCertificate = async (e) => {
//     e.preventDefault();
//     if (!certFile) {
//       toast.error('Please select a certificate file');
//       return;
//     }
//     setIsSubmitting(true);
//     try {
//       const fd = new FormData();
//       Object.entries(certForm).forEach(([k, v]) => fd.append(k, v));
//       fd.append('file', certFile);
//       await adminContentApi.createCertificate(fd);
//       toast.success('Certificate uploaded');
//       queryClient.invalidateQueries({ queryKey: ['admin-certificates'] });
//       setIsFormOpen(false);
//       setCertForm(emptyCertForm);
//     } catch (error) {
//       toast.error(error?.response?.data?.message || 'Could not upload certificate');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDeleteCertificate = async (id) => {
//     await adminContentApi.deleteCertificate(id);
//     toast.success('Certificate deleted');
//     queryClient.invalidateQueries({ queryKey: ['admin-certificates'] });
//   };

//   return (
//     <div className="px-6 py-8">
//       <Helmet><title>Content Management</title></Helmet>
//       <h1 className="font-display text-2xl font-bold text-bamboo-800">Content Management</h1>

//       <div className="mt-5 flex gap-2"> 
//         {TABS.map((t) => (
//           <button key={t} onClick={() => setTab(t)} className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize ${tab === t ? 'bg-bamboo-600 text-white' : 'bg-white text-bamboo-600'}`}>
//             {t}
//           </button>
//         ))}
//       </div>

//       {tab === 'artisans' && (
//         <div className="mt-6">
//           <Button onClick={() => setIsFormOpen(true)} className="!px-4 !py-2 text-sm"><FiPlus size={14} className="mr-1.5" /> Add Artisan</Button>
//           <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//             {artisansLoading ? <p className="text-bamboo-400">Loading...</p> : artisans?.map((a) => (
//               <div key={a._id} className="card flex items-center gap-3 p-4">
//                 {a.photo?.url && <img src={a.photo.url} alt={a.name} className="h-12 w-12 rounded-full object-cover" />}
//                 <div className="flex-1">
//                   <p className="font-medium text-bamboo-800">{a.name}</p>
//                   <p className="text-xs text-bamboo-400">{a.village}, {a.state}</p>
//                 </div>
//                 <button onClick={() => handleDeleteArtisan(a._id)} className="text-red-500 hover:underline"><FiTrash2 size={13} /></button>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {tab === 'sustainability' && (
//         <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//           {statsLoading ? <p className="text-bamboo-400">Loading...</p> : stats?.map((stat) => (
//             <div key={stat._id} className="card p-4">
//               <p className="text-sm font-medium text-bamboo-800">{stat.label}</p>
//               <input
//                 type="number"
//                 defaultValue={stat.value}
//                 onBlur={(e) => e.target.value !== String(stat.value) && handleUpdateStat(stat.key, e.target.value)}
//                 className="input-field mt-2 !py-2"
//               />
//             </div>
//           ))}
//         </div>
//       )}

//       {tab === 'species' && (
//         <div className="mt-6">
//           <Button onClick={() => setIsFormOpen(true)} className="!px-4 !py-2 text-sm"><FiPlus size={14} className="mr-1.5" /> Add Species</Button>
//           <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//             {speciesLoading ? <p className="text-bamboo-400">Loading...</p> : species?.map((s) => (
//               <div key={s._id} className="card p-4">
//                 <p className="font-medium text-bamboo-800">{s.name}</p>
//                 <p className="text-xs italic text-bamboo-400">{s.scientificName}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {tab === 'certificates' && (
//         <div className="mt-6">
//           <Button onClick={() => setIsFormOpen(true)} className="!px-4 !py-2 text-sm"><FiPlus size={14} className="mr-1.5" /> Upload Certificate</Button>
//           <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//             {certsLoading ? <p className="text-bamboo-400">Loading...</p> : certificates?.map((c) => (
//               <div key={c._id} className="card p-4">
//                 <p className="font-medium text-bamboo-800">{c.title}</p>
//                 <p className="text-xs uppercase text-bamboo-400">{c.type}</p>
//                 <button onClick={() => handleDeleteCertificate(c._id)} className="mt-2 flex items-center gap-1 text-xs font-semibold text-red-500 hover:underline">
//                   <FiTrash2 size={12} /> Delete
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Forms */}
//       {isFormOpen && tab === 'artisans' && (
//         <FormModal title="Add Artisan" onClose={() => setIsFormOpen(false)} onSubmit={handleCreateArtisan} isSubmitting={isSubmitting}>
//           <FormInput label="Name" value={artisanForm.name} onChange={(e) => setArtisanForm((f) => ({ ...f, name: e.target.value }))} required />
//           <div className="grid grid-cols-2 gap-3">
//             <FormInput label="Village" value={artisanForm.village} onChange={(e) => setArtisanForm((f) => ({ ...f, village: e.target.value }))} />
//             <FormInput label="State" value={artisanForm.state} onChange={(e) => setArtisanForm((f) => ({ ...f, state: e.target.value }))} />
//           </div>
//           <FormInput label="Experience (years)" type="number" value={artisanForm.experienceYears} onChange={(e) => setArtisanForm((f) => ({ ...f, experienceYears: e.target.value }))} />
//           <FormInput label="Craft Specialty" value={artisanForm.craftSpecialty} onChange={(e) => setArtisanForm((f) => ({ ...f, craftSpecialty: e.target.value }))} />
//           <FormInput label="Quote" value={artisanForm.quote} onChange={(e) => setArtisanForm((f) => ({ ...f, quote: e.target.value }))} />
//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Story</label>
//             <textarea value={artisanForm.story} onChange={(e) => setArtisanForm((f) => ({ ...f, story: e.target.value }))} className="input-field min-h-[100px]" />
//           </div>
//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Photo</label>
//             <input type="file" accept="image/*" onChange={(e) => setArtisanPhoto(e.target.files[0])} className="text-sm" />
//           </div>
//         </FormModal>
//       )}

//       {isFormOpen && tab === 'species' && (
//         <FormModal title="Add Bamboo Species" onClose={() => setIsFormOpen(false)} onSubmit={handleCreateSpecies} isSubmitting={isSubmitting}>
//           <FormInput label="Name" value={speciesForm.name} onChange={(e) => setSpeciesForm((f) => ({ ...f, name: e.target.value }))} required />
//           <FormInput label="Scientific Name" value={speciesForm.scientificName} onChange={(e) => setSpeciesForm((f) => ({ ...f, scientificName: e.target.value }))} />
//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Description</label>
//             <textarea value={speciesForm.description} onChange={(e) => setSpeciesForm((f) => ({ ...f, description: e.target.value }))} className="input-field min-h-[100px]" />
//           </div>
//           <FormInput label="Growth Region" value={speciesForm.growthRegion} onChange={(e) => setSpeciesForm((f) => ({ ...f, growthRegion: e.target.value }))} />
//           <FormInput label="Used For (comma-separated)" value={speciesForm.usedFor} onChange={(e) => setSpeciesForm((f) => ({ ...f, usedFor: e.target.value }))} />
//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Image</label>
//             <input type="file" accept="image/*" onChange={(e) => setSpeciesImage(e.target.files[0])} className="text-sm" />
//           </div>
//         </FormModal>
//       )}

//       {isFormOpen && tab === 'certificates' && (
//         <FormModal title="Upload Certificate" onClose={() => setIsFormOpen(false)} onSubmit={handleCreateCertificate} isSubmitting={isSubmitting}>
//           <FormInput label="Title" value={certForm.title} onChange={(e) => setCertForm((f) => ({ ...f, title: e.target.value }))} required />
//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Type</label>
//             <select value={certForm.type} onChange={(e) => setCertForm((f) => ({ ...f, type: e.target.value }))} className="input-field">
//               <option value="msme">MSME</option>
//               <option value="gst">GST</option>
//               <option value="trademark">Trademark</option>
//               <option value="fssai">FSSAI</option>
//               <option value="quality">Quality</option>
//               <option value="eco_certification">Eco Certification</option>
//               <option value="other">Other</option>
//             </select> 
//           </div>
//           <FormInput label="Issued By" value={certForm.issuedBy} onChange={(e) => setCertForm((f) => ({ ...f, issuedBy: e.target.value }))} />
//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Certificate File</label>
//             <input type="file" onChange={(e) => setCertFile(e.target.files[0])} className="text-sm" required />
//           </div>
//         </FormModal>
//       )}
//     </div>
//   );
// };

// const FormModal = ({ title, onClose, onSubmit, isSubmitting, children }) => (
//   <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-4 py-8">
//     <div className="w-full max-w-lg rounded-2xl bg-white p-6">
//       <h2 className="font-display text-lg font-semibold text-bamboo-800">{title}</h2>
//       <form onSubmit={onSubmit} className="mt-4 max-h-[65vh] space-y-4 overflow-y-auto pr-1">
//         {children}
//         <div className="flex gap-3 pt-2">
//           <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
//           <Button type="submit" className="flex-1" isLoading={isSubmitting}>Save</Button>
//         </div>
//       </form>
//     </div>
//   </div>
// );

// export default AdminContent;

import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { adminContentApi } from '../../services/adminApi';
import Button from '../../components/ui/Button';
import FormInput from '../../components/ui/FormInput';

const TABS = ['artisans', 'sustainability', 'species', 'certificates'];

const emptyArtisanForm = { name: '', village: '', state: '', experienceYears: '0', story: '', quote: '', craftSpecialty: '' };
const emptySpeciesForm = { name: '', scientificName: '', description: '', growthRegion: '', usedFor: '' };
const emptyCertForm = { title: '', type: 'msme', issuedBy: '' };

const AdminContent = () => {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState('artisans');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [artisanForm, setArtisanForm] = useState(emptyArtisanForm);
  const [artisanPhoto, setArtisanPhoto] = useState(null);
  const [editingArtisanId, setEditingArtisanId] = useState(null);

  const [speciesForm, setSpeciesForm] = useState(emptySpeciesForm);
  const [speciesImage, setSpeciesImage] = useState(null);
  const [editingSpeciesId, setEditingSpeciesId] = useState(null);

  const [certForm, setCertForm] = useState(emptyCertForm);
  const [certFile, setCertFile] = useState(null);
  const [editingCertId, setEditingCertId] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: artisans, isLoading: artisansLoading } = useQuery({
    queryKey: ['admin-artisans'],
    queryFn: () => adminContentApi.getArtisans(),
    select: (res) => res.data.data.artisans,
    enabled: tab === 'artisans',
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-sustainability-stats'],
    queryFn: () => adminContentApi.getSustainabilityStats(),
    select: (res) => res.data.data.stats,
    enabled: tab === 'sustainability',
  });

  const { data: species, isLoading: speciesLoading } = useQuery({
    queryKey: ['admin-bamboo-species'],
    queryFn: () => adminContentApi.getBambooSpecies(),
    select: (res) => res.data.data.species,
    enabled: tab === 'species',
  });

  const { data: certificates, isLoading: certsLoading } = useQuery({
    queryKey: ['admin-certificates'],
    queryFn: () => adminContentApi.getCertificates(),
    select: (res) => res.data.data.certificates,
    enabled: tab === 'certificates',
  });

  const closeForm = () => setIsFormOpen(false);

  /* --------------------------------- Artisans -------------------------------- */

  const openCreateArtisan = () => {
    setEditingArtisanId(null);
    setArtisanForm(emptyArtisanForm);
    setArtisanPhoto(null);
    setIsFormOpen(true);
  };

  const openEditArtisan = (a) => {
    setEditingArtisanId(a._id);
    setArtisanForm({
      name: a.name ?? '',
      village: a.village ?? '',
      state: a.state ?? '',
      experienceYears: String(a.experienceYears ?? '0'),
      story: a.story ?? '',
      quote: a.quote ?? '',
      craftSpecialty: a.craftSpecialty ?? '',
    });
    setArtisanPhoto(null);
    setIsFormOpen(true);
  };

  const handleSubmitArtisan = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(artisanForm).forEach(([k, v]) => fd.append(k, v));
      if (artisanPhoto) fd.append('photo', artisanPhoto);

      if (editingArtisanId) {
        await adminContentApi.updateArtisan(editingArtisanId, fd);
        toast.success('Artisan profile updated');
      } else {
        await adminContentApi.createArtisan(fd);
        toast.success('Artisan profile created');
      }
      queryClient.invalidateQueries({ queryKey: ['admin-artisans'] });
      setIsFormOpen(false);
      setEditingArtisanId(null);
      setArtisanForm(emptyArtisanForm);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not save artisan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteArtisan = async (id) => {
    try {
      await adminContentApi.deleteArtisan(id);
      toast.success('Artisan deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-artisans'] });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not delete artisan');
    }
  };

  /* ------------------------------ Sustainability ------------------------------ */

  const handleUpdateStat = async (key, value) => {
    try {
      await adminContentApi.updateSustainabilityStat(key, { value: Number(value) });
      toast.success('Stat updated');
      queryClient.invalidateQueries({ queryKey: ['admin-sustainability-stats'] });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not update stat');
    }
  };

  const handleDeleteStat = async (key) => {
    try {
      await adminContentApi.deleteSustainabilityStat(key);
      toast.success('Stat deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-sustainability-stats'] });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not delete stat');
    }
  };

  /* ---------------------------------- Species --------------------------------- */

  const openCreateSpecies = () => {
    setEditingSpeciesId(null);
    setSpeciesForm(emptySpeciesForm);
    setSpeciesImage(null);
    setIsFormOpen(true);
  };

  const openEditSpecies = (s) => {
    setEditingSpeciesId(s._id);
    setSpeciesForm({
      name: s.name ?? '',
      scientificName: s.scientificName ?? '',
      description: s.description ?? '',
      growthRegion: s.growthRegion ?? '',
      usedFor: Array.isArray(s.usedFor) ? s.usedFor.join(', ') : s.usedFor ?? '',
    });
    setSpeciesImage(null);
    setIsFormOpen(true);
  };

  const handleSubmitSpecies = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(speciesForm).forEach(([k, v]) => fd.append(k, v));
      if (speciesImage) fd.append('image', speciesImage);

      if (editingSpeciesId) {
        await adminContentApi.updateBambooSpecies(editingSpeciesId, fd);
        toast.success('Species updated');
      } else {
        await adminContentApi.createBambooSpecies(fd);
        toast.success('Species added');
      }
      queryClient.invalidateQueries({ queryKey: ['admin-bamboo-species'] });
      setIsFormOpen(false);
      setEditingSpeciesId(null);
      setSpeciesForm(emptySpeciesForm);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not save species');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSpecies = async (id) => {
    try {
      await adminContentApi.deleteBambooSpecies(id);
      toast.success('Species deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-bamboo-species'] });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not delete species');
    }
  };

  /* -------------------------------- Certificates ------------------------------- */

  const openCreateCertificate = () => {
    setEditingCertId(null);
    setCertForm(emptyCertForm);
    setCertFile(null);
    setIsFormOpen(true);
  };

  const openEditCertificate = (c) => {
    setEditingCertId(c._id);
    setCertForm({
      title: c.title ?? '',
      type: c.type ?? 'msme',
      issuedBy: c.issuedBy ?? '',
    });
    setCertFile(null);
    setIsFormOpen(true);
  };

  const handleSubmitCertificate = async (e) => {
    e.preventDefault();
    if (!editingCertId && !certFile) {
      toast.error('Please select a certificate file');
      return;
    }
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(certForm).forEach(([k, v]) => fd.append(k, v));
      if (certFile) fd.append('file', certFile);

      if (editingCertId) {
        await adminContentApi.updateCertificate(editingCertId, fd);
        toast.success('Certificate updated');
      } else {
        await adminContentApi.createCertificate(fd);
        toast.success('Certificate uploaded');
      }
      queryClient.invalidateQueries({ queryKey: ['admin-certificates'] });
      setIsFormOpen(false);
      setEditingCertId(null);
      setCertForm(emptyCertForm);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not save certificate');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCertificate = async (id) => {
    try {
      await adminContentApi.deleteCertificate(id);
      toast.success('Certificate deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-certificates'] });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not delete certificate');
    }
  };

  const addButtonFor = {
    artisans: { label: 'Add Artisan', onClick: openCreateArtisan },
    species: { label: 'Add Species', onClick: openCreateSpecies },
    certificates: { label: 'Upload Certificate', onClick: openCreateCertificate },
  };

  return (
    <div className="px-6 py-8">
      <Helmet><title>Content Management</title></Helmet>
      <h1 className="font-display text-2xl font-bold text-bamboo-800">Content Management</h1>

      <div className="mt-5 flex gap-2">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize ${tab === t ? 'bg-bamboo-600 text-white' : 'bg-white text-bamboo-600'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'artisans' && (
        <div className="mt-6">
          <Button onClick={addButtonFor.artisans.onClick} className="!px-4 !py-2 text-sm"><FiPlus size={14} className="mr-1.5" /> {addButtonFor.artisans.label}</Button>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {artisansLoading ? <p className="text-bamboo-400">Loading...</p> : artisans?.map((a) => (
              <div key={a._id} className="card flex items-center gap-3 p-4">
                {a.photo?.url && <img src={a.photo.url} alt={a.name} className="h-12 w-12 rounded-full object-cover" />}
                <div className="flex-1">
                  <p className="font-medium text-bamboo-800">{a.name}</p>
                  <p className="text-xs text-bamboo-400">{a.village}, {a.state}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => openEditArtisan(a)} className="text-bamboo-500 hover:underline"><FiEdit2 size={13} /></button>
                  <button onClick={() => handleDeleteArtisan(a._id)} className="text-red-500 hover:underline"><FiTrash2 size={13} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'sustainability' && (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {statsLoading ? <p className="text-bamboo-400">Loading...</p> : stats?.map((stat) => (
            <StatCard key={stat._id} stat={stat} onSave={handleUpdateStat} onDelete={handleDeleteStat} />
          ))}
        </div>
      )}

      {tab === 'species' && (
        <div className="mt-6">
          <Button onClick={addButtonFor.species.onClick} className="!px-4 !py-2 text-sm"><FiPlus size={14} className="mr-1.5" /> {addButtonFor.species.label}</Button>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {speciesLoading ? <p className="text-bamboo-400">Loading...</p> : species?.map((s) => (
              <div key={s._id} className="card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-bamboo-800">{s.name}</p>
                    <p className="text-xs italic text-bamboo-400">{s.scientificName}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => openEditSpecies(s)} className="text-bamboo-500 hover:underline"><FiEdit2 size={13} /></button>
                    <button onClick={() => handleDeleteSpecies(s._id)} className="text-red-500 hover:underline"><FiTrash2 size={13} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'certificates' && (
        <div className="mt-6">
          <Button onClick={addButtonFor.certificates.onClick} className="!px-4 !py-2 text-sm"><FiPlus size={14} className="mr-1.5" /> {addButtonFor.certificates.label}</Button>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {certsLoading ? <p className="text-bamboo-400">Loading...</p> : certificates?.map((c) => (
              <div key={c._id} className="card p-4">
                <p className="font-medium text-bamboo-800">{c.title}</p>
                <p className="text-xs uppercase text-bamboo-400">{c.type}</p>
                <div className="mt-2 flex items-center gap-4">
                  <button onClick={() => openEditCertificate(c)} className="flex items-center gap-1 text-xs font-semibold text-bamboo-600 hover:underline">
                    <FiEdit2 size={12} /> Edit
                  </button>
                  <button onClick={() => handleDeleteCertificate(c._id)} className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:underline">
                    <FiTrash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Forms */}
      {isFormOpen && tab === 'artisans' && (
        <FormModal title={editingArtisanId ? 'Edit Artisan' : 'Add Artisan'} onClose={closeForm} onSubmit={handleSubmitArtisan} isSubmitting={isSubmitting}>
          <FormInput label="Name" value={artisanForm.name} onChange={(e) => setArtisanForm((f) => ({ ...f, name: e.target.value }))} required />
          <div className="grid grid-cols-2 gap-3">
            <FormInput label="Village" value={artisanForm.village} onChange={(e) => setArtisanForm((f) => ({ ...f, village: e.target.value }))} />
            <FormInput label="State" value={artisanForm.state} onChange={(e) => setArtisanForm((f) => ({ ...f, state: e.target.value }))} />
          </div>
          <FormInput label="Experience (years)" type="number" value={artisanForm.experienceYears} onChange={(e) => setArtisanForm((f) => ({ ...f, experienceYears: e.target.value }))} />
          <FormInput label="Craft Specialty" value={artisanForm.craftSpecialty} onChange={(e) => setArtisanForm((f) => ({ ...f, craftSpecialty: e.target.value }))} />
          <FormInput label="Quote" value={artisanForm.quote} onChange={(e) => setArtisanForm((f) => ({ ...f, quote: e.target.value }))} />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Story</label>
            <textarea value={artisanForm.story} onChange={(e) => setArtisanForm((f) => ({ ...f, story: e.target.value }))} className="input-field min-h-[100px]" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Photo {editingArtisanId && <span className="font-normal text-bamboo-400">(leave empty to keep current)</span>}</label>
            <input type="file" accept="image/*" onChange={(e) => setArtisanPhoto(e.target.files[0])} className="text-sm" />
          </div>
        </FormModal>
      )}

      {isFormOpen && tab === 'species' && (
        <FormModal title={editingSpeciesId ? 'Edit Bamboo Species' : 'Add Bamboo Species'} onClose={closeForm} onSubmit={handleSubmitSpecies} isSubmitting={isSubmitting}>
          <FormInput label="Name" value={speciesForm.name} onChange={(e) => setSpeciesForm((f) => ({ ...f, name: e.target.value }))} required />
          <FormInput label="Scientific Name" value={speciesForm.scientificName} onChange={(e) => setSpeciesForm((f) => ({ ...f, scientificName: e.target.value }))} />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Description</label>
            <textarea value={speciesForm.description} onChange={(e) => setSpeciesForm((f) => ({ ...f, description: e.target.value }))} className="input-field min-h-[100px]" />
          </div>
          <FormInput label="Growth Region" value={speciesForm.growthRegion} onChange={(e) => setSpeciesForm((f) => ({ ...f, growthRegion: e.target.value }))} />
          <FormInput label="Used For (comma-separated)" value={speciesForm.usedFor} onChange={(e) => setSpeciesForm((f) => ({ ...f, usedFor: e.target.value }))} />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Image {editingSpeciesId && <span className="font-normal text-bamboo-400">(leave empty to keep current)</span>}</label>
            <input type="file" accept="image/*" onChange={(e) => setSpeciesImage(e.target.files[0])} className="text-sm" />
          </div>
        </FormModal>
      )}

      {isFormOpen && tab === 'certificates' && (
        <FormModal title={editingCertId ? 'Edit Certificate' : 'Upload Certificate'} onClose={closeForm} onSubmit={handleSubmitCertificate} isSubmitting={isSubmitting}>
          <FormInput label="Title" value={certForm.title} onChange={(e) => setCertForm((f) => ({ ...f, title: e.target.value }))} required />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Type</label>
            <select value={certForm.type} onChange={(e) => setCertForm((f) => ({ ...f, type: e.target.value }))} className="input-field">
              <option value="msme">MSME</option>
              <option value="gst">GST</option>
              <option value="trademark">Trademark</option>
              <option value="fssai">FSSAI</option>
              <option value="quality">Quality</option>
              <option value="eco_certification">Eco Certification</option>
              <option value="other">Other</option>
            </select>
          </div>
          <FormInput label="Issued By" value={certForm.issuedBy} onChange={(e) => setCertForm((f) => ({ ...f, issuedBy: e.target.value }))} />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-bamboo-700">
              Certificate File {editingCertId && <span className="font-normal text-bamboo-400">(leave empty to keep current)</span>}
            </label>
            <input type="file" onChange={(e) => setCertFile(e.target.files[0])} className="text-sm" required={!editingCertId} />
          </div>
        </FormModal>
      )}
    </div>
  );
};

/**
 * Sustainability stat card: value is a controlled input held in local
 * "draft" state, so typing never touches the DB. The Save button is
 * disabled until the draft differs from the saved value, and the DB
 * update only fires when the admin explicitly clicks Save.
 */
const StatCard = ({ stat, onSave, onDelete }) => {
  const [draft, setDraft] = useState(String(stat.value));
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setDraft(String(stat.value));
  }, [stat.value]);

  const isDirty = draft !== String(stat.value);

  const handleSave = async () => {
    if (!isDirty) return;
    setIsSaving(true);
    try {
      await onSave(stat.key, draft);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-bamboo-800">{stat.label}</p>
        <button onClick={() => onDelete(stat.key)} className="text-red-500 hover:underline"><FiTrash2 size={13} /></button>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <input
          type="number"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="input-field !py-2"
        />
        <Button
          type="button"
          onClick={handleSave}
          disabled={!isDirty || isSaving}
          className="!px-3 !py-2 text-xs"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  );
};

const FormModal = ({ title, onClose, onSubmit, isSubmitting, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-4 py-8">
    <div className="w-full max-w-lg rounded-2xl bg-white p-6">
      <h2 className="font-display text-lg font-semibold text-bamboo-800">{title}</h2>
      <form onSubmit={onSubmit} className="mt-4 max-h-[65vh] space-y-4 overflow-y-auto pr-1">
        {children}
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" className="flex-1" isLoading={isSubmitting}>Save</Button>
        </div>
      </form>
    </div>
  </div>
);

export default AdminContent;