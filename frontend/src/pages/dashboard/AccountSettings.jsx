
// import { useEffect, useState } from 'react';
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { motion } from 'framer-motion';
// import {
//   FiUser,
//   FiLock,
//   FiMail,
//   FiPhone,
//   FiSave,
//   FiEye,
//   FiEyeOff,
//   FiGift,
//   FiCreditCard,
//   FiAward,
//   FiCalendar,
//   FiHash,
// } from 'react-icons/fi';
// import toast from 'react-hot-toast'; // swap for your actual toast lib/import if different
// import Button from '../../components/ui/Button';
// import { authApi } from '../../services/authApi';

// const inputClass =
//   'w-full rounded-xl border border-sand-200 bg-white px-4 py-2.5 text-sm text-bamboo-800 outline-none transition-all duration-150 placeholder:text-bamboo-300 focus:border-bamboo-500 focus:ring-4 focus:ring-bamboo-100 disabled:cursor-not-allowed disabled:bg-sand-50 disabled:text-bamboo-400';

// const selectClass = `${inputClass} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22%237a8f6d%22><path fill-rule=%22evenodd%22 d=%22M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z%22 clip-rule=%22evenodd%22/></svg>')] bg-[length:16px] bg-[right_0.9rem_center] bg-no-repeat pr-9`;
// const labelClass = 'mb-1.5 block text-xs font-semibold uppercase tracking-wide text-bamboo-500';

// const Card = ({ icon: Icon, title, subtitle, children }) => (
//   <motion.div
//     initial={{ opacity: 0, y: 12 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ duration: 0.35, ease: 'easeOut' }}
//     className="rounded-2xl border border-sand-100 bg-white p-6 shadow-soft transition-shadow duration-200 hover:shadow-lg sm:p-8"
//   >
//     <div className="flex items-center gap-3.5">
//       <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-bamboo-500 to-bamboo-700 text-white shadow-sm shadow-bamboo-200">
//         <Icon size={19} />
//       </span>
//       <div className="min-w-0">
//         <h2 className="font-display text-lg font-semibold leading-tight text-bamboo-800">{title}</h2>
//         {subtitle && <p className="mt-0.5 text-xs text-bamboo-400">{subtitle}</p>}
//       </div>
//     </div>
//     <div className="mt-6 border-t border-sand-100 pt-6">{children}</div>
//   </motion.div>
// );

// /**
//  * Fixed: the switch now sits in its own shrink-0 box with an explicit gap
//  * from the label (gap-4) and the label is min-w-0 flex-1, so long labels
//  * (e.g. "Marketing emails & offers") wrap/truncate instead of squeezing
//  * into — and overlapping — the thumb at narrow widths.
//  */
// const Toggle = ({ checked, onChange, label }) => (
//   <button
//     type="button"
//     onClick={() => onChange(!checked)}
//     className="flex w-full items-center justify-between gap-4 rounded-xl border border-sand-200 bg-white px-4 py-3.5 text-left transition-colors duration-150 hover:border-bamboo-300 hover:bg-sand-50/70 focus:outline-none focus:ring-4 focus:ring-bamboo-100"
//   >
//     <span className="min-w-0 flex-1 truncate text-sm font-medium text-bamboo-800">{label}</span>
//     <span
//       className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ${
//         checked ? 'bg-bamboo-700' : 'bg-sand-300'
//       }`}
//     >
//       <span
//         aria-hidden="true"
//         className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-1 ring-black/5 transition-transform duration-200 ${
//           checked ? 'translate-x-[22px]' : 'translate-x-[2px]'
//         }`}
//       />
//     </span>
//   </button>
// );

// const StatPill = ({ icon: Icon, label, value, accent = 'bamboo' }) => {
//   const accents = {
//     bamboo: 'bg-bamboo-50 text-bamboo-700',
//     amber: 'bg-amber-50 text-amber-600',
//     emerald: 'bg-emerald-50 text-emerald-600',
//     sky: 'bg-sky-50 text-sky-600',
//   };
//   return (
//     <div className="flex items-center gap-3 rounded-xl border border-sand-100 bg-sand-50/60 p-4 transition-colors duration-150 hover:bg-sand-50">
//       <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full shadow-sm ${accents[accent]}`}>
//         <Icon size={16} />
//       </span>
//       <div className="min-w-0">
//         <p className="text-[11px] font-medium uppercase tracking-wide text-bamboo-400">{label}</p>
//         <p className="mt-0.5 truncate text-sm font-semibold text-bamboo-800">{value}</p>
//       </div>
//     </div>
//   );
// };

// const AccountSettings = () => {
//   const queryClient = useQueryClient();

//   const { data: user, isLoading } = useQuery({
//     queryKey: ['me'],
//     queryFn: () => authApi.getMe(),
//     select: (res) => res.data.data.user,
//   });

//   return (
//     <div className="mx-auto max-w-2xl px-4 py-10 sm:py-12">
//       <div className="mb-8 px-1">
//         <h1 className="font-display text-2xl font-semibold tracking-tight text-bamboo-800">Account Settings</h1>
//         <p className="mt-1.5 text-sm text-bamboo-500">View and update your account details.</p>
//       </div>

//       {isLoading || !user ? (
//         <div className="space-y-6">
//           {[...Array(3)].map((_, i) => (
//             <div key={i} className="h-40 animate-pulse rounded-2xl border border-sand-100 bg-white shadow-soft" />
//           ))}
//         </div>
//       ) : (
//         <div className="space-y-6">
//           <Card icon={FiAward} title="Account Overview" subtitle="Your membership and rewards at a glance">
//             <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
//               <StatPill icon={FiAward} label="Membership" value={user.membership} accent="bamboo" />
//               <StatPill icon={FiGift} label="Reward Points" value={user.rewardPoints ?? 0} accent="amber" />
//               <StatPill icon={FiCreditCard} label="Wallet Balance" value={`₹${user.walletBalance ?? 0}`} accent="emerald" />
//               <StatPill icon={FiHash} label="Referral Code" value={user.referralCode ?? '—'} accent="sky" />
//               <StatPill
//                 icon={FiCalendar}
//                 label="Member Since"
//                 value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
//                 accent="bamboo"
//               />
//               <StatPill
//                 icon={FiCalendar}
//                 label="Last Login"
//                 value={user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : '—'}
//                 accent="bamboo"
//               />
//             </div>
//           </Card>

//           <Card icon={FiUser} title="Profile Details" subtitle="Your name and contact info">
//             <ProfileDetailsForm user={user} queryClient={queryClient} />
//           </Card>

//           <Card icon={FiLock} title="Change Password" subtitle="Choose a strong, unique password">
//             <ChangePasswordForm />
//           </Card>
//         </div>
//       )}
//     </div>
//   );
// };

// const ProfileDetailsForm = ({ user, queryClient }) => {
//   const [form, setForm] = useState({
//     firstName: user.firstName ?? '',
//     lastName: user.lastName ?? '',
//     phone: user.phone ?? '',
//     preferredTheme: user.preferredTheme ?? 'system',
//     language: user.language ?? 'en',
//     currency: user.currency ?? 'INR',
//     marketingConsent: user.marketingConsent ?? true,
//     notificationPreferences: {
//       email: user.notificationPreferences?.email ?? true,
//       inApp: user.notificationPreferences?.inApp ?? true,
//     },
//   });

//   // Keep the form in sync if the underlying query data changes elsewhere.
//   useEffect(() => {
//     setForm({
//       firstName: user.firstName ?? '',
//       lastName: user.lastName ?? '',
//       phone: user.phone ?? '',
//       preferredTheme: user.preferredTheme ?? 'system',
//       language: user.language ?? 'en',
//       currency: user.currency ?? 'INR',
//       marketingConsent: user.marketingConsent ?? true,
//       notificationPreferences: {
//         email: user.notificationPreferences?.email ?? true,
//         inApp: user.notificationPreferences?.inApp ?? true,
//       },
//     });
//   }, [user]);

//   const mutation = useMutation({
//     mutationFn: (payload) => authApi.updateProfile(payload),
//     onSuccess: (res) => {
//       queryClient.setQueryData(['me'], (old) =>
//         old ? { ...old, data: { ...old.data, data: { user: res.data.data.user } } } : old
//       );
//       toast.success('Profile updated');
//     },
//     onError: (err) => {
//       toast.error(err?.response?.data?.message || 'Could not update profile');
//     },
//   });

//   const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     mutation.mutate(form);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-5">
//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//         <div>
//           <label className={labelClass} htmlFor="firstName">First name</label>
//           <input id="firstName" name="firstName" value={form.firstName} onChange={handleChange} className={inputClass} required />
//         </div>
//         <div>
//           <label className={labelClass} htmlFor="lastName">Last name</label>
//           <input id="lastName" name="lastName" value={form.lastName} onChange={handleChange} className={inputClass} required />
//         </div>
//       </div>

//       <div>
//         <label className={labelClass} htmlFor="phone">
//           <FiPhone size={11} className="mr-1 inline-block -translate-y-px" />
//           Phone
//         </label>
//         <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} className={inputClass} placeholder="e.g. 9876543210" />
//       </div>

