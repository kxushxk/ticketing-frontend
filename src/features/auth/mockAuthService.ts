import type { AuthResponse, LoginRequest, RegisterRequest, RegistrationRequest, PendingRequest } from "./authService";
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

// In-memory mock stores for OTP and pending requests
const mockOtpStore = new Map<string, { otp: string; expiresAt: number }>();
const mockVerifiedEmails = new Set<string>();
let mockPendingRequests: (RegistrationRequest & { id: number; status: string; createdAt: string })[] = [];
let mockRequestIdCounter = 1;

export async function mockSendOtpApi(email: string): Promise<{ message: string }> {
  await new Promise((r) => setTimeout(r, 400));
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  mockOtpStore.set(email, { otp, expiresAt: Date.now() + 600000 });
  console.log(`[MOCK] OTP for ${email}: ${otp}`);
  return { message: "OTP sent to your email" };
}

export async function mockVerifyOtpApi(email: string, otp: string): Promise<{ message: string }> {
  await new Promise((r) => setTimeout(r, 400));
  const stored = mockOtpStore.get(email);
  if (!stored) throw new Error("No OTP sent to this email");
  if (stored.expiresAt < Date.now()) {
    mockOtpStore.delete(email);
    throw new Error("OTP has expired");
  }
  if (stored.otp !== otp) throw new Error("Invalid OTP");
  mockOtpStore.delete(email);
  mockVerifiedEmails.add(email);
  return { message: "OTP verified successfully" };
}

export async function mockRequestRegistrationApi(data: RegistrationRequest): Promise<{ message: string; requestId: number }> {
  await new Promise((r) => setTimeout(r, 400));
  if (!mockVerifiedEmails.has(data.email)) {
    throw new Error("Email not verified. Please verify OTP first.");
  }
  mockVerifiedEmails.delete(data.email);
  const id = mockRequestIdCounter++;
  mockPendingRequests.push({ ...data, id, status: "pending", createdAt: new Date().toISOString() });
  return { message: "Registration request submitted. Waiting for admin approval.", requestId: id };
}

export async function mockGetPendingRequestsApi(): Promise<PendingRequest[]> {
  await new Promise((r) => setTimeout(r, 300));
  return mockPendingRequests
    .filter((p) => p.status === "pending")
    .map((p) => ({ id: p.id, name: p.name, email: p.email, createdAt: p.createdAt }));
}

export async function mockApproveRequestApi(id: number): Promise<{ message: string; user?: User }> {
  await new Promise((r) => setTimeout(r, 400));
  const idx = mockPendingRequests.findIndex((p) => p.id === id && p.status === "pending");
  if (idx === -1) throw new Error("Pending request not found");
  const request = mockPendingRequests[idx];
  request.status = "approved";
  const user: User = {
    id: String(Math.floor(Math.random() * 10000)),
    name: request.name,
    email: request.email,
    role: "USER",
  };
  return { message: "Registration approved. User can now log in.", user };
}

export async function mockRejectRequestApi(id: number): Promise<{ message: string }> {
  await new Promise((r) => setTimeout(r, 300));
  const idx = mockPendingRequests.findIndex((p) => p.id === id && p.status === "pending");
  if (idx === -1) throw new Error("Pending request not found");
  mockPendingRequests[idx].status = "rejected";
  return { message: "Registration request rejected" };
}
