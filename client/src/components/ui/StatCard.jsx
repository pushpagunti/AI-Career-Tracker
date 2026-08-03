import { motion } from 'framer-motion';

const colorMap = {
  blue: {
    bg: 'from-blue-500/10 to-blue-500/0 dark:from-blue-500/20',
    icon: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
    ring: 'stroke-blue-500',
    trend: 'text-blue-600 dark:text-blue-400',
  },
  purple: {
    bg: 'from-purple-500/10 to-purple-500/0 dark:from-purple-500/20',
    icon: 'bg-purple-500/15 text-purple-600 dark:text-purple-400',
    ring: 'stroke-purple-500',
    trend: 'text-purple-600 dark:text-purple-400',
  },
  green: {
    bg: 'from-emerald-500/10 to-emerald-500/0 dark:from-emerald-500/20',
    icon: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
    ring: 'stroke-emerald-500',
    trend: 'text-emerald-600 dark:text-emerald-400',
  },
  orange: {
    bg: 'from-orange-500/10 to-orange-500/0 dark:from-orange-500/20',
    icon: 'bg-orange-500/15 text-orange-600 dark:text-orange-400',
    ring: 'stroke-orange-500',
    trend: 'text-orange-600 dark:text-orange-400',
  },
};

const StatCard = ({ icon: Icon, label, value, suffix = '', color = 'blue', trend, index = 0 }) => {
  const c = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className={`relative overflow-hidden rounded-[18px] border border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br ${c.bg}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${c.icon}`}>
          <Icon size={20} aria-hidden="true" />
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-white/60 dark:bg-black/20 ${c.trend}`}>
            {trend}
          </span>
        )}
      </div>

      <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
        {value}
        {suffix}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</p>
    </motion.div>
  );
};

export default StatCard;