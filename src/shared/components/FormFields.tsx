import type { UseFormRegisterReturn, FieldError } from "react-hook-form";

interface FieldProps {
  label: string;
  error?: FieldError;
  children: React.ReactNode;
}

function FieldWrapper({ label, error, children }: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-text dark:text-muted-dark">{label}</label>
      <div className="mt-1">{children}</div>
      {error && <p className="mt-0.5 text-xs text-earth">{error.message}</p>}
    </div>
  );
}

interface TextFieldProps {
  label: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
  placeholder?: string;
  type?: string;
}

export function TextField({ label, registration, error, placeholder, type = "text" }: TextFieldProps) {
  return (
    <FieldWrapper label={label} error={error}>
      <input
        {...registration}
        type={type}
        placeholder={placeholder}
        className="block w-full rounded-lg border border-border px-3 py-2 text-sm shadow-sm placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-border-dark dark:bg-surface-dark-hover dark:text-text-dark dark:placeholder:text-muted-dark"
      />
    </FieldWrapper>
  );
}

interface TextAreaFieldProps {
  label: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
  placeholder?: string;
  rows?: number;
}

export function TextAreaField({ label, registration, error, placeholder, rows = 4 }: TextAreaFieldProps) {
  return (
    <FieldWrapper label={label} error={error}>
      <textarea
        {...registration}
        rows={rows}
        placeholder={placeholder}
        className="block w-full rounded-lg border border-border px-3 py-2 text-sm shadow-sm placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-border-dark dark:bg-surface-dark-hover dark:text-text-dark dark:placeholder:text-muted-dark"
      />
    </FieldWrapper>
  );
}

interface SelectFieldProps {
  label: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
  options: { value: string; label: string }[];
}

export function SelectField({ label, registration, error, options }: SelectFieldProps) {
  return (
    <FieldWrapper label={label} error={error}>
      <select
        {...registration}
        className="block w-full rounded-lg border border-border px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-border-dark dark:bg-surface-dark-hover dark:text-text-dark"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}
