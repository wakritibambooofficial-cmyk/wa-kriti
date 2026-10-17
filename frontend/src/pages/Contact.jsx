// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { Helmet } from 'react-helmet-async';
// import { useQuery } from '@tanstack/react-query';
// import toast from 'react-hot-toast';
// import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

// import { contactApi, cmsApi } from '../services/cmsApi';
// import FormInput from '../components/ui/FormInput';
// import Button from '../components/ui/Button';

// const contactSchema = z.object({
//   name: z.string().trim().min(1, 'Name is required'),
//   email: z.string().trim().email('Enter a valid email'),
//   phone: z.string().optional().or(z.literal('')),
//   subject: z.string().optional().or(z.literal('')),
//   message: z.string().trim().min(5, 'Message must be at least 5 characters'),
// });

// const Contact = () => {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(contactSchema) });

//   const { data: settings } = useQuery({
//     queryKey: ['website-settings'],
//     queryFn: () => cmsApi.getSettings(),
//     select: (res) => res.data.data.settings,
//   });

//   const onSubmit = async (values) => {
//     setIsSubmitting(true);
//     try {
//       await contactApi.submit(values);
//       toast.success('Message sent! We will get back to you shortly.');
//       reset();
//     } catch (error) {
//       toast.error(error?.response?.data?.message || 'Could not send message');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-sand-100 pb-20">
//       <Helmet><title>Contact Us</title></Helmet>
//       <div className="mx-auto max-w-5xl px-4 py-12">
//         <h1 className="text-center font-display text-3xl font-bold text-bamboo-800">Get in Touch</h1>
//         <p className="mx-auto mt-2 max-w-lg text-center text-sm text-bamboo-500">
//           Have a question about our bamboo products? We&apos;d love to hear from you.
//         </p>

//         <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
//           <div className="space-y-5 lg:col-span-1">
//             <ContactInfoCard icon={FiMapPin} label="Address" value={settings?.address || 'India'} />
//             <ContactInfoCard icon={FiPhone} label="Phone" value={settings?.contactPhone || '+91 00000 00000'} />
//             <ContactInfoCard icon={FiMail} label="Email" value={settings?.contactEmail || 'support@wakriti.com'} />
//           </div>

//           <div className="card p-6 lg:col-span-2">
//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
//               <div className="grid grid-cols-2 gap-3">
//                 <FormInput label="Full Name" error={errors.name} {...register('name')} />
//                 <FormInput label="Email" type="email" error={errors.email} {...register('email')} />
//               </div>
//               <div className="grid grid-cols-2 gap-3">
//                 <FormInput label="Phone (Optional)" error={errors.phone} {...register('phone')} />
//                 <FormInput label="Subject" error={errors.subject} {...register('subject')} />
//               </div>
//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Message</label>
//                 <textarea {...register('message')} className="input-field min-h-[140px]" placeholder="How can we help?" />
//                 {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
//               </div>
//               <Button type="submit" isLoading={isSubmitting} fullWidth>
//                 Send Message
//               </Button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ContactInfoCard = ({ icon: Icon, label, value }) => (
//   <div className="card flex items-start gap-3 p-4">
//     <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bamboo-100 text-bamboo-600">
//       <Icon size={16} />
//     </div>
//     <div>
//       <p className="text-xs uppercase tracking-wide text-bamboo-400">{label}</p>
//       <p className="text-sm font-medium text-bamboo-800">{value}</p>
//     </div>
//   </div>
// );

// export default Contact;
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import { motion } from 'framer-motion';

import { contactApi, cmsApi } from '../services/cmsApi';
import FormInput from '../components/ui/FormInput';
import Button from '../components/ui/Button';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().trim().email('Enter a valid email'),
  phone: z.string().optional().or(z.literal('')),
  subject: z.string().optional().or(z.literal('')),
  message: z.string().trim().min(5, 'Message must be at least 5 characters'),
});

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: 'easeOut' },
  }),
};

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(contactSchema) });

  const { data: settings } = useQuery({
    queryKey: ['website-settings'],
    queryFn: () => cmsApi.getSettings(),
    select: (res) => res.data.data.settings,
  });

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      await contactApi.submit(values);
      toast.success('Message sent! We will get back to you shortly.');
      reset();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand-100 pb-20">
      <Helmet><title>Contact Us</title></Helmet>
      <div className="mx-auto max-w-5xl px-4 py-12">
        <motion.h1
          initial="hidden"
          animate="visible"
          custom={0}
          variants={fadeUp}
          className="text-center font-display text-3xl font-bold text-bamboo-800"
        >
          Get in Touch
        </motion.h1>
        <motion.p
          initial="hidden"
          animate="visible"
          custom={0.1}
          variants={fadeUp}
          className="mx-auto mt-2 max-w-lg text-center text-sm text-bamboo-500"
        >
          Have a question about our bamboo products? We&apos;d love to hear from you.
        </motion.p>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-1">
            <motion.div initial="hidden" animate="visible" custom={0.2} variants={fadeUp}>
              <ContactInfoCard icon={FiMapPin} label="Address" value={settings?.address || 'India'} />
            </motion.div>
            <motion.div initial="hidden" animate="visible" custom={0.3} variants={fadeUp}>
              <ContactInfoCard icon={FiPhone} label="Phone" value={settings?.contactPhone || '+91 00000 00000'} />
            </motion.div>
            <motion.div initial="hidden" animate="visible" custom={0.4} variants={fadeUp}>
              <ContactInfoCard icon={FiMail} label="Email" value={settings?.contactEmail || 'support@wakriti.com'} />
            </motion.div>

            <motion.div initial="hidden" animate="visible" custom={0.5} variants={fadeUp}>
              <IndiaMapCard />
            </motion.div>
          </div>

          <motion.div
            initial="hidden"
            animate="visible"
            custom={0.3}
            variants={fadeUp}
            className="card p-6 lg:col-span-2"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div className="grid grid-cols-2 gap-3">
                <FormInput label="Full Name" error={errors.name} {...register('name')} />
                <FormInput label="Email" type="email" error={errors.email} {...register('email')} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormInput label="Phone (Optional)" error={errors.phone} {...register('phone')} />
                <FormInput label="Subject" error={errors.subject} {...register('subject')} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Message</label>
                <textarea {...register('message')} className="input-field min-h-[140px]" placeholder="How can we help?" />
                {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
              </div>
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                <Button type="submit" isLoading={isSubmitting} fullWidth>
                  Send Message
                </Button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const ContactInfoCard = ({ icon: Icon, label, value }) => (
  <div className="card flex items-start gap-3 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bamboo-100 text-bamboo-600 transition-transform duration-200 group-hover:scale-105">
      <Icon size={16} />
    </div>
    <div>
      <p className="text-xs uppercase tracking-wide text-bamboo-400">{label}</p>
      <p className="text-sm font-medium text-bamboo-800">{value}</p>
    </div>
  </div>
);

const IndiaMapCard = () => (
  <div className="card overflow-hidden p-4">
    <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-bamboo-400">
      <FiMapPin size={12} /> Rooted in Tripura, India
    </p>

    <div className="relative overflow-hidden rounded-xl border border-sand-200">
      <iframe
        title="Tripura, India location map"
        src="https://www.google.com/maps?q=Tripura,India&z=7&output=embed"
        className="h-56 w-full"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>

    <p className="mt-3 text-xs leading-relaxed text-bamboo-500">
      Every Wa-Kriti piece begins its journey in the bamboo-rich hills of Tripura, handcrafted by skilled local artisans.
    </p>
  </div>
);

export default Contact; 