import { getRequest, postRequest, putRequest, deleteRequest } from "../api/methods";
import type { Ticket, Comment, TicketHistory, TicketUpdatePayload, Attachment } from "../types/ticket";

export const getTickets = async (): Promise<Ticket[]> => {
  const response = await getRequest("/tickets");
  return response.data;
};

export const getTicketById = async (id: number): Promise<Ticket> => {
  const response = await getRequest(`/tickets/${id}`);
  return response.data;
};

export const createTicket = async (ticket: Partial<Ticket> & { userId: number }): Promise<Ticket> => {
  const response = await postRequest("/tickets", ticket);
  return response.data;
};

export const updateTicket = async (id: number, data: TicketUpdatePayload): Promise<Ticket> => {
  const response = await putRequest(`/tickets/${id}`, data);
  return response.data;
};

export const deleteTicket = async (id: number): Promise<void> => {
  await deleteRequest(`/tickets/${id}`);
};

export const getComments = async (ticketId: number): Promise<Comment[]> => {
  const response = await getRequest(`/tickets/${ticketId}/comments`);
  return response.data;
};

export const addComment = async (ticketId: number, body: string, userId: number): Promise<Comment> => {
  const response = await postRequest(`/tickets/${ticketId}/comments`, { body, userId });
  return response.data;
};

export const getTicketHistory = async (ticketId: number): Promise<TicketHistory[]> => {
  const response = await getRequest(`/tickets/${ticketId}/history`);
  return response.data;
};

export const updateTicketStatus = async (ticketId: number, status: string, userId: number): Promise<Ticket> => {
  const response = await putRequest(`/tickets/${ticketId}/status`, { status, userId });
  return response.data;
};

export const assignTicket = async (ticketId: number, assigneeId: number): Promise<Ticket> => {
  const response = await putRequest(`/tickets/${ticketId}/assign`, { assigneeId });
  return response.data;
};

export const getAttachments = async (ticketId: number): Promise<Attachment[]> => {
  const response = await getRequest(`/tickets/${ticketId}/attachments`);
  return response.data;
};

export const uploadAttachment = async (ticketId: number, file: File, userId: number): Promise<Attachment> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("userId", String(userId));
  const { default: axiosInstance } = await import("../api/axiosInstance");
  const response = await axiosInstance.post(`/tickets/${ticketId}/attachments`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};