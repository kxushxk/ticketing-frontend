import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

const variants = {
  default: "bg-primary text-white hover:bg-primary-hover",
  destructive: "bg-earth text-white hover:bg-earth-hover",
  outline: "border border-border bg-transparent hover:bg-surface-hover text-text",
  secondary: "bg-surface-hover text-text hover:bg-border",
  ghost: "hover:bg-surface-hover text-muted hover:text-text",
  link: "text-primary underline-offset-4 hover:underline",
} as const;

const sizes = {
  default: "h-9 px-4 py-2",
  sm: "h-8 rounded-md px-3 text-xs",
  lg: "h-10 rounded-md px-8",
  icon: "h-9 w-9",
} as const;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";
