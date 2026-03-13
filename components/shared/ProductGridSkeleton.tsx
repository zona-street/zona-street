import { cn } from "@/lib/utils";

interface ProductGridSkeletonProps {
  count?: number;
  bordered?: boolean;
  grid?: string;
}

export function ProductGridSkeleton({
  count = 4,
  bordered = false,
  grid = "sm:grid-cols-2 lg:grid-cols-4",
}: ProductGridSkeletonProps) {
  return (
    <div className={cn("grid gap-6", grid)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div
            className={cn(
              "aspect-square bg-gray-200",
              bordered && "border-2 border-gray-300",
            )}
          />
          <div className="mt-4 h-4 bg-gray-200" />
          <div className="mt-2 h-4 bg-gray-200" />
        </div>
      ))}
    </div>
  );
}
