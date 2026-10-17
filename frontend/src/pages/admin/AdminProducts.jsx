

// import { useState, useMemo, useRef } from 'react';
// import { useQuery, useQueryClient } from '@tanstack/react-query';
// import { Helmet } from 'react-helmet-async';
// import toast from 'react-hot-toast';
// import {
//   FiPlus, FiEdit2, FiTrash2, FiCopy, FiDownload, FiUpload, FiTag, FiX,
//   FiSearch, FiRefreshCw, FiAlertTriangle, FiAlertCircle,
// } from 'react-icons/fi';

// import { productApi, categoryApi } from '../../services/productApi';
// import { adminProductApi, adminProductIoApi, adminQrApi } from '../../services/adminApi';
// import Button from '../../components/ui/Button';
// import FormInput from '../../components/ui/FormInput';

// const emptyForm = {
//   name: '', shortDescription: '', longDescription: '', category: '', subCategory: '',
//   brand: 'Wa-Kriti', barcode: '',
//   price: '', comparePrice: '', costPrice: '', taxPercentage: '',
//   stockQuantity: '', minStockLevel: '5', status: 'draft',
//   material: 'Bamboo', color: '', finish: '',
//   weight: '', dimLength: '', dimWidth: '', dimHeight: '',
//   packagingDetails: '', warranty: '', returnPolicy: '', careInstructions: '', manufacturingProcess: '',
//   estimatedDeliveryDays: '5', shippingCost: '', productOrigin: '', sustainabilityScore: '',
//   tags: '', metaTitle: '', metaDescription: '',
//   isHandmade: true, isEcoFriendly: true, isMadeInIndia: true, isBestSeller: false,
//   isNewArrival: true, isTrending: false, isLimitedEdition: false, isFestivalProduct: false,
//   isTribalArtisanProduct: false,
// };

// const emptyVariant = { name: '', sku: '', price: '', comparePrice: '', stock: '', status: 'active' };

// // 4 fixed image slots — label shown in UI, type sent to backend matching productImageSchema enum
// const IMAGE_SLOTS = [
//   { key: 'primary', label: 'Primary (Main)', type: 'primary' },
//   { key: 'gallery1', label: 'Gallery 1', type: 'gallery' },
//   { key: 'gallery2', label: 'Gallery 2', type: 'gallery' },
//   { key: 'lifestyle', label: 'Lifestyle', type: 'lifestyle' },
// ];

// const emptyImageSlots = { primary: null, gallery1: null, gallery2: null, lifestyle: null };

// const CHECKBOX_FIELDS = [
//   'isHandmade', 'isEcoFriendly', 'isMadeInIndia', 'isBestSeller', 'isNewArrival',
//   'isTrending', 'isLimitedEdition', 'isFestivalProduct', 'isTribalArtisanProduct',
// ];

// const STATUS_OPTIONS = ['draft', 'published', 'hidden', 'archived'];

// const SORT_OPTIONS = [
//   { value: 'newest', label: 'Newest first' },
//   { value: 'name-asc', label: 'Name (A-Z)' },
//   { value: 'price-asc', label: 'Price: Low to High' },
//   { value: 'price-desc', label: 'Price: High to Low' },
//   { value: 'stock-asc', label: 'Stock: Low to High' },
// ];

// const AdminProducts = () => {
//   const queryClient = useQueryClient();
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingProduct, setEditingProduct] = useState(null);
//   const [form, setForm] = useState(emptyForm);
//   const [imageSlots, setImageSlots] = useState(emptyImageSlots);
//   const [variants, setVariants] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [errors, setErrors] = useState({});
//   const formTopRef = useRef(null);

//   // --- Filter / search bar state ---
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filterCategory, setFilterCategory] = useState('');
//   const [filterStatus, setFilterStatus] = useState('');
//   const [showLowStockOnly, setShowLowStockOnly] = useState(false);
//   const [sortBy, setSortBy] = useState('newest');

//   const { data: products, isLoading } = useQuery({
//     queryKey: ['admin-products'],
//     queryFn: () => productApi.getProducts({ status: 'all', limit: 50 }),
//     select: (res) => res.data.data.products,
//   });

//   const { data: categories = [] } = useQuery({
//     queryKey: ['categories', 'admin'],
//     queryFn: () => categoryApi.getCategories({ status: 'all' }),
//     select: (res) => res.data.data.categories,
//   });

//   const isLowStock = (p) => Number(p.stockQuantity) <= Number(p.minStockLevel ?? 5);

//   const lowStockCount = useMemo(
//     () => (products || []).filter(isLowStock).length,
//     [products]
//   );

//   const filteredProducts = useMemo(() => {
//     if (!products) return [];
//     let result = [...products];

//     if (searchQuery.trim()) {
//       const q = searchQuery.trim().toLowerCase();
//       result = result.filter(
//         (p) => p.name?.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q)
//       );
//     }

//     if (filterCategory) {
//       result = result.filter((p) => (p.category?._id || p.category) === filterCategory);
//     }

//     if (filterStatus) {
//       result = result.filter((p) => p.status === filterStatus);
//     }

//     if (showLowStockOnly) {
//       result = result.filter(isLowStock);
//     }

//     switch (sortBy) {
//       case 'name-asc':
//         result.sort((a, b) => a.name.localeCompare(b.name));
//         break;
//       case 'price-asc':
//         result.sort((a, b) => a.price - b.price);
//         break;
//       case 'price-desc':
//         result.sort((a, b) => b.price - a.price);
//         break;
//       case 'stock-asc':
//         result.sort((a, b) => a.stockQuantity - b.stockQuantity);
//         break;
//       default:
//         break; // newest = API order
//     }

//     return result;
//   }, [products, searchQuery, filterCategory, filterStatus, showLowStockOnly, sortBy]);

//   const hasActiveFilters =
//     searchQuery.trim() || filterCategory || filterStatus || showLowStockOnly || sortBy !== 'newest';

//   const clearFilters = () => {
//     setSearchQuery('');
//     setFilterCategory('');
//     setFilterStatus('');
//     setShowLowStockOnly(false);
//     setSortBy('newest');
//   };

//   const openCreateForm = () => {
//     setEditingProduct(null);
//     setForm(emptyForm);
//     setImageSlots(emptyImageSlots);
//     setVariants([]);
//     setErrors({});
//     setIsFormOpen(true);
//   };

//   const openEditForm = (product) => {
//     setEditingProduct(product);
//     setErrors({});
//     setForm({
//       name: product.name,
//       shortDescription: product.shortDescription || '',
//       longDescription: product.longDescription || '',
//       category: product.category?._id || '',
//       subCategory: product.subCategory?._id || product.subCategory || '',
//       brand: product.brand || 'Wa-Kriti',
//       barcode: product.barcode || '',
//       price: product.price,
//       comparePrice: product.comparePrice || '',
//       costPrice: product.costPrice ?? '',
//       taxPercentage: product.taxPercentage ?? '',
//       stockQuantity: product.stockQuantity,
//       minStockLevel: product.minStockLevel ?? '5',
//       status: product.status,
//       material: product.material || 'Bamboo',
//       color: product.color || '',
//       finish: product.finish || '',
//       weight: product.weight ?? '',
//       dimLength: product.dimensions?.length ?? '',
//       dimWidth: product.dimensions?.width ?? '',
//       dimHeight: product.dimensions?.height ?? '',
//       packagingDetails: product.packagingDetails || '',
//       warranty: product.warranty || '',
//       returnPolicy: product.returnPolicy || '',
//       careInstructions: product.careInstructions || '',
//       manufacturingProcess: product.manufacturingProcess || '',
//       estimatedDeliveryDays: product.estimatedDeliveryDays ?? '5',
//       shippingCost: product.shippingCost ?? '',
//       productOrigin: product.productOrigin || '',
//       sustainabilityScore: product.sustainabilityScore ?? '',
//       tags: (product.tags || []).join(', '),
//       metaTitle: product.metaTitle || '',
//       metaDescription: product.metaDescription || '',
//       isHandmade: product.isHandmade, isEcoFriendly: product.isEcoFriendly,
//       isMadeInIndia: product.isMadeInIndia, isBestSeller: product.isBestSeller,
//       isNewArrival: product.isNewArrival, isTrending: product.isTrending,
//       isLimitedEdition: product.isLimitedEdition, isFestivalProduct: product.isFestivalProduct,
//       isTribalArtisanProduct: product.isTribalArtisanProduct,
//     });

