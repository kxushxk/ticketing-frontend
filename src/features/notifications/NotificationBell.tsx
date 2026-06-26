import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getNotifications, markNotificationRead, markAllRead } from "./notificationService";
import type { RootState } from "../../redux/store";
import { Bell, CheckCheck, Loader2 } from "lucide-react";

export function NotificationBell() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useSelector((state: RootState) => state.auth.user);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: () => getNotifications(String(user!.id)),
    enabled: !!user,
    refetchInterval: 30000,
  });

  const markRead = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] }),
  });

  const markAll = useMutation({
    mutationFn: () => markAllRead(String(user!.id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] }),
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unread = notifications?.filter((n) => !n.read) ?? [];
  const displayed = notifications?.slice(0, 10) ?? [];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-lg p-2 text-muted hover:bg-surface-hover dark:text-muted-dark dark:hover:bg-surface-dark-hover"
      >
        <Bell className="h-5 w-5" />
        {unread.length > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-earth px-1 text-[10px] font-bold text-white">
            {unread.length > 9 ? "9+" : unread.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-50 w-80 rounded-lg border border-border bg-surface shadow-lg dark:border-border-dark dark:bg-surface-dark">
          <div className="flex items-center justify-between border-b border-border px-4 py-3 dark:border-border-dark">
            <h3 className="text-sm font-semibold text-text dark:text-text-dark">Notifications</h3>
            {unread.length > 0 && (
              <button
                onClick={() => markAll.mutate()}
                disabled={markAll.isPending}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline dark:text-primary-light"
              >
                {markAll.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCheck className="h-3 w-3" />}
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto">
            {isLoading ? (
              <div className="space-y-2 p-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-12 animate-pulse rounded bg-surface-hover dark:bg-surface-dark-hover" />
                ))}
              </div>
            ) : displayed.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-muted dark:text-muted-dark">No notifications</p>
            ) : (
              displayed.map((n) => (
                <button
                  key={n.id}
                  onClick={() => {
                    markRead.mutate(n.id);
                    if (n.link) navigate(n.link);
                    setOpen(false);
                  }}
                  className={`w-full border-b border-canvas px-4 py-3 text-left transition-colors hover:bg-canvas dark:border-border-dark/50 dark:hover:bg-surface-dark-hover/50 ${!n.read ? "bg-primary/10/50 dark:bg-primary-dark/10" : ""}`}
                >
                  <p className="text-sm font-medium text-text dark:text-text-dark">{n.title}</p>
                  <p className="mt-0.5 text-xs text-muted dark:text-muted-dark">{n.message}</p>
                  <p className="mt-1 text-[10px] text-muted dark:text-muted-dark">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
