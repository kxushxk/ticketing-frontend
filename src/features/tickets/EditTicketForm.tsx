import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateTicket } from "../../hooks/useUpdateTicket";
import { ticketSchema } from "../../schemas/ticketSchema";
import type { TicketFormData, Ticket } from "../../types/ticket";

interface EditTicketFormProps {
  ticket: Ticket;
  onSuccess: () => void;
}

export function EditTicketForm({ ticket, onSuccess }: EditTicketFormProps) {
  const mutation = useUpdateTicket(ticket.id);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
    },
  });

  const onSubmit = (data: TicketFormData) => {
    mutation.mutate(data, { onSuccess });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-muted dark:text-muted-dark">Title</label>
        <input
          {...register("title")}
          className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-border-dark dark:bg-surface-dark-hover dark:text-text-dark"
        />
        {errors.title && <p className="mt-0.5 text-xs text-earth">{errors.title.message}</p>}
      </div>
      <div>
        <label className="block text-xs font-medium text-muted dark:text-muted-dark">Description</label>
        <textarea
          {...register("description")}
          rows={3}
          className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-border-dark dark:bg-surface-dark-hover dark:text-text-dark"
        />
        {errors.description && <p className="mt-0.5 text-xs text-earth">{errors.description.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-muted dark:text-muted-dark">Status</label>
          <select
            {...register("status")}
            className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none dark:border-border-dark dark:bg-surface-dark-hover dark:text-text-dark"
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-muted dark:text-muted-dark">Priority</label>
          <select
            {...register("priority")}
            className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none dark:border-border-dark dark:bg-surface-dark-hover dark:text-text-dark"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
        >
          {mutation.isPending ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