//     setVariants(
//       (product.variants || []).map((v) => ({
//         _id: v._id,
//         name: v.name || '',
//         sku: v.sku || '',
//         price: v.price ?? '',
//         comparePrice: v.comparePrice ?? '',
//         stock: v.stock ?? '',
//         status: v.status || 'active',
//       }))
//     );

//     // Map existing DB images back into the 4 fixed slots (in saved sortOrder)
//     // so the admin can see what's already saved instead of an empty form.
//     const sorted = [...(product.images || [])].sort((a, b) => a.sortOrder - b.sortOrder);

//     const slots = {
//       primary: sorted[0] ? { kind: 'existing', image: sorted[0] } : null,
//       gallery1: sorted[1] ? { kind: 'existing', image: sorted[1] } : null,
//       gallery2: sorted[2] ? { kind: 'existing', image: sorted[2] } : null,
//       lifestyle: sorted[3] ? { kind: 'existing', image: sorted[3] } : null,
//     };

//     setImageSlots(slots);
//     setIsFormOpen(true);
//   };

//   const handleChange = (key, value) => {
//     setForm((f) => ({ ...f, [key]: value }));
//     // Clear that field's error the moment the admin starts fixing it
//     setErrors((prev) => {
//       if (!prev[key]) return prev;
//       const next = { ...prev };
//       delete next[key];
//       return next;
//     });
//   };

//   const handleSlotChange = (slotKey, file) => {
//     if (!file) return;
//     setImageSlots((prev) => ({ ...prev, [slotKey]: { kind: 'new', file } }));
//     setErrors((prev) => {
//       if (!prev.images) return prev;
//       const next = { ...prev };
//       delete next.images;
//       return next;
//     });
//   };

//   const removeSlot = (slotKey) => {
//     setImageSlots((prev) => ({ ...prev, [slotKey]: null }));
//   };

//   // --- Variants ---
//   const addVariantRow = () => setVariants((v) => [...v, { ...emptyVariant }]);
//   const updateVariantRow = (idx, key, value) =>
//     setVariants((v) => v.map((row, i) => (i === idx ? { ...row, [key]: value } : row)));
//   const removeVariantRow = (idx) => setVariants((v) => v.filter((_, i) => i !== idx));

//   // --- Validation ---
//   const validateForm = () => {
//     const newErrors = {};

//     if (!form.name.trim()) newErrors.name = 'Product name is required';
//     if (!form.category) newErrors.category = 'Category is required';
//     if (!form.subCategory) newErrors.subCategory = 'Sub-category is required';

//     if (form.price === '' || form.price === null || Number(form.price) <= 0) {
//       newErrors.price = 'A valid price is required';
//     }
//     if (form.taxPercentage === '' || form.taxPercentage === null) {
//       newErrors.taxPercentage = 'Tax % is required';
//     } else if (Number(form.taxPercentage) < 0 || Number(form.taxPercentage) > 100) {
//       newErrors.taxPercentage = 'Tax % must be between 0 and 100';
//     }
//     if (form.stockQuantity === '' || form.stockQuantity === null || Number(form.stockQuantity) < 0) {
//       newErrors.stockQuantity = 'Stock quantity is required';
//     }
//     if (form.weight === '' || form.weight === null || Number(form.weight) <= 0) {
//       newErrors.weight = 'Weight is required';
//     }
//     if (form.comparePrice && Number(form.comparePrice) < Number(form.price)) {
//       newErrors.comparePrice = 'Compare price (MRP) cannot be lower than the selling price';
//     }

//     const filledSlots = Object.values(imageSlots).filter(Boolean).length;
//     if (filledSlots === 0) newErrors.images = 'At least one product image is required';
//     if (filledSlots > 4) newErrors.images = 'Maximum 4 images per product';

//     return newErrors;
//   };

//   const buildFormData = () => {
//     const fd = new FormData();

//     const { dimLength, dimWidth, dimHeight, tags, ...rest } = form;
//     Object.entries(rest).forEach(([key, value]) => fd.append(key, value));

//     if (dimLength || dimWidth || dimHeight) {
//       fd.append('dimensions', JSON.stringify({
//         length: dimLength ? Number(dimLength) : null,
//         width: dimWidth ? Number(dimWidth) : null,
//         height: dimHeight ? Number(dimHeight) : null,
//       }));
//     }

//     if (tags?.trim()) {
//       const tagList = tags.split(',').map((t) => t.trim()).filter(Boolean);
//       fd.append('tags', JSON.stringify(tagList));
//     }

//     const cleanVariants = variants
//       .filter((v) => v.name.trim())
//       .map((v) => ({
//         ...(v._id ? { _id: v._id } : {}),
//         name: v.name,
//         sku: v.sku,
//         price: Number(v.price) || 0,
//         comparePrice: v.comparePrice ? Number(v.comparePrice) : null,
//         stock: Number(v.stock) || 0,
//         status: v.status,
//       }));
//     if (cleanVariants.length) {
//       fd.append('variants', JSON.stringify(cleanVariants));
//     }

//     const keptExisting = [];
//     IMAGE_SLOTS.forEach(({ key, type }, idx) => {
//       const slot = imageSlots[key];
//       if (!slot) return;
//       if (slot.kind === 'new') {
//         fd.append('images', slot.file);
//         fd.append('imageTypes', type);
//         fd.append('imageSortOrders', String(idx));
//       } else if (slot.kind === 'existing') {
//         keptExisting.push({ _id: slot.image._id, type, sortOrder: idx });
//       }
//     });

//     if (editingProduct) {
//       fd.append('existingImages', JSON.stringify(keptExisting));
//     }

//     return fd;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = validateForm();
//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       toast.error('Please fix the highlighted fields before saving');
//       formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const fd = buildFormData();
//       if (editingProduct) {
//         await adminProductApi.update(editingProduct._id, fd);
//         toast.success('Product updated');
//       } else {
//         await adminProductApi.create(fd);
//         toast.success('Product created');
//       }
//       queryClient.invalidateQueries({ queryKey: ['admin-products'] });
//       setIsFormOpen(false);
//     } catch (error) {
//       toast.error(error?.response?.data?.message || 'Could not save product');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await adminProductApi.delete(id);
//       toast.success('Product deleted');
//       queryClient.invalidateQueries({ queryKey: ['admin-products'] });
//     } catch (error) {
//       toast.error(error?.response?.data?.message || 'Could not delete product');
//     }
//   };

//   const handleDuplicate = async (id) => {
//     try {
//       await adminProductApi.duplicate(id);
//       toast.success('Product duplicated');
//       queryClient.invalidateQueries({ queryKey: ['admin-products'] });
//     } catch (error) {
//       toast.error(error?.response?.data?.message || 'Could not duplicate product');
//     }
//   };

//   const handleExportCsv = async () => {
//     try {
//       const response = await adminProductIoApi.exportCsv();
//       const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/csv' }));
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = `wakriti-products-${Date.now()}.csv`;
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
//     } catch {
//       toast.error('Could not export products');
//     }
//   };

//   const handleImportCsv = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     try {
//       const fd = new FormData();
//       fd.append('file', file);
//       const { data } = await adminProductIoApi.importCsv(fd);
//       toast.success(`Import complete: ${data.data.results.created} created, ${data.data.results.updated} updated`);
//       if (data.data.results.skipped?.length) {
//         console.warn('Skipped rows:', data.data.results.skipped);
//       }
//       queryClient.invalidateQueries({ queryKey: ['admin-products'] });
//     } catch (error) {
//       toast.error(error?.response?.data?.message || 'Could not import products');
//     } finally {
//       e.target.value = '';
//     }
//   };

//   const handleGenerateQr = async (id) => {
//     try {
//       const { data } = await adminQrApi.generate(id);
//       const win = window.open('', '_blank');
//       win.document.write(`<img src="${data.data.qrDataUrl}" alt="QR Code" /><p>Serial: ${data.data.serialNumber}</p>`);
//       toast.success('QR code generated');
//     } catch (error) {
//       toast.error(error?.response?.data?.message || 'Could not generate QR code');
//     }
//   };

