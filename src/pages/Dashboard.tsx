import { useState, useMemo, memo } from "react";
import { useTickets } from "../hooks/useTickets";
import type { Ticket } from "../types/ticket";
import { Link, useNavigate } from "react-router-dom";
import { DataTable, StatusBadge, PriorityBadge } from "../shared/components/DataTable";
import { Pagination } from "../shared/components/Pagination";
import { useDebounce } from "../shared/hooks/useDebounce";
import type { Column } from "../shared/components/DataTable";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Ticket as TicketIcon, AlertCircle, PlayCircle, CheckCircle2, Plus, Search } from "lucide-react";

const PAGE_SIZE = 10;

const StatCard = memo(function StatCard({ label, count, icon: Icon, colorClass }: { label: string; count: number; icon: React.FC<{ className?: string }>; colorClass: string }) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="!p-4 sm:!p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs sm:text-sm font-medium text-muted dark:text-muted-dark truncate">{label}</p>
          <Icon className={`h-5 w-5 shrink-0 ${colorClass}`} />
        </div>
        <p className={`mt-2 text-2xl sm:text-3xl font-bold ${colorClass}`}>{count}</p>
      </CardContent>
    </Card>
  );
});

function Skeleton() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl border border-border bg-surface shadow-sm dark:border-border-dark dark:bg-surface-dark" />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-xl bg-border dark:bg-surface-dark-hover" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <TicketIcon className="mb-4 h-12 w-12 text-muted dark:text-muted" />
      <h3 className="text-lg font-semibold text-text dark:text-muted-dark">No tickets yet</h3>
      <p className="mt-1 text-sm text-muted dark:text-muted-dark">Create your first ticket to get started.</p>
      <Link to="/create-ticket">
        <Button>
          <Plus className="h-4 w-4" />
          Create Ticket
        </Button>
      </Link>
    </div>
  );
}

function FilterBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  status: string;
  onStatusChange: (v: string) => void;
  priority: string;
  onPriorityChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
      <div className="relative w-full sm:w-auto sm:min-w-0 sm:flex-1 sm:max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tickets..."
          className="block w-full rounded-lg border border-border py-2 pl-9 pr-3 text-sm shadow-sm placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-border-dark dark:bg-surface-dark dark:text-text-dark dark:placeholder:text-muted-dark"
        />
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="flex-1 sm:flex-none rounded-lg border border-border px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-border-dark dark:bg-surface-dark dark:text-text-dark"
        >
          <option value="">All Statuses</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Closed">Closed</option>
        </select>
        <select
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="flex-1 sm:flex-none rounded-lg border border-border px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-border-dark dark:bg-surface-dark dark:text-text-dark"
        >
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>
      </div>
    </div>
  );
}

function Dashboard() {
  const { data, isLoading, error } = useTickets();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 300);

  const tickets = useMemo(() => (data as Ticket[]) ?? [], [data]);

  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      const matchesSearch =
        !debouncedSearch ||
        t.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        t.description.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesStatus = !statusFilter || t.status === statusFilter;
      const matchesPriority = !priorityFilter || t.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tickets, debouncedSearch, statusFilter, priorityFilter]);

  const openCount = tickets.filter((t) => t.status === "Open").length;
  const inProgressCount = tickets.filter((t) => t.status === "In Progress").length;
  const completedCount = tickets.filter((t) => t.status === "Completed").length;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const columns: Column<Ticket>[] = [
    {
      key: "title",
      header: "Title",
      render: (t) => (
        <div className="min-w-0">
          <p className="font-medium text-text dark:text-text-dark truncate">{t.title}</p>
          <p className="max-w-xs truncate text-xs text-muted dark:text-muted-dark">{t.description}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (t) => <StatusBadge status={t.status} />,
    },
    {
      key: "priority",
      header: "Priority",
      render: (t) => <PriorityBadge priority={t.priority} />,
    },
    {
      key: "assigneeName",
      header: "Assignee",
      hideOnMobile: true,
      render: (t) => (
        <span className="text-muted dark:text-muted-dark">{t.assigneeName ?? "—"}</span>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      hideOnMobile: true,
      render: (t) => (
        <span className="text-muted dark:text-muted-dark">
          {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "—"}
        </span>
      ),
    },
  ];

  if (isLoading) return <Skeleton />;

  if (error) {
    return (
      <div className="rounded-lg border border-earth/30 bg-earth/10 p-4 text-earth dark:border-earth/50 dark:bg-earth/20 dark:text-earth">
        Failed to load tickets. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text dark:text-text-dark">Dashboard</h1>
          <p className="text-sm text-muted dark:text-muted-dark">Overview of all tickets</p>
        </div>
        <Link to="/create-ticket" className="sm:self-auto">
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            New Ticket
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Tickets" count={tickets.length} icon={TicketIcon} colorClass="text-text dark:text-text-dark" />
        <StatCard label="Open" count={openCount} icon={AlertCircle} colorClass="text-primary dark:text-primary-light" />
        <StatCard label="In Progress" count={inProgressCount} icon={PlayCircle} colorClass="text-accent dark:text-accent" />
        <StatCard label="Completed" count={completedCount} icon={CheckCircle2} colorClass="text-success dark:text-success" />
      </div>

      <div className="rounded-xl border border-border bg-surface shadow-sm dark:border-border-dark dark:bg-surface-dark overflow-hidden">
        <div className="flex flex-col gap-3 px-4 sm:px-5 py-4 border-b border-border dark:border-border-dark sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-semibold text-text dark:text-text-dark">Tickets</h2>
          <FilterBar
            search={search}
            onSearchChange={(v) => { setSearch(v); setPage(1); }}
            status={statusFilter}
            onStatusChange={(v) => { setStatusFilter(v); setPage(1); }}
            priority={priorityFilter}
            onPriorityChange={(v) => { setPriorityFilter(v); setPage(1); }}
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <DataTable
              columns={columns}
              data={paginated}
              keyExtractor={(t) => t.id}
              onRowClick={(t) => navigate(`/ticket/${t.id}`)}
            />
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
