import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, ...props }, ref) => (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-text dark:text-text-dark">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={cn(
          "flex h-9 w-full rounded-lg border border-border bg-surface px-3 py-1 text-sm text-text shadow-sm transition-colors",
          "focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "dark:border-border-dark dark:bg-surface-dark-hover dark:text-text-dark",
          className,
        )}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-earth">{error}</p>}
    </div>
  ),
);
Select.displayName = "Select";
