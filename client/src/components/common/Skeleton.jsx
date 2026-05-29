const Skeleton = ({ className = "", variant = "text" }) => {
  const base = "animate-pulse bg-gray-200 dark:bg-dark-border rounded";
  const variants = {
    text: "h-4 w-full",
    title: "h-6 w-3/4",
    avatar: "h-12 w-12 rounded-full",
    card: "h-32 w-full rounded-xl",
    button: "h-10 w-24",
    thumbnail: "h-40 w-full rounded-lg",
  };

  return <div className={`${base} ${variants[variant] || variants.text} ${className}`} />;
};

export const SkeletonCard = () => (
  <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-4 space-y-3">
    <Skeleton variant="thumbnail" />
    <Skeleton variant="title" />
    <Skeleton variant="text" />
    <Skeleton variant="text" className="w-1/2" />
    <div className="flex justify-between items-center pt-2">
      <Skeleton variant="button" />
      <Skeleton variant="button" className="w-16" />
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5, cols = 4 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4">
        {Array.from({ length: cols }).map((_, j) => (
          <Skeleton key={j} className="flex-1 h-5" />
        ))}
      </div>
    ))}
  </div>
);

export const SkeletonStats = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="bg-white dark:bg-dark-card rounded-xl p-5 border border-gray-200 dark:border-dark-border space-y-3">
        <Skeleton variant="avatar" />
        <Skeleton variant="title" />
        <Skeleton variant="text" className="w-1/3" />
      </div>
    ))}
  </div>
);

export default Skeleton;
