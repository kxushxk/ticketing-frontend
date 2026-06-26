import type { UserRole } from "../../redux/auth/authTypes";

export type Permission = string;

export const Permissions = {
  DASHBOARD_VIEW: "dashboard:view",
  TICKETS_CREATE: "tickets:create",
  TICKETS_VIEW: "tickets:view",
  TICKETS_EDIT: "tickets:edit",
  TICKETS_DELETE: "tickets:delete",
  TICKETS_ASSIGN: "tickets:assign",
  USERS_MANAGE: "users:manage",
} as const;

const rolePermissions: Record<UserRole, Permission[]> = {
  ADMIN: ["*"],
  MANAGER: [
    Permissions.DASHBOARD_VIEW,
    Permissions.TICKETS_CREATE,
    Permissions.TICKETS_VIEW,
    Permissions.TICKETS_EDIT,
    Permissions.TICKETS_ASSIGN,
  ],
  DEVELOPER: [
    Permissions.DASHBOARD_VIEW,
    Permissions.TICKETS_CREATE,
    Permissions.TICKETS_VIEW,
    Permissions.TICKETS_EDIT,
  ],
  USER: [
    Permissions.DASHBOARD_VIEW,
    Permissions.TICKETS_CREATE,
    Permissions.TICKETS_VIEW,
  ],
};

export function hasPermission(role: UserRole | undefined, permission: Permission): boolean {
  if (!role) return false;
  const perms = rolePermissions[role];
  if (!perms) return false;
  if (perms.includes("*")) return true;
  return perms.includes(permission);
}

export function hasAnyPermission(role: UserRole | undefined, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

export function hasAllPermissions(role: UserRole | undefined, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(role, p));
}

export function hasRole(role: UserRole | undefined, allowedRoles: UserRole[]): boolean {
  if (!role) return false;
  return allowedRoles.includes(role);
}
