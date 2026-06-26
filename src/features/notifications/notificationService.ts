import { getRequest, putRequest } from "../../api/methods";

export interface AppNotification {
  id: number;
  userId: number;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export const getNotifications = async (userId: string): Promise<AppNotification[]> => {
  const response = await getRequest(`/notifications?userId=${userId}&_sort=createdAt&_order=desc`);
  return response.data;
};

export const markNotificationRead = async (id: number): Promise<void> => {
  await putRequest(`/notifications/${id}`, { read: true });
};

export const markAllRead = async (userId: string): Promise<void> => {
  const response = await getRequest(`/notifications?userId=${userId}&read=false`);
  const unread = response.data as AppNotification[];
  await Promise.all(unread.map((n) => putRequest(`/notifications/${n.id}`, { read: true })));
};
