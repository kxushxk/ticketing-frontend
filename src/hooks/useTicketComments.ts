import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getComments, addComment } from "../services/ticketService";

export function useTicketComments(ticketId: number) {
  return useQuery({
    queryKey: ["ticket", String(ticketId), "comments"],
    queryFn: () => getComments(ticketId),
    enabled: !!ticketId,
  });
}

export function useAddComment(ticketId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ body, userId }: { body: string; userId: number }) =>
      addComment(ticketId, body, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket", String(ticketId), "comments"] });
    },
  });
}
