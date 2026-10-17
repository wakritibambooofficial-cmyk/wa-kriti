



// import { useMemo, useState } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import { useQuery } from '@tanstack/react-query';
// import { FiSliders, FiSearch, FiX } from 'react-icons/fi';
// import { Helmet } from 'react-helmet-async';
// import { motion, AnimatePresence } from 'framer-motion';

// import { productApi, categoryApi } from '../../services/productApi';
// import ProductCard from '../../components/product/ProductCard';
// import { ProductGridSkeleton } from '../../components/product/ProductCardSkeleton';
// import EmptyState from '../../components/ui/EmptyState';
// import FilterSidebar from '../../components/product/FilterSidebar';

// const SORT_OPTIONS = [
//   { value: 'featured', label: 'Featured' },
//   { value: 'newest', label: 'Newest' },
//   { value: 'price_low', label: 'Price: Low to High' },
//   { value: 'price_high', label: 'Price: High to Low' },
//   { value: 'rating', label: 'Highest Rated' },
//   { value: 'popularity', label: 'Most Popular' },
//   { value: 'discount', label: 'Discount' },
// ];

// const getPaginationRange = (current, total) => {
//   const delta = 1;
//   const range = [];
//   const rangeWithDots = [];
//   let last;
//   for (let i = 1; i <= total; i++) {
//     if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) range.push(i);
//   }
//   range.forEach((i) => {
//     if (last) {
//       if (i - last === 2) rangeWithDots.push(last + 1);
//       else if (i - last > 2) rangeWithDots.push('...');
//     }
//     rangeWithDots.push(i);
//     last = i;
//   });
//   return rangeWithDots;
// };

// const Shop = () => {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const [isFilterOpen, setIsFilterOpen] = useState(false); // mobile drawer
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false); // desktop collapsible column
//   const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');

//   const filters = useMemo(() => Object.fromEntries(searchParams.entries()), [searchParams]);
//   const page = parseInt(filters.page, 10) || 1;
//   const sort = filters.sort || 'featured';

//   const updateFilters = (updates) => {
//     const next = new URLSearchParams(searchParams);
//     Object.entries(updates).forEach(([key, value]) => {
//       if (value === '' || value === null || value === undefined) next.delete(key);
//       else next.set(key, value);
//     });
//     next.delete('page');
//     setSearchParams(next);
//   };

//   const updateFilter = (key, value) => updateFilters({ [key]: value });

//   const clearFilters = () => {
//     setSearchParams({});
//     setSearchInput('');
//   };

//   const { data: categoriesData } = useQuery({
//     queryKey: ['categories', 'flat'],
//     queryFn: () => categoryApi.getCategories(),
//     select: (res) => res.data.data.categories,
//   });

//   const { data: productsData, isLoading, isError } = useQuery({
//     queryKey: ['products', filters],
//     queryFn: () => productApi.getProducts(filters),
//     keepPreviousData: true,
//   });

//   const products = productsData?.data?.data?.products || [];
//   const pagination = productsData?.data?.pagination;

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     updateFilter('q', searchInput);
//   };

//   const getFilterLabel = (key, value) => {
//     if (key === 'category') {
//       const category = categoriesData?.find((cat) => cat._id === value);
//       return category?.name || value;
//     }
//     return value;
//   };

//   const activeFilterEntries = Object.entries(filters).filter(([k]) => !['page', 'sort'].includes(k));

//   const sidebarProps = {
//     categories: categoriesData || [],
//     filters,
//     onChange: updateFilter,
//     onChangeMultiple: updateFilters,
//     onClear: clearFilters,
//   };

//   return (
//     <div className="min-h-screen bg-sand-100 pb-24">
//       <Helmet>
//         <title>Shop All Bamboo Products</title>
//         <meta
//           name="description"
//           content="Browse premium handcrafted bamboo furniture, decor, kitchenware, and lifestyle products — sustainable, eco-friendly, made in India."
//         />
//       </Helmet>

//       {/* ── Animated Hero ── */}
//       {/* <div className="relative overflow-hidden bg-gradient-to-br from-bamboo-700 via-bamboo-600 to-bamboo-800 px-4 py-20 text-center text-white">
//         <motion.div
//           animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
//           transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
//           className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/5 blur-3xl"
//         />
//         <motion.div
//           animate={{ x: [0, -25, 0], y: [0, -15, 0] }}
//           transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
//           className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-earth-400/10 blur-3xl"
//         />
//         <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] bg-[size:26px_26px]" />

