import type { User } from "../../redux/auth/authTypes";
import {
  mockLoginApi,
  mockRegisterApi,
  mockRefreshTokenApi,
  mockGetProfileApi,
  mockForgotPasswordApi,
  mockResetPasswordApi,
  mockSendOtpApi,
  mockVerifyOtpApi,
  mockRequestRegistrationApi,
  mockGetPendingRequestsApi,
  mockApproveRequestApi,
  mockRejectRequestApi,
} from "./mockAuthService";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

const USE_MOCK = import.meta.env.VITE_MOCK_AUTH === "true";

export const loginApi = async (data: LoginRequest): Promise<AuthResponse> => {
  if (USE_MOCK) return mockLoginApi(data);
  const { default: axiosInstance } = await import("../../api/axiosInstance");
  const response = await axiosInstance.post("/auth/login", data);
  return response.data;
};

export const registerApi = async (data: RegisterRequest): Promise<AuthResponse> => {
  if (USE_MOCK) return mockRegisterApi(data);
  const { default: axiosInstance } = await import("../../api/axiosInstance");
  const response = await axiosInstance.post("/auth/register", data);
  return response.data;
};

export const refreshTokenApi = async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
  if (USE_MOCK) return mockRefreshTokenApi();
  const { default: axiosInstance } = await import("../../api/axiosInstance");
  const response = await axiosInstance.post("/auth/refresh", { refreshToken });
  return response.data;
};

export const getProfileApi = async (): Promise<User> => {
  if (USE_MOCK) return mockGetProfileApi();
  const { default: axiosInstance } = await import("../../api/axiosInstance");
  const response = await axiosInstance.get("/auth/me");
  return response.data;
};

export const forgotPasswordApi = async (email: string): Promise<{ message: string }> => {
  if (USE_MOCK) return mockForgotPasswordApi(email);
  const { default: axiosInstance } = await import("../../api/axiosInstance");
  const response = await axiosInstance.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPasswordApi = async (token: string, password: string): Promise<{ message: string }> => {
  if (USE_MOCK) return mockResetPasswordApi(token, password);
  const { default: axiosInstance } = await import("../../api/axiosInstance");
  const response = await axiosInstance.post("/auth/reset-password", { token, password });
  return response.data;
};

export const sendOtpApi = async (email: string): Promise<{ message: string }> => {
  if (USE_MOCK) return mockSendOtpApi(email);
  const { default: axiosInstance } = await import("../../api/axiosInstance");
  const response = await axiosInstance.post("/auth/send-otp", { email });
  return response.data;
};

export const verifyOtpApi = async (email: string, otp: string): Promise<{ message: string }> => {
  if (USE_MOCK) return mockVerifyOtpApi(email, otp);
  const { default: axiosInstance } = await import("../../api/axiosInstance");
  const response = await axiosInstance.post("/auth/verify-otp", { email, otp });
  return response.data;
};

export interface RegistrationRequest {
  name: string;
  email: string;
  password: string;
}

export const requestRegistrationApi = async (data: RegistrationRequest): Promise<{ message: string; requestId: number }> => {
  if (USE_MOCK) return mockRequestRegistrationApi(data);
  const { default: axiosInstance } = await import("../../api/axiosInstance");
  const response = await axiosInstance.post("/auth/request-registration", data);
  return response.data;
};

export interface PendingRequest {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export const getPendingRequestsApi = async (): Promise<PendingRequest[]> => {
  if (USE_MOCK) return mockGetPendingRequestsApi();
  const { default: axiosInstance } = await import("../../api/axiosInstance");
  const response = await axiosInstance.get("/auth/pending-requests");
  return response.data;
};

export const approveRequestApi = async (id: number): Promise<{ message: string; user?: User }> => {
  if (USE_MOCK) return mockApproveRequestApi(id);
  const { default: axiosInstance } = await import("../../api/axiosInstance");
  const response = await axiosInstance.post(`/auth/approve-request/${id}`);
  return response.data;
};

export const rejectRequestApi = async (id: number): Promise<{ message: string }> => {
  if (USE_MOCK) return mockRejectRequestApi(id);
  const { default: axiosInstance } = await import("../../api/axiosInstance");
  const response = await axiosInstance.post(`/auth/reject-request/${id}`);
  return response.data;
};
