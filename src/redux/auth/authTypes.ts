export type UserRole = "ADMIN" | "MANAGER" | "DEVELOPER" | "USER";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}