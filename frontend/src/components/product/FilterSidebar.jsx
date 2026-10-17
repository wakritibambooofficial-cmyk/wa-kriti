// import { FiX } from 'react-icons/fi';

// const PRICE_PRESETS = [
//   { label: 'Under ₹500', min: 0, max: 500 },
//   { label: '₹500 – ₹1000', min: 500, max: 1000 },
//   { label: '₹1000 – ₹5000', min: 1000, max: 5000 },
//   { label: '₹5000+', min: 5000, max: null },
// ];

// const CheckboxRow = ({ label, checked, onChange }) => (
//   <label className="flex cursor-pointer items-center gap-2.5 py-1.5 text-sm text-bamboo-600">
//     <input
//       type="checkbox"
//       checked={checked}
//       onChange={onChange}
//       className="h-4 w-4 rounded border-sand-400 text-bamboo-600 focus:ring-bamboo-400"
//     />
//     {label}
//   </label>
// );

// const FilterSidebar = ({ categories = [], filters, onChange, onClear, isOpen, onClose }) => {
//   const content = (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between lg:hidden">
//         <h3 className="font-display text-lg font-semibold text-bamboo-800">Filters</h3>
//         <button onClick={onClose} aria-label="Close filters">
//           <FiX size={20} />
//         </button>
//       </div>

//       <div>
//         <h4 className="mb-2 text-sm font-semibold text-bamboo-800">Category</h4>
//         <div className="max-h-48 space-y-1 overflow-y-auto pr-1">
//           {categories.map((cat) => (
//             <CheckboxRow
//               key={cat._id}
//               label={cat.name}
//               checked={filters.category === cat._id}
//               onChange={() => onChange('category', filters.category === cat._id ? '' : cat._id)}
//             />
//           ))}
//         </div>
//       </div>

//       <div>
//         <h4 className="mb-2 text-sm font-semibold text-bamboo-800">Price</h4>
//         <div className="space-y-1">
//           {PRICE_PRESETS.map((preset) => {
//             const active = String(filters.minPrice) === String(preset.min) && String(filters.maxPrice) === String(preset.max ?? '');
//             return (
//               <CheckboxRow
//                 key={preset.label}
//                 label={preset.label}
//                 checked={active}
//                 onChange={() => {
//                   if (active) {
//                     onChange('minPrice', '');
//                     onChange('maxPrice', '');
//                   } else {
//                     onChange('minPrice', preset.min);
//                     onChange('maxPrice', preset.max ?? '');
//                   }
//                 }}
//               />
//             );
//           })}
//         </div>
//       </div>

//       <div>
//         <h4 className="mb-2 text-sm font-semibold text-bamboo-800">Attributes</h4>
//         <CheckboxRow label="Handmade" checked={filters.handmade === 'true'} onChange={() => onChange('handmade', filters.handmade === 'true' ? '' : 'true')} />
//         <CheckboxRow label="Eco Friendly" checked={filters.ecoFriendly === 'true'} onChange={() => onChange('ecoFriendly', filters.ecoFriendly === 'true' ? '' : 'true')} />
//         <CheckboxRow label="Made in India" checked={filters.madeInIndia === 'true'} onChange={() => onChange('madeInIndia', filters.madeInIndia === 'true' ? '' : 'true')} />
//         <CheckboxRow label="Tribal Artisan" checked={filters.tribalArtisan === 'true'} onChange={() => onChange('tribalArtisan', filters.tribalArtisan === 'true' ? '' : 'true')} />
//         <CheckboxRow label="Best Seller" checked={filters.bestSeller === 'true'} onChange={() => onChange('bestSeller', filters.bestSeller === 'true' ? '' : 'true')} />
//         <CheckboxRow label="Trending" checked={filters.trending === 'true'} onChange={() => onChange('trending', filters.trending === 'true' ? '' : 'true')} />
//         <CheckboxRow label="Limited Edition" checked={filters.limitedEdition === 'true'} onChange={() => onChange('limitedEdition', filters.limitedEdition === 'true' ? '' : 'true')} />
//       </div>

//       <button onClick={onClear} className="text-sm font-semibold text-bamboo-600 hover:underline">
//         Clear All Filters
//       </button>
//     </div>
//   );

//   return (
//     <>
//       {/* Desktop sidebar */}
//       <aside className="hidden w-64 shrink-0 lg:block">{content}</aside>

//       {/* Mobile drawer */}
//       {isOpen && (
//         <div className="fixed inset-0 z-50 lg:hidden">
//           <div className="absolute inset-0 bg-black/40" onClick={onClose} />
//           <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-6 shadow-soft-lg">
//             {content}
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default FilterSidebar;


