import { STATUS_FLOW, type TicketStatus } from "../../types/ticket";
import { useUpdateTicketStatus } from "../../hooks/useUpdateTicketStatus";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { PermissionGuard } from "../auth/PermissionGuard";
import { Permissions } from "../auth/permissions";

const statusColors: Record<TicketStatus, string> = {
  Open: "bg-primary/20 text-primary dark:bg-primary/30 dark:text-primary-light",
  "In Progress": "bg-accent/20 text-accent dark:bg-accent/30 dark:text-accent",
  Completed: "bg-success/20 text-success dark:bg-success/30 dark:text-success",
  Closed: "bg-surface-hover text-text dark:bg-surface-dark-hover dark:text-muted-dark",
};

interface TicketStatusWorkflowProps {
  ticketId: number;
  currentStatus: TicketStatus;
}

export function TicketStatusWorkflow({ ticketId, currentStatus }: TicketStatusWorkflowProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  const mutation = useUpdateTicketStatus(ticketId);
  const allowedTransitions = STATUS_FLOW[currentStatus] ?? [];

  const handleTransition = (status: string) => {
    if (!user) return;
    mutation.mutate({ status, userId: Number(user.id) });
  };

  return (
    <PermissionGuard permission={Permissions.TICKETS_EDIT}>
      <div className="flex flex-wrap items-center gap-2">
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusColors[currentStatus]}`}>
          {currentStatus}
        </span>
        {allowedTransitions.map((next) => (
          <button
            key={next}
            onClick={() => handleTransition(next)}
            disabled={mutation.isPending}
            className="rounded-lg border border-border px-3 py-1 text-xs font-medium text-muted hover:bg-surface-hover disabled:opacity-50 dark:border-border-dark dark:text-muted-dark dark:hover:bg-surface-dark-hover"
          >
            â†’ {next}
          </button>
        ))}
      </div>
    </PermissionGuard>
  );
}
