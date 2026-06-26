interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  const delta = 1;
  const left = Math.max(2, currentPage - delta);
  const right = Math.min(totalPages - 1, currentPage + delta);

  pages.push(1);
  if (left > 2) pages.push("...");
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < totalPages - 1) pages.push("...");
  if (totalPages > 1) pages.push(totalPages);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-border px-4 sm:px-5 py-3 dark:border-border-dark">
      <p className="text-center sm:text-left text-xs text-muted dark:text-muted-dark">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex items-center justify-center gap-1">
        <button
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="rounded-md px-2.5 py-1.5 text-xs font-medium text-muted hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-40 dark:text-muted-dark dark:hover:bg-surface-dark-hover"
        >
          Prev
        </button>
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="px-1 text-xs text-muted">...</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`rounded-md px-2.5 py-1.5 text-xs font-medium ${
                p === currentPage
                  ? "bg-primary text-white"
                  : "text-muted hover:bg-surface-hover dark:text-muted-dark dark:hover:bg-surface-dark-hover"
              }`}
            >
              {p}
            </button>
          ),
        )}
        <button
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="rounded-md px-2.5 py-1.5 text-xs font-medium text-muted hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-40 dark:text-muted-dark dark:hover:bg-surface-dark-hover"
        >
          Next
        </button>
      </div>
    </div>
  );
}
