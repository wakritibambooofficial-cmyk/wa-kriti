// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Link } from 'react-router-dom';
// import AuthLayout from '../../components/layouts/AuthLayout';
// import FormInput from '../../components/ui/FormInput';
// import Button from '../../components/ui/Button';
// import { loginSchema } from '../../validators/authSchemas';
// import { useAuth } from '../../hooks/useAuth';

// const Login = () => {
//   const { login } = useAuth();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({ resolver: zodResolver(loginSchema) });

//   const onSubmit = async (values) => {
//     setIsSubmitting(true);
//     await login(values);
//     setIsSubmitting(false);
//   };

//   return (
//     <AuthLayout title="Welcome Back" subtitle="Log in to continue your bamboo journey">
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
//         <FormInput label="Email Address" type="email" placeholder="you@example.com" error={errors.email} {...register('email')} />
//         <FormInput label="Password" type="password" placeholder="••••••••" error={errors.password} {...register('password')} />

//         <div className="flex items-center justify-end">
//           <Link to="/forgot-password" className="text-sm font-medium text-bamboo-600 hover:underline">
//             Forgot password?
//           </Link>
//         </div>

//         <Button type="submit" fullWidth isLoading={isSubmitting}>
//           Log In
//         </Button>
//       </form>

//       <p className="mt-6 text-center text-sm text-bamboo-500">
//         Don&apos;t have an account?{' '}
//         <Link to="/signup" className="font-semibold text-bamboo-700 hover:underline">
//           Sign up
//         </Link>
//       </p>
//     </AuthLayout>
//   );
// };

// export default Login;




import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from '../../components/layouts/AuthLayout';
import FormInput from '../../components/ui/FormInput';
import Button from '../../components/ui/Button';
import { loginSchema } from '../../validators/authSchemas';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      await login(values);
    } catch (err) {
      const message = err?.response?.data?.message || 'Invalid email or password';
      toast.error(message);
      // Attach a blank error to password field so the input highlights red too
      setError('password', { type: 'server', message: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Log in to continue your bamboo journey">
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
        <FormInput
          label="Password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password}
          {...register('password')}
        />

        <div className="flex items-center justify-end">
          <Link to="/forgot-password" className="text-sm font-medium text-bamboo-600 hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth isLoading={isSubmitting} disabled={isSubmitting}>
          Log In
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-bamboo-500">
        Don&apos;t have an account?{' '}
        <Link to="/signup" className="font-semibold text-bamboo-700 hover:underline">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;