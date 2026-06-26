import type { Ticket } from "../types/ticket";
import { PermissionGuard } from "../features/auth/PermissionGuard";
import { Permissions } from "../features/auth/permissions";

interface Props {
    ticket: Ticket;
    onDelete: (id: number) => void;
    onEdit: (id: number) => void;
}

function TicketCard({
    ticket,
    onEdit,
    onDelete,
}: Props) {
    return (
        
        <div className="rounded-xl border border-border bg-surface p-4 shadow-sm dark:border-border-dark dark:bg-surface-dark">
            <h2 className="text-lg font-bold text-text dark:text-text-dark">{ticket.title}</h2>
            <p className="mt-1 text-sm text-muted dark:text-muted-dark">{ticket.description}</p>
            <p className="mt-2 text-xs text-muted dark:text-muted-dark">Status: {ticket.status}</p>

            <div className="mt-3 flex gap-2">
                <PermissionGuard permission={Permissions.TICKETS_EDIT}>
                    <button
                        onClick={() => onEdit(ticket.id)}
                        className="rounded-lg bg-accent px-3 py-1 text-xs font-medium text-white hover:bg-accent-hover"
                    >
                        Edit
                    </button>
                </PermissionGuard>

                <PermissionGuard permission={Permissions.TICKETS_DELETE}>
                    <button
                        onClick={() => onDelete(ticket.id)}
                        className="rounded-lg bg-earth px-3 py-1 text-xs font-medium text-white hover:bg-earth"
                    >
                        Delete
                    </button>
                </PermissionGuard>
            </div>
            
        </div>
    );
}

export default TicketCard;