//         {[...Array(6)].map((_, i) => (
//           <motion.span
//             key={i}
//             className="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-amber-300/40"
//             style={{ left: `${15 + i * 14}%`, top: `${20 + (i % 3) * 20}%` }}
//             animate={{ y: [0, -18, 0], opacity: [0.3, 0.9, 0.3] }}
//             transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
//           />
//         ))}

//         <motion.div
//           initial={{ opacity: 0, y: -12 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="relative"
//         >
//           <motion.span
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay: 0.1, duration: 0.4 }}
//             className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-sand-100 backdrop-blur-sm"
//           >
//             Wa-Kriti Collection
//           </motion.span>

//           <motion.h1
//             initial={{ opacity: 0, y: 16 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2, duration: 0.5 }}
//             className="mt-4 font-display text-3xl font-bold sm:text-5xl"
//           >
//             Shop All Bamboo Products
//           </motion.h1>

//           <motion.p
//             initial={{ opacity: 0, y: 16 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3, duration: 0.5 }}
//             className="mx-auto mt-3 max-w-xl text-sm text-sand-200 sm:text-base"
//           >
//             Handcrafted furniture, decor, and lifestyle essentials — made sustainably by skilled artisans.
//           </motion.p>

//           <motion.form
//             initial={{ opacity: 0, y: 16 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.4, duration: 0.5 }}
//             onSubmit={handleSearchSubmit}
//             className="mx-auto mt-8 flex max-w-md items-center rounded-2xl bg-white/95 p-1.5 shadow-2xl shadow-bamboo-900/30 backdrop-blur-sm transition-shadow focus-within:shadow-bamboo-900/40"
//           >
//             <FiSearch className="ml-3 shrink-0 text-bamboo-400" size={18} />
//             <input
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//               placeholder="Search bamboo chairs, baskets..."
//               className="w-full min-w-0 bg-transparent px-3 py-2.5 text-sm text-bamboo-800 outline-none placeholder:text-bamboo-400"
//             />
//             <button
//               type="submit"
//               className="shrink-0 rounded-xl bg-gradient-to-r from-bamboo-600 to-bamboo-700 px-5 py-2.5 text-xs font-bold text-white shadow-md transition-transform hover:scale-105 active:scale-95"
//             >
//               Search
//             </button>
//           </motion.form>
//         </motion.div>
//       </div> */}

//       <div className="mx-auto max-w-7xl px-4">
//         {/* ── Toolbar ── */}
//         <div className="sticky top-0 z-20 -mx-4 mb-6 mt-6 border-b border-bamboo-100/70 bg-sand-100/90 px-4 py-4 backdrop-blur-md">
//           <div className="flex flex-wrap items-center justify-between gap-3">
//             <div className="flex items-center gap-3">
//               {/* Mobile: opens the drawer */}
//               <button
//                 onClick={() => setIsFilterOpen(true)}
//                 className="flex items-center gap-2 rounded-xl border border-bamboo-200 bg-white px-4 py-2.5 text-sm font-semibold text-bamboo-700 shadow-sm transition-all hover:border-bamboo-400 hover:shadow-md active:scale-95 lg:hidden"
//               >
//                 <FiSliders size={16} /> Filters
//                 {activeFilterEntries.length > 0 && (
//                   <span className="flex h-5 w-5 items-center justify-center rounded-full bg-bamboo-600 text-[10px] font-bold text-white">
//                     {activeFilterEntries.length}
//                   </span>
//                 )}
//               </button>

//               {/* Desktop: toggles the side column */}
//               <button
//                 onClick={() => setIsSidebarOpen((prev) => !prev)}
//                 className="hidden items-center gap-2 rounded-xl border border-bamboo-200 bg-white px-4 py-2.5 text-sm font-semibold text-bamboo-700 shadow-sm transition-all hover:border-bamboo-400 hover:shadow-md active:scale-95 lg:flex"
//               >
//                 {isSidebarOpen ? <FiX size={16} /> : <FiSliders size={16} />}
//                 {isSidebarOpen ? 'Hide Filters' : 'Show Filters'}
//                 {!isSidebarOpen && activeFilterEntries.length > 0 && (
//                   <span className="flex h-5 w-5 items-center justify-center rounded-full bg-bamboo-600 text-[10px] font-bold text-white">
//                     {activeFilterEntries.length}
//                   </span>
//                 )}
//               </button>

