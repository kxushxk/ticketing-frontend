interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return <div className={`animate-pulse rounded bg-border dark:bg-surface-dark-hover ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-sm dark:border-border-dark dark:bg-surface-dark">
      <Skeleton className="mb-2 h-4 w-1/3" />
      <Skeleton className="h-8 w-1/4" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-10 w-32" />
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}
