export const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-white/10 rounded-lg ${className}`} />
);

export const SkeletonCard = () => (
  <div className="bg-white/70 dark:bg-white/5 border border-white/40 dark:border-white/10 rounded-2xl p-4 space-y-3">
    <Skeleton className="h-3 w-1/3" />
    <Skeleton className="h-6 w-1/2" />
  </div>
);