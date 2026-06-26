import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "accent";
}

const badgeVariants = {
  default: "bg-primary text-white",
  secondary: "bg-surface-hover text-muted",
  destructive: "bg-earth text-white",
  outline: "border border-border text-muted",
  success: "bg-success text-white",
  accent: "bg-accent text-dark",
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        badgeVariants[variant],
        className,
      )}
      {...props}
    />
  ),
);
Badge.displayName = "Badge";
