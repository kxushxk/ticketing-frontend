import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, type, ...props }, ref) => (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-text dark:text-text-dark">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            "flex h-9 w-full rounded-lg border border-border bg-surface px-3 py-1 text-sm text-text shadow-sm transition-colors",
            "placeholder:text-muted",
            "focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "dark:border-border-dark dark:bg-surface-dark-hover dark:text-text-dark dark:placeholder:text-muted-dark",
            icon && "pl-9",
            className,
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-earth">{error}</p>}
    </div>
  ),
);
Input.displayName = "Input";
