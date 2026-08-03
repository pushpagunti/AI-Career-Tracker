import { useState } from 'react';

const FloatingInput = ({ label, error, value, className = '', ...props }) => {
  const [focused, setFocused] = useState(false);
  const hasValue = value !== undefined && value !== '' && value !== null;
  const floated = focused || hasValue;

  return (
    <div className="relative">
      <input
        value={value}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`peer w-full px-3.5 pt-5 pb-2 rounded-xl border bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm outline-none transition-colors ${
          error
            ? 'border-red-400 focus:border-red-500'
            : 'border-gray-200 dark:border-white/10 focus:border-brand-500'
        } ${className}`}
        {...props}
      />
      <label
        className={`absolute left-3.5 pointer-events-none transition-all duration-150 text-gray-400 dark:text-gray-500 ${
          floated ? 'top-1.5 text-[11px]' : 'top-3.5 text-sm'
        }`}
      >
        {label}
      </label>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default FloatingInput;