import UsersPage from "../features/users/UsersPage";
import { PermissionGuard } from "../features/auth/PermissionGuard";
import { Permissions } from "../features/auth/permissions";

function Users() {
  return (
    <PermissionGuard permission={Permissions.USERS_MANAGE}>
      <UsersPage />
    </PermissionGuard>
  );
}

export default Users;