//               <p className="hidden text-sm text-bamboo-500 sm:block">
//                 {pagination ? (
//                   <>
//                     <span className="font-semibold text-bamboo-700">{pagination.total}</span> product(s) found
//                   </>
//                 ) : (
//                   'Loading products...'
//                 )}
//               </p>
//             </div>

//             <div className="flex items-center gap-2">
//               <span className="hidden text-xs font-medium uppercase tracking-wide text-bamboo-400 sm:inline">
//                 Sort by
//               </span>
//               <select
//                 value={sort}
//                 onChange={(e) => updateFilter('sort', e.target.value)}
//                 className="cursor-pointer rounded-xl border border-bamboo-200 bg-white px-3 py-2.5 text-sm font-medium text-bamboo-700 shadow-sm outline-none transition-all hover:border-bamboo-400 focus:ring-2 focus:ring-bamboo-300"
//               >
//                 {SORT_OPTIONS.map((opt) => (
//                   <option key={opt.value} value={opt.value}>
//                     {opt.label}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <p className="mt-2 text-xs text-bamboo-500 sm:hidden">
//             {pagination ? `${pagination.total} product(s) found` : ''}
//           </p>
//         </div>

//         {/* ── Active filter chips ── */}
//         <AnimatePresence>
//           {activeFilterEntries.length > 0 && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: 'auto' }}
//               exit={{ opacity: 0, height: 0 }}
//               className="mb-6 flex flex-wrap items-center gap-2 overflow-hidden"
//             >
//               {activeFilterEntries.map(([key, value]) => (
//                 <span
//                   key={key}
//                   className="flex items-center gap-2 rounded-full border border-bamboo-200 bg-white px-3.5 py-1.5 text-xs font-medium text-bamboo-700 shadow-sm transition-all hover:border-bamboo-300"
//                 >
//                   <span className="text-bamboo-400">{key}:</span>
//                   {getFilterLabel(key, value)}
//                   <button
//                     onClick={() => updateFilter(key, '')}
//                     className="flex h-4 w-4 items-center justify-center rounded-full text-bamboo-400 transition-colors hover:bg-bamboo-100 hover:text-bamboo-700"
//                     aria-label={`Remove ${key} filter`}
//                   >
//                     <FiX size={12} />
//                   </button>
//                 </span>
//               ))}
//               <button
//                 onClick={clearFilters}
//                 className="text-xs font-semibold text-earth-600 underline-offset-2 hover:underline"
//               >
//                 Clear All
//               </button>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         <div className="flex gap-8">
//           {/* Desktop collapsible column — collapses to 0 width, grid takes the space back */}
//           <motion.div
//             initial={false}
//             animate={{
//               width: isSidebarOpen ? 256 : 0,
//               opacity: isSidebarOpen ? 1 : 0,
//               marginRight: isSidebarOpen ? 0 : -32, // cancels the parent's gap-8 (2rem) when collapsed
//             }}
//             transition={{ duration: 0.3, ease: 'easeInOut' }}
//             className="hidden shrink-0 overflow-hidden lg:block"
//           >
//             <div className="w-64">
//               <FilterSidebar {...sidebarProps} isOpen={false} onClose={() => {}} />
//             </div>
//           </motion.div>

//           {/* Mobile drawer — always mounted so the "Filters" button works regardless of desktop state */}
//           <div className="lg:hidden">
//             <FilterSidebar {...sidebarProps} isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
//           </div>

//           <div className="min-w-0 flex-1">
//             {isLoading && <ProductGridSkeleton count={8} />}

//             {isError && (
//               <EmptyState
//                 title="Something went wrong"
//                 message="We couldn't load products right now. Please try again shortly."
//               />
//             )}

//             {!isLoading && !isError && products.length === 0 && (
//               <EmptyState
//                 title="No products found"
//                 message="Try adjusting your filters or search term."
//                 actionLabel="Clear Filters"
//                 actionTo="/shop"
//               />
//             )}

