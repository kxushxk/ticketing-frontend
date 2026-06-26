import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTicket } from "../services/ticketService";
import type { TicketUpdatePayload } from "../types/ticket";

export function useUpdateTicket(ticketId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TicketUpdatePayload) => updateTicket(ticketId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["ticket", String(ticketId)] });
    },
  });
}