//   return (
//     <div className="px-6 py-8">
//       <Helmet><title>Manage Products</title></Helmet>
//       <div className="flex items-center justify-between">
//         <h1 className="font-display text-2xl font-bold text-bamboo-800">Products</h1>
//         <div className="flex gap-2">
//           <Button onClick={handleExportCsv} variant="secondary" className="!px-4 !py-2 text-sm">
//             <FiDownload size={14} className="mr-1.5" /> Export CSV
//           </Button>
//           <label className="btn-secondary flex cursor-pointer items-center !px-4 !py-2 text-sm">
//             <FiUpload size={14} className="mr-1.5" /> Import CSV
//             <input type="file" accept=".csv" onChange={handleImportCsv} className="hidden" />
//           </label>
//           <Button onClick={openCreateForm} className="!px-4 !py-2 text-sm"><FiPlus size={14} className="mr-1.5" /> Add Product</Button>
//         </div>
//       </div>

//       {/* --- Search / Filter bar (Amazon/Flipkart-style) --- */}
//       <div className="mt-5 rounded-2xl bg-white p-4 shadow-soft">
//         <div className="flex flex-wrap items-center gap-3">
//           <div className="relative flex-1 min-w-[220px]">
//             <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-bamboo-400" size={15} />
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search by product name or SKU..."
//               className="input-field !pl-9 text-sm"
//             />
//           </div>

//           <select
//             value={filterCategory}
//             onChange={(e) => setFilterCategory(e.target.value)}
//             className="input-field w-auto text-sm"
//           >
//             <option value="">All Categories</option>
//             {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
//           </select>

//           <select
//             value={filterStatus}
//             onChange={(e) => setFilterStatus(e.target.value)}
//             className="input-field w-auto text-sm"
//           >
//             <option value="">All Statuses</option>
//             {STATUS_OPTIONS.map((s) => (
//               <option key={s} value={s} className="capitalize">{s[0].toUpperCase() + s.slice(1)}</option>
//             ))}
//           </select>

//           <select
//             value={sortBy}
//             onChange={(e) => setSortBy(e.target.value)}
//             className="input-field w-auto text-sm"
//           >
//             {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
//           </select>

//           <label className={`flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
//             showLowStockOnly ? 'border-red-300 bg-red-50 text-red-600' : 'border-sand-200 text-bamboo-500'
//           }`}>
//             <input
//               type="checkbox"
//               checked={showLowStockOnly}
//               onChange={(e) => setShowLowStockOnly(e.target.checked)}
//               className="hidden"
//             />
//             <FiAlertCircle size={13} />
//             Low stock only {lowStockCount > 0 && `(${lowStockCount})`}
//           </label>

//           {hasActiveFilters && (
//             <button
//               type="button"
//               onClick={clearFilters}
//               className="flex items-center gap-1 text-xs font-semibold text-bamboo-500 hover:text-bamboo-700"
//             >
//               <FiRefreshCw size={12} /> Clear filters
//             </button>
//           )}
//         </div>

//         <p className="mt-3 text-xs text-bamboo-400">
//           Showing <span className="font-semibold text-bamboo-600">{filteredProducts.length}</span> of {products?.length || 0} products
//         </p>
//       </div>

//       <div className="mt-4 overflow-x-auto rounded-2xl bg-white shadow-soft">
//         <table className="w-full text-left text-sm">
//           <thead className="bg-sand-100 text-xs uppercase text-bamboo-500">
//             <tr>
//               <th className="px-4 py-3">Product</th>
//               <th className="px-4 py-3">SKU</th>
//               <th className="px-4 py-3">Price</th>
//               <th className="px-4 py-3">Stock</th>
//               <th className="px-4 py-3">Status</th>
//               <th className="px-4 py-3">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-sand-200">
//             {isLoading ? (
//               <tr><td colSpan={6} className="px-4 py-8 text-center text-bamboo-400">Loading...</td></tr>
//             ) : !filteredProducts.length ? (
//               <tr>
//                 <td colSpan={6} className="px-4 py-8 text-center text-bamboo-400">
//                   {products?.length ? 'No products match your filters' : 'No products yet'}
//                 </td>
//               </tr>
//             ) : (
//               filteredProducts.map((p) => {
//                 const lowStock = isLowStock(p);
//                 return (
//                   <tr key={p._id}>
//                     <td className="px-4 py-3">
//                       <div className="flex items-center gap-3">
//                         {p.images?.[0]?.url && <img src={p.images[0].url} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />}
//                         <span className="font-medium text-bamboo-800">{p.name}</span>
//                       </div>
//                     </td>
//                     <td className="px-4 py-3 text-bamboo-500">{p.sku}</td>
//                     <td className="px-4 py-3 text-bamboo-700">₹{p.price}</td>
//                     <td className="px-4 py-3">
//                       <div className="flex items-center gap-1.5">
//                         <span className={lowStock ? 'font-semibold text-red-500' : 'text-bamboo-600'}>{p.stockQuantity}</span>
//                         {lowStock && (
//                           <span className="flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-500">
//                             <FiAlertTriangle size={10} /> Low
//                           </span>
//                         )}
//                       </div>
//                     </td>
//                     <td className="px-4 py-3">
//                       <span className="rounded-full bg-bamboo-100 px-2.5 py-1 text-xs font-semibold capitalize text-bamboo-700">{p.status}</span>
//                     </td>
//                     <td className="px-4 py-3">
//                       <div className="flex gap-3 text-xs font-semibold">
//                         <button onClick={() => openEditForm(p)} className="flex items-center gap-1 text-bamboo-600 hover:underline"><FiEdit2 size={12} />Edit</button>
//                         <button onClick={() => handleDuplicate(p._id)} className="flex items-center gap-1 text-bamboo-500 hover:underline"><FiCopy size={12} />Copy</button>
//                         <button onClick={() => handleGenerateQr(p._id)} className="flex items-center gap-1 text-bamboo-500 hover:underline"><FiTag size={12} />QR</button>
//                         <button onClick={() => handleDelete(p._id)} className="flex items-center gap-1 text-red-500 hover:underline"><FiTrash2 size={12} />Delete</button>
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })
//             )}
//           </tbody>
//         </table>
//       </div>

//       {isFormOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-4 py-8">
//           <div className="w-full max-w-2xl rounded-2xl bg-white p-6">
//             <div ref={formTopRef} />
//             <h2 className="font-display text-lg font-semibold text-bamboo-800">
//               {editingProduct ? 'Edit Product' : 'Add New Product'}
//             </h2>
//             <p className="mt-1 text-xs text-bamboo-400">Fields marked <span className="font-semibold text-red-500">*</span> are required.</p>

//             {Object.keys(errors).length > 0 && (
//               <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600">
//                 <p className="flex items-center gap-1.5 font-semibold">
//                   <FiAlertTriangle size={13} /> Please fix the following before saving:
//                 </p>
//                 <ul className="mt-1.5 list-disc space-y-0.5 pl-5">
//                   {Object.values(errors).map((msg, i) => <li key={i}>{msg}</li>)}
//                 </ul>
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="mt-4 max-h-[70vh] space-y-4 overflow-y-auto pr-1">
//               <div>
//                 <FormInput
//                   label="Product Name *"
//                   value={form.name}
//                   onChange={(e) => handleChange('name', e.target.value)}
//                   required
//                 />
//                 {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
//               </div>

//               <FormInput label="Short Description" value={form.shortDescription} onChange={(e) => handleChange('shortDescription', e.target.value)} />

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Long Description</label>
//                 <textarea value={form.longDescription} onChange={(e) => handleChange('longDescription', e.target.value)} className="input-field min-h-[100px]" />
//               </div>

