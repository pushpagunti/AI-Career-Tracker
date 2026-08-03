const Button = ({ children, variant = 'primary', isLoading = false, className = '', ...props }) => {
  const base =
    'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';

  const variants = {
    primary:
      'bg-brand-600 text-white shadow-glow hover:bg-brand-700 hover:shadow-lg dark:bg-brand-500 dark:hover:bg-brand-600',
    secondary:
      'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 dark:bg-white/5 dark:text-gray-200 dark:border-white/10 dark:hover:bg-white/10',
    ghost:
      'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} disabled={isLoading} {...props}>
      {isLoading && (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
};

export default Button;