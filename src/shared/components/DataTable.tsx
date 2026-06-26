import { Link } from "react-router-dom";
import type { TicketStatus, TicketPriority } from "../../types/ticket";

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
  hideOnMobile?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  onRowClick?: (item: T) => void;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
}: DataTableProps<T>) {
  if (data.length === 0) return null;

  const visibleOnMobile = columns.filter((c) => !c.hideOnMobile);

  return (
    <>
      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full divide-y divide-border dark:divide-border-dark">
          <thead>
            <tr className="bg-canvas dark:bg-surface-dark/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted dark:text-muted-dark ${col.className ?? ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border dark:divide-border-dark">
            {data.map((item) => (
              <tr
                key={keyExtractor(item)}
                onClick={onRowClick ? () => onRowClick(item) : undefined}
                className={`transition-colors hover:bg-canvas dark:hover:bg-surface-dark-hover/50 ${onRowClick ? "cursor-pointer" : ""}`}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-5 py-3 text-sm ${col.className ?? ""}`}
                  >
                    {col.render
                      ? col.render(item)
                      : (item as Record<string, unknown>)[col.key] as React.ReactNode}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="block sm:hidden divide-y divide-border dark:divide-border-dark">
        {data.map((item) => (
          <div
            key={keyExtractor(item)}
            onClick={onRowClick ? () => onRowClick(item) : undefined}
            className={`px-4 py-3 ${onRowClick ? "cursor-pointer" : ""}`}
          >
            {visibleOnMobile.map((col) => (
              <div
                key={col.key}
                className="flex items-center justify-between py-1"
              >
                <span className="text-xs font-medium text-muted dark:text-muted-dark shrink-0 mr-2">
                  {col.header}
                </span>
                <div className="text-sm text-right text-text dark:text-text-dark">
                  {col.render
                    ? col.render(item)
                    : (item as Record<string, unknown>)[col.key] as React.ReactNode}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

const statusBadge: Record<TicketStatus, string> = {
  Open: "bg-primary/20 text-primary dark:bg-primary/30 dark:text-primary-light",
  "In Progress": "bg-accent/20 text-accent dark:bg-accent/30 dark:text-accent",
  Completed: "bg-success/20 text-success dark:bg-success/30 dark:text-success",
  Closed: "bg-surface-hover text-text dark:bg-surface-dark-hover dark:text-muted-dark",
};

const priorityBadge: Record<TicketPriority, string> = {
  Low: "bg-surface-hover text-text dark:bg-surface-dark-hover dark:text-muted-dark",
  Medium: "bg-accent/20 text-accent dark:bg-accent/30 dark:text-accent",
  High: "bg-earth/20 text-earth dark:bg-earth/30 dark:text-earth",
  Critical: "bg-earth/20 text-earth dark:bg-earth/30 dark:text-earth",
};

export function StatusBadge({ status }: { status: TicketStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge[status] ?? ""}`}>
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityBadge[priority] ?? ""}`}>
      {priority}
    </span>
  );
}
