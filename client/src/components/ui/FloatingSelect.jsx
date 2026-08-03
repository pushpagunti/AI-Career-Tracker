// src/components/ui/FloatingSelect.jsx
const FloatingSelect = ({ label, options, value, className = '', ...props }) => (
  <div className="relative">
    <select
      value={value}
      className={`peer w-full px-3.5 pt-5 pb-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm outline-none focus:border-brand-500 transition-colors appearance-none ${className}`}
      {...props}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
    <label className="absolute left-3.5 top-1.5 text-[11px] text-gray-400 dark:text-gray-500 pointer-events-none">
      {label}
    </label>
  </div>
);

export default FloatingSelect;