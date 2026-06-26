import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export const Skeleton = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("animate-pulse rounded-md bg-border dark:bg-border-dark", className)}
      {...props}
    />
  ),
);
Skeleton.displayName = "Skeleton";
