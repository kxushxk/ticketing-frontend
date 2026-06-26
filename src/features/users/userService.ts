import { getRequest, postRequest, putRequest, deleteRequest } from "../../api/methods";
import type { User } from "../../redux/auth/authTypes";

export interface UserWithStatus extends User {
  active: boolean;
  createdAt: string;
}

export const getUsers = async (): Promise<UserWithStatus[]> => {
  const response = await getRequest("/users");
  return response.data;
};

export const createUser = async (data: { name: string; email: string; password: string; role: string }): Promise<UserWithStatus> => {
  const response = await postRequest("/users", data);
  return response.data;
};

export const updateUser = async (id: number, data: Partial<{ name: string; email: string; role: string; active: boolean }>): Promise<UserWithStatus> => {
  const response = await putRequest(`/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await deleteRequest(`/users/${id}`);
};
