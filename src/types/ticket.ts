export type TicketStatus = "Open" | "In Progress" | "Completed" | "Closed";
export type TicketPriority = "Low" | "Medium" | "High" | "Critical";
export type UserRole = "ADMIN" | "MANAGER" | "DEVELOPER" | "USER";

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  assigneeId?: number;
  assigneeName?: string;
  createdBy?: number;
  createdByName?: string;
  createdAt: string;
  updatedAt: string;
  category?: string;
}

export interface Comment {
  id: number;
  ticketId: number;
  authorId: number;
  authorName: string;
  body: string;
  createdAt: string;
}

export interface TicketHistory {
  id: number;
  ticketId: number;
  userId: number;
  userName: string;
  action: string;
  field?: string;
  oldValue?: string;
  newValue?: string;
  createdAt: string;
}

export interface TicketUpdatePayload {
  title?: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  assigneeId?: number;
  category?: string;
}

export interface TicketFormData {
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  assigneeId?: number;
  category?: string;
}

export interface Attachment {
  id: number;
  ticketId: number;
  fileName: string;
  fileSize: number;
  mimeType: string;
  url: string;
  uploadedById: number;
  uploadedByName: string;
  createdAt: string;
}

export const STATUS_FLOW: Record<TicketStatus, TicketStatus[]> = {
  "Open": ["In Progress"],
  "In Progress": ["Completed", "Open"],
  "Completed": ["Closed", "In Progress"],
  "Closed": ["Open"],
};