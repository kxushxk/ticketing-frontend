import { NavLink } from "react-router-dom";
import { usePermission } from "../../features/auth/usePermission";
import { Permissions } from "../../features/auth/permissions";
import { LayoutDashboard, PlusCircle, Users, X } from "lucide-react";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard, permission: null },
  { label: "Create Ticket", path: "/create-ticket", icon: PlusCircle, permission: Permissions.TICKETS_CREATE },
  { label: "Users", path: "/users", icon: Users, permission: Permissions.USERS_MANAGE },
] as const;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

function Sidebar({ open, onClose }: SidebarProps) {
  const { can, user } = usePermission();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 shrink-0 border-r border-border bg-surface transition-transform duration-200 dark:border-border-dark dark:bg-surface-dark lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 items-center justify-between border-b border-border px-5 dark:border-border-dark">
          <NavLink to="/dashboard" className="text-lg font-bold text-text dark:text-text-dark">
            Ticketing System
          </NavLink>
          <button onClick={onClose} className="rounded-lg p-1 text-muted hover:bg-surface-hover hover:text-muted dark:hover:bg-surface-dark-hover lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="space-y-1 px-3 py-4">
          {navItems.map((item) => {
            if (!user) return null;
            if (item.permission && !can(item.permission)) return null;
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary dark:bg-primary/30 dark:text-primary-light"
                      : "text-muted hover:bg-surface-hover hover:text-text dark:text-muted-dark dark:hover:bg-surface-dark-hover dark:hover:text-white"
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
