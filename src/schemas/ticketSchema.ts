import { z } from "zod";

export const ticketSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  status: z.enum(["Open", "In Progress", "Completed", "Closed"]),
  priority: z.enum(["Low", "Medium", "High", "Critical"]),
});

export type TicketFormData = z.infer<typeof ticketSchema>;