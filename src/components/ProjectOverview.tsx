import { useQuery } from "@tanstack/react-query";
import { getProjectSummary } from "../api/reports";
import CountBars from "./CountBars";
import { ErrorBox, Loading } from "./Feedback";
import Stat from "./Stat";
import { formatDate } from "../lib/format";
import { card } from "../lib/ui";
import { Users, Clock, Calendar } from "lucide-react";

export default function ProjectOverview({ projectId }: { projectId: number }) {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["summary", projectId],
    queryFn: () => getProjectSummary(projectId),
  });
  if (isPending) return <Loading label="Loading project summary..." />;
  if (isError) return <ErrorBox error={error} onRetry={() => refetch()} />;

  const p = data.progress;
  // Assumes progressPercent is 0-100.
  const pct = Math.max(0, Math.min(100, Math.round(p.progressPercent)));

  return (
    <div className="space-y-4">
      {/* Project Completion Progress Bar */}
      <div className={card}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-sm">
          <span className="font-bold text-navy">Project Completion</span>
          <span className="text-xs font-semibold text-text-muted">
            <span className="text-navy font-bold">{p.doneTasks}</span> of{" "}
            <span className="text-navy font-bold">{p.totalTasks}</span> tasks completed ({pct}%)
          </span>
        </div>
        <div className="mt-2.5 h-3 w-full rounded-full bg-navy-subtle overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Overview Metric Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat
          label="Team Members"
          value={data.memberCount}
          icon={<Users className="h-5 w-5 text-navy" />}
        />
        <Stat
          label="Overdue Tasks"
          value={data.overdueTasks}
          icon={
            <Clock
              className={`h-5 w-5 ${
                data.overdueTasks > 0 ? "text-danger" : "text-navy"
              }`}
            />
          }
          helper={data.overdueTasks > 0 ? "Action required" : "On schedule"}
        />
        <Stat
          label="Start Date"
          value={formatDate(data.startDate)}
          icon={<Calendar className="h-5 w-5 text-navy" />}
        />
        <Stat
          label="End Date"
          value={data.endDate ? formatDate(data.endDate) : "Ongoing"}
          icon={<Calendar className="h-5 w-5 text-navy" />}
        />
      </div>

      {/* Task Distribution Breakdown */}
      <div className={card}>
        <h3 className="mb-3 text-sm font-bold text-navy">Tasks by status</h3>
        <CountBars data={p.tasksByStatus} />
      </div>
    </div>
  );
}
