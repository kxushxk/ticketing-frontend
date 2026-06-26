import { usePermission } from "./usePermission";
import type { Permission } from "./permissions";

interface PermissionGuardProps {
  permission: Permission;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function PermissionGuard({ permission, fallback = null, children }: PermissionGuardProps) {
  const { can } = usePermission();

  if (!can(permission)) {
    return fallback;
  }

  return <>{children}</>;
}
