// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import FormInput from '../ui/FormInput';
// import Button from '../ui/Button';

// const addressFormSchema = z.object({
//   fullName: z.string().trim().min(1, 'Full name is required'),
//   phone: z.string().trim().min(10, 'Enter a valid 10-digit phone number'),
//   addressLine1: z.string().trim().min(1, 'Address is required'),
//   addressLine2: z.string().trim().optional().or(z.literal('')),
//   landmark: z.string().trim().optional().or(z.literal('')),
//   city: z.string().trim().min(1, 'City is required'),
//   state: z.string().trim().min(1, 'State is required'),
//   pincode: z.string().regex(/^[1-9][0-9]{5}$/, 'Enter a valid 6-digit PIN code'),
//   label: z.enum(['home', 'office', 'other']),
// });

// const AddressForm = ({ defaultValues, onSubmit, onCancel, isSubmitting }) => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(addressFormSchema),
//     defaultValues: defaultValues || { label: 'home', country: 'India' },
//   });

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
//       <div className="grid grid-cols-2 gap-3">
//         <FormInput label="Full Name" error={errors.fullName} {...register('fullName')} />
//         <FormInput label="Phone" type="tel" error={errors.phone} {...register('phone')} />
//       </div>
//       <FormInput label="Address Line 1" error={errors.addressLine1} {...register('addressLine1')} />
//       <FormInput label="Address Line 2 (Optional)" error={errors.addressLine2} {...register('addressLine2')} />
//       <FormInput label="Landmark (Optional)" error={errors.landmark} {...register('landmark')} />
//       <div className="grid grid-cols-3 gap-3">
//         <FormInput label="City" error={errors.city} {...register('city')} />
//         <FormInput label="State" error={errors.state} {...register('state')} />
//         <FormInput label="PIN Code" error={errors.pincode} {...register('pincode')} />
//       </div>
//       <div>
//         <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Address Label</label>
//         <select {...register('label')} className="input-field">
//           <option value="home">Home</option>
//           <option value="office">Office</option>
//           <option value="other">Other</option>
//         </select>
//       </div>

//       <div className="flex gap-3 pt-2">
//         {onCancel && (
//           <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
//             Cancel
//           </Button>
//         )}
//         <Button type="submit" isLoading={isSubmitting} className="flex-1">
//           Save Address
//         </Button>
//       </div>
//     </form>
//   );
// };

// export default AddressForm;


import { useForm } from 'react-hook-form';
import Button from '../ui/Button';

const INDIAN_STATES = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

const AddressForm = ({ defaultValues, onSubmit, onCancel, isSubmitting }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      label: defaultValues?.label || 'home',
      fullName: defaultValues?.fullName || '',
      phone: defaultValues?.phone || '',
      addressLine1: defaultValues?.addressLine1 || '',
      addressLine2: defaultValues?.addressLine2 || '',
      city: defaultValues?.city || '',
      state: defaultValues?.state || '',
      pincode: defaultValues?.pincode || '',
    },
  });

  const inputClass =
    'mt-1 w-full rounded-lg border border-sand-300 bg-white px-3 py-2 text-sm text-bamboo-800 focus:border-bamboo-500 focus:outline-none focus:ring-1 focus:ring-bamboo-500';
  const errorClass = 'mt-1 text-xs text-red-500';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* Label */}
      <div>
        <label className="text-sm font-medium text-bamboo-700">Label</label>
        <select {...register('label')} className={inputClass}>
          <option value="home">Home</option>
          <option value="office">Office</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Full Name */}
      <div>
        <label className="text-sm font-medium text-bamboo-700">Full Name</label>
        <input
          type="text"
          className={inputClass}
          {...register('fullName', { required: 'Full name is required' })}
        />
        {errors.fullName && <p className={errorClass}>{errors.fullName.message}</p>}
      </div>

      {/* Phone */}
      <div>
        <label className="text-sm font-medium text-bamboo-700">Phone</label>
        <input
          type="tel"
          className={inputClass}
          {...register('phone', {
            required: 'Phone number is required',
            pattern: {
              value: /^[6-9]\d{9}$/,
              message: 'Enter a valid 10-digit phone number',
            },
          })}
        />
        {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
      </div>

      {/* Pincode */}
      <div>
        <label className="text-sm font-medium text-bamboo-700">Pincode</label>
        <input
          type="text"
          className={inputClass}
          {...register('pincode', {
            required: 'Pincode is required',
            pattern: {
              value: /^\d{6}$/,
              message: 'Enter a valid 6-digit pincode',
            },
          })}
        />
        {errors.pincode && <p className={errorClass}>{errors.pincode.message}</p>}
      </div>

      {/* Address Line 1 */}
      <div className="sm:col-span-2">
        <label className="text-sm font-medium text-bamboo-700">Address Line 1</label>
        <input
          type="text"
          className={inputClass}
          {...register('addressLine1', { required: 'Address line 1 is required' })}
        />
        {errors.addressLine1 && <p className={errorClass}>{errors.addressLine1.message}</p>}
      </div>

      {/* Address Line 2 */}
      <div className="sm:col-span-2">
        <label className="text-sm font-medium text-bamboo-700">Address Line 2 (Optional)</label>
        <input type="text" className={inputClass} {...register('addressLine2')} />
      </div>

      {/* City */}
      <div>
        <label className="text-sm font-medium text-bamboo-700">City</label>
        <input
          type="text"
          className={inputClass}
          {...register('city', { required: 'City is required' })}
        />
        {errors.city && <p className={errorClass}>{errors.city.message}</p>}
      </div>

      {/* State Dropdown */}
      <div>
        <label className="text-sm font-medium text-bamboo-700">State</label>
        <select
          className={inputClass}
          defaultValue=""
          {...register('state', { required: 'State is required' })}
        >
          <option value="" disabled>
            Select a state
          </option>
          {INDIAN_STATES.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
        {errors.state && <p className={errorClass}>{errors.state.message}</p>}
      </div>

      {/* Actions */}
      <div className="sm:col-span-2 mt-2 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-4 py-2 text-sm font-medium text-bamboo-600 hover:bg-sand-200"
        >
          Cancel
        </button>
        <Button type="submit" disabled={isSubmitting} className="!px-4 !py-2 text-sm">
          {isSubmitting ? 'Saving...' : 'Save Address'}
        </Button>
      </div>
    </form>
  );
};

export default AddressForm;