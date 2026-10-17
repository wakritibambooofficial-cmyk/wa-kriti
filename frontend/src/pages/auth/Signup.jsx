// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Link, useNavigate } from 'react-router-dom';
// import AuthLayout from '../../components/layouts/AuthLayout';
// import FormInput from '../../components/ui/FormInput';
// import Button from '../../components/ui/Button';
// import { signupSchema } from '../../validators/authSchemas';
// import { useAuth } from '../../hooks/useAuth';

// const Signup = () => {
//   const { signup } = useAuth();
//   const navigate = useNavigate();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({ resolver: zodResolver(signupSchema) });

//   const onSubmit = async (values) => {
//     setIsSubmitting(true);
//     const { success, email } = await signup(values);
//     setIsSubmitting(false);
//     if (success) {
//       navigate('/verify-email', { state: { email } });
//     }
//   };

//   return (
//     <AuthLayout title="Create Your Account" subtitle="Join Wa-Kriti and bring nature home">
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
//         <div className="grid grid-cols-2 gap-3">
//           <FormInput label="First Name" error={errors.firstName} {...register('firstName')} />
//           <FormInput label="Last Name" error={errors.lastName} {...register('lastName')} />
//         </div>
//         <FormInput label="Email Address" type="email" placeholder="you@example.com" error={errors.email} {...register('email')} />
//         <FormInput label="Phone (Optional)" type="tel" placeholder="9876543210" error={errors.phone} {...register('phone')} />
//         <FormInput label="Password" type="password" placeholder="••••••••" error={errors.password} {...register('password')} />
//         <FormInput
//           label="Confirm Password"
//           type="password"
//           placeholder="••••••••"
//           error={errors.confirmPassword}
//           {...register('confirmPassword')}
//         />

//         <Button type="submit" fullWidth isLoading={isSubmitting}>
//           Create Account
//         </Button>
//       </form>

//       <p className="mt-6 text-center text-sm text-bamboo-500">
//         Already have an account?{' '}
//         <Link to="/login" className="font-semibold text-bamboo-700 hover:underline">
//           Log in
//         </Link>
//       </p>
//     </AuthLayout>
//   );
// };

// export default Signup;



import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from '../../components/layouts/AuthLayout';
import FormInput from '../../components/ui/FormInput';
import Button from '../../components/ui/Button';
import { signupSchema } from '../../validators/authSchemas';
import { useAuth } from '../../hooks/useAuth';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const { success, email, message } = await signup(values);
      if (success) {
        navigate('/verify-email', { state: { email } });
      } else {
        // Backend responded but signup didn't succeed (e.g. email already registered)
        toast.error(message || 'Could not create account. Please try again.');
      }
    } catch (err) {
      const message = err?.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Create Your Account" subtitle="Join Wa-Kriti and bring nature home">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="grid grid-cols-2 gap-3">
          <FormInput
            label="First Name"
            autoComplete="given-name"
            autoFocus
            error={errors.firstName}
            {...register('firstName')}
          />
          <FormInput
            label="Last Name"
            autoComplete="family-name"
            error={errors.lastName}
            {...register('lastName')}
          />
        </div>
        <FormInput
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email}
          {...register('email')}
        />
        <FormInput
          label="Phone (Optional)"
          type="tel"
          placeholder="9876543210"
          autoComplete="tel"
          error={errors.phone}
          {...register('phone')}
        />
        <FormInput
          label="Password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          error={errors.password}
          {...register('password')}
        />
        <FormInput
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          error={errors.confirmPassword}
          {...register('confirmPassword')}
        />

        <Button type="submit" fullWidth isLoading={isSubmitting} disabled={isSubmitting}>
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-bamboo-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-bamboo-700 hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Signup;
