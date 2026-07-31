/** Base shimmer block — server-safe, no layout shift when sized explicitly */

export type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={`skeleton-shimmer min-h-[0.5rem] min-w-[2rem] rounded-md ${className}`.trim()}
    />
  );
}
