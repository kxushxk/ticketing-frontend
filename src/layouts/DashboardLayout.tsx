import Sidebar from "../shared/components/Sidebar";
import UserDropdown from "../shared/components/UserDropdown";
import DarkModeToggle from "../shared/components/DarkModeToggle";
import Breadcrumbs from "../shared/components/Breadcrumbs";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import { logout } from "../redux/auth/authSlice";
import { Menu } from "lucide-react";
import { useState } from "react";
import { NotificationBell } from "../features/notifications/NotificationBell";
import { CommandPalette } from "../features/ui/CommandPalette";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useSelector((state: RootState) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAuthPage = ["/login", "/register", "/forgot-password", "/reset-password"].includes(location.pathname);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-canvas dark:bg-canvas-dark">
        <header className="flex h-14 items-center justify-between border-b border-border bg-surface px-4 dark:border-border-dark dark:bg-surface-dark sm:px-6 lg:px-8">
          <Link to="/" className="text-lg font-bold text-text dark:text-text-dark">
            Ticketing System
          </Link>
          <DarkModeToggle />
        </header>
        <main>{children}</main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-canvas dark:bg-canvas-dark">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-surface px-4 shadow-sm dark:border-border-dark dark:bg-surface-dark sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-1.5 text-muted hover:bg-surface-hover dark:text-muted-dark dark:hover:bg-surface-dark-hover lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link to="/" className="text-lg font-bold text-text dark:text-text-dark lg:hidden">
              Ticketing System
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {token && <NotificationBell />}
            <DarkModeToggle />
            {token ? <UserDropdown /> : (
              <Link
                to="/login"
                className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-hover"
              >
                Login
              </Link>
            )}
            {token && (
              <button onClick={handleLogout} className="text-xs font-medium text-muted hover:text-earth dark:text-muted-dark dark:hover:text-earth sm:hidden">
                Logout
              </button>
            )}
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Breadcrumbs />
          {children}
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}

export default DashboardLayout;
