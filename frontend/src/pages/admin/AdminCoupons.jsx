// import { useState } from 'react';
// import { useQuery, useQueryClient } from '@tanstack/react-query';
// import { Helmet } from 'react-helmet-async';
// import toast from 'react-hot-toast';
// import { FiPlus, FiTrash2, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
// import { adminCouponApi } from '../../services/adminApi';
// import Button from '../../components/ui/Button';
// import FormInput from '../../components/ui/FormInput';

// const emptyForm = { code: '', description: '', type: 'percentage', value: '', minPurchaseAmount: '0', endDate: '', perUserLimit: '1' };

// const AdminCoupons = () => {
//   const queryClient = useQueryClient(); 
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [form, setForm] = useState(emptyForm);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const { data: coupons, isLoading } = useQuery({
//     queryKey: ['admin-coupons'],
//     queryFn: () => adminCouponApi.getAll(),
//     select: (res) => res.data.data.coupons,
//   });

//   const handleChange = (key, value) => setForm((f) => ({ ...f, [key]: value }));

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     try {
//       await adminCouponApi.create({
//         ...form,
//         value: Number(form.value),
//         minPurchaseAmount: Number(form.minPurchaseAmount),
//         perUserLimit: Number(form.perUserLimit),
//         endDate: form.endDate,
//       });
//       toast.success('Coupon created');
//       queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
//       setIsFormOpen(false);
//       setForm(emptyForm);
//     } catch (error) {
//       toast.error(error?.response?.data?.message || 'Could not create coupon');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleToggle = async (id) => {
//     await adminCouponApi.toggle(id);
//     queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
//   };

//   const handleDelete = async (id) => {
//     await adminCouponApi.delete(id);
//     toast.success('Coupon deleted');
//     queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
//   };
 
//   return (
//     <div className="px-6 py-8">
//       <Helmet><title>Manage Coupons</title></Helmet>
//       <div className="flex items-center justify-between">
//         <h1 className="font-display text-2xl font-bold text-bamboo-800">Coupons</h1>
//         <Button onClick={() => setIsFormOpen(true)} className="!px-4 !py-2 text-sm"><FiPlus size={14} className="mr-1.5" /> Create Coupon</Button>
//       </div>

//       <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-soft">
//         <table className="w-full text-left text-sm">
//           <thead className="bg-sand-100 text-xs uppercase text-bamboo-500">
//             <tr>
//               <th className="px-4 py-3">Code</th>
//               <th className="px-4 py-3">Type</th>
//               <th className="px-4 py-3">Value</th>
//               <th className="px-4 py-3">Used</th>
//               <th className="px-4 py-3">Expires</th>
//               <th className="px-4 py-3">Status</th>
//               <th className="px-4 py-3">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-sand-200">
//             {isLoading ? (
//               <tr><td colSpan={7} className="px-4 py-8 text-center text-bamboo-400">Loading...</td></tr>
//             ) : !coupons?.length ? (
//               <tr><td colSpan={7} className="px-4 py-8 text-center text-bamboo-400">No coupons yet</td></tr>
//             ) : (
//               coupons.map((c) => (
//                 <tr key={c._id}>
//                   <td className="px-4 py-3 font-semibold text-bamboo-800">{c.code}</td>
//                   <td className="px-4 py-3 capitalize text-bamboo-600">{c.type.replace('_', ' ')}</td>
//                   <td className="px-4 py-3 text-bamboo-600">{c.type === 'percentage' ? `${c.value}%` : `₹${c.value}`}</td>
//                   <td className="px-4 py-3 text-bamboo-500">{c.usageCount}{c.usageLimit ? ` / ${c.usageLimit}` : ''}</td>
//                   <td className="px-4 py-3 text-xs text-bamboo-400">{new Date(c.endDate).toLocaleDateString('en-IN')}</td>
//                   <td className="px-4 py-3">
//                     <button onClick={() => handleToggle(c._id)} className="flex items-center gap-1 text-xs font-semibold">
//                       {c.status === 'active' ? <FiToggleRight className="text-bamboo-600" size={18} /> : <FiToggleLeft className="text-bamboo-300" size={18} />}
//                       <span className="capitalize text-bamboo-600">{c.status}</span>
//                     </button>
//                   </td>
//                   <td className="px-4 py-3">
//                     <button onClick={() => handleDelete(c._id)} className="text-red-500 hover:underline"><FiTrash2 size={13} /></button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {isFormOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
//           <div className="w-full max-w-md rounded-2xl bg-white p-6">
//             <h2 className="font-display text-lg font-semibold text-bamboo-800">Create Coupon</h2>
//             <form onSubmit={handleSubmit} className="mt-4 space-y-4">
//               <FormInput label="Coupon Code" value={form.code} onChange={(e) => handleChange('code', e.target.value.toUpperCase())} required />
//               <FormInput label="Description" value={form.description} onChange={(e) => handleChange('description', e.target.value)} />
//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Type</label>
//                 <select value={form.type} onChange={(e) => handleChange('type', e.target.value)} className="input-field">
//                   <option value="percentage">Percentage</option>
//                   <option value="fixed">Fixed Amount</option>
//                   <option value="free_shipping">Free Shipping</option>
//                 </select>
//               </div>
//               <FormInput label="Value" type="number" value={form.value} onChange={(e) => handleChange('value', e.target.value)} required />
//               <FormInput label="Minimum Purchase Amount" type="number" value={form.minPurchaseAmount} onChange={(e) => handleChange('minPurchaseAmount', e.target.value)} />
//               <FormInput label="Per User Limit" type="number" value={form.perUserLimit} onChange={(e) => handleChange('perUserLimit', e.target.value)} />
//               <FormInput label="Expiry Date" type="date" value={form.endDate} onChange={(e) => handleChange('endDate', e.target.value)} required />
//               <div className="flex gap-3">
//                 <Button type="button" variant="secondary" className="flex-1" onClick={() => setIsFormOpen(false)}>Cancel</Button>
//                 <Button type="submit" className="flex-1" isLoading={isSubmitting}>Create</Button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminCoupons;



import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import {
  FiPlus,
  FiTrash2,
  FiToggleLeft,
  FiToggleRight,
  FiX,
} from 'react-icons/fi';

import { adminCouponApi } from '../../services/adminApi';
import { productApi, categoryApi } from '../../services/productApi';

import Button from '../../components/ui/Button';
import FormInput from '../../components/ui/FormInput';

const emptyForm = {
  code: '',
  description: '',

  type: 'percentage',
  value: '',

  minPurchaseAmount: '0',
  maxDiscountAmount: '',

  usageLimit: '',
  perUserLimit: '1',

  applicableCategories: [],
  applicableProducts: [],

  membershipOnly: false,
  firstOrderOnly: false,
  isFestivalCoupon: false,

  startDate: '',
  endDate: '',

  status: 'active',
};

const AdminCoupons = () => {
  const queryClient = useQueryClient();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /*
   * Coupons
   */
  const {
    data: coupons = [],
    isLoading,
  } = useQuery({
    queryKey: ['admin-coupons'],
    queryFn: () => adminCouponApi.getAll(),
    select: (res) => res.data.data.coupons,
  });

  /*
   * Categories
   */
  const {
    data: categories = [],
  } = useQuery({
    queryKey: ['categories', 'admin'],
    queryFn: () =>
      categoryApi.getCategories({
        status: 'all',
      }),
    select: (res) => res.data.data.categories,
  });

  /*
   * Products
   */
  const {
    data: products = [],
  } = useQuery({
    queryKey: ['admin-products-for-coupons'],
    queryFn: () =>
      productApi.getProducts({
        status: 'all',
        limit: 100,
      }),
    select: (res) => res.data.data.products,
  });

  /*
   * Generic form change
   */
  const handleChange = (key, value) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  /*
   * Multi-select helper
   */
  const toggleArrayValue = (key, value) => {
    setForm((previous) => {
      const current = previous[key] || [];

      return {
        ...previous,
        [key]: current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value],
      };
    });
  };

  /*
   * Open create form
   */
  const openCreateForm = () => {
    setForm({
      ...emptyForm,
      startDate: new Date().toISOString().slice(0, 16),
    });

    setIsFormOpen(true);
  };

  /*
   * Close form
   */
  const closeForm = () => {
    if (isSubmitting) return;

    setIsFormOpen(false);
    setForm(emptyForm);
  };

  /*
   * Client-side validation.
   *
   * Server-side validation still remains authoritative.
   */
  const validateForm = () => {
    const code = form.code.trim().toUpperCase();

    if (!code) {
      return 'Coupon code is required';
    }

    if (!/^[A-Z0-9_-]+$/.test(code)) {
      return 'Coupon code can only contain letters, numbers, hyphens and underscores';
    }

    if (code.length < 3 || code.length > 50) {
      return 'Coupon code must be between 3 and 50 characters';
    }

    if (!form.type) {
      return 'Coupon type is required';
    }

    if (form.type !== 'free_shipping') {
      if (form.value === '') {
        return 'Coupon value is required';
      }

      const value = Number(form.value);

      if (!Number.isFinite(value) || value < 0) {
        return 'Coupon value must be 0 or greater';
      }

      if (form.type === 'percentage' && value > 100) {
        return 'Percentage discount cannot exceed 100%';
      }
    }

    if (form.minPurchaseAmount !== '') {
      const minimum = Number(form.minPurchaseAmount);

      if (!Number.isFinite(minimum) || minimum < 0) {
        return 'Minimum purchase amount must be 0 or greater';
      }
    }

    if (form.maxDiscountAmount !== '') {
      const maxDiscount = Number(form.maxDiscountAmount);

      if (
        !Number.isFinite(maxDiscount) ||
        maxDiscount <= 0
      ) {
        return 'Maximum discount must be greater than 0';
      }

      if (form.type !== 'percentage') {
        return 'Maximum discount can only be used with percentage coupons';
      }
    }

    if (form.usageLimit !== '') {
      const usageLimit = Number(form.usageLimit);

      if (
        !Number.isInteger(usageLimit) ||
        usageLimit < 1
      ) {
        return 'Usage limit must be a whole number greater than 0';
      }
    }

    if (form.perUserLimit !== '') {
      const perUserLimit = Number(form.perUserLimit);

      if (
        !Number.isInteger(perUserLimit) ||
        perUserLimit < 1
      ) {
        return 'Per-user limit must be a whole number greater than 0';
      }
    }

    if (!form.startDate) {
      return 'Start date is required';
    }

    if (!form.endDate) {
      return 'Expiry date is required';
    }

    const startDate = new Date(form.startDate);
    const endDate = new Date(form.endDate);

    if (Number.isNaN(startDate.getTime())) {
      return 'Invalid start date';
    }

    if (Number.isNaN(endDate.getTime())) {
      return 'Invalid expiry date';
    }

    if (endDate <= startDate) {
      return 'Expiry date must be after the start date';
    }

    return null;
  };

  /*
   * Create coupon
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        code: form.code.trim().toUpperCase(),

        description: form.description.trim(),

        type: form.type,

        /*
         * Free shipping does not need a value.
         */
        value:
          form.type === 'free_shipping'
            ? 0
            : Number(form.value),

        minPurchaseAmount:
          form.minPurchaseAmount === ''
            ? 0
            : Number(form.minPurchaseAmount),

        maxDiscountAmount:
          form.type === 'percentage' &&
          form.maxDiscountAmount !== ''
            ? Number(form.maxDiscountAmount)
            : null,

        usageLimit:
          form.usageLimit === ''
            ? null
            : Number(form.usageLimit),

        perUserLimit:
          form.perUserLimit === ''
            ? 1
            : Number(form.perUserLimit),

        applicableCategories:
          form.applicableCategories,

        applicableProducts:
          form.applicableProducts,

        membershipOnly:
          Boolean(form.membershipOnly),

        firstOrderOnly:
          Boolean(form.firstOrderOnly),

        isFestivalCoupon:
          Boolean(form.isFestivalCoupon),

        startDate: form.startDate,

        endDate: form.endDate,

        status: form.status,
      };

      await adminCouponApi.create(payload);

      toast.success('Coupon created successfully');

      queryClient.invalidateQueries({
        queryKey: ['admin-coupons'],
      });

      closeForm();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          'Could not create coupon'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /*
   * Toggle status
   */
  const handleToggle = async (coupon) => {
    try {
      await adminCouponApi.toggle(coupon._id);

      queryClient.invalidateQueries({
        queryKey: ['admin-coupons'],
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          'Could not update coupon status'
      );
    }
  };

  /*
   * Delete
   */
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to permanently delete this coupon?'
    );

    if (!confirmed) return;

    try {
      await adminCouponApi.delete(id);

      toast.success('Coupon deleted');

      queryClient.invalidateQueries({
        queryKey: ['admin-coupons'],
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          'Could not delete coupon'
      );
    }
  };

  return (
    <div className="px-6 py-8">
      <Helmet>
        <title>Manage Coupons</title>
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-bamboo-800">
            Coupons
          </h1>

          <p className="mt-1 text-sm text-bamboo-400">
            Create and manage promotional discounts.
          </p>
        </div>

        <Button
          onClick={openCreateForm}
          className="!px-4 !py-2 text-sm"
        >
          <FiPlus
            size={14}
            className="mr-1.5"
          />
          Create Coupon
        </Button>
      </div>

      {/* Coupon table */}
      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-soft">
        <table className="w-full text-left text-sm">
          <thead className="bg-sand-100 text-xs uppercase text-bamboo-500">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Value</th>
              <th className="px-4 py-3">Minimum</th>
              <th className="px-4 py-3">Used</th>
              <th className="px-4 py-3">Expires</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-sand-200">
            {isLoading ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center text-bamboo-400"
                >
                  Loading...
                </td>
              </tr>
            ) : !coupons.length ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center text-bamboo-400"
                >
                  No coupons yet
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr key={coupon._id}>
                  <td className="px-4 py-3 font-semibold text-bamboo-800">
                    {coupon.code}
                  </td>

                  <td className="px-4 py-3 capitalize text-bamboo-600">
                    {coupon.type.replace('_', ' ')}
                  </td>

                  <td className="px-4 py-3 text-bamboo-600">
                    {coupon.type === 'percentage'
                      ? `${coupon.value}%`
                      : coupon.type === 'free_shipping'
                        ? 'Free'
                        : `₹${coupon.value}`}
                  </td>

                  <td className="px-4 py-3 text-bamboo-500">
                    ₹{coupon.minPurchaseAmount || 0}
                  </td>

                  <td className="px-4 py-3 text-bamboo-500">
                    {coupon.usageCount}
                    {coupon.usageLimit
                      ? ` / ${coupon.usageLimit}`
                      : ' / ∞'}
                  </td>

                  <td className="px-4 py-3 text-xs text-bamboo-400">
                    {coupon.endDate
                      ? new Date(
                          coupon.endDate
                        ).toLocaleDateString('en-IN')
                      : '-'}
                  </td>

                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() =>
                        handleToggle(coupon)
                      }
                      className="flex items-center gap-1 text-xs font-semibold"
                    >
                      {coupon.status === 'active' ? (
                        <FiToggleRight
                          className="text-bamboo-600"
                          size={18}
                        />
                      ) : (
                        <FiToggleLeft
                          className="text-bamboo-300"
                          size={18}
                        />
                      )}

                      <span className="capitalize text-bamboo-600">
                        {coupon.status}
                      </span>
                    </button>
                  </td>

                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(coupon._id)
                      }
                      className="text-red-500 hover:underline"
                      title="Delete coupon"
                    >
                      <FiTrash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-4 py-8">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6">
            {/* Modal header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg font-semibold text-bamboo-800">
                  Create Coupon
                </h2>

                <p className="mt-1 text-xs text-bamboo-400">
                  Configure discount, eligibility and usage rules.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-full p-2 text-bamboo-400 hover:bg-sand-100 hover:text-bamboo-700"
              >
                <FiX size={18} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-5 max-h-[75vh] space-y-5 overflow-y-auto pr-1"
            >
              {/* Basic information */}
              <section>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-bamboo-400">
                  Basic Information
                </p>

                <div className="space-y-3">
                  <FormInput
                    label="Coupon Code"
                    value={form.code}
                    onChange={(e) =>
                      handleChange(
                        'code',
                        e.target.value
                          .toUpperCase()
                          .replace(/\s/g, '')
                      )
                    }
                    placeholder="e.g. WAKRITI20"
                    required
                  />

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-bamboo-700">
                      Description
                    </label>

                    <textarea
                      value={form.description}
                      onChange={(e) =>
                        handleChange(
                          'description',
                          e.target.value
                        )
                      }
                      maxLength={500}
                      placeholder="Describe what this coupon offers..."
                      className="input-field min-h-[80px]"
                    />
                  </div>
                </div>
              </section>

              {/* Discount */}
              <section>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-bamboo-400">
                  Discount
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-bamboo-700">
                      Discount Type
                    </label>

                    <select
                      value={form.type}
                      onChange={(e) =>
                        handleChange(
                          'type',
                          e.target.value
                        )
                      }
                      className="input-field"
                    >
                      <option value="percentage">
                        Percentage
                      </option>

                      <option value="fixed">
                        Fixed Amount
                      </option>

                      <option value="free_shipping">
                        Free Shipping
                      </option>
                    </select>
                  </div>

                  <FormInput
                    label={
                      form.type === 'percentage'
                        ? 'Discount (%)'
                        : form.type === 'fixed'
                          ? 'Discount Amount (₹)'
                          : 'Discount Value'
                    }
                    type="number"
                    min="0"
                    max={
                      form.type === 'percentage'
                        ? '100'
                        : undefined
                    }
                    step="0.01"
                    value={
                      form.type === 'free_shipping'
                        ? '0'
                        : form.value
                    }
                    disabled={
                      form.type === 'free_shipping'
                    }
                    onChange={(e) =>
                      handleChange(
                        'value',
                        e.target.value
                      )
                    }
                    required={
                      form.type !== 'free_shipping'
                    }
                  />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <FormInput
                    label="Minimum Purchase (₹)"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.minPurchaseAmount}
                    onChange={(e) =>
                      handleChange(
                        'minPurchaseAmount',
                        e.target.value
                      )
                    }
                  />

                  <FormInput
                    label="Maximum Discount (₹)"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.maxDiscountAmount}
                    disabled={
                      form.type !== 'percentage'
                    }
                    onChange={(e) =>
                      handleChange(
                        'maxDiscountAmount',
                        e.target.value
                      )
                    }
                    placeholder={
                      form.type === 'percentage'
                        ? 'Optional cap'
                        : 'Only for percentage'
                    }
                  />
                </div>
              </section>

              {/* Usage */}
              <section>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-bamboo-400">
                  Usage Limits
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <FormInput
                    label="Total Usage Limit"
                    type="number"
                    min="1"
                    step="1"
                    value={form.usageLimit}
                    onChange={(e) =>
                      handleChange(
                        'usageLimit',
                        e.target.value
                      )
                    }
                    placeholder="Unlimited"
                  />

                  <FormInput
                    label="Per User Limit"
                    type="number"
                    min="1"
                    step="1"
                    value={form.perUserLimit}
                    onChange={(e) =>
                      handleChange(
                        'perUserLimit',
                        e.target.value
                      )
                    }
                  />
                </div>

                <p className="mt-2 text-xs text-bamboo-400">
                  Leave Total Usage Limit empty for unlimited
                  usage.
                </p>
              </section>

              {/* Eligibility */}
              <section>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-bamboo-400">
                  Eligibility
                </p>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-bamboo-600">
                    <input
                      type="checkbox"
                      checked={form.membershipOnly}
                      onChange={(e) =>
                        handleChange(
                          'membershipOnly',
                          e.target.checked
                        )
                      }
                    />
                    Members only
                  </label>

                  <label className="flex items-center gap-2 text-sm text-bamboo-600">
                    <input
                      type="checkbox"
                      checked={form.firstOrderOnly}
                      onChange={(e) =>
                        handleChange(
                          'firstOrderOnly',
                          e.target.checked
                        )
                      }
                    />
                    First order only
                  </label>

                  <label className="flex items-center gap-2 text-sm text-bamboo-600">
                    <input
                      type="checkbox"
                      checked={form.isFestivalCoupon}
                      onChange={(e) =>
                        handleChange(
                          'isFestivalCoupon',
                          e.target.checked
                        )
                      }
                    />
                    Festival coupon
                  </label>
                </div>
              </section>

              {/* Categories */}
              <section>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-bamboo-400">
                  Applicable Categories
                </p>

                {!categories.length ? (
                  <p className="text-xs text-bamboo-400">
                    No categories available.
                  </p>
                ) : (
                  <div className="max-h-40 space-y-2 overflow-y-auto rounded-xl border border-sand-200 p-3">
                    {categories.map((category) => (
                      <label
                        key={category._id}
                        className="flex items-center gap-2 text-sm text-bamboo-600"
                      >
                        <input
                          type="checkbox"
                          checked={form.applicableCategories.includes(
                            category._id
                          )}
                          onChange={() =>
                            toggleArrayValue(
                              'applicableCategories',
                              category._id
                            )
                          }
                        />

                        {category.name}
                      </label>
                    ))}
                  </div>
                )}

                <p className="mt-2 text-xs text-bamboo-400">
                  Select none to make the coupon applicable
                  to all categories.
                </p>
              </section>

              {/* Products */}
              <section>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-bamboo-400">
                  Applicable Products
                </p>

                {!products.length ? (
                  <p className="text-xs text-bamboo-400">
                    No products available.
                  </p>
                ) : (
                  <div className="max-h-48 space-y-2 overflow-y-auto rounded-xl border border-sand-200 p-3">
                    {products.map((product) => (
                      <label
                        key={product._id}
                        className="flex items-center gap-2 text-sm text-bamboo-600"
                      >
                        <input
                          type="checkbox"
                          checked={form.applicableProducts.includes(
                            product._id
                          )}
                          onChange={() =>
                            toggleArrayValue(
                              'applicableProducts',
                              product._id
                            )
                          }
                        />

                        <span>
                          {product.name}

                          {product.sku && (
                            <span className="ml-2 text-xs text-bamboo-400">
                              ({product.sku})
                            </span>
                          )}
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                <p className="mt-2 text-xs text-bamboo-400">
                  Select none to make the coupon applicable
                  to all products.
                </p>
              </section>

              {/* Schedule */}
              <section>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-bamboo-400">
                  Schedule
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <FormInput
                    label="Start Date & Time"
                    type="datetime-local"
                    value={form.startDate}
                    onChange={(e) =>
                      handleChange(
                        'startDate',
                        e.target.value
                      )
                    }
                    required
                  />

                  <FormInput
                    label="Expiry Date & Time"
                    type="datetime-local"
                    value={form.endDate}
                    onChange={(e) =>
                      handleChange(
                        'endDate',
                        e.target.value
                      )
                    }
                    required
                  />
                </div>
              </section>

              {/* Status */}
              <section>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-bamboo-400">
                  Status
                </p>

                <select
                  value={form.status}
                  onChange={(e) =>
                    handleChange(
                      'status',
                      e.target.value
                    )
                  }
                  className="input-field"
                >
                  <option value="active">
                    Active
                  </option>

                  <option value="inactive">
                    Inactive
                  </option>
                </select>
              </section>

              {/* Actions */}
              <div className="sticky bottom-0 flex gap-3 bg-white pt-3">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={closeForm}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  className="flex-1"
                  isLoading={isSubmitting}
                >
                  Create Coupon
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;