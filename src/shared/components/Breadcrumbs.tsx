import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const labelMap: Record<string, string> = {
  dashboard: "Dashboard",
  "create-ticket": "Create Ticket",
  ticket: "Ticket",
};

function Breadcrumbs() {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav className="mb-4 text-sm text-muted dark:text-muted-dark">
      <ol className="flex items-center gap-1.5">
        <li>
          <Link to="/dashboard" className="flex items-center gap-1 hover:text-text dark:hover:text-muted-dark">
            <Home className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Home</span>
          </Link>
        </li>
        {segments.map((seg, i) => {
          const label = labelMap[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1);
          const href = "/" + segments.slice(0, i + 1).join("/");
          const isLast = i === segments.length - 1;
          return (
            <li key={seg} className="flex items-center gap-1.5">
              <ChevronRight className="h-3 w-3 text-muted dark:text-muted" />
              {isLast ? (
                <span className="font-medium text-text dark:text-muted-dark">{label}</span>
              ) : (
                <Link to={href} className="hover:text-text dark:hover:text-muted-dark">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