//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <label className="mb-1.5 block text-sm font-medium text-bamboo-700">
//                     Category <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     value={form.category}
//                     onChange={(e) => handleChange('category', e.target.value)}
//                     className={`input-field ${errors.category ? 'border-red-400 focus:border-red-400' : ''}`}
//                   >
//                     <option value="">Select category</option>
//                     {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
//                   </select>
//                   {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
//                 </div>
//                 <div>
//                   <label className="mb-1.5 block text-sm font-medium text-bamboo-700">
//                     Sub-category <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     value={form.subCategory}
//                     onChange={(e) => handleChange('subCategory', e.target.value)}
//                     className={`input-field ${errors.subCategory ? 'border-red-400 focus:border-red-400' : ''}`}
//                   >
//                     <option value="">Select sub-category</option>
//                     {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
//                   </select>
//                   {errors.subCategory && <p className="mt-1 text-xs text-red-500">{errors.subCategory}</p>}
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-3">
//                 <FormInput label="Brand" value={form.brand} onChange={(e) => handleChange('brand', e.target.value)} />
//                 <FormInput label="Barcode" value={form.barcode} onChange={(e) => handleChange('barcode', e.target.value)} />
//               </div>

//               <p className="text-xs font-semibold uppercase tracking-wide text-bamboo-400">Pricing & Stock</p>
//               <div className="grid grid-cols-3 gap-3">
//                 <div>
//                   <FormInput
//                     label="Price *"
//                     type="number"
//                     value={form.price}
//                     onChange={(e) => handleChange('price', e.target.value)}
//                   />
//                   {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
//                 </div>
//                 <FormInput label="Compare Price (MRP)" type="number" value={form.comparePrice} onChange={(e) => handleChange('comparePrice', e.target.value)} />
//                 {errors.comparePrice && <p className="mt-1 text-xs text-red-500 col-span-3">{errors.comparePrice}</p>}
//                 <FormInput label="Cost Price" type="number" value={form.costPrice} onChange={(e) => handleChange('costPrice', e.target.value)} />
//               </div>
//               <div className="grid grid-cols-3 gap-3">
//                 <div>
//                   <FormInput
//                     label="Tax % *"
//                     type="number"
//                     value={form.taxPercentage}
//                     onChange={(e) => handleChange('taxPercentage', e.target.value)}
//                   />
//                   {errors.taxPercentage && <p className="mt-1 text-xs text-red-500">{errors.taxPercentage}</p>}
//                 </div>
//                 <div>
//                   <FormInput
//                     label="Stock Quantity *"
//                     type="number"
//                     value={form.stockQuantity}
//                     onChange={(e) => handleChange('stockQuantity', e.target.value)}
//                   />
//                   {errors.stockQuantity && <p className="mt-1 text-xs text-red-500">{errors.stockQuantity}</p>}
//                 </div>
//                 <FormInput label="Low Stock Alert Level" type="number" value={form.minStockLevel} onChange={(e) => handleChange('minStockLevel', e.target.value)} />
//               </div>

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Status</label>
//                 <select value={form.status} onChange={(e) => handleChange('status', e.target.value)} className="input-field">
//                   <option value="draft">Draft</option>
//                   <option value="published">Published</option>
//                   <option value="hidden">Hidden</option>
//                   <option value="archived">Archived</option>
//                 </select>
//               </div>

//               <p className="text-xs font-semibold uppercase tracking-wide text-bamboo-400">Physical Details</p>
//               <div className="grid grid-cols-2 gap-3">
//                 <FormInput label="Material" value={form.material} onChange={(e) => handleChange('material', e.target.value)} />
//                 <FormInput label="Color" value={form.color} onChange={(e) => handleChange('color', e.target.value)} />
//               </div>
//               <div className="grid grid-cols-2 gap-3">
//                 <FormInput label="Finish" value={form.finish} onChange={(e) => handleChange('finish', e.target.value)} />
//                 <div>
//                   <FormInput
//                     label="Weight (kg) *"
//                     type="number"
//                     value={form.weight}
//                     onChange={(e) => handleChange('weight', e.target.value)}
//                   />
//                   {errors.weight && <p className="mt-1 text-xs text-red-500">{errors.weight}</p>}
//                 </div>
//               </div>
//               <div className="grid grid-cols-3 gap-3">
//                 <FormInput label="Length (cm)" type="number" value={form.dimLength} onChange={(e) => handleChange('dimLength', e.target.value)} />
//                 <FormInput label="Width (cm)" type="number" value={form.dimWidth} onChange={(e) => handleChange('dimWidth', e.target.value)} />
//                 <FormInput label="Height (cm)" type="number" value={form.dimHeight} onChange={(e) => handleChange('dimHeight', e.target.value)} />
//               </div>

//               <p className="text-xs font-semibold uppercase tracking-wide text-bamboo-400">Fulfilment & Policies</p>
//               <div className="grid grid-cols-2 gap-3">
//                 <FormInput label="Estimated Delivery (days)" type="number" value={form.estimatedDeliveryDays} onChange={(e) => handleChange('estimatedDeliveryDays', e.target.value)} />
//                 <FormInput label="Shipping Cost" type="number" value={form.shippingCost} onChange={(e) => handleChange('shippingCost', e.target.value)} />
//               </div>
//               <FormInput label="Warranty" value={form.warranty} onChange={(e) => handleChange('warranty', e.target.value)} />
//               <FormInput label="Return Policy" value={form.returnPolicy} onChange={(e) => handleChange('returnPolicy', e.target.value)} />
//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Care Instructions</label>
//                 <textarea value={form.careInstructions} onChange={(e) => handleChange('careInstructions', e.target.value)} className="input-field min-h-[70px]" />
//               </div>
//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Manufacturing Process</label>
//                 <textarea value={form.manufacturingProcess} onChange={(e) => handleChange('manufacturingProcess', e.target.value)} className="input-field min-h-[70px]" />
//               </div>
//               <FormInput label="Packaging Details" value={form.packagingDetails} onChange={(e) => handleChange('packagingDetails', e.target.value)} />
//               <div className="grid grid-cols-2 gap-3">
//                 <FormInput label="Product Origin" value={form.productOrigin} onChange={(e) => handleChange('productOrigin', e.target.value)} />
//                 <FormInput label="Sustainability Score (0-100)" type="number" value={form.sustainabilityScore} onChange={(e) => handleChange('sustainabilityScore', e.target.value)} />
//               </div>

//               <p className="text-xs font-semibold uppercase tracking-wide text-bamboo-400">SEO & Discovery</p>
//               <FormInput label="Tags (comma separated)" value={form.tags} onChange={(e) => handleChange('tags', e.target.value)} />
//               <FormInput label="Meta Title" value={form.metaTitle} onChange={(e) => handleChange('metaTitle', e.target.value)} />
//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Meta Description</label>
//                 <textarea value={form.metaDescription} onChange={(e) => handleChange('metaDescription', e.target.value)} className="input-field min-h-[60px]" />
//               </div>

//               <p className="text-xs font-semibold uppercase tracking-wide text-bamboo-400">Tags & Badges</p>
//               <div className="grid grid-cols-2 gap-2">
//                 {CHECKBOX_FIELDS.map((key) => (
//                   <label key={key} className="flex items-center gap-2 text-sm text-bamboo-600">
//                     <input type="checkbox" checked={form[key]} onChange={(e) => handleChange(key, e.target.checked)} />
//                     {key.replace('is', '').replace(/([A-Z])/g, ' $1').trim()}
//                   </label>
//                 ))}
//               </div>

