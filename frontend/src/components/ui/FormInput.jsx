import { forwardRef, useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

/**
 * Reusable input for use with react-hook-form's register().
 * Usage: <FormInput label="Email" type="email" error={errors.email} {...register('email')} />
 */
const FormInput = forwardRef(({ label, error, type = 'text', className = '', ...rest }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const resolvedType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="w-full">
      {label && <label className="mb-1.5 block text-sm font-medium text-bamboo-700">{label}</label>}
      <div className="relative">
        <input
          ref={ref}
          type={resolvedType}
          className={`input-field ${error ? 'input-error' : ''} ${isPassword ? 'pr-11' : ''} ${className}`}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-bamboo-400 hover:text-bamboo-600"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}
    </div>
  );
});

FormInput.displayName = 'FormInput';
export default FormInput;
