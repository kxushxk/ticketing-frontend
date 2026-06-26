import { useTicketHistory } from "../../hooks/useTicketHistory";
import type { TicketHistory as HistoryEntry } from "../../types/ticket";

const actionIcons: Record<string, string> = {
  created: "ðŸŸ¢",
  status_changed: "ðŸ”„",
  assigned: "ðŸ‘¤",
  commented: "ðŸ’¬",
  updated: "âœï¸",
};

function HistoryItem({ entry }: { entry: HistoryEntry }) {
  const icon = actionIcons[entry.action] ?? "ðŸ“Œ";
  return (
    <div className="flex gap-3 text-sm">
      <span className="mt-0.5">{icon}</span>
      <div className="flex-1">
        <span className="font-medium text-text dark:text-text-dark">{entry.userName}</span>{" "}
        <span className="text-muted dark:text-muted-dark">
          {entry.action === "created" && "created this ticket"}
          {entry.action === "status_changed" && `changed status from "${entry.oldValue}" to "${entry.newValue}"`}
          {entry.action === "assigned" && `assigned to ${entry.newValue ?? "unassigned"}`}
          {entry.action === "commented" && "added a comment"}
          {entry.action === "updated" && `updated ${entry.field}`}
          {!["created", "status_changed", "assigned", "commented", "updated"].includes(entry.action) && entry.action}
        </span>
        <p className="text-xs text-muted dark:text-muted-dark">
          {new Date(entry.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

function HistorySkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-10 animate-pulse rounded bg-border dark:bg-surface-dark-hover" />
      ))}
    </div>
  );
}

interface TicketHistoryProps {
  ticketId: number;
}

export function TicketHistory({ ticketId }: TicketHistoryProps) {
  const { data: history, isLoading } = useTicketHistory(ticketId);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-text dark:text-text-dark">Activity</h3>

      {isLoading ? (
        <HistorySkeleton />
      ) : history && history.length > 0 ? (
        <div className="space-y-3">
          {history.map((entry) => (
            <HistoryItem key={entry.id} entry={entry} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted dark:text-muted-dark">No activity recorded yet.</p>
      )}
    </div>
  );
}
