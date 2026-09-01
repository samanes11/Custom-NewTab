interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gradient-to-r from-surface-hover via-surface to-surface-hover bg-[length:200%_100%] ${className}`}
      style={{ animation: "pulse 1.6s ease-in-out infinite" }}
    />
  );
}

export function SkeletonLines({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={`h-3 ${i === count - 1 ? "w-2/3" : "w-full"}`} />
      ))}
    </div>
  );
}
