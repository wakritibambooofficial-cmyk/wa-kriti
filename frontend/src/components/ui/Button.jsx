const variantClass = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger:
    'inline-flex items-center justify-center rounded-xl bg-red-500 px-6 py-3 text-sm font-semibold text-white shadow-soft transition-all duration-200 hover:bg-red-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60',
  ghost:
    'inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-bamboo-600 transition-colors hover:bg-bamboo-50 disabled:cursor-not-allowed disabled:opacity-60',
};

const Button = ({
  children,
  variant = 'primary',
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  type = 'button',
  ...rest
}) => {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`${variantClass[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          Please wait...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
