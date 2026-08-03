// src/components/ui/PageHeader.jsx
import { motion } from 'framer-motion';

const PageHeader = ({ icon: Icon, title, subtitle, action, color = 'blue' }) => {
  const iconColors = {
    blue: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
    purple: 'bg-purple-500/15 text-purple-600 dark:text-purple-400',
    emerald: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
    orange: 'bg-orange-500/15 text-orange-600 dark:text-orange-400',
    indigo: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
    >
      <div className="flex items-center gap-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconColors[color]}`}>
          <Icon size={22} aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </motion.div>
  );
};

export default PageHeader;