//             {!isLoading && products.length > 0 && (
//               <>
//                 <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4">
//                   {products.map((product, idx) => (
//                     <motion.div
//                       key={product._id}
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.3) }}
//                     >
//                       <ProductCard product={product} />
//                     </motion.div>
//                   ))}
//                 </div>

//                 {pagination && pagination.totalPages > 1 && (
//                   <div className="mt-12 flex items-center justify-center gap-1.5">
//                     <button
//                       onClick={() => updateFilter('page', Math.max(1, page - 1))}
//                       disabled={page === 1}
//                       className="flex h-9 w-9 items-center justify-center rounded-lg border border-bamboo-200 bg-white text-bamboo-600 transition-all hover:border-bamboo-400 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
//                     >
//                       ‹
//                     </button>
//                     {getPaginationRange(page, pagination.totalPages).map((item, i) =>
//                       item === '...' ? (
//                         <span key={`dots-${i}`} className="px-1 text-sm text-bamboo-400">…</span>
//                       ) : (
//                         <button
//                           key={item}
//                           onClick={() => updateFilter('page', item)}
//                           className={`h-9 w-9 rounded-lg text-sm font-medium transition-all ${
//                             page === item
//                               ? 'bg-gradient-to-br from-bamboo-600 to-bamboo-700 text-white shadow-md shadow-bamboo-600/30'
//                               : 'border border-bamboo-200 bg-white text-bamboo-600 hover:border-bamboo-400 hover:shadow-sm'
//                           }`}
//                         >
//                           {item}
//                         </button>
//                       )
//                     )}
//                     <button
//                       onClick={() => updateFilter('page', Math.min(pagination.totalPages, page + 1))}
//                       disabled={page === pagination.totalPages}
//                       className="flex h-9 w-9 items-center justify-center rounded-lg border border-bamboo-200 bg-white text-bamboo-600 transition-all hover:border-bamboo-400 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
//                     >
//                       ›
//                     </button>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Shop;



import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FiSliders, FiSearch, FiX } from 'react-icons/fi';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';

import { productApi, categoryApi } from '../../services/productApi';
import ProductCard from '../../components/product/ProductCard';
import { ProductGridSkeleton } from '../../components/product/ProductCardSkeleton';
import EmptyState from '../../components/ui/EmptyState';
import FilterSidebar from '../../components/product/FilterSidebar';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popularity', label: 'Most Popular' },
  { value: 'discount', label: 'Discount' },
];

