import { useInfiniteQuery } from "@tanstack/react-query";
import { getRequest } from "../api/methods";
import type { Ticket } from "../types/ticket";

const PAGE_SIZE = 10;

export function useInfiniteTickets() {
  return useInfiniteQuery({
    queryKey: ["tickets", "infinite"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getRequest(`/tickets?_page=${pageParam}&_limit=${PAGE_SIZE}&_sort=createdAt&_order=desc`);
      const totalCount = Number(response.headers["x-total-count"] ?? response.data.length);
      return {
        tickets: response.data as Ticket[],
        totalPages: Math.ceil(totalCount / PAGE_SIZE),
        currentPage: pageParam,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
  });
}