//               {/* Variants */}
//               <div>
//                 <div className="mb-1.5 flex items-center justify-between">
//                   <label className="block text-sm font-medium text-bamboo-700">Variants (optional)</label>
//                   <button type="button" onClick={addVariantRow} className="text-xs font-semibold text-bamboo-600 hover:underline">
//                     + Add Variant
//                   </button>
//                 </div>
//                 {variants.length === 0 ? (
//                   <p className="text-xs text-bamboo-400">No variants — this product will sell as a single item.</p>
//                 ) : (
//                   <div className="space-y-2">
//                     {variants.map((v, idx) => (
//                       <div key={idx} className="grid grid-cols-12 items-center gap-2 rounded-lg border border-sand-200 p-2">
//                         <input
//                           className="input-field col-span-3 !py-1.5 text-xs"
//                           placeholder="Name (e.g. Small)"
//                           value={v.name}
//                           onChange={(e) => updateVariantRow(idx, 'name', e.target.value)}
//                         />
//                         <input
//                           className="input-field col-span-2 !py-1.5 text-xs"
//                           placeholder="SKU (auto)"
//                           value={v.sku}
//                           onChange={(e) => updateVariantRow(idx, 'sku', e.target.value)}
//                         />
//                         <input
//                           type="number"
//                           className="input-field col-span-2 !py-1.5 text-xs"
//                           placeholder="Price"
//                           value={v.price}
//                           onChange={(e) => updateVariantRow(idx, 'price', e.target.value)}
//                         />
//                         <input
//                           type="number"
//                           className="input-field col-span-2 !py-1.5 text-xs"
//                           placeholder="Stock"
//                           value={v.stock}
//                           onChange={(e) => updateVariantRow(idx, 'stock', e.target.value)}
//                         />
//                         <select
//                           className="input-field col-span-2 !py-1.5 text-xs"
//                           value={v.status}
//                           onChange={(e) => updateVariantRow(idx, 'status', e.target.value)}
//                         >
//                           <option value="active">Active</option>
//                           <option value="inactive">Inactive</option>
//                         </select>
//                         <button type="button" onClick={() => removeVariantRow(idx)} className="col-span-1 flex justify-center text-red-500">
//                           <FiX size={14} />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* 4 fixed image slots */}
//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-bamboo-700">
//                   Product Images (up to 4) <span className="text-red-500">*</span>
//                 </label>
//                 <div className="grid grid-cols-2 gap-3">
//                   {IMAGE_SLOTS.map(({ key, label }) => {
//                     const slot = imageSlots[key];
//                     const previewUrl = slot
//                       ? (slot.kind === 'new' ? URL.createObjectURL(slot.file) : slot.image.url)
//                       : null;

//                     return (
//                       <div key={key} className={`rounded-xl border p-2.5 ${errors.images ? 'border-red-300' : 'border-sand-200'}`}>
//                         <p className="mb-1.5 text-xs font-semibold text-bamboo-600">{label}</p>
//                         {previewUrl ? (
//                           <div className="relative">
//                             <img
//                               src={previewUrl}
//                               alt={label}
//                               className="h-24 w-full rounded-lg object-cover"
//                             />
//                             <button
//                               type="button"
//                               onClick={() => removeSlot(key)}
//                               className="absolute -right-1.5 -top-1.5 rounded-full bg-red-500 p-1 text-white"
//                             >
//                               <FiX size={10} />
//                             </button>
//                             {slot.kind === 'existing' && (
//                               <label className="absolute inset-x-0 bottom-0 cursor-pointer rounded-b-lg bg-black/50 py-1 text-center text-[10px] font-semibold text-white">
//                                 Replace
//                                 <input
//                                   type="file"
//                                   accept="image/*"
//                                   onChange={(e) => handleSlotChange(key, e.target.files[0])}
//                                   className="hidden"
//                                 />
//                               </label>
//                             )}
//                           </div>
//                         ) : (
//                           <label className="flex h-24 w-full cursor-pointer items-center justify-center rounded-lg border border-dashed border-sand-300 text-xs text-bamboo-400 hover:bg-sand-50">
//                             + Upload
//                             <input
//                               type="file"
//                               accept="image/*"
//                               onChange={(e) => handleSlotChange(key, e.target.files[0])}
//                               className="hidden"
//                             />
//                           </label>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//                 {errors.images && <p className="mt-1.5 text-xs text-red-500">{errors.images}</p>}
//               </div>

//               <div className="flex gap-3 pt-2">
//                 <Button type="button" variant="secondary" className="flex-1" onClick={() => setIsFormOpen(false)}>Cancel</Button>
//                 <Button type="submit" className="flex-1" isLoading={isSubmitting}>Save Product</Button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminProducts;



import { useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import {
  FiPlus, FiEdit2, FiTrash2, FiCopy, FiDownload, FiUpload, FiTag, FiX,
  FiSearch, FiRefreshCw, FiAlertTriangle, FiChevronLeft, FiChevronRight,
} from 'react-icons/fi';

import { productApi, categoryApi } from '../../services/productApi';
import { adminProductApi, adminProductIoApi, adminQrApi } from '../../services/adminApi';
import Button from '../../components/ui/Button';
import FormInput from '../../components/ui/FormInput';

const emptyForm = {
  name: '', shortDescription: '', longDescription: '', category: '', subCategory: '',
  brand: 'Wa-Kriti', barcode: '',
  price: '', comparePrice: '', costPrice: '', taxPercentage: '',
  stockQuantity: '', minStockLevel: '5', status: 'draft',
  material: 'Bamboo', color: '', finish: '',
  weight: '', dimLength: '', dimWidth: '', dimHeight: '',
  packagingDetails: '', warranty: '', returnPolicy: '', careInstructions: '', manufacturingProcess: '',
  estimatedDeliveryDays: '5', shippingCost: '', productOrigin: '', sustainabilityScore: '',
  tags: '', metaTitle: '', metaDescription: '',
  isHandmade: true, isEcoFriendly: true, isMadeInIndia: true, isBestSeller: false,
  isNewArrival: true, isTrending: false, isLimitedEdition: false, isFestivalProduct: false,
  isTribalArtisanProduct: false,
};

const emptyVariant = { name: '', sku: '', price: '', comparePrice: '', stock: '', status: 'active' };

// 4 fixed image slots — label shown in UI, type sent to backend matching productImageSchema enum
const IMAGE_SLOTS = [
  { key: 'primary', label: 'Primary (Main)', type: 'primary' },
  { key: 'gallery1', label: 'Gallery 1', type: 'gallery' },
  { key: 'gallery2', label: 'Gallery 2', type: 'gallery' },
  { key: 'lifestyle', label: 'Lifestyle', type: 'lifestyle' },
];

const emptyImageSlots = { primary: null, gallery1: null, gallery2: null, lifestyle: null };

const CHECKBOX_FIELDS = [
  'isHandmade', 'isEcoFriendly', 'isMadeInIndia', 'isBestSeller', 'isNewArrival',
  'isTrending', 'isLimitedEdition', 'isFestivalProduct', 'isTribalArtisanProduct',
];

const STATUS_OPTIONS = ['draft', 'published', 'hidden', 'archived'];

// These map 1:1 to productController.js's SORT_MAP on the backend. Do NOT add
// options here that don't exist in that map — they'd silently fall back to
// "newest" server-side, which looks like a bug but isn't.
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest rated' },
  { value: 'popularity', label: 'Most popular' },
  { value: 'featured', label: 'Featured first' },
];

