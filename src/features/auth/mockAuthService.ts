import type { AuthResponse, LoginRequest, RegisterRequest } from "./authService";
import type { User } from "../../redux/auth/authTypes";

function fakeToken(prefix: string) {
  const payload = btoa(JSON.stringify({ sub: prefix, iat: Date.now() }));
  return `${prefix}_${payload}_${Math.random().toString(36).slice(2)}`;
}

function makeUser(name: string, email: string): User {
  const role = email.includes("admin")
    ? "ADMIN"
    : email.includes("manager")
      ? "MANAGER"
      : email.includes("dev")
        ? "DEVELOPER"
        : "USER";
  return {
    id: String(Math.floor(Math.random() * 10000)),
    name,
    email,
    role,
  };
}

export async function mockLoginApi(data: LoginRequest): Promise<AuthResponse> {
  await new Promise((r) => setTimeout(r, 600));
  const user = makeUser(data.email.split("@")[0], data.email);
  return {
    user,
    accessToken: fakeToken("access"),
    refreshToken: fakeToken("refresh"),
  };
}

export async function mockRegisterApi(data: RegisterRequest): Promise<AuthResponse> {
  await new Promise((r) => setTimeout(r, 600));
  const user = makeUser(data.name, data.email);
  return {
    user,
    accessToken: fakeToken("access"),
    refreshToken: fakeToken("refresh"),
  };
}

export async function mockRefreshTokenApi(): Promise<{ accessToken: string; refreshToken: string }> {
  await new Promise((r) => setTimeout(r, 200));
  return { accessToken: fakeToken("access"), refreshToken: fakeToken("refresh") };
}

export async function mockGetProfileApi(): Promise<User> {
  await new Promise((r) => setTimeout(r, 200));
  return makeUser("Mock User", "mock@test.com");
}

export async function mockForgotPasswordApi(email: string): Promise<{ message: string }> {
  void email;
  await new Promise((r) => setTimeout(r, 600));
  return { message: "If an account with that email exists, a password reset link has been sent." };
}

export async function mockResetPasswordApi(token: string, password: string): Promise<{ message: string }> {
  void token;
  void password;
  await new Promise((r) => setTimeout(r, 600));
  return { message: "Password has been reset successfully." };
}
