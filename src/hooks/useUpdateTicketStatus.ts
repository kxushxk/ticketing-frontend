import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTicketStatus } from "../services/ticketService";

export function useUpdateTicketStatus(ticketId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ status, userId }: { status: string; userId: number }) =>
      updateTicketStatus(ticketId, status, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["ticket", String(ticketId)] });
      queryClient.invalidateQueries({ queryKey: ["ticket", String(ticketId), "history"] });
    },
  });
}
