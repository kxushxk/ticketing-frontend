import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTicketById } from "../services/ticketService";
import { useDeleteTicket } from "../hooks/useDeleteTicket";
import { TicketStatusWorkflow } from "../features/tickets/TicketStatusWorkflow";
import { TicketAssignee } from "../features/tickets/TicketAssignee";
import { TicketComments } from "../features/tickets/TicketComments";
import { TicketAttachments } from "../features/tickets/TicketAttachments";
import { TicketHistory } from "../features/tickets/TicketHistory";
import { EditTicketForm } from "../features/tickets/EditTicketForm";
import { Modal } from "../shared/components/Modal";
import { useToast } from "../shared/context/useToast";
import { PermissionGuard } from "../features/auth/PermissionGuard";
import { Permissions } from "../features/auth/permissions";
import { PriorityBadge, StatusBadge } from "../shared/components/DataTable";

function Skeleton() {
  return (
    <div className="space-y-4">
      <div className="h-4 w-1/4 animate-pulse rounded bg-border dark:bg-surface-dark-hover" />
      <div className="h-8 w-2/3 animate-pulse rounded bg-border dark:bg-surface-dark-hover" />
      <div className="h-4 w-1/2 animate-pulse rounded bg-border dark:bg-surface-dark-hover" />
      <div className="h-32 animate-pulse rounded-xl bg-border dark:bg-surface-dark-hover" />
    </div>
  );
}

function TicketDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const deleteMutation = useDeleteTicket();

  const { data: ticket, isLoading, error } = useQuery({
    queryKey: ["ticket", id],
    queryFn: () => getTicketById(Number(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl">
        <Skeleton />
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h1 className="text-2xl font-bold text-text dark:text-muted-dark">Ticket Not Found</h1>
        <p className="mt-2 text-sm text-muted dark:text-muted-dark">The ticket you're looking for doesn't exist.</p>
        <Link to="/dashboard" className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const handleDelete = () => {
    deleteMutation.mutate(ticket.id, {
      onSuccess: () => {
        addToast("Ticket deleted", "success");
        navigate("/dashboard");
      },
      onError: () => addToast("Failed to delete ticket", "error"),
    });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/dashboard" className="inline-block text-sm text-primary hover:underline dark:text-primary-light">
        &larr; Back to Dashboard
      </Link>

      <div className="rounded-xl border border-border bg-surface p-6 shadow-sm dark:border-border-dark dark:bg-surface-dark">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold text-text dark:text-text-dark">{ticket.title}</h1>
            <p className="mt-0.5 text-sm text-muted dark:text-muted-dark">Ticket #{ticket.id}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <TicketStatusWorkflow ticketId={ticket.id} currentStatus={ticket.status} />
          <TicketAssignee ticket={ticket} />
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-text dark:text-muted-dark">Description</h3>
          <p className="mt-1 text-sm text-muted dark:text-muted-dark">{ticket.description}</p>
        </div>

        <div className="mt-6 flex items-center gap-3 border-t border-border pt-4 dark:border-border-dark">
          <PermissionGuard permission={Permissions.TICKETS_EDIT}>
            <button
              onClick={() => setEditOpen(true)}
              className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-accent-hover"
            >
              Edit
            </button>
          </PermissionGuard>
          <PermissionGuard permission={Permissions.TICKETS_DELETE}>
            <button
              onClick={() => setDeleteOpen(true)}
              className="rounded-lg bg-earth px-3 py-1.5 text-xs font-medium text-white hover:bg-earth"
            >
              Delete
            </button>
          </PermissionGuard>
          <span className="text-xs text-muted dark:text-muted-dark">
            Created {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : "â€”"}
            {ticket.createdByName ? ` by ${ticket.createdByName}` : ""}
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface p-6 shadow-sm dark:border-border-dark dark:bg-surface-dark">
        <TicketComments ticketId={ticket.id} />
      </div>

      <div className="rounded-xl border border-border bg-surface p-6 shadow-sm dark:border-border-dark dark:bg-surface-dark">
        <TicketAttachments ticketId={ticket.id} />
      </div>

      <div className="rounded-xl border border-border bg-surface p-6 shadow-sm dark:border-border-dark dark:bg-surface-dark">
        <TicketHistory ticketId={ticket.id} />
      </div>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Ticket">
        <EditTicketForm ticket={ticket} onSuccess={() => { setEditOpen(false); addToast("Ticket updated", "success"); }} />
      </Modal>

      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete Ticket">
        <p className="text-sm text-muted dark:text-muted-dark">
          Are you sure you want to delete <strong className="text-text dark:text-text-dark">{ticket.title}</strong>? This action cannot be undone.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={() => setDeleteOpen(false)}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text hover:bg-canvas dark:border-border-dark dark:text-muted-dark dark:hover:bg-surface-dark-hover"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="rounded-lg bg-earth px-4 py-2 text-sm font-medium text-white hover:bg-earth-hover disabled:opacity-50"
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default TicketDetails;