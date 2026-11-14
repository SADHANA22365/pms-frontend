import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "../api/reports";
import CountBars from "../components/CountBars";
import { ErrorBox, Loading } from "../components/Feedback";
import Stat from "../components/Stat";
import PageHeader from "../components/PageHeader";
import { card } from "../lib/ui";
import {
  FolderKanban,
  ListTodo,
  Clock,
  Users,
  ArrowRight,
  TrendingUp,
  Tag,
} from "lucide-react";

const quickLinks = [
  {
    label: "Projects",
    desc: "View and manage all projects",
    to: "/projects",
    icon: FolderKanban,
    color: "bg-navy-soft text-navy",
  },
  {
    label: "Users",
    desc: "Manage team members",
    to: "/users",
    icon: Users,
    color: "bg-navy-soft text-navy",
  },
  {
    label: "Overdue Tasks",
    desc: "Tasks past their due date",
    to: "/tasks/overdue",
    icon: Clock,
    color: "bg-danger-bg text-danger-text",
  },
  {
    label: "Labels",
    desc: "Organise tasks with labels",
    to: "/labels",
    icon: Tag,
    color: "bg-primary-soft text-primary-active",
  },
];

export default function HomePage() {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back — here's what's happening across your projects."
        icon={<TrendingUp size={20} className="text-primary" />}
      />

      {isPending && <Loading />}
      {isError && (
        <div className="mt-2">
          <ErrorBox error={error} onRetry={() => refetch()} />
        </div>
      )}

      {data && (
        <>
          {/* ── Stat cards ──────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Stat
              label="Total Projects"
              value={data.totalProjects}
              icon={<FolderKanban size={18} />}
            />
            <Stat
              label="Total Tasks"
              value={data.totalTasks}
              icon={<ListTodo size={18} />}
            />
            <Stat
              label="Overdue Tasks"
              value={data.overdueTasks}
              icon={<Clock size={18} />}
              helper={data.overdueTasks > 0 ? "Needs attention" : "All on track"}
              variant={data.overdueTasks > 0 ? "danger" : "default"}
            />
            <Stat
              label="Active / Total Users"
              value={`${data.activeUsers} / ${data.totalUsers}`}
              icon={<Users size={18} />}
              helper="Team members"
            />
          </div>

          {/* ── Charts ──────────────────────────────────────── */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className={card}>
              <h2 className="mb-4 text-base font-semibold text-navy">
                Projects by status
              </h2>
              <CountBars data={data.projectsByStatus} />
            </div>
            <div className={card}>
              <h2 className="mb-4 text-base font-semibold text-navy">
                Tasks by status
              </h2>
              <CountBars data={data.tasksByStatus} />
            </div>
          </div>

          {/* ── Quick links ─────────────────────────────────── */}
          <div>
            <h2 className="mb-3 text-base font-semibold text-navy">
              Quick links
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {quickLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="group flex items-center gap-3 rounded-xl border border-border bg-surface p-4 shadow-xs transition hover:border-primary hover:shadow-sm focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${item.color}`}
                    >
                      <Icon size={18} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-navy">
                        {item.label}
                      </p>
                      <p className="text-xs text-muted">{item.desc}</p>
                    </div>
                    <ArrowRight
                      size={14}
                      className="shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-primary"
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