//       <div>
//         <label className={labelClass} htmlFor="email">
//           <FiMail size={11} className="mr-1 inline-block -translate-y-px" />
//           Email
//           {user.emailVerified && (
//             <span className="ml-1.5 inline-flex items-center rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold normal-case tracking-normal text-emerald-600">
//               Verified
//             </span>
//           )}
//         </label>
//         <input id="email" value={user.email ?? ''} disabled className={inputClass} />
//         <p className="mt-1.5 text-xs text-bamboo-400">
//           Email is tied to your account verification. Contact support to change it.
//         </p>
//       </div>

//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
//         <div>
//           <label className={labelClass} htmlFor="preferredTheme">Theme</label>
//           <select id="preferredTheme" name="preferredTheme" value={form.preferredTheme} onChange={handleChange} className={selectClass}>
//             <option value="light">Light</option>
//             <option value="dark">Dark</option>
//             <option value="system">System</option>
//           </select>
//         </div>
//         <div>
//           <label className={labelClass} htmlFor="language">Language</label>
//           <select id="language" name="language" value={form.language} onChange={handleChange} className={selectClass}>
//             <option value="en">English</option>
//             <option value="hi">Hindi</option>
//           </select>
//         </div>
//         <div>
//           <label className={labelClass} htmlFor="currency">Currency</label>
//           <select id="currency" name="currency" value={form.currency} onChange={handleChange} className={selectClass}>
//             <option value="INR">INR (₹)</option>
//             <option value="USD">USD ($)</option>
//           </select>
//         </div>
//       </div>

//       <div className="space-y-2.5 pt-1">
//         <Toggle
//           checked={form.notificationPreferences.email}
//           onChange={(v) => setForm((prev) => ({ ...prev, notificationPreferences: { ...prev.notificationPreferences, email: v } }))}
//           label="Email notifications"
//         />
//         <Toggle
//           checked={form.notificationPreferences.inApp}
//           onChange={(v) => setForm((prev) => ({ ...prev, notificationPreferences: { ...prev.notificationPreferences, inApp: v } }))}
//           label="In-app notifications"
//         />
//         <Toggle
//           checked={form.marketingConsent}
//           onChange={(v) => setForm((prev) => ({ ...prev, marketingConsent: v }))}
//           label="Marketing emails & offers"
//         />
//       </div>

//       <div className="pt-2">
//         <Button type="submit" disabled={mutation.isPending} className="shadow-sm shadow-bamboo-200">
//           <FiSave size={16} className="mr-1.5 inline-block -translate-y-px" />
//           {mutation.isPending ? 'Saving...' : 'Save Changes'}
//         </Button>
//       </div>
//     </form>
//   );
// };

// const ChangePasswordForm = () => {
//   const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
//   const [showCurrent, setShowCurrent] = useState(false);
//   const [showNew, setShowNew] = useState(false);

//   const mutation = useMutation({
//     mutationFn: (payload) => authApi.changePassword(payload),
//     onSuccess: () => {
//       toast.success('Password changed. Please log in again.');
//       setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
//     },
//     onError: (err) => {
//       toast.error(err?.response?.data?.message || 'Could not change password');
//     },
//   });

//   const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (form.newPassword !== form.confirmPassword) {
//       toast.error('New password and confirmation do not match');
//       return;
//     }
//     if (form.newPassword.length < 8) {
//       toast.error('New password must be at least 8 characters');
//       return;
//     }
//     mutation.mutate({ currentPassword: form.currentPassword, newPassword: form.newPassword });
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-5">
//       <div>
//         <label className={labelClass} htmlFor="currentPassword">Current password</label>
//         <div className="relative">
//           <input
//             id="currentPassword"
//             name="currentPassword"
//             type={showCurrent ? 'text' : 'password'}
//             value={form.currentPassword}
//             onChange={handleChange}
//             className={`${inputClass} pr-11`}
//             required
//           />
//           <button
//             type="button"
//             onClick={() => setShowCurrent((v) => !v)}
//             className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-bamboo-400 transition-colors hover:bg-sand-100 hover:text-bamboo-700"
//             aria-label={showCurrent ? 'Hide password' : 'Show password'}
//           >
//             {showCurrent ? <FiEyeOff size={16} /> : <FiEye size={16} />}
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//         <div>
//           <label className={labelClass} htmlFor="newPassword">New password</label>
//           <div className="relative">
//             <input
//               id="newPassword"
//               name="newPassword"
//               type={showNew ? 'text' : 'password'}
//               value={form.newPassword}
//               onChange={handleChange}
//               className={`${inputClass} pr-11`}
//               minLength={8}
//               required
//             />
//             <button
//               type="button"
//               onClick={() => setShowNew((v) => !v)}
//               className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-bamboo-400 transition-colors hover:bg-sand-100 hover:text-bamboo-700"
//               aria-label={showNew ? 'Hide password' : 'Show password'}
//             >
//               {showNew ? <FiEyeOff size={16} /> : <FiEye size={16} />}
//             </button>
//           </div>
//         </div>
//         <div>
//           <label className={labelClass} htmlFor="confirmPassword">Confirm new password</label>
//           <input
//             id="confirmPassword"
//             name="confirmPassword"
//             type={showNew ? 'text' : 'password'}
//             value={form.confirmPassword}
//             onChange={handleChange}
//             className={inputClass}
//             minLength={8}
//             required
//           />
//         </div>
//       </div>

