import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignTicket } from "../../services/ticketService";
import { PermissionGuard } from "../auth/PermissionGuard";
import { Permissions } from "../auth/permissions";
import type { Ticket } from "../../types/ticket";

const MOCK_USERS = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
];

interface TicketAssigneeProps {
  ticket: Ticket;
}

export function TicketAssignee({ ticket }: TicketAssigneeProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (assigneeId: number) => assignTicket(ticket.id, assigneeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket", String(ticket.id)] });
      setOpen(false);
    },
  });

  return (
    <div className="relative">
      <p className="text-xs text-muted dark:text-muted-dark">Assignee</p>
      <PermissionGuard permission={Permissions.TICKETS_ASSIGN}>
        <button
          onClick={() => setOpen(!open)}
          className="mt-0.5 text-sm font-medium text-primary hover:underline dark:text-primary-light"
        >
          {ticket.assigneeName ?? "Unassigned"}
        </button>
        {open && (
          <div className="absolute left-0 top-full z-10 mt-1 w-44 rounded-lg border border-border bg-surface py-1 shadow-lg dark:border-border-dark dark:bg-surface-dark">
            {MOCK_USERS.map((u) => (
              <button
                key={u.id}
                onClick={() => mutation.mutate(u.id)}
                disabled={mutation.isPending}
                className={`w-full px-3 py-1.5 text-left text-sm hover:bg-canvas dark:hover:bg-surface-dark-hover ${
                  ticket.assigneeId === u.id
                    ? "font-medium text-primary dark:text-primary-light"
                    : "text-text dark:text-muted-dark"
                }`}
              >
                {u.name}
              </button>
            ))}
          </div>
        )}
      </PermissionGuard>
      {!ticket.assigneeName && (
        <span className="text-sm text-muted dark:text-muted-dark">Unassigned</span>
      )}
    </div>
  );
}
