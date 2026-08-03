const GlassCard = ({ children, className = '', hover = false }) => (
  <div
    className={`bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-2xl shadow-sm ${
      hover ? 'transition-all duration-200 hover:shadow-glow hover:-translate-y-0.5' : ''
    } ${className}`}
  >
    {children}
  </div>
);

export default GlassCard;