//       <div className="pt-2">
//         <Button type="submit" disabled={mutation.isPending} className="shadow-sm shadow-bamboo-200">
//           <FiLock size={16} className="mr-1.5 inline-block -translate-y-px" />
//           {mutation.isPending ? 'Updating...' : 'Update Password'}
//         </Button>
//       </div>
//     </form>
//   );
// };

// export default AccountSettings;



import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  FiUser,
  FiLock,
  FiMail,
  FiPhone,
  FiSave,
  FiEye,
  FiEyeOff,
  FiGift,
  FiAward,
  FiCalendar,
} from 'react-icons/fi';
import toast from 'react-hot-toast'; // swap for your actual toast lib/import if different
import Button from '../../components/ui/Button';
import { authApi } from '../../services/authApi';

const inputClass =
  'w-full rounded-xl border border-sand-200 bg-white px-4 py-2.5 text-sm text-bamboo-800 outline-none transition-all duration-150 placeholder:text-bamboo-300 focus:border-bamboo-500 focus:ring-4 focus:ring-bamboo-100 disabled:cursor-not-allowed disabled:bg-sand-50 disabled:text-bamboo-400';

const labelClass = 'mb-1.5 block text-xs font-semibold uppercase tracking-wide text-bamboo-500';

const Card = ({ icon: Icon, title, subtitle, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, ease: 'easeOut' }}
    className="rounded-2xl border border-sand-100 bg-white p-6 shadow-soft transition-shadow duration-200 hover:shadow-lg sm:p-8"
  >
    <div className="flex items-center gap-3.5">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-bamboo-500 to-bamboo-700 text-white shadow-sm shadow-bamboo-200">
        <Icon size={19} />
      </span>
      <div className="min-w-0">
        <h2 className="font-display text-lg font-semibold leading-tight text-bamboo-800">{title}</h2>
        {subtitle && <p className="mt-0.5 text-xs text-bamboo-400">{subtitle}</p>}
      </div>
    </div>
    <div className="mt-6 border-t border-sand-100 pt-6">{children}</div>
  </motion.div>
);

