// src/components/ui/Alert.jsx
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const config = {
  success: { icon: CheckCircle2, cls: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20' },
  error: { icon: AlertCircle, cls: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/20' },
  info: { icon: Info, cls: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20' },
};

const Alert = ({ type = 'info', children }) => {
  const { icon: Icon, cls } = config[type];
  return (
    <div className={`flex items-start gap-2.5 px-4 py-3 rounded-xl border text-sm ${cls}`}>
      <Icon size={18} className="shrink-0 mt-0.5" aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
};

export default Alert;