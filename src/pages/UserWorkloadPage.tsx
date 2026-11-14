import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserWorkload } from "../api/reports";
import CountBars from "../components/CountBars";
import { ErrorBox, Loading } from "../components/Feedback";
import Stat from "../components/Stat";
import PageHeader from "../components/PageHeader";
import { card } from "../lib/ui";
import { ArrowLeft, ListTodo, Clock, Activity, Users } from "lucide-react";

export default function UserWorkloadPage() {
  const id = Number(useParams().userId);
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["workload", id],
    queryFn: () => getUserWorkload(id),
  });

  if (isPending) return <Loading />;
  if (isError) return <ErrorBox error={error} onRetry={() => refetch()} />;

  /* Initials avatar */
  const initials = data.userName
    .split(" ")
    .slice(0, 2)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        to="/users"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-navy transition-colors"
      >
        <ArrowLeft size={15} />
        All Users
      </Link>

      {/* Page header with avatar */}
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-navy-soft text-navy font-bold text-lg select-none">
          {initials}
        </div>
        <PageHeader
          title={`${data.userName}'s Workload`}
          subtitle="Task workload and assignments"
          icon={<Activity size={20} className="text-primary" />}
        />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:max-w-sm">
        <Stat
          label="Open Tasks"
          value={data.openTasks}
          icon={<ListTodo size={18} />}
          helper="In progress"
        />
        <Stat
          label="Overdue Tasks"
          value={data.overdueTasks}
          icon={<Clock size={18} />}
          helper={data.overdueTasks > 0 ? "Needs attention" : "All on track"}
          variant={data.overdueTasks > 0 ? "danger" : "default"}
        />
      </div>

      {/* Workload breakdown */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className={`${card} sm:col-span-2 lg:col-span-2`}>
          <div className="mb-4 flex items-center gap-2">
            <Users size={16} className="text-primary" />
            <h3 className="text-sm font-semibold text-navy">
              Assigned tasks by status
            </h3>
          </div>
          <CountBars data={data.assignedByStatus} />
        </div>

        {/* Summary info card */}
        <div className={`${card} flex flex-col gap-3`}>
          <div className="mb-1 flex items-center gap-2">
            <Activity size={16} className="text-primary" />
            <h3 className="text-sm font-semibold text-navy">Summary</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Total assigned</span>
              <span className="font-semibold text-navy">
                {data.openTasks + data.overdueTasks}
              </span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex justify-between text-sm">
              <span className="text-muted">Open tasks</span>
              <span className="font-semibold text-navy">{data.openTasks}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Overdue tasks</span>
              <span
                className={`font-semibold ${
                  data.overdueTasks > 0 ? "text-danger-text" : "text-success"
                }`}
              >
                {data.overdueTasks}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
