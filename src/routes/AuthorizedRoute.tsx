import ProtectedRoute from "./ProtectedRoute";
import RoleGuard from "../components/RoleGuard";
import type { UserRole } from "../redux/auth/authTypes";
import type { Permission } from "../features/auth/permissions";
import { PermissionGuard } from "../features/auth/PermissionGuard";

interface AuthorizedRouteProps {
  roles?: UserRole[];
  permission?: Permission;
  children: React.ReactNode;
}

export function AuthorizedRoute({ roles, permission, children }: AuthorizedRouteProps) {
  let content = children;

  if (roles && roles.length > 0) {
    content = <RoleGuard allowedRoles={roles}>{content}</RoleGuard>;
  }

  if (permission) {
    content = <PermissionGuard permission={permission}>{content}</PermissionGuard>;
  }

  return <ProtectedRoute>{content}</ProtectedRoute>;
}
