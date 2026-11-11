import { useQuery } from "@tanstack/react-query";
import { getIssueStatistics } from "../api/issues";
import CountBars from "./CountBars";
import { ErrorBox, Loading } from "./Feedback";
import Stat from "./Stat";
import { card } from "../lib/ui";

export default function IssueStats({ projectId }: { projectId: number }) {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["issue-stats", projectId],
    queryFn: () => getIssueStatistics(projectId),
  });
  if (isPending) return <Loading />;
  if (isError) return <ErrorBox error={error} onRetry={() => refetch()} />;

  return (
    <div className="mb-4">
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Total issues" value={data.totalIssues} />
        <Stat label="Open issues" value={data.openIssues} />
        <Stat label="Open bugs" value={data.openBugs} />
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <div className={card}>
          <h3 className="mb-2 text-sm font-semibold">By status</h3>
          <CountBars data={data.byStatus} />
        </div>
        <div className={card}>
          <h3 className="mb-2 text-sm font-semibold">By type</h3>
          <CountBars data={data.byType} />
        </div>
        <div className={card}>
          <h3 className="mb-2 text-sm font-semibold">By severity</h3>
          <CountBars data={data.bySeverity} />
        </div>
      </div>
      {data.openBugsByAssignee.length > 0 && (
        <p className="mt-3 text-sm text-slate-600">
          Open bugs by assignee:{" "}
          {data.openBugsByAssignee.map((a) => `${a.assigneeName} (${a.openBugs})`).join(", ")}
        </p>
      )}
    </div>
  );
}