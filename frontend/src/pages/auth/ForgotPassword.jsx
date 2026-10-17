// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Link, useNavigate } from 'react-router-dom';
// import AuthLayout from '../../components/layouts/AuthLayout';
// import FormInput from '../../components/ui/FormInput';
// import Button from '../../components/ui/Button';
// import { forgotPasswordSchema } from '../../validators/authSchemas';
// import { useAuth } from '../../hooks/useAuth';

// const ForgotPassword = () => {
//   const { forgotPassword } = useAuth();
//   const navigate = useNavigate();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const {
//     register,
//     handleSubmit,
//     getValues,
//     formState: { errors },
//   } = useForm({ resolver: zodResolver(forgotPasswordSchema) });

//   const onSubmit = async (values) => {
//     setIsSubmitting(true);
//     const { success } = await forgotPassword(values);
//     setIsSubmitting(false);
//     if (success) navigate('/reset-password', { state: { email: getValues('email') } });
//   };

//   return (
//     <AuthLayout title="Forgot Password" subtitle="Enter your email to receive a reset OTP">
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
//         <FormInput label="Email Address" type="email" placeholder="you@example.com" error={errors.email} {...register('email')} />
//         <Button type="submit" fullWidth isLoading={isSubmitting}>
//           Send Reset OTP
//         </Button>
//       </form>

//       <p className="mt-6 text-center text-sm text-bamboo-500">
//         Remembered your password?{' '}
//         <Link to="/login" className="font-semibold text-bamboo-700 hover:underline">
//           Log in
//         </Link>
//       </p>
//     </AuthLayout>
//   );
// };

// export default ForgotPassword;



import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from '../../components/layouts/AuthLayout';
import FormInput from '../../components/ui/FormInput';
import Button from '../../components/ui/Button';
import { forgotPasswordSchema } from '../../validators/authSchemas';
import { useAuth } from '../../hooks/useAuth';

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const { success, message } = await forgotPassword(values);
      if (success) {
        navigate('/reset-password', { state: { email: getValues('email') } });
      } else {
        toast.error(message || 'Could not send reset OTP. Please try again.');
      }
    } catch (err) {
      const message = err?.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Forgot Password" subtitle="Enter your email to receive a reset OTP">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormInput
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          autoFocus
          error={errors.email}
          {...register('email')}
        />
        <Button type="submit" fullWidth isLoading={isSubmitting} disabled={isSubmitting}>
          Send Reset OTP
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-bamboo-500">
        Remembered your password?{' '}
        <Link to="/login" className="font-semibold text-bamboo-700 hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default ForgotPassword;