const PAGE_SIZE = 50;
const SEARCH_DEBOUNCE_MS = 400;

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageSlots, setImageSlots] = useState(emptyImageSlots);
  const [variants, setVariants] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const formTopRef = useRef(null);

  // --- Server-side search / filter / sort / pagination state ---
  // Every one of these, when changed, produces a NEW backend request.
  // Nothing here filters an already-fetched array in the browser — that's
  // what caused products to silently disappear once the catalog grew past
  // whatever limit was hardcoded on the client.
  const [searchInput, setSearchInput] = useState(''); // raw input, debounced below
  const [searchQuery, setSearchQuery] = useState(''); // debounced value actually sent to the API
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);

  // Debounce the search box so we don't fire a request on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => setSearchQuery(searchInput.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Any filter/search/sort change invalidates the current page — never leave
  // the admin stranded on "page 6" of a filtered result that only has 2 pages.
  useEffect(() => {
    setPage(1);
  }, [searchQuery, filterCategory, filterStatus, sortBy]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['admin-products', page, searchQuery, filterCategory, filterStatus, sortBy],
    queryFn: () =>
      productApi.getProducts({
        status: filterStatus || 'all',
        q: searchQuery || undefined,
        category: filterCategory || undefined,
        sort: sortBy,
        page,
        limit: PAGE_SIZE,
      }),
    // Keep both the rows AND the pagination meta the backend returns —
    // { page, limit, total, totalPages } — instead of throwing it away.
    select: (res) => ({
      products: res.data.data.products,
      pagination: res.data.pagination || {},
    }),
    keepPreviousData: true, // avoids a blank flash while the next page loads
  });

  const products = data?.products || [];
  const { total = 0, totalPages = 1 } = data?.pagination || {};

  const { data: categories = [] } = useQuery({
    queryKey: ['categories', 'admin'],
    queryFn: () => categoryApi.getCategories({ status: 'all' }),
    select: (res) => res.data.data.categories,
  });

  const isLowStock = (p) => Number(p.stockQuantity) <= Number(p.minStockLevel ?? 5);

  const hasActiveFilters =
    searchInput.trim() || filterCategory || filterStatus || sortBy !== 'newest';

  const clearFilters = () => {
    setSearchInput('');
    setFilterCategory('');
    setFilterStatus('');
    setSortBy('newest');
  };

  const goToPage = (next) => {
    if (next < 1 || next > totalPages) return;
    setPage(next);
  };

  const openCreateForm = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setImageSlots(emptyImageSlots);
    setVariants([]);
    setErrors({});
    setIsFormOpen(true);
  };

  const openEditForm = (product) => {
    setEditingProduct(product);
    setErrors({});
    setForm({
      name: product.name,
      shortDescription: product.shortDescription || '',
      longDescription: product.longDescription || '',
      category: product.category?._id || '',
      subCategory: product.subCategory?._id || product.subCategory || '',
      brand: product.brand || 'Wa-Kriti',
      barcode: product.barcode || '',
      price: product.price,
      comparePrice: product.comparePrice || '',
      costPrice: product.costPrice ?? '',
      taxPercentage: product.taxPercentage ?? '',
      stockQuantity: product.stockQuantity,
      minStockLevel: product.minStockLevel ?? '5',
      status: product.status,
      material: product.material || 'Bamboo',
      color: product.color || '',
      finish: product.finish || '',
      weight: product.weight ?? '',
      dimLength: product.dimensions?.length ?? '',
      dimWidth: product.dimensions?.width ?? '',
      dimHeight: product.dimensions?.height ?? '',
      packagingDetails: product.packagingDetails || '',
      warranty: product.warranty || '',
      returnPolicy: product.returnPolicy || '',
      careInstructions: product.careInstructions || '',
      manufacturingProcess: product.manufacturingProcess || '',
      estimatedDeliveryDays: product.estimatedDeliveryDays ?? '5',
      shippingCost: product.shippingCost ?? '',
      productOrigin: product.productOrigin || '',
      sustainabilityScore: product.sustainabilityScore ?? '',
      tags: (product.tags || []).join(', '),
      metaTitle: product.metaTitle || '',
      metaDescription: product.metaDescription || '',
      isHandmade: product.isHandmade, isEcoFriendly: product.isEcoFriendly,
      isMadeInIndia: product.isMadeInIndia, isBestSeller: product.isBestSeller,
      isNewArrival: product.isNewArrival, isTrending: product.isTrending,
      isLimitedEdition: product.isLimitedEdition, isFestivalProduct: product.isFestivalProduct,
      isTribalArtisanProduct: product.isTribalArtisanProduct,
    });

    setVariants(
      (product.variants || []).map((v) => ({
        _id: v._id,
        name: v.name || '',
        sku: v.sku || '',
        price: v.price ?? '',
        comparePrice: v.comparePrice ?? '',
        stock: v.stock ?? '',
        status: v.status || 'active',
      }))
    );

    // Map existing DB images back into the 4 fixed slots (in saved sortOrder)
    // so the admin can see what's already saved instead of an empty form.
    const sorted = [...(product.images || [])].sort((a, b) => a.sortOrder - b.sortOrder);

    const slots = {
      primary: sorted[0] ? { kind: 'existing', image: sorted[0] } : null,
      gallery1: sorted[1] ? { kind: 'existing', image: sorted[1] } : null,
      gallery2: sorted[2] ? { kind: 'existing', image: sorted[2] } : null,
      lifestyle: sorted[3] ? { kind: 'existing', image: sorted[3] } : null,
    };

    setImageSlots(slots);
    setIsFormOpen(true);
  };

  const handleChange = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleSlotChange = (slotKey, file) => {
    if (!file) return;
    setImageSlots((prev) => ({ ...prev, [slotKey]: { kind: 'new', file } }));
    setErrors((prev) => {
      if (!prev.images) return prev;
      const next = { ...prev };
      delete next.images;
      return next;
    });
  };

  const removeSlot = (slotKey) => {
    setImageSlots((prev) => ({ ...prev, [slotKey]: null }));
  };

  // --- Variants ---
  const addVariantRow = () => setVariants((v) => [...v, { ...emptyVariant }]);
  const updateVariantRow = (idx, key, value) =>
    setVariants((v) => v.map((row, i) => (i === idx ? { ...row, [key]: value } : row)));
  const removeVariantRow = (idx) => setVariants((v) => v.filter((_, i) => i !== idx));

  // --- Validation ---
  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = 'Product name is required';
    if (!form.category) newErrors.category = 'Category is required';
    if (!form.subCategory) newErrors.subCategory = 'Sub-category is required';

    if (form.price === '' || form.price === null || Number(form.price) <= 0) {
      newErrors.price = 'A valid price is required';
    }
    if (form.taxPercentage === '' || form.taxPercentage === null) {
      newErrors.taxPercentage = 'Tax % is required';
    } else if (Number(form.taxPercentage) < 0 || Number(form.taxPercentage) > 100) {
      newErrors.taxPercentage = 'Tax % must be between 0 and 100';
    }
    if (form.stockQuantity === '' || form.stockQuantity === null || Number(form.stockQuantity) < 0) {
      newErrors.stockQuantity = 'Stock quantity is required';
    }
    if (form.weight === '' || form.weight === null || Number(form.weight) <= 0) {
      newErrors.weight = 'Weight is required';
    }
    if (form.comparePrice && Number(form.comparePrice) < Number(form.price)) {
      newErrors.comparePrice = 'Compare price (MRP) cannot be lower than the selling price';
    }

    const filledSlots = Object.values(imageSlots).filter(Boolean).length;
    if (filledSlots === 0) newErrors.images = 'At least one product image is required';
    if (filledSlots > 4) newErrors.images = 'Maximum 4 images per product';

    return newErrors;
  };

  const buildFormData = () => {
    const fd = new FormData();

    const { dimLength, dimWidth, dimHeight, tags, ...rest } = form;
    Object.entries(rest).forEach(([key, value]) => fd.append(key, value));

    if (dimLength || dimWidth || dimHeight) {
      fd.append('dimensions', JSON.stringify({
        length: dimLength ? Number(dimLength) : null,
        width: dimWidth ? Number(dimWidth) : null,
        height: dimHeight ? Number(dimHeight) : null,
      }));
    }

    if (tags?.trim()) {
      const tagList = tags.split(',').map((t) => t.trim()).filter(Boolean);
      fd.append('tags', JSON.stringify(tagList));
    }

    const cleanVariants = variants
      .filter((v) => v.name.trim())
      .map((v) => ({
        ...(v._id ? { _id: v._id } : {}),
        name: v.name,
        sku: v.sku,
        price: Number(v.price) || 0,
        comparePrice: v.comparePrice ? Number(v.comparePrice) : null,
        stock: Number(v.stock) || 0,
        status: v.status,
      }));
    if (cleanVariants.length) {
      fd.append('variants', JSON.stringify(cleanVariants));
    }

    const keptExisting = [];
    IMAGE_SLOTS.forEach(({ key, type }, idx) => {
      const slot = imageSlots[key];
      if (!slot) return;
      if (slot.kind === 'new') {
        fd.append('images', slot.file);
        fd.append('imageTypes', type);
        fd.append('imageSortOrders', String(idx));
      } else if (slot.kind === 'existing') {
        keptExisting.push({ _id: slot.image._id, type, sortOrder: idx });
      }
    });

    if (editingProduct) {
      fd.append('existingImages', JSON.stringify(keptExisting));
    }

    return fd;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fix the highlighted fields before saving');
      formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    setIsSubmitting(true);
    try {
      const fd = buildFormData();
      if (editingProduct) {
        await adminProductApi.update(editingProduct._id, fd);
        toast.success('Product updated');
      } else {
        await adminProductApi.create(fd);
        toast.success('Product created');
      }
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setIsFormOpen(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminProductApi.delete(id);
      toast.success('Product deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not delete product');
    }
  };

  const handleDuplicate = async (id) => {
    try {
      await adminProductApi.duplicate(id);
      toast.success('Product duplicated');
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not duplicate product');
    }
  };

  const handleExportCsv = async () => {
    try {
      const response = await adminProductIoApi.exportCsv();
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/csv' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `wakriti-products-${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error('Could not export products');
    }
  };

  const handleImportCsv = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append('file', file);
      const { data } = await adminProductIoApi.importCsv(fd);
      toast.success(`Import complete: ${data.data.results.created} created, ${data.data.results.updated} updated`);
      if (data.data.results.skipped?.length) {
        console.warn('Skipped rows:', data.data.results.skipped);
      }
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not import products');
    } finally {
      e.target.value = '';
    }
  };

  const handleGenerateQr = async (id) => {
    try {
      const { data } = await adminQrApi.generate(id);
      const win = window.open('', '_blank');
      win.document.write(`<img src="${data.data.qrDataUrl}" alt="QR Code" /><p>Serial: ${data.data.serialNumber}</p>`);
      toast.success('QR code generated');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not generate QR code');
    }
  };

  return (
    <div className="px-6 py-8">
      <Helmet><title>Manage Products</title></Helmet>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-bamboo-800">Products</h1>
        <div className="flex gap-2">
          <Button onClick={handleExportCsv} variant="secondary" className="!px-4 !py-2 text-sm">
            <FiDownload size={14} className="mr-1.5" /> Export CSV
          </Button>
          <label className="btn-secondary flex cursor-pointer items-center !px-4 !py-2 text-sm">
            <FiUpload size={14} className="mr-1.5" /> Import CSV
            <input type="file" accept=".csv" onChange={handleImportCsv} className="hidden" />
          </label>
          <Button onClick={openCreateForm} className="!px-4 !py-2 text-sm"><FiPlus size={14} className="mr-1.5" /> Add Product</Button>
        </div>
      </div>

      {/* --- Search / Filter bar — every control here drives a server request --- */}
      <div className="mt-5 rounded-2xl bg-white p-4 shadow-soft">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-bamboo-400" size={15} />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by product name or SKU..."
              className="input-field !pl-9 text-sm"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="input-field w-auto text-sm"
          >
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field w-auto text-sm"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s} className="capitalize">{s[0].toUpperCase() + s.slice(1)}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field w-auto text-sm"
          >
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1 text-xs font-semibold text-bamboo-500 hover:text-bamboo-700"
            >
              <FiRefreshCw size={12} /> Clear filters
            </button>
          )}
        </div>

        <p className="mt-3 text-xs text-bamboo-400">
          Showing <span className="font-semibold text-bamboo-600">{products.length}</span> of{' '}
          <span className="font-semibold text-bamboo-600">{total}</span> products
          {isFetching && <span className="ml-2 text-bamboo-300">· updating…</span>}
        </p>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl bg-white shadow-soft">
        <table className="w-full text-left text-sm">
          <thead className="bg-sand-100 text-xs uppercase text-bamboo-500">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand-200">
            {isLoading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-bamboo-400">Loading...</td></tr>
            ) : !products.length ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-bamboo-400">
                  {hasActiveFilters ? 'No products match your filters' : 'No products yet'}
                </td>
              </tr>
            ) : (
              products.map((p) => {
                const lowStock = isLowStock(p);
                return (
                  <tr key={p._id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.images?.[0]?.url && <img src={p.images[0].url} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />}
                        <span className="font-medium text-bamboo-800">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-bamboo-500">{p.sku}</td>
                    <td className="px-4 py-3 text-bamboo-700">₹{p.price}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className={lowStock ? 'font-semibold text-red-500' : 'text-bamboo-600'}>{p.stockQuantity}</span>
                        {lowStock && (
                          <span className="flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-500">
                            <FiAlertTriangle size={10} /> Low
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-bamboo-100 px-2.5 py-1 text-xs font-semibold capitalize text-bamboo-700">{p.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3 text-xs font-semibold">
                        <button onClick={() => openEditForm(p)} className="flex items-center gap-1 text-bamboo-600 hover:underline"><FiEdit2 size={12} />Edit</button>
                        <button onClick={() => handleDuplicate(p._id)} className="flex items-center gap-1 text-bamboo-500 hover:underline"><FiCopy size={12} />Copy</button>
                        <button onClick={() => handleGenerateQr(p._id)} className="flex items-center gap-1 text-bamboo-500 hover:underline"><FiTag size={12} />QR</button>
                        <button onClick={() => handleDelete(p._id)} className="flex items-center gap-1 text-red-500 hover:underline"><FiTrash2 size={12} />Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* --- Pagination — always reflects the real server-side total, never a hardcoded cap --- */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-bamboo-500">
            Page <span className="font-semibold text-bamboo-700">{page}</span> of{' '}
            <span className="font-semibold text-bamboo-700">{totalPages}</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1 || isFetching}
              onClick={() => goToPage(page - 1)}
              className="flex items-center gap-1 rounded-lg border border-sand-200 px-3 py-1.5 text-xs font-semibold text-bamboo-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FiChevronLeft size={12} /> Previous
            </button>
            <button
              type="button"
              disabled={page >= totalPages || isFetching}
              onClick={() => goToPage(page + 1)}
              className="flex items-center gap-1 rounded-lg border border-sand-200 px-3 py-1.5 text-xs font-semibold text-bamboo-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next <FiChevronRight size={12} />
            </button>
          </div>
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-4 py-8">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6">
            <div ref={formTopRef} />
            <h2 className="font-display text-lg font-semibold text-bamboo-800">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="mt-1 text-xs text-bamboo-400">Fields marked <span className="font-semibold text-red-500">*</span> are required.</p>

            {Object.keys(errors).length > 0 && (
              <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600">
                <p className="flex items-center gap-1.5 font-semibold">
                  <FiAlertTriangle size={13} /> Please fix the following before saving:
                </p>
                <ul className="mt-1.5 list-disc space-y-0.5 pl-5">
                  {Object.values(errors).map((msg, i) => <li key={i}>{msg}</li>)}
                </ul>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 max-h-[70vh] space-y-4 overflow-y-auto pr-1">
              <div>
                <FormInput
                  label="Product Name *"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>

              <FormInput label="Short Description" value={form.shortDescription} onChange={(e) => handleChange('shortDescription', e.target.value)} />

              <div>
                <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Long Description</label>
                <textarea value={form.longDescription} onChange={(e) => handleChange('longDescription', e.target.value)} className="input-field min-h-[100px]" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-bamboo-700">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className={`input-field ${errors.category ? 'border-red-400 focus:border-red-400' : ''}`}
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                  {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-bamboo-700">
                    Sub-category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.subCategory}
                    onChange={(e) => handleChange('subCategory', e.target.value)}
                    className={`input-field ${errors.subCategory ? 'border-red-400 focus:border-red-400' : ''}`}
                  >
                    <option value="">Select sub-category</option>
                    {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                  {errors.subCategory && <p className="mt-1 text-xs text-red-500">{errors.subCategory}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormInput label="Brand" value={form.brand} onChange={(e) => handleChange('brand', e.target.value)} />
                <FormInput label="Barcode" value={form.barcode} onChange={(e) => handleChange('barcode', e.target.value)} />
              </div>

              <p className="text-xs font-semibold uppercase tracking-wide text-bamboo-400">Pricing & Stock</p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <FormInput
                    label="Price *"
                    type="number"
                    value={form.price}
                    onChange={(e) => handleChange('price', e.target.value)}
                  />
                  {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
                </div>
                <FormInput label="Compare Price (MRP)" type="number" value={form.comparePrice} onChange={(e) => handleChange('comparePrice', e.target.value)} />
                {errors.comparePrice && <p className="mt-1 text-xs text-red-500 col-span-3">{errors.comparePrice}</p>}
                <FormInput label="Cost Price" type="number" value={form.costPrice} onChange={(e) => handleChange('costPrice', e.target.value)} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <FormInput
                    label="Tax % *"
                    type="number"
                    value={form.taxPercentage}
                    onChange={(e) => handleChange('taxPercentage', e.target.value)}
                  />
                  {errors.taxPercentage && <p className="mt-1 text-xs text-red-500">{errors.taxPercentage}</p>}
                </div>
                <div>
                  <FormInput
                    label="Stock Quantity *"
                    type="number"
                    value={form.stockQuantity}
                    onChange={(e) => handleChange('stockQuantity', e.target.value)}
                  />
                  {errors.stockQuantity && <p className="mt-1 text-xs text-red-500">{errors.stockQuantity}</p>}
                </div>
                <FormInput label="Low Stock Alert Level" type="number" value={form.minStockLevel} onChange={(e) => handleChange('minStockLevel', e.target.value)} />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Status</label>
                <select value={form.status} onChange={(e) => handleChange('status', e.target.value)} className="input-field">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="hidden">Hidden</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <p className="text-xs font-semibold uppercase tracking-wide text-bamboo-400">Physical Details</p>
              <div className="grid grid-cols-2 gap-3">
                <FormInput label="Material" value={form.material} onChange={(e) => handleChange('material', e.target.value)} />
                <FormInput label="Color" value={form.color} onChange={(e) => handleChange('color', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormInput label="Finish" value={form.finish} onChange={(e) => handleChange('finish', e.target.value)} />
                <div>
                  <FormInput
                    label="Weight (kg) *"
                    type="number"
                    value={form.weight}
                    onChange={(e) => handleChange('weight', e.target.value)}
                  />
                  {errors.weight && <p className="mt-1 text-xs text-red-500">{errors.weight}</p>}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <FormInput label="Length (cm)" type="number" value={form.dimLength} onChange={(e) => handleChange('dimLength', e.target.value)} />
                <FormInput label="Width (cm)" type="number" value={form.dimWidth} onChange={(e) => handleChange('dimWidth', e.target.value)} />
                <FormInput label="Height (cm)" type="number" value={form.dimHeight} onChange={(e) => handleChange('dimHeight', e.target.value)} />
              </div>

              <p className="text-xs font-semibold uppercase tracking-wide text-bamboo-400">Fulfilment & Policies</p>
              <div className="grid grid-cols-2 gap-3">
                <FormInput label="Estimated Delivery (days)" type="number" value={form.estimatedDeliveryDays} onChange={(e) => handleChange('estimatedDeliveryDays', e.target.value)} />
                <FormInput label="Shipping Cost" type="number" value={form.shippingCost} onChange={(e) => handleChange('shippingCost', e.target.value)} />
              </div>
              <FormInput label="Warranty" value={form.warranty} onChange={(e) => handleChange('warranty', e.target.value)} />
              <FormInput label="Return Policy" value={form.returnPolicy} onChange={(e) => handleChange('returnPolicy', e.target.value)} />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Care Instructions</label>
                <textarea value={form.careInstructions} onChange={(e) => handleChange('careInstructions', e.target.value)} className="input-field min-h-[70px]" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Manufacturing Process</label>
                <textarea value={form.manufacturingProcess} onChange={(e) => handleChange('manufacturingProcess', e.target.value)} className="input-field min-h-[70px]" />
              </div>
              <FormInput label="Packaging Details" value={form.packagingDetails} onChange={(e) => handleChange('packagingDetails', e.target.value)} />
              <div className="grid grid-cols-2 gap-3">
                <FormInput label="Product Origin" value={form.productOrigin} onChange={(e) => handleChange('productOrigin', e.target.value)} />
                <FormInput label="Sustainability Score (0-100)" type="number" value={form.sustainabilityScore} onChange={(e) => handleChange('sustainabilityScore', e.target.value)} />
              </div>

              <p className="text-xs font-semibold uppercase tracking-wide text-bamboo-400">SEO & Discovery</p>
              <FormInput label="Tags (comma separated)" value={form.tags} onChange={(e) => handleChange('tags', e.target.value)} />
              <FormInput label="Meta Title" value={form.metaTitle} onChange={(e) => handleChange('metaTitle', e.target.value)} />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Meta Description</label>
                <textarea value={form.metaDescription} onChange={(e) => handleChange('metaDescription', e.target.value)} className="input-field min-h-[60px]" />
              </div>

              <p className="text-xs font-semibold uppercase tracking-wide text-bamboo-400">Tags & Badges</p>
              <div className="grid grid-cols-2 gap-2">
                {CHECKBOX_FIELDS.map((key) => (
                  <label key={key} className="flex items-center gap-2 text-sm text-bamboo-600">
                    <input type="checkbox" checked={form[key]} onChange={(e) => handleChange(key, e.target.checked)} />
                    {key.replace('is', '').replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                ))}
              </div>

              {/* Variants */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="block text-sm font-medium text-bamboo-700">Variants (optional)</label>
                  <button type="button" onClick={addVariantRow} className="text-xs font-semibold text-bamboo-600 hover:underline">
                    + Add Variant
                  </button>
                </div>
                {variants.length === 0 ? (
                  <p className="text-xs text-bamboo-400">No variants — this product will sell as a single item.</p>
                ) : (
                  <div className="space-y-2">
                    {variants.map((v, idx) => (
                      <div key={idx} className="grid grid-cols-12 items-center gap-2 rounded-lg border border-sand-200 p-2">
                        <input
                          className="input-field col-span-3 !py-1.5 text-xs"
                          placeholder="Name (e.g. Small)"
                          value={v.name}
                          onChange={(e) => updateVariantRow(idx, 'name', e.target.value)}
                        />
                        <input
                          className="input-field col-span-2 !py-1.5 text-xs"
                          placeholder="SKU (auto)"
                          value={v.sku}
                          onChange={(e) => updateVariantRow(idx, 'sku', e.target.value)}
                        />
                        <input
                          type="number"
                          className="input-field col-span-2 !py-1.5 text-xs"
                          placeholder="Price"
                          value={v.price}
                          onChange={(e) => updateVariantRow(idx, 'price', e.target.value)}
                        />
                        <input
                          type="number"
                          className="input-field col-span-2 !py-1.5 text-xs"
                          placeholder="Stock"
                          value={v.stock}
                          onChange={(e) => updateVariantRow(idx, 'stock', e.target.value)}
                        />
                        <select
                          className="input-field col-span-2 !py-1.5 text-xs"
                          value={v.status}
                          onChange={(e) => updateVariantRow(idx, 'status', e.target.value)}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                        <button type="button" onClick={() => removeVariantRow(idx)} className="col-span-1 flex justify-center text-red-500">
                          <FiX size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 4 fixed image slots */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-bamboo-700">
                  Product Images (up to 4) <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {IMAGE_SLOTS.map(({ key, label }) => {
                    const slot = imageSlots[key];
                    const previewUrl = slot
                      ? (slot.kind === 'new' ? URL.createObjectURL(slot.file) : slot.image.url)
                      : null;

                    return (
                      <div key={key} className={`rounded-xl border p-2.5 ${errors.images ? 'border-red-300' : 'border-sand-200'}`}>
                        <p className="mb-1.5 text-xs font-semibold text-bamboo-600">{label}</p>
                        {previewUrl ? (
                          <div className="relative">
                            <img
                              src={previewUrl}
                              alt={label}
                              className="h-24 w-full rounded-lg object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeSlot(key)}
                              className="absolute -right-1.5 -top-1.5 rounded-full bg-red-500 p-1 text-white"
                            >
                              <FiX size={10} />
                            </button>
                            {slot.kind === 'existing' && (
                              <label className="absolute inset-x-0 bottom-0 cursor-pointer rounded-b-lg bg-black/50 py-1 text-center text-[10px] font-semibold text-white">
                                Replace
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleSlotChange(key, e.target.files[0])}
                                  className="hidden"
                                />
                              </label>
                            )}
                          </div>
                        ) : (
                          <label className="flex h-24 w-full cursor-pointer items-center justify-center rounded-lg border border-dashed border-sand-300 text-xs text-bamboo-400 hover:bg-sand-50">
                            + Upload
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleSlotChange(key, e.target.files[0])}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    );
                  })}
                </div>
                {errors.images && <p className="mt-1.5 text-xs text-red-500">{errors.images}</p>}
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                <Button type="submit" className="flex-1" isLoading={isSubmitting}>Save Product</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;