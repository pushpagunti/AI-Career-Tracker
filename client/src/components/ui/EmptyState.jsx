// src/components/ui/EmptyState.jsx
import { motion } from 'framer-motion';

const EmptyState = ({ icon: Icon, title, subtitle, action }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center text-center py-16 px-6"
  >
    <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center mb-4">
      <Icon size={28} className="text-brand-500" aria-hidden="true" />
    </div>
    <h3 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h3>
    {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs">{subtitle}</p>}
    {action && <div className="mt-4">{action}</div>}
  </motion.div>
);

export default EmptyState;