import { FiX, FiChevronDown } from 'react-icons/fi';
import { useState } from 'react';

const PRICE_PRESETS = [
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 – ₹1000', min: 500, max: 1000 },
  { label: '₹1000 – ₹5000', min: 1000, max: 5000 },
  { label: '₹5000+', min: 5000, max: null },
];

const ATTRIBUTES = [
  { key: 'handmade', label: 'Handmade' },
  { key: 'ecoFriendly', label: 'Eco Friendly' },
  { key: 'madeInIndia', label: 'Made in India' },
  { key: 'tribalArtisan', label: 'Tribal Artisan' },
  { key: 'bestSeller', label: 'Best Seller' },
  { key: 'trending', label: 'Trending' },
  { key: 'limitedEdition', label: 'Limited Edition' },
];

const CheckboxRow = ({ label, checked, onChange }) => (
  <label className="group flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm text-bamboo-600 transition-colors hover:bg-bamboo-50">
    <span className="relative flex h-4.5 w-4.5 shrink-0 items-center justify-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer absolute h-full w-full cursor-pointer opacity-0"
      />
      <span
        className={`flex h-4.5 w-4.5 items-center justify-center rounded-md border-2 transition-all duration-150 ${
          checked
            ? 'border-bamboo-600 bg-bamboo-600'
            : 'border-sand-400 bg-white group-hover:border-bamboo-400'
        }`}
      >
        <svg
          className={`h-3 w-3 text-white transition-transform duration-150 ${checked ? 'scale-100' : 'scale-0'}`}
          viewBox="0 0 12 12"
          fill="none"
        >
          <path d="M2.5 6.5L4.5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </span>
    <span className={`transition-colors ${checked ? 'font-medium text-bamboo-800' : ''}`}>{label}</span>
  </label>
);

const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-bamboo-100 pb-5">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-sm font-semibold text-bamboo-800"
      >
        {title}
        <FiChevronDown
          size={16}
          className={`text-bamboo-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
};

const FilterSidebar = ({ categories = [], filters, onChange, onChangeMultiple, onClear, isOpen, onClose }) => {
  const content = (
    <div className="space-y-5">
      <div className="flex items-center justify-between lg:hidden">
        <h3 className="font-display text-lg font-semibold text-bamboo-800">Filters</h3>
        <button onClick={onClose} aria-label="Close filters" className="rounded-full p-1.5 hover:bg-bamboo-50">
          <FiX size={20} />
        </button>
      </div>

      <FilterSection title="Category">
        <div className="scrollbar-thin max-h-48 space-y-0.5 overflow-y-auto pr-1">
          {categories.map((cat) => (
            <CheckboxRow
              key={cat._id}
              label={cat.name}
              checked={filters.category === cat._id}
              onChange={() => onChange('category', filters.category === cat._id ? '' : cat._id)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price">
        <div className="space-y-0.5">
          {PRICE_PRESETS.map((preset) => {
            const active =
              String(filters.minPrice) === String(preset.min) &&
              String(filters.maxPrice) === String(preset.max ?? '');
            return (
              <CheckboxRow
                key={preset.label}
                label={preset.label}
                checked={active}
                onChange={() => {
                  if (active) {
                    onChangeMultiple({ minPrice: '', maxPrice: '' });
                  } else {
                    onChangeMultiple({ minPrice: preset.min, maxPrice: preset.max ?? '' });
                  }
                }}
              />
            );
          })}
        </div>
      </FilterSection>

      <FilterSection title="Attributes">
        <div className="space-y-0.5">
          {ATTRIBUTES.map((attr) => (
            <CheckboxRow
              key={attr.key}
              label={attr.label}
              checked={filters[attr.key] === 'true'}
              onChange={() => onChange(attr.key, filters[attr.key] === 'true' ? '' : 'true')}
            />
          ))}
        </div>
      </FilterSection>

      <button
        onClick={onClear}
        className="w-full rounded-lg border border-bamboo-200 py-2.5 text-sm font-semibold text-bamboo-600 transition-colors hover:border-bamboo-400 hover:bg-bamboo-50"
      >
        Clear All Filters
      </button>
    </div>
  );

  return (
    <>
      <aside className="hidden w-64 shrink-0 lg:block">{content}</aside>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-6 shadow-soft-lg">
            {content}
          </div>
        </div>
      )}
    </>
  );
};

export default FilterSidebar;