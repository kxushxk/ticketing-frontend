import { useQuery }
from "@tanstack/react-query";

import { getTickets }
from "../services/ticketService";

export function useTickets() {
  return useQuery({
    queryKey: ["tickets"],
    queryFn: getTickets,
  });
}