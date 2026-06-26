import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../redux/store";
import { logout } from "../../redux/auth/authSlice";
import { LogOut, User, ChevronDown } from "lucide-react";

function UserDropdown() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!token) return null;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg p-1.5 text-sm font-medium text-text hover:bg-surface-hover dark:text-muted-dark dark:hover:bg-surface-dark-hover"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary dark:bg-primary/30 dark:text-primary-light">
          {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
        </div>
        <span className="hidden text-xs sm:inline">{user?.name}</span>
        <ChevronDown className="h-3 w-3 text-muted" />
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-50 w-48 rounded-lg border border-border bg-surface py-1 shadow-lg dark:border-border-dark dark:bg-surface-dark">
          <div className="border-b border-border px-4 py-2 dark:border-border-dark">
            <p className="text-sm font-medium text-text dark:text-text-dark">{user?.name}</p>
            <p className="text-xs text-muted dark:text-muted-dark">{user?.email}</p>
          </div>
          <div className="border-b border-border px-2 py-1 dark:border-border-dark">
            <button className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted hover:bg-canvas dark:text-muted-dark dark:hover:bg-surface-dark-hover">
              <User className="h-4 w-4" />
              Profile
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-earth hover:bg-canvas dark:text-earth dark:hover:bg-surface-dark-hover"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default UserDropdown;
