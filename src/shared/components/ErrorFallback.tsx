import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorFallbackProps {
  error?: Error | null;
  resetErrorBoundary?: () => void;
  title?: string;
  message?: string;
}

export function ErrorFallback({ error, resetErrorBoundary, title, message }: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <AlertTriangle className="mb-4 h-12 w-12 text-earth" />
      <h1 className="text-2xl font-bold text-text dark:text-text-dark">{title ?? "Something went wrong"}</h1>
      <p className="mt-2 text-sm text-muted dark:text-muted-dark">
        {message ?? error?.message ?? "An unexpected error occurred."}
      </p>
      {resetErrorBoundary && (
        <button
          onClick={resetErrorBoundary}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
      )}
      <button
        onClick={() => window.location.reload()}
        className="mt-3 text-sm text-muted underline hover:text-text dark:text-muted-dark dark:hover:text-muted-dark"
      >
        Reload page
      </button>
    </div>
  );
}
