import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTicket } from "../services/ticketService";

export function useDeleteTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteTicket(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
}
