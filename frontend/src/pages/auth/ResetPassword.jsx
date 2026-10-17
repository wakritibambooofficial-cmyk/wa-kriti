// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useLocation, Link } from 'react-router-dom';
// import AuthLayout from '../../components/layouts/AuthLayout';
// import FormInput from '../../components/ui/FormInput';
// import Button from '../../components/ui/Button';
// import { resetPasswordSchema } from '../../validators/authSchemas';
// import { useAuth } from '../../hooks/useAuth';

// const ResetPassword = () => {
//   const location = useLocation();
//   const email = location.state?.email;
//   const { resetPassword } = useAuth();
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({ resolver: zodResolver(resetPasswordSchema) });

//   if (!email) {
//     return (
//       <AuthLayout title="Reset Link Invalid">
//         <p className="text-center text-sm text-bamboo-500">
//           Please request a password reset first.
//         </p>
//         <Link to="/forgot-password" className="btn-primary mt-6 block text-center">
//           Go to Forgot Password
//         </Link>
//       </AuthLayout>
//     );
//   }

//   const onSubmit = async (values) => {
//     setIsSubmitting(true);
//     await resetPassword({ email, otp: values.otp, newPassword: values.newPassword });
//     setIsSubmitting(false);
//   };

//   return (
//     <AuthLayout title="Reset Password" subtitle={`Enter the OTP sent to ${email} and choose a new password`}>
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
//         <FormInput label="OTP" inputMode="numeric" maxLength={6} placeholder="123456" error={errors.otp} {...register('otp')} />
//         <FormInput label="New Password" type="password" placeholder="••••••••" error={errors.newPassword} {...register('newPassword')} />
//         <FormInput
//           label="Confirm New Password"
//           type="password"
//           placeholder="••••••••"
//           error={errors.confirmPassword}
//           {...register('confirmPassword')}
//         />
//         <Button type="submit" fullWidth isLoading={isSubmitting}>
//           Reset Password
//         </Button>
//       </form>
//     </AuthLayout>
//   );
// };

// export default ResetPassword;



import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from '../../components/layouts/AuthLayout';
import FormInput from '../../components/ui/FormInput';
import Button from '../../components/ui/Button';
import { resetPasswordSchema } from '../../validators/authSchemas';
import { useAuth } from '../../hooks/useAuth';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const { resetPassword } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(resetPasswordSchema) });

  if (!email) {
    return (
      <AuthLayout title="Reset Link Invalid">
        <p className="text-center text-sm text-bamboo-500">
          Please request a password reset first.
        </p>
        <Link to="/forgot-password" className="btn-primary mt-6 block text-center">
          Go to Forgot Password
        </Link>
      </AuthLayout>
    );
  }

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const { success, message } = await resetPassword({
        email,
        otp: values.otp,
        newPassword: values.newPassword,
      });
      if (success) {
        toast.success('Password reset successful. Please log in.');
        navigate('/login');
      } else {
        toast.error(message || 'Invalid or expired OTP. Please try again.');
      }
    } catch (err) {
      const message = err?.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Reset Password" subtitle={`Enter the OTP sent to ${email} and choose a new password`}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormInput
          label="OTP"
          inputMode="numeric"
          maxLength={6}
          placeholder="123456"
          autoComplete="one-time-code"
          autoFocus
          error={errors.otp}
          {...register('otp')}
        />
        <FormInput
          label="New Password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          error={errors.newPassword}
          {...register('newPassword')}
        />
        <FormInput
          label="Confirm New Password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          error={errors.confirmPassword}
          {...register('confirmPassword')}
        />
        <Button type="submit" fullWidth isLoading={isSubmitting} disabled={isSubmitting}>
          Reset Password
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;