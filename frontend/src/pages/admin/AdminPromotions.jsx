

// import { useState } from 'react';
// import { useQuery, useQueryClient } from '@tanstack/react-query';
// import { Helmet } from 'react-helmet-async';
// import toast from 'react-hot-toast';
// import { FiPlus, FiTrash2 } from 'react-icons/fi';
// import { productApi } from '../../services/productApi';
// import { adminPromotionApi } from '../../services/adminApi';
// import Button from '../../components/ui/Button';
// import FormInput from '../../components/ui/FormInput';

// const emptyComboForm = { title: '', description: '', promotionType: 'bundle_discount', products: [], bundlePrice: '', eligibleProduct: '', buyQuantity: '2', getQuantity: '1', freeProduct: '', endDate: '' };
// const emptyHamperForm = { name: '', description: '', maxItems: '6', packagingCost: '99', availableProducts: [] };

// const AdminPromotions = () => {
//   const queryClient = useQueryClient();
//   const [tab, setTab] = useState('combos');
//   const [isComboFormOpen, setIsComboFormOpen] = useState(false);
//   const [isHamperFormOpen, setIsHamperFormOpen] = useState(false);
//   const [comboForm, setComboForm] = useState(emptyComboForm);
//   const [hamperForm, setHamperForm] = useState(emptyHamperForm);
//   const [comboImage, setComboImage] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const { data: products = [] } = useQuery({
//     queryKey: ['admin-products-lite2'],
//     queryFn: () => productApi.getProducts({ status: 'all', limit: 100 }),
//     select: (res) => res.data.data.products,
//   });

//   const { data: combos, isLoading: combosLoading } = useQuery({
//     queryKey: ['admin-combo-offers'],
//     queryFn: () => adminPromotionApi.getComboOffers(),
//     select: (res) => res.data.data.offers,
//   });

//   const { data: hampers, isLoading: hampersLoading } = useQuery({
//     queryKey: ['admin-hamper-templates'],
//     queryFn: () => adminPromotionApi.getHamperTemplates(),
//     select: (res) => res.data.data.templates,
//   });

//   // FIX: only append the fields relevant to the selected promotionType.
//   // Sending eligibleProduct/freeProduct as '' for a bundle_discount offer
//   // (or products/bundlePrice for a buy_x_get_y offer) is what was causing
//   // the "Invalid ID" Zod validation failures.
//   const handleCreateCombo = async (e) => {
//     e.preventDefault();

//     if (comboForm.promotionType === 'bundle_discount' && comboForm.products.length === 0) {
//       toast.error('Select at least one product for the bundle');
//       return;
//     }
//     if (comboForm.promotionType === 'buy_x_get_y' && !comboForm.eligibleProduct) {
//       toast.error('Select an eligible product');
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const fd = new FormData();
//       fd.append('title', comboForm.title);
//       fd.append('description', comboForm.description);
//       fd.append('promotionType', comboForm.promotionType);
//       if (comboForm.endDate) fd.append('endDate', comboForm.endDate);

//       if (comboForm.promotionType === 'bundle_discount') {
//         fd.append('products', JSON.stringify(comboForm.products));
//         fd.append('bundlePrice', comboForm.bundlePrice);
//       } else {
//         fd.append('eligibleProduct', comboForm.eligibleProduct);
//         fd.append('buyQuantity', comboForm.buyQuantity);
//         fd.append('getQuantity', comboForm.getQuantity);
//         if (comboForm.freeProduct) fd.append('freeProduct', comboForm.freeProduct);
//       }

//       if (comboImage) fd.append('image', comboImage);

//       await adminPromotionApi.createComboOffer(fd);
//       toast.success('Combo offer created');
//       queryClient.invalidateQueries({ queryKey: ['admin-combo-offers'] });
//       setIsComboFormOpen(false);
//       setComboForm(emptyComboForm);
//       setComboImage(null);
//     } catch (error) {
//       toast.error(error?.response?.data?.message || 'Could not create offer');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDeleteCombo = async (id) => {
//     try {
//       await adminPromotionApi.deleteComboOffer(id);
//       toast.success('Offer deleted');
//       queryClient.invalidateQueries({ queryKey: ['admin-combo-offers'] });
//     } catch (error) {
//       toast.error(error?.response?.data?.message || 'Could not delete offer');
//     }
//   };