const getPaginationRange = (current, total) => {
  const delta = 1;
  const range = [];
  const rangeWithDots = [];
  let last;
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) range.push(i);
  }
  range.forEach((i) => {
    if (last) {
      if (i - last === 2) rangeWithDots.push(last + 1);
      else if (i - last > 2) rangeWithDots.push('...');
    }
    rangeWithDots.push(i);
    last = i;
  });
  return rangeWithDots;
};

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false); // mobile drawer
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // desktop collapsible column
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');

  const filters = useMemo(() => Object.fromEntries(searchParams.entries()), [searchParams]);
  const page = parseInt(filters.page, 10) || 1;
  const sort = filters.sort || 'featured';

  // resetPage=true (default) is for real filter changes (category, sort, search, clear chip) —
  // those should always jump back to page 1.
  // resetPage=false is for pagination itself, so the page value we just set isn't wiped out.
  const updateFilters = (updates, { resetPage = true } = {}) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined) next.delete(key);
      else next.set(key, value);
    });
    if (resetPage && !('page' in updates)) next.delete('page');
    setSearchParams(next);
  };

  const updateFilter = (key, value) => updateFilters({ [key]: value });

  // Dedicated setter for pagination — never strips the page it just set.
  const goToPage = (pageNum) => updateFilters({ page: pageNum }, { resetPage: false });

  const clearFilters = () => {
    setSearchParams({});
    setSearchInput('');
  };

  const { data: categoriesData } = useQuery({
    queryKey: ['categories', 'flat'],
    queryFn: () => categoryApi.getCategories(),
    select: (res) => res.data.data.categories,
  });

  const { data: productsData, isLoading, isError } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productApi.getProducts(filters),
    keepPreviousData: true,
  });

  const products = productsData?.data?.data?.products || [];
  const pagination = productsData?.data?.pagination;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilter('q', searchInput);
  };

  const getFilterLabel = (key, value) => {
    if (key === 'category') {
      const category = categoriesData?.find((cat) => cat._id === value);
      return category?.name || value;
    }
    return value;
  };

  const activeFilterEntries = Object.entries(filters).filter(([k]) => !['page', 'sort'].includes(k));

  const sidebarProps = {
    categories: categoriesData || [],
    filters,
    onChange: updateFilter,
    onChangeMultiple: updateFilters,
    onClear: clearFilters,
  };

  return (
    <div className="min-h-screen bg-sand-100 pb-24">
      <Helmet>
        <title>Shop All Bamboo Products</title>
        <meta
          name="description"
          content="Browse premium handcrafted bamboo furniture, decor, kitchenware, and lifestyle products — sustainable, eco-friendly, made in India."
        />
      </Helmet>

      {/* ── Animated Hero ── */}
      {/* <div className="relative overflow-hidden bg-gradient-to-br from-bamboo-700 via-bamboo-600 to-bamboo-800 px-4 py-20 text-center text-white">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/5 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -25, 0], y: [0, -15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-earth-400/10 blur-3xl"
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] bg-[size:26px_26px]" />

        {[...Array(6)].map((_, i) => (
          <motion.span
            key={i}
            className="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-amber-300/40"
            style={{ left: `${15 + i * 14}%`, top: `${20 + (i % 3) * 20}%` }}
            animate={{ y: [0, -18, 0], opacity: [0.3, 0.9, 0.3] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
          />
        ))}

        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-sand-100 backdrop-blur-sm"
          >
            Wa-Kriti Collection
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-4 font-display text-3xl font-bold sm:text-5xl"
          >
            Shop All Bamboo Products
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mx-auto mt-3 max-w-xl text-sm text-sand-200 sm:text-base"
          >
            Handcrafted furniture, decor, and lifestyle essentials — made sustainably by skilled artisans.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            onSubmit={handleSearchSubmit}
            className="mx-auto mt-8 flex max-w-md items-center rounded-2xl bg-white/95 p-1.5 shadow-2xl shadow-bamboo-900/30 backdrop-blur-sm transition-shadow focus-within:shadow-bamboo-900/40"
          >
            <FiSearch className="ml-3 shrink-0 text-bamboo-400" size={18} />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search bamboo chairs, baskets..."
              className="w-full min-w-0 bg-transparent px-3 py-2.5 text-sm text-bamboo-800 outline-none placeholder:text-bamboo-400"
            />
            <button
              type="submit"
              className="shrink-0 rounded-xl bg-gradient-to-r from-bamboo-600 to-bamboo-700 px-5 py-2.5 text-xs font-bold text-white shadow-md transition-transform hover:scale-105 active:scale-95"
            >
              Search
            </button>
          </motion.form>
        </motion.div>
      </div> */}

      <div className="mx-auto max-w-7xl px-4">
        {/* ── Toolbar ── */}
        <div className="sticky top-0 z-20 -mx-4 mb-6 mt-6 border-b border-bamboo-100/70 bg-sand-100/90 px-4 py-4 backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Mobile: opens the drawer */}
              <button
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-2 rounded-xl border border-bamboo-200 bg-white px-4 py-2.5 text-sm font-semibold text-bamboo-700 shadow-sm transition-all hover:border-bamboo-400 hover:shadow-md active:scale-95 lg:hidden"
              >
                <FiSliders size={16} /> Filters
                {activeFilterEntries.length > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-bamboo-600 text-[10px] font-bold text-white">
                    {activeFilterEntries.length}
                  </span>
                )}
              </button>

              {/* Desktop: toggles the side column */}
              <button
                onClick={() => setIsSidebarOpen((prev) => !prev)}
                className="hidden items-center gap-2 rounded-xl border border-bamboo-200 bg-white px-4 py-2.5 text-sm font-semibold text-bamboo-700 shadow-sm transition-all hover:border-bamboo-400 hover:shadow-md active:scale-95 lg:flex"
              >
                {isSidebarOpen ? <FiX size={16} /> : <FiSliders size={16} />}
                {isSidebarOpen ? 'Hide Filters' : 'Show Filters'}
                {!isSidebarOpen && activeFilterEntries.length > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-bamboo-600 text-[10px] font-bold text-white">
                    {activeFilterEntries.length}
                  </span>
                )}
              </button>

              <p className="hidden text-sm text-bamboo-500 sm:block">
                {pagination ? (
                  <>
                    <span className="font-semibold text-bamboo-700">{pagination.total}</span> product(s) found
                  </>
                ) : (
                  'Loading products...'
                )}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden text-xs font-medium uppercase tracking-wide text-bamboo-400 sm:inline">
                Sort by
              </span>
              <select
                value={sort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="cursor-pointer rounded-xl border border-bamboo-200 bg-white px-3 py-2.5 text-sm font-medium text-bamboo-700 shadow-sm outline-none transition-all hover:border-bamboo-400 focus:ring-2 focus:ring-bamboo-300"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="mt-2 text-xs text-bamboo-500 sm:hidden">
            {pagination ? `${pagination.total} product(s) found` : ''}
          </p>
        </div>

        {/* ── Active filter chips ── */}
        <AnimatePresence>
          {activeFilterEntries.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 flex flex-wrap items-center gap-2 overflow-hidden"
            >
              {activeFilterEntries.map(([key, value]) => (
                <span
                  key={key}
                  className="flex items-center gap-2 rounded-full border border-bamboo-200 bg-white px-3.5 py-1.5 text-xs font-medium text-bamboo-700 shadow-sm transition-all hover:border-bamboo-300"
                >
                  <span className="text-bamboo-400">{key}:</span>
                  {getFilterLabel(key, value)}
                  <button
                    onClick={() => updateFilter(key, '')}
                    className="flex h-4 w-4 items-center justify-center rounded-full text-bamboo-400 transition-colors hover:bg-bamboo-100 hover:text-bamboo-700"
                    aria-label={`Remove ${key} filter`}
                  >
                    <FiX size={12} />
                  </button>
                </span>
              ))}
              <button
                onClick={clearFilters}
                className="text-xs font-semibold text-earth-600 underline-offset-2 hover:underline"
              >
                Clear All
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-8">
          {/* Desktop collapsible column — collapses to 0 width, grid takes the space back */}
          <motion.div
            initial={false}
            animate={{
              width: isSidebarOpen ? 256 : 0,
              opacity: isSidebarOpen ? 1 : 0,
              marginRight: isSidebarOpen ? 0 : -32, // cancels the parent's gap-8 (2rem) when collapsed
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="hidden shrink-0 overflow-hidden lg:block"
          >
            <div className="w-64">
              <FilterSidebar {...sidebarProps} isOpen={false} onClose={() => {}} />
            </div>
          </motion.div>

          {/* Mobile drawer — always mounted so the "Filters" button works regardless of desktop state */}
          <div className="lg:hidden">
            <FilterSidebar {...sidebarProps} isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
          </div>

          <div className="min-w-0 flex-1">
            {isLoading && <ProductGridSkeleton count={8} />}

            {isError && (
              <EmptyState
                title="Something went wrong"
                message="We couldn't load products right now. Please try again shortly."
              />
            )}

            {!isLoading && !isError && products.length === 0 && (
              <EmptyState
                title="No products found"
                message="Try adjusting your filters or search term."
                actionLabel="Clear Filters"
                actionTo="/shop"
              />
            )}

            {!isLoading && products.length > 0 && (
              <>
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {products.map((product, idx) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.3) }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>

                {pagination && pagination.totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => goToPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-bamboo-200 bg-white text-bamboo-600 transition-all hover:border-bamboo-400 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      ‹
                    </button>
                    {getPaginationRange(page, pagination.totalPages).map((item, i) =>
                      item === '...' ? (
                        <span key={`dots-${i}`} className="px-1 text-sm text-bamboo-400">…</span>
                      ) : (
                        <button
                          key={item}
                          onClick={() => goToPage(item)}
                          className={`h-9 w-9 rounded-lg text-sm font-medium transition-all ${
                            page === item
                              ? 'bg-gradient-to-br from-bamboo-600 to-bamboo-700 text-white shadow-md shadow-bamboo-600/30'
                              : 'border border-bamboo-200 bg-white text-bamboo-600 hover:border-bamboo-400 hover:shadow-sm'
                          }`}
                        >
                          {item}
                        </button>
                      )
                    )}
                    <button
                      onClick={() => goToPage(Math.min(pagination.totalPages, page + 1))}
                      disabled={page === pagination.totalPages}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-bamboo-200 bg-white text-bamboo-600 transition-all hover:border-bamboo-400 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      ›
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;