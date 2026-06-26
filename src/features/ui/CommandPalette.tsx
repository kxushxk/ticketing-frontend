import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, LayoutDashboard, PlusCircle, Users, Command } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";

const commands = [
  { label: "Go to Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Create Ticket", path: "/create-ticket", icon: PlusCircle },
  { label: "Manage Users", path: "/users", icon: Users },
];

export function CommandPalette() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  const toggle = useCallback(() => {
    setOpen((prev) => !prev);
    setQuery("");
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggle();
      }
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [close, toggle]);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase()),
  );

  const handleSelect = useCallback((path: string) => {
    navigate(path);
    close();
  }, [navigate, close]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-[15vh]"
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <div className="w-full max-w-md rounded-xl border border-border bg-surface shadow-2xl dark:border-border-dark dark:bg-surface-dark">
        <div className="flex items-center gap-3 border-b border-border px-4 py-3 dark:border-border-dark">
          <Search className="h-4 w-4 text-muted shrink-0" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands..."
            className="flex-1 border-0 bg-transparent shadow-none focus:ring-0"
          />
          <Badge variant="outline" className="hidden sm:inline-flex gap-0.5 text-[10px]">
            <Command className="h-3 w-3" />K
          </Badge>
        </div>
        <div className="max-h-60 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted">No results</p>
          ) : (
            filtered.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.path}
                  onClick={() => handleSelect(cmd.path)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-text hover:bg-surface-hover dark:text-muted-dark dark:hover:bg-surface-dark-hover"
                >
                  <Icon className="h-4 w-4 text-muted" />
                  {cmd.label}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