//   const handleCreateHamper = async (e) => {
//     e.preventDefault();

//     if (hamperForm.availableProducts.length === 0) {
//       toast.error('Select at least one product for the hamper template');
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       await adminPromotionApi.createHamperTemplate({
//         ...hamperForm,
//         maxItems: Number(hamperForm.maxItems),
//         packagingCost: Number(hamperForm.packagingCost),
//         basketOptions: [{ name: 'Classic Basket', price: 199 }, { name: 'Premium Basket', price: 349 }],
//       });
//       toast.success('Hamper template created');
//       queryClient.invalidateQueries({ queryKey: ['admin-hamper-templates'] });
//       setIsHamperFormOpen(false);
//       setHamperForm(emptyHamperForm);
//     } catch (error) {
//       toast.error(error?.response?.data?.message || 'Could not create hamper template');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDeleteHamper = async (id) => {
//     try {
//       await adminPromotionApi.deleteHamperTemplate(id);
//       toast.success('Hamper template deleted');
//       queryClient.invalidateQueries({ queryKey: ['admin-hamper-templates'] });
//     } catch (error) {
//       toast.error(error?.response?.data?.message || 'Could not delete hamper template');
//     }
//   };

//   const toggleProductSelection = (setList, key, productId) => {
//     setList((f) => ({
//       ...f,
//       [key]: f[key].includes(productId) ? f[key].filter((id) => id !== productId) : [...f[key], productId],
//     }));
//   };

//   return (
//     <div className="px-6 py-8">
//       <Helmet><title>Promotions</title></Helmet>
//       <h1 className="font-display text-2xl font-bold text-bamboo-800">Promotions</h1>

//       <div className="mt-5 flex gap-2">
//         <button onClick={() => setTab('combos')} className={`rounded-full px-4 py-1.5 text-xs font-semibold ${tab === 'combos' ? 'bg-bamboo-600 text-white' : 'bg-white text-bamboo-600'}`}>
//           Combo Offers
//         </button>
//         <button onClick={() => setTab('hampers')} className={`rounded-full px-4 py-1.5 text-xs font-semibold ${tab === 'hampers' ? 'bg-bamboo-600 text-white' : 'bg-white text-bamboo-600'}`}>
//           Gift Hampers
//         </button>
//       </div>

//       {tab === 'combos' && (
//         <div className="mt-6">
//           <Button onClick={() => setIsComboFormOpen(true)} className="!px-4 !py-2 text-sm"><FiPlus size={14} className="mr-1.5" /> New Combo Offer</Button>

//           <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//             {combosLoading ? (
//               <p className="text-bamboo-400">Loading...</p>
//             ) : combos?.length ? (
//               combos.map((offer) => (
//                 <div key={offer._id} className="card p-4">
//                   <p className="font-medium text-bamboo-800">{offer.title}</p>
//                   <p className="text-xs capitalize text-bamboo-400">{offer.promotionType.replace(/_/g, ' ')}</p>
//                   <p className="mt-1 text-xs text-bamboo-500">{offer.description}</p>
//                   <button onClick={() => handleDeleteCombo(offer._id)} className="mt-2 flex items-center gap-1 text-xs font-semibold text-red-500 hover:underline">
//                     <FiTrash2 size={12} /> Delete
//                   </button>
//                 </div>
//               ))
//             ) : (
//               <p className="text-sm text-bamboo-400">No combo offers yet.</p>
//             )}
//           </div>
//         </div>
//       )}

//       {tab === 'hampers' && (
//         <div className="mt-6">
//           <Button onClick={() => setIsHamperFormOpen(true)} className="!px-4 !py-2 text-sm"><FiPlus size={14} className="mr-1.5" /> New Hamper Template</Button>
//           <p className="mt-3 text-sm text-bamboo-500">
//             Hamper templates let customers build custom gift boxes from selected products on the storefront.
//           </p>

//           <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//             {hampersLoading ? (
//               <p className="text-bamboo-400">Loading...</p>
//             ) : hampers?.length ? (
//               hampers.map((template) => (
//                 <div key={template._id} className="card p-4">
//                   <p className="font-medium text-bamboo-800">{template.name}</p>
//                   <p className="mt-1 text-xs text-bamboo-500">{template.description}</p>
//                   <p className="mt-1 text-xs text-bamboo-400">
//                     Max {template.maxItems} items · Packaging ₹{template.packagingCost}
//                   </p>
//                   <p className="mt-1 text-xs text-bamboo-400">
//                     {template.availableProducts?.length || 0} eligible products
//                   </p>
//                   <button onClick={() => handleDeleteHamper(template._id)} className="mt-2 flex items-center gap-1 text-xs font-semibold text-red-500 hover:underline">
//                     <FiTrash2 size={12} /> Delete
//                   </button>
//                 </div>
//               ))
//             ) : (
//               <p className="text-sm text-bamboo-400">No hamper templates yet.</p>
//             )}
//           </div>
//         </div>
//       )}

//       {isComboFormOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-4 py-8">
//           <div className="w-full max-w-lg rounded-2xl bg-white p-6">
//             <h2 className="font-display text-lg font-semibold text-bamboo-800">New Combo Offer</h2>
//             <form onSubmit={handleCreateCombo} className="mt-4 max-h-[65vh] space-y-4 overflow-y-auto pr-1">
//               <FormInput label="Title" value={comboForm.title} onChange={(e) => setComboForm((f) => ({ ...f, title: e.target.value }))} required />
//               <FormInput label="Description" value={comboForm.description} onChange={(e) => setComboForm((f) => ({ ...f, description: e.target.value }))} />
//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Promotion Type</label>
//                 <select value={comboForm.promotionType} onChange={(e) => setComboForm((f) => ({ ...f, promotionType: e.target.value }))} className="input-field">
//                   <option value="bundle_discount">Bundle Discount</option>
//                   <option value="buy_x_get_y">Buy X Get Y (e.g. Buy 2 Get 1 Free)</option>
//                 </select>
//               </div>

//               {comboForm.promotionType === 'bundle_discount' ? (
//                 <>
//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Select Products (bundle)</label>
//                     <div className="max-h-32 space-y-1 overflow-y-auto rounded-lg border border-sand-300 p-2">
//                       {products.map((p) => (
//                         <label key={p._id} className="flex items-center gap-2 text-sm text-bamboo-600">
//                           <input
//                             type="checkbox"
//                             checked={comboForm.products.includes(p._id)}
//                             onChange={() => toggleProductSelection(setComboForm, 'products', p._id)}
//                           />
//                           {p.name} (₹{p.price})
//                         </label>
//                       ))}
//                     </div>
//                   </div>
//                   <FormInput label="Bundle Price" type="number" value={comboForm.bundlePrice} onChange={(e) => setComboForm((f) => ({ ...f, bundlePrice: e.target.value }))} required />
//                 </>
//               ) : (
//                 <>
//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Eligible Product (Buy)</label>
//                     <select value={comboForm.eligibleProduct} onChange={(e) => setComboForm((f) => ({ ...f, eligibleProduct: e.target.value }))} className="input-field" required>
//                       <option value="">Select product</option>
//                       {products.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
//                     </select>
//                   </div>
//                   <div className="grid grid-cols-2 gap-3">
//                     <FormInput label="Buy Quantity" type="number" value={comboForm.buyQuantity} onChange={(e) => setComboForm((f) => ({ ...f, buyQuantity: e.target.value }))} />
//                     <FormInput label="Get Quantity Free" type="number" value={comboForm.getQuantity} onChange={(e) => setComboForm((f) => ({ ...f, getQuantity: e.target.value }))} />
//                   </div>
//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Free Product (optional, defaults to same product)</label>
//                     <select value={comboForm.freeProduct} onChange={(e) => setComboForm((f) => ({ ...f, freeProduct: e.target.value }))} className="input-field">
//                       <option value="">Same as eligible product</option>
//                       {products.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
//                     </select>
//                   </div>
//                 </>
//               )}

//               <FormInput label="End Date (optional)" type="date" value={comboForm.endDate} onChange={(e) => setComboForm((f) => ({ ...f, endDate: e.target.value }))} />
//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Banner Image</label>
//                 <input type="file" accept="image/*" onChange={(e) => setComboImage(e.target.files[0])} className="text-sm" />
//               </div>

//               <div className="flex gap-3 pt-2">
//                 <Button type="button" variant="secondary" className="flex-1" onClick={() => setIsComboFormOpen(false)}>Cancel</Button>
//                 <Button type="submit" className="flex-1" isLoading={isSubmitting}>Create</Button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {isHamperFormOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-4 py-8">
//           <div className="w-full max-w-lg rounded-2xl bg-white p-6">
//             <h2 className="font-display text-lg font-semibold text-bamboo-800">New Hamper Template</h2>
//             <form onSubmit={handleCreateHamper} className="mt-4 max-h-[65vh] space-y-4 overflow-y-auto pr-1">
//               <FormInput label="Name" value={hamperForm.name} onChange={(e) => setHamperForm((f) => ({ ...f, name: e.target.value }))} required />
//               <FormInput label="Description" value={hamperForm.description} onChange={(e) => setHamperForm((f) => ({ ...f, description: e.target.value }))} />
//               <div className="grid grid-cols-2 gap-3">
//                 <FormInput label="Max Items" type="number" value={hamperForm.maxItems} onChange={(e) => setHamperForm((f) => ({ ...f, maxItems: e.target.value }))} />
//                 <FormInput label="Packaging Cost" type="number" value={hamperForm.packagingCost} onChange={(e) => setHamperForm((f) => ({ ...f, packagingCost: e.target.value }))} />
//               </div>
//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Available Products</label>
//                 <div className="max-h-32 space-y-1 overflow-y-auto rounded-lg border border-sand-300 p-2">
//                   {products.map((p) => (
//                     <label key={p._id} className="flex items-center gap-2 text-sm text-bamboo-600">
//                       <input
//                         type="checkbox"
//                         checked={hamperForm.availableProducts.includes(p._id)}
//                         onChange={() => toggleProductSelection(setHamperForm, 'availableProducts', p._id)}
//                       />
//                       {p.name}
//                     </label>
//                   ))}
//                 </div>
//               </div>
//               <div className="flex gap-3 pt-2">
//                 <Button type="button" variant="secondary" className="flex-1" onClick={() => setIsHamperFormOpen(false)}>Cancel</Button>
//                 <Button type="submit" className="flex-1" isLoading={isSubmitting}>Create</Button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminPromotions;


import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { productApi } from '../../services/productApi';
import { adminPromotionApi } from '../../services/adminApi';
import Button from '../../components/ui/Button';
import FormInput from '../../components/ui/FormInput';

const emptyComboForm = { title: '', description: '', promotionType: 'bundle_discount', products: [], bundlePrice: '', eligibleProduct: '', buyQuantity: '2', getQuantity: '1', freeProduct: '', endDate: '' };
const emptyHamperForm = { name: '', description: '', maxItems: '6', packagingCost: '99', availableProducts: [] };

const AdminPromotions = () => {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState('combos');

  const [isComboFormOpen, setIsComboFormOpen] = useState(false);
  const [isHamperFormOpen, setIsHamperFormOpen] = useState(false);
  const [comboForm, setComboForm] = useState(emptyComboForm);
  const [hamperForm, setHamperForm] = useState(emptyHamperForm);
  const [comboImage, setComboImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // null = creating new, otherwise the _id of the item being edited
  const [editingComboId, setEditingComboId] = useState(null);
  const [editingHamperId, setEditingHamperId] = useState(null);

  const { data: products = [] } = useQuery({
    queryKey: ['admin-products-lite2'],
    queryFn: () => productApi.getProducts({ status: 'all', limit: 100 }),
    select: (res) => res.data.data.products,
  });

  const { data: combos, isLoading: combosLoading } = useQuery({
    queryKey: ['admin-combo-offers'],
    queryFn: () => adminPromotionApi.getComboOffers(),
    select: (res) => res.data.data.offers,
  });

  const { data: hampers, isLoading: hampersLoading } = useQuery({
    queryKey: ['admin-hamper-templates'],
    queryFn: () => adminPromotionApi.getHamperTemplates(),
    select: (res) => res.data.data.templates,
  });

  const closeComboForm = () => {
    setIsComboFormOpen(false);
    setEditingComboId(null);
    setComboForm(emptyComboForm);
    setComboImage(null);
  };

  const closeHamperForm = () => {
    setIsHamperFormOpen(false);
    setEditingHamperId(null);
    setHamperForm(emptyHamperForm);
  };

  const openCreateCombo = () => {
    setEditingComboId(null);
    setComboForm(emptyComboForm);
    setComboImage(null);
    setIsComboFormOpen(true);
  };

  const openEditCombo = (offer) => {
    setEditingComboId(offer._id);
    setComboForm({
      title: offer.title || '',
      description: offer.description || '',
      promotionType: offer.promotionType,
      products: offer.products?.map((p) => p._id) || [],
      bundlePrice: offer.bundlePrice ?? '',
      eligibleProduct: offer.eligibleProduct?._id || '',
      buyQuantity: String(offer.buyQuantity ?? 2),
      getQuantity: String(offer.getQuantity ?? 1),
      freeProduct: offer.freeProduct?._id || '',
      endDate: offer.endDate ? offer.endDate.slice(0, 10) : '',
    });
    setComboImage(null);
    setIsComboFormOpen(true);
  };

  const openCreateHamper = () => {
    setEditingHamperId(null);
    setHamperForm(emptyHamperForm);
    setIsHamperFormOpen(true);
  };

  const openEditHamper = (template) => {
    setEditingHamperId(template._id);
    setHamperForm({
      name: template.name || '',
      description: template.description || '',
      maxItems: String(template.maxItems ?? 6),
      packagingCost: String(template.packagingCost ?? 99),
      availableProducts: template.availableProducts?.map((p) => p._id) || [],
    });
    setIsHamperFormOpen(true);
  };

  const handleSubmitCombo = async (e) => {
    e.preventDefault();

    if (comboForm.promotionType === 'bundle_discount' && comboForm.products.length === 0) {
      toast.error('Select at least one product for the bundle');
      return;
    }
    if (comboForm.promotionType === 'buy_x_get_y' && !comboForm.eligibleProduct) {
      toast.error('Select an eligible product');
      return;
    }

    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('title', comboForm.title);
      fd.append('description', comboForm.description);
      fd.append('promotionType', comboForm.promotionType);
      if (comboForm.endDate) fd.append('endDate', comboForm.endDate);

      if (comboForm.promotionType === 'bundle_discount') {
        fd.append('products', JSON.stringify(comboForm.products));
        fd.append('bundlePrice', comboForm.bundlePrice);
      } else {
        fd.append('eligibleProduct', comboForm.eligibleProduct);
        fd.append('buyQuantity', comboForm.buyQuantity);
        fd.append('getQuantity', comboForm.getQuantity);
        if (comboForm.freeProduct) fd.append('freeProduct', comboForm.freeProduct);
      }

      if (comboImage) fd.append('image', comboImage);

      if (editingComboId) {
        await adminPromotionApi.updateComboOffer(editingComboId, fd);
        toast.success('Combo offer updated');
      } else {
        await adminPromotionApi.createComboOffer(fd);
        toast.success('Combo offer created');
      }

      queryClient.invalidateQueries({ queryKey: ['admin-combo-offers'] });
      closeComboForm();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not save offer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCombo = async (id) => {
    try {
      await adminPromotionApi.deleteComboOffer(id);
      toast.success('Offer deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-combo-offers'] });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not delete offer');
    }
  };

  const handleSubmitHamper = async (e) => {
    e.preventDefault();

    if (hamperForm.availableProducts.length === 0) {
      toast.error('Select at least one product for the hamper template');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: hamperForm.name,
        description: hamperForm.description,
        maxItems: Number(hamperForm.maxItems),
        packagingCost: Number(hamperForm.packagingCost),
        availableProducts: hamperForm.availableProducts,
      };

      if (editingHamperId) {
        await adminPromotionApi.updateHamperTemplate(editingHamperId, payload);
        toast.success('Hamper template updated');
      } else {
        await adminPromotionApi.createHamperTemplate({
          ...payload,
          basketOptions: [{ name: 'Classic Basket', price: 199 }, { name: 'Premium Basket', price: 349 }],
        });
        toast.success('Hamper template created');
      }

      queryClient.invalidateQueries({ queryKey: ['admin-hamper-templates'] });
      closeHamperForm();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not save hamper template');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteHamper = async (id) => {
    try {
      await adminPromotionApi.deleteHamperTemplate(id);
      toast.success('Hamper template deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-hamper-templates'] });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not delete hamper template');
    }
  };

  const toggleProductSelection = (setList, key, productId) => {
    setList((f) => ({
      ...f,
      [key]: f[key].includes(productId) ? f[key].filter((id) => id !== productId) : [...f[key], productId],
    }));
  };

  return (
    <div className="px-6 py-8">
      <Helmet><title>Promotions</title></Helmet>
      <h1 className="font-display text-2xl font-bold text-bamboo-800">Promotions</h1>

      <div className="mt-5 flex gap-2">
        <button onClick={() => setTab('combos')} className={`rounded-full px-4 py-1.5 text-xs font-semibold ${tab === 'combos' ? 'bg-bamboo-600 text-white' : 'bg-white text-bamboo-600'}`}>
          Combo Offers
        </button>
        {/* <button onClick={() => setTab('hampers')} className={`rounded-full px-4 py-1.5 text-xs font-semibold ${tab === 'hampers' ? 'bg-bamboo-600 text-white' : 'bg-white text-bamboo-600'}`}>
          Gift Hampers
        </button> */}
      </div>

      {tab === 'combos' && (
        <div className="mt-6">
          <Button onClick={openCreateCombo} className="!px-4 !py-2 text-sm"><FiPlus size={14} className="mr-1.5" /> New Combo Offer</Button>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {combosLoading ? (
              <p className="text-bamboo-400">Loading...</p>
            ) : combos?.length ? (
              combos.map((offer) => (
                <div key={offer._id} className="card p-4">
                  <p className="font-medium text-bamboo-800">{offer.title}</p>
                  <p className="text-xs capitalize text-bamboo-400">{offer.promotionType.replace(/_/g, ' ')}</p>
                  <p className="mt-1 text-xs text-bamboo-500">{offer.description}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <button onClick={() => openEditCombo(offer)} className="flex items-center gap-1 text-xs font-semibold text-bamboo-600 hover:underline">
                      <FiEdit2 size={12} /> Edit
                    </button>
                    <button onClick={() => handleDeleteCombo(offer._id)} className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:underline">
                      <FiTrash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-bamboo-400">No combo offers yet.</p>
            )}
          </div>
        </div>
      )}

      {tab === 'hampers' && (
        <div className="mt-6">
          <Button onClick={openCreateHamper} className="!px-4 !py-2 text-sm"><FiPlus size={14} className="mr-1.5" /> New Hamper Template</Button>
          <p className="mt-3 text-sm text-bamboo-500">
            Hamper templates let customers build custom gift boxes from selected products on the storefront.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {hampersLoading ? (
              <p className="text-bamboo-400">Loading...</p>
            ) : hampers?.length ? (
              hampers.map((template) => (
                <div key={template._id} className="card p-4">
                  <p className="font-medium text-bamboo-800">{template.name}</p>
                  <p className="mt-1 text-xs text-bamboo-500">{template.description}</p>
                  <p className="mt-1 text-xs text-bamboo-400">
                    Max {template.maxItems} items · Packaging ₹{template.packagingCost}
                  </p>
                  <p className="mt-1 text-xs text-bamboo-400">
                    {template.availableProducts?.length || 0} eligible products
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    <button onClick={() => openEditHamper(template)} className="flex items-center gap-1 text-xs font-semibold text-bamboo-600 hover:underline">
                      <FiEdit2 size={12} /> Edit
                    </button>
                    <button onClick={() => handleDeleteHamper(template._id)} className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:underline">
                      <FiTrash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-bamboo-400">No hamper templates yet.</p>
            )}
          </div>
        </div>
      )}

      {isComboFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-4 py-8">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6">
            <h2 className="font-display text-lg font-semibold text-bamboo-800">
              {editingComboId ? 'Edit Combo Offer' : 'New Combo Offer'}
            </h2>
            <form onSubmit={handleSubmitCombo} className="mt-4 max-h-[65vh] space-y-4 overflow-y-auto pr-1">
              <FormInput label="Title" value={comboForm.title} onChange={(e) => setComboForm((f) => ({ ...f, title: e.target.value }))} required />
              <FormInput label="Description" value={comboForm.description} onChange={(e) => setComboForm((f) => ({ ...f, description: e.target.value }))} />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Promotion Type</label>
                <select value={comboForm.promotionType} onChange={(e) => setComboForm((f) => ({ ...f, promotionType: e.target.value }))} className="input-field">
                  <option value="bundle_discount">Bundle Discount</option>
                  <option value="buy_x_get_y">Buy X Get Y (e.g. Buy 2 Get 1 Free)</option>
                </select>
              </div>

              {comboForm.promotionType === 'bundle_discount' ? (
                <>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Select Products (bundle)</label>
                    <div className="max-h-32 space-y-1 overflow-y-auto rounded-lg border border-sand-300 p-2">
                      {products.map((p) => (
                        <label key={p._id} className="flex items-center gap-2 text-sm text-bamboo-600">
                          <input
                            type="checkbox"
                            checked={comboForm.products.includes(p._id)}
                            onChange={() => toggleProductSelection(setComboForm, 'products', p._id)}
                          />
                          {p.name} (₹{p.price})
                        </label>
                      ))}
                    </div>
                  </div>
                  <FormInput label="Bundle Price" type="number" value={comboForm.bundlePrice} onChange={(e) => setComboForm((f) => ({ ...f, bundlePrice: e.target.value }))} required />
                </>
              ) : (
                <>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Eligible Product (Buy)</label>
                    <select value={comboForm.eligibleProduct} onChange={(e) => setComboForm((f) => ({ ...f, eligibleProduct: e.target.value }))} className="input-field" required>
                      <option value="">Select product</option>
                      {products.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <FormInput label="Buy Quantity" type="number" value={comboForm.buyQuantity} onChange={(e) => setComboForm((f) => ({ ...f, buyQuantity: e.target.value }))} />
                    <FormInput label="Get Quantity Free" type="number" value={comboForm.getQuantity} onChange={(e) => setComboForm((f) => ({ ...f, getQuantity: e.target.value }))} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Free Product (optional, defaults to same product)</label>
                    <select value={comboForm.freeProduct} onChange={(e) => setComboForm((f) => ({ ...f, freeProduct: e.target.value }))} className="input-field">
                      <option value="">Same as eligible product</option>
                      {products.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
                    </select>
                  </div>
                </>
              )}

              <FormInput label="End Date (optional)" type="date" value={comboForm.endDate} onChange={(e) => setComboForm((f) => ({ ...f, endDate: e.target.value }))} />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-bamboo-700">
                  Banner Image {editingComboId ? '(leave empty to keep current image)' : ''}
                </label>
                <input type="file" accept="image/*" onChange={(e) => setComboImage(e.target.files[0])} className="text-sm" />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="secondary" className="flex-1" onClick={closeComboForm}>Cancel</Button>
                <Button type="submit" className="flex-1" isLoading={isSubmitting}>{editingComboId ? 'Save Changes' : 'Create'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isHamperFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-4 py-8">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6">
            <h2 className="font-display text-lg font-semibold text-bamboo-800">
              {editingHamperId ? 'Edit Hamper Template' : 'New Hamper Template'}
            </h2>
            <form onSubmit={handleSubmitHamper} className="mt-4 max-h-[65vh] space-y-4 overflow-y-auto pr-1">
              <FormInput label="Name" value={hamperForm.name} onChange={(e) => setHamperForm((f) => ({ ...f, name: e.target.value }))} required />
              <FormInput label="Description" value={hamperForm.description} onChange={(e) => setHamperForm((f) => ({ ...f, description: e.target.value }))} />
              <div className="grid grid-cols-2 gap-3">
                <FormInput label="Max Items" type="number" value={hamperForm.maxItems} onChange={(e) => setHamperForm((f) => ({ ...f, maxItems: e.target.value }))} />
                <FormInput label="Packaging Cost" type="number" value={hamperForm.packagingCost} onChange={(e) => setHamperForm((f) => ({ ...f, packagingCost: e.target.value }))} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Available Products</label>
                <div className="max-h-32 space-y-1 overflow-y-auto rounded-lg border border-sand-300 p-2">
                  {products.map((p) => (
                    <label key={p._id} className="flex items-center gap-2 text-sm text-bamboo-600">
                      <input
                        type="checkbox"
                        checked={hamperForm.availableProducts.includes(p._id)}
                        onChange={() => toggleProductSelection(setHamperForm, 'availableProducts', p._id)}
                      />
                      {p.name}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="secondary" className="flex-1" onClick={closeHamperForm}>Cancel</Button>
                <Button type="submit" className="flex-1" isLoading={isSubmitting}>{editingHamperId ? 'Save Changes' : 'Create'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPromotions;