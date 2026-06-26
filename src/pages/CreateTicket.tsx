import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { ticketSchema } from "../schemas/ticketSchema";
import type { TicketFormData } from "../schemas/ticketSchema";
import { useCreateTicket } from "../hooks/useCreateTicket";
import { useToast } from "../shared/context/useToast";

function CreateTicket() {
  const navigate = useNavigate();
  const mutation = useCreateTicket();
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "Open",
      priority: "Medium",
    },
  });

  const onSubmit = (data: TicketFormData) => {
    mutation.mutate(
      { ...data, userId: 1 },
      {
        onSuccess: () => {
          addToast("Ticket created successfully", "success");
          reset();
          navigate("/dashboard");
        },
        onError: () => {
          addToast("Failed to create ticket", "error");
        },
      },
    );
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
        <h1 className="text-xl font-bold text-text">Create Ticket</h1>
        <p className="mt-1 text-sm text-muted">Fill in the details below to create a new ticket.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text">Title</label>
            <input
              {...register("title")}
              placeholder="Enter ticket title"
              className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm shadow-sm placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {errors.title && <p className="mt-1 text-xs text-earth">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text">Description</label>
            <textarea
              {...register("description")}
              placeholder="Describe the issue"
              rows={4}
              className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm shadow-sm placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {errors.description && <p className="mt-1 text-xs text-earth">{errors.description.message}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-text">Status</label>
              <select
                {...register("status")}
                className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text">Priority</label>
              <select
                {...register("priority")}
                className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {mutation.isPending ? "Creating..." : "Create Ticket"}
            </button>
            {mutation.isError && (
              <p className="text-xs text-earth">Failed to create ticket. Try again.</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTicket;