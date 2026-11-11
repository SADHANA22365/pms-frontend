import { useQuery } from "@tanstack/react-query";
import { getProjectSummary } from "../api/reports";
import CountBars from "./CountBars";
import { ErrorBox, Loading } from "./Feedback";
import Stat from "./Stat";
import { formatDate } from "../lib/format";
import { card } from "../lib/ui";

export default function ProjectOverview({ projectId }: { projectId: number }) {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["summary", projectId],
    queryFn: () => getProjectSummary(projectId),
  });
  if (isPending) return <Loading />;
  if (isError) return <ErrorBox error={error} onRetry={() => refetch()} />;

  const p = data.progress;
  // Assumes progressPercent is 0-100. If you see 0-1 values, tell me.
  const pct = Math.max(0, Math.min(100, Math.round(p.progressPercent)));

  return (
    <div>
      <div className={card}>
        <div className="flex justify-between text-sm">
          <span className="font-medium">Progress</span>
          <span>
            {p.doneTasks} of {p.totalTasks} tasks done ({pct}%)
          </span>
        </div>
        <div className="mt-2 h-3 rounded bg-slate-100">
          <div className="h-3 rounded bg-green-500" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Members" value={data.memberCount} />
        <Stat label="Overdue tasks" value={data.overdueTasks} />
        <Stat label="Start" value={formatDate(data.startDate)} />
        <Stat label="End" value={formatDate(data.endDate)} />
      </div>

      <div className={`${card} mt-3`}>
        <h3 className="mb-2 text-sm font-semibold">Tasks by status</h3>
        <CountBars data={p.tasksByStatus} />
      </div>
    </div>
  );
}