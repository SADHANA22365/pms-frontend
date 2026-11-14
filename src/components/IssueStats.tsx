import { useQuery } from "@tanstack/react-query";
import { getIssueStatistics } from "../api/issues";
import CountBars from "./CountBars";
import { ErrorBox, Loading } from "./Feedback";
import Stat from "./Stat";
import { card } from "../lib/ui";
import { AlertCircle, Bug, CheckCircle2, User } from "lucide-react";

export default function IssueStats({ projectId }: { projectId: number }) {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["issue-stats", projectId],
    queryFn: () => getIssueStatistics(projectId),
  });
  if (isPending) return <Loading label="Calculating issue metrics..." />;
  if (isError) return <ErrorBox error={error} onRetry={() => refetch()} />;

  return (
    <div className="mb-6 space-y-4">
      {/* Primary Issue Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Stat
          label="Total Issues"
          value={data.totalIssues}
          icon={<AlertCircle className="h-5 w-5 text-navy" />}
        />
        <Stat
          label="Open Issues"
          value={data.openIssues}
          icon={<CheckCircle2 className="h-5 w-5 text-info" />}
          helper={data.openIssues === 0 ? "All resolved" : "Pending resolution"}
        />
        <Stat
          label="Open Bugs"
          value={data.openBugs}
          icon={
            <Bug
              className={`h-5 w-5 ${
                data.openBugs > 0 ? "text-danger" : "text-navy"
              }`}
            />
          }
          helper={data.openBugs > 0 ? "Requires fixing" : "Zero bugs"}
        />
      </div>

      {/* Breakdown by Status, Type, and Severity */}
      <div className="grid gap-3 md:grid-cols-3">
        <div className={card}>
          <h3 className="mb-3 text-sm font-bold text-navy">By status</h3>
          <CountBars data={data.byStatus} />
        </div>
        <div className={card}>
          <h3 className="mb-3 text-sm font-bold text-navy">By type</h3>
          <CountBars data={data.byType} />
        </div>
        <div className={card}>
          <h3 className="mb-3 text-sm font-bold text-navy">By severity</h3>
          <CountBars data={data.bySeverity} />
        </div>
      </div>

      {/* Open Bugs by Assignee summary */}
      {data.openBugsByAssignee.length > 0 && (
        <div className="rounded-xl border border-border bg-white p-3.5 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-navy block mb-2">
            Open bugs by assignee:
          </span>
          <div className="flex flex-wrap gap-2">
            {data.openBugsByAssignee.map((a) => (
              <span
                key={a.assigneeName}
                className="inline-flex items-center gap-1.5 rounded-full border border-danger-border bg-danger-bg/50 px-3 py-1 text-xs font-semibold text-danger-text"
              >
                <User className="h-3 w-3 text-danger shrink-0" />
                <span>{a.assigneeName}</span>
                <span className="rounded-full bg-danger px-1.5 py-0.2 text-[10px] text-white font-bold">
                  {a.openBugs}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