const StatPill = ({ icon: Icon, label, value, accent = 'bamboo' }) => {
  const accents = {
    bamboo: 'bg-bamboo-50 text-bamboo-700',
    amber: 'bg-amber-50 text-amber-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    sky: 'bg-sky-50 text-sky-600',
  };
  return (
    <div className="flex items-center gap-3 rounded-xl border border-sand-100 bg-sand-50/60 p-4 transition-colors duration-150 hover:bg-sand-50">
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full shadow-sm ${accents[accent]}`}>
        <Icon size={16} />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-bamboo-400">{label}</p>
        <p className="mt-0.5 truncate text-sm font-semibold text-bamboo-800">{value}</p>
      </div>
    </div>
  );
};

const AccountSettings = () => {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: () => authApi.getMe(),
    select: (res) => res.data.data.user,
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-12">
      <div className="mb-8 px-1">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-bamboo-800">Account Settings</h1>
        <p className="mt-1.5 text-sm text-bamboo-500">View and update your account details.</p>
      </div>

      {isLoading || !user ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl border border-sand-100 bg-white shadow-soft" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <Card icon={FiAward} title="Account Overview">
            <div className="grid grid-cols-2 gap-3">
              {/* <StatPill icon={FiGift} label="Reward Points" value={user.rewardPoints ?? 0} accent="amber" /> */}
              <StatPill
                icon={FiCalendar}
                label="Last Login"
                value={user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : '—'}
                accent="bamboo"
              />
            </div>
          </Card>

          <Card icon={FiUser} title="Profile Details" subtitle="Your name and contact info">
            <ProfileDetailsForm user={user} queryClient={queryClient} />
          </Card>

          <Card icon={FiLock} title="Change Password" subtitle="Choose a strong, unique password">
            <ChangePasswordForm />
          </Card>
        </div>
      )}
    </div>
  );
};

const ProfileDetailsForm = ({ user, queryClient }) => {
  const [form, setForm] = useState({
    firstName: user.firstName ?? '',
    lastName: user.lastName ?? '',
    phone: user.phone ?? '',
  });

  // Keep the form in sync if the underlying query data changes elsewhere.
  useEffect(() => {
    setForm({
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      phone: user.phone ?? '',
    });
  }, [user]);

  const mutation = useMutation({
    mutationFn: (payload) => authApi.updateProfile(payload),
    onSuccess: (res) => {
      queryClient.setQueryData(['me'], (old) =>
        old ? { ...old, data: { ...old.data, data: { user: res.data.data.user } } } : old
      );
      toast.success('Profile updated');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Could not update profile');
    },
  });

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="firstName">First name</label>
          <input id="firstName" name="firstName" value={form.firstName} onChange={handleChange} className={inputClass} required />
        </div>
        <div>
          <label className={labelClass} htmlFor="lastName">Last name</label>
          <input id="lastName" name="lastName" value={form.lastName} onChange={handleChange} className={inputClass} required />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="phone">
          <FiPhone size={11} className="mr-1 inline-block -translate-y-px" />
          Phone
        </label>
        <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} className={inputClass} placeholder="e.g. 9876543210" />
      </div>

      <div>
        <label className={labelClass} htmlFor="email">
          <FiMail size={11} className="mr-1 inline-block -translate-y-px" />
          Email
          {user.emailVerified && (
            <span className="ml-1.5 inline-flex items-center rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold normal-case tracking-normal text-emerald-600">
              Verified
            </span>
          )}
        </label>
        <input id="email" value={user.email ?? ''} disabled className={inputClass} />
        <p className="mt-1.5 text-xs text-bamboo-400">
          Email is tied to your account verification. Contact support to change it.
        </p>
      </div>

      <div className="pt-2">
        <Button type="submit" disabled={mutation.isPending} className="shadow-sm shadow-bamboo-200">
          <FiSave size={16} className="mr-1.5 inline-block -translate-y-px" />
          {mutation.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};

const ChangePasswordForm = () => {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const mutation = useMutation({
    mutationFn: (payload) => authApi.changePassword(payload),
    onSuccess: () => {
      toast.success('Password changed. Please log in again.');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Could not change password');
    },
  });

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      toast.error('New password and confirmation do not match');
      return;
    }
    if (form.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    mutation.mutate({ currentPassword: form.currentPassword, newPassword: form.newPassword });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={labelClass} htmlFor="currentPassword">Current password</label>
        <div className="relative">
          <input
            id="currentPassword"
            name="currentPassword"
            type={showCurrent ? 'text' : 'password'}
            value={form.currentPassword}
            onChange={handleChange}
            className={`${inputClass} pr-11`}
            required
          />
          <button
            type="button"
            onClick={() => setShowCurrent((v) => !v)}
            className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-bamboo-400 transition-colors hover:bg-sand-100 hover:text-bamboo-700"
            aria-label={showCurrent ? 'Hide password' : 'Show password'}
          >
            {showCurrent ? <FiEyeOff size={16} /> : <FiEye size={16} />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="newPassword">New password</label>
          <div className="relative">
            <input
              id="newPassword"
              name="newPassword"
              type={showNew ? 'text' : 'password'}
              value={form.newPassword}
              onChange={handleChange}
              className={`${inputClass} pr-11`}
              minLength={8}
              required
            />
            <button
              type="button"
              onClick={() => setShowNew((v) => !v)}
              className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-bamboo-400 transition-colors hover:bg-sand-100 hover:text-bamboo-700"
              aria-label={showNew ? 'Hide password' : 'Show password'}
            >
              {showNew ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
        </div>
        <div>
          <label className={labelClass} htmlFor="confirmPassword">Confirm new password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showNew ? 'text' : 'password'}
            value={form.confirmPassword}
            onChange={handleChange}
            className={inputClass}
            minLength={8}
            required
          />
        </div>
      </div>

      <div className="pt-2">
        <Button type="submit" disabled={mutation.isPending} className="shadow-sm shadow-bamboo-200">
          <FiLock size={16} className="mr-1.5 inline-block -translate-y-px" />
          {mutation.isPending ? 'Updating...' : 'Update Password'}
        </Button>
      </div>
    </form>
  );
};

export default AccountSettings;