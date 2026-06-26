import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { hasRole } from "../features/auth/permissions";
import type { UserRole } from "../redux/auth/authTypes";

interface Props {
    allowedRoles: UserRole[];
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

function RoleGuard({ allowedRoles, children, fallback }: Props) {
    const user = useSelector((state: RootState) => state.auth.user);

    if (!user) return null;

    if (!hasRole(user.role, allowedRoles)) {
        return fallback ?? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <h1 className="text-2xl font-bold text-text dark:text-muted-dark">Access Denied</h1>
                <p className="mt-1 text-sm text-muted dark:text-muted-dark">
                    You don't have permission to access this page.
                </p>
            </div>
        );
    }

    return <>{children}</>;
}

export default RoleGuard;