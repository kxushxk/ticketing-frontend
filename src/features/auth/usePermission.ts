import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { hasPermission, hasAnyPermission, hasAllPermissions, hasRole } from "./permissions";
import type { Permission } from "./permissions";
import type { UserRole } from "../../redux/auth/authTypes";

export function usePermission() {
  const user = useSelector((state: RootState) => state.auth.user);

  return {
    can: (permission: Permission) => hasPermission(user?.role, permission),
    canAny: (permissions: Permission[]) => hasAnyPermission(user?.role, permissions),
    canAll: (permissions: Permission[]) => hasAllPermissions(user?.role, permissions),
    isRole: (roles: UserRole[]) => hasRole(user?.role, roles),
    role: user?.role ?? null,
    user,
  };
}
