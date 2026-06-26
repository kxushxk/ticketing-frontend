import { createAsyncThunk } from "@reduxjs/toolkit";
import type { LoginRequest, RegisterRequest } from "./authService";
import { loginApi, registerApi, getProfileApi, refreshTokenApi } from "./authService";
import type { User } from "../../redux/auth/authTypes";

const STORAGE_KEY = "auth";

function persistAuth(user: User, accessToken: string, refreshToken: string) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, accessToken, refreshToken }));
}

function clearPersistedAuth() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getPersistedAuth(): { user: User; accessToken: string; refreshToken: string } | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (data: LoginRequest, { rejectWithValue }) => {
    try {
      const res = await loginApi(data);
      persistAuth(res.user, res.accessToken, res.refreshToken);
      return { user: res.user, token: res.accessToken };
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      return rejectWithValue(message ?? "Login failed");
    }
  },
);

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (data: RegisterRequest, { rejectWithValue }) => {
    try {
      const res = await registerApi(data);
      persistAuth(res.user, res.accessToken, res.refreshToken);
      return { user: res.user, token: res.accessToken };
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      return rejectWithValue(message ?? "Registration failed");
    }
  },
);

export const refreshSessionThunk = createAsyncThunk(
  "auth/refresh",
  async (_, { rejectWithValue }) => {
    try {
      const persisted = getPersistedAuth();
      if (!persisted) return rejectWithValue("No session");
      const res = await refreshTokenApi(persisted.refreshToken);
      persistAuth(persisted.user, res.accessToken, res.refreshToken);
      return { user: persisted.user, token: res.accessToken };
    } catch {
      clearPersistedAuth();
      return rejectWithValue("Session expired");
    }
  },
);

export const getProfileThunk = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const user = await getProfileApi();
      const persisted = getPersistedAuth();
      if (persisted) {
        persistAuth(user, persisted.accessToken, persisted.refreshToken);
      }
      return user;
    } catch {
      return rejectWithValue("Failed to fetch profile");
    }
  },
);
