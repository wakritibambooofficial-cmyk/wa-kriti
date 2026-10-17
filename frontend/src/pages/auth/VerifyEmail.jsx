// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useLocation, useNavigate, Link } from 'react-router-dom';
// import AuthLayout from '../../components/layouts/AuthLayout';
// import FormInput from '../../components/ui/FormInput';
// import Button from '../../components/ui/Button';
// import { otpSchema } from '../../validators/authSchemas';
// import { useAuth } from '../../hooks/useAuth';

// const VerifyEmail = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const email = location.state?.email;
//   const { verifyOtp, resendOtp } = useAuth();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isResending, setIsResending] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({ resolver: zodResolver(otpSchema) });

//   if (!email) {
//     return (
//       <AuthLayout title="Verification Link Invalid">
//         <p className="text-center text-sm text-bamboo-500">
//           Please sign up first to receive a verification code.
//         </p>
//         <Link to="/signup" className="btn-primary mt-6 block text-center">
//           Go to Signup
//         </Link>
//       </AuthLayout>
//     );
//   }

//   const onSubmit = async (values) => {
//     setIsSubmitting(true);
//     const { success } = await verifyOtp({ email, otp: values.otp, purpose: 'signup_verification' });
//     setIsSubmitting(false);
//     if (success) navigate('/login');
//   };

//   const handleResend = async () => {
//     setIsResending(true);
//     await resendOtp({ email, purpose: 'signup_verification' });
//     setIsResending(false);
//   };

//   return (
//     <AuthLayout title="Verify Your Email" subtitle={`We sent a 6-digit code to ${email}`}>
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
//         <FormInput
//           label="Enter OTP"
//           inputMode="numeric"
//           maxLength={6}
//           placeholder="123456"
//           error={errors.otp}
//           {...register('otp')}
//         />
//         <Button type="submit" fullWidth isLoading={isSubmitting}>
//           Verify Email
//         </Button>
//       </form>

//       <button
//         onClick={handleResend}
//         disabled={isResending}
//         className="mt-5 w-full text-center text-sm font-medium text-bamboo-600 hover:underline disabled:opacity-60"
//       >
//         {isResending ? 'Resending...' : "Didn't receive the code? Resend OTP"}
//       </button>
//     </AuthLayout>
//   );
// };

// export default VerifyEmail;


import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from '../../components/layouts/AuthLayout';
import FormInput from '../../components/ui/FormInput';
import Button from '../../components/ui/Button';
import { otpSchema } from '../../validators/authSchemas';
import { useAuth } from '../../hooks/useAuth';

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const { verifyOtp, resendOtp } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(otpSchema) });

  if (!email) {
    return (
      <AuthLayout title="Verification Link Invalid">
        <p className="text-center text-sm text-bamboo-500">
          Please sign up first to receive a verification code.
        </p>
        <Link to="/signup" className="btn-primary mt-6 block text-center">
          Go to Signup
        </Link>
      </AuthLayout>
    );
  }

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const { success, message } = await verifyOtp({
        email,
        otp: values.otp,
        purpose: 'signup_verification',
      });
      if (success) {
        toast.success('Email verified. Please log in.');
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

  const handleResend = async () => {
    setIsResending(true);
    try {
      const { success, message } = await resendOtp({ email, purpose: 'signup_verification' });
      if (success) {
        toast.success('A new OTP has been sent to your email.');
      } else {
        toast.error(message || 'Could not resend OTP. Please try again.');
      }
    } catch (err) {
      const message = err?.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthLayout title="Verify Your Email" subtitle={`We sent a 6-digit code to ${email}`}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormInput
          label="Enter OTP"
          inputMode="numeric"
          maxLength={6}
          placeholder="123456"
          autoComplete="one-time-code"
          autoFocus
          error={errors.otp}
          {...register('otp')}
        />
        <Button type="submit" fullWidth isLoading={isSubmitting} disabled={isSubmitting}>
          Verify Email
        </Button>
      </form>

      <button
        onClick={handleResend}
        disabled={isResending}
        className="mt-5 w-full text-center text-sm font-medium text-bamboo-600 hover:underline disabled:opacity-60"
      >
        {isResending ? 'Resending...' : "Didn't receive the code? Resend OTP"}
      </button>
    </AuthLayout>
  );
};

export default VerifyEmail;