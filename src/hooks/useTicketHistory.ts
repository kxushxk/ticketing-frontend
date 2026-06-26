import { useQuery } from "@tanstack/react-query";
import { getTicketHistory } from "../services/ticketService";

export function useTicketHistory(ticketId: number) {
  return useQuery({
    queryKey: ["ticket", String(ticketId), "history"],
    queryFn: () => getTicketHistory(ticketId),
    enabled: !!ticketId,
  });
}
