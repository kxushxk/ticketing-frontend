import axiosInstance from "./axiosInstance";
import type { AxiosResponse } from "axios";

export const getRequest = (url: string): Promise<AxiosResponse> =>
  axiosInstance.get(url);

export const postRequest = <T = unknown>(url: string, data: T): Promise<AxiosResponse> =>
  axiosInstance.post(url, data);

export const putRequest = <T = unknown>(url: string, data: T): Promise<AxiosResponse> =>
  axiosInstance.put(url, data);

export const deleteRequest = (url: string): Promise<AxiosResponse> =>
  axiosInstance.delete(url);
