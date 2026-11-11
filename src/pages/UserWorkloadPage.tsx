import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserWorkload } from "../api/reports";
import CountBars from "../components/CountBars";
import { ErrorBox, Loading } from "../components/Feedback";
import Stat from "../components/Stat";
import { card, link } from "../lib/ui";

export default function UserWorkloadPage() {
  const id = Number(useParams().userId);
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["workload", id],
    queryFn: () => getUserWorkload(id),
  });
  if (isPending) return <Loading />;
  if (isError) return <ErrorBox error={error} onRetry={() => refetch()} />;

  return (
    <div>
      <Link to="/users" className={`text-sm ${link}`}>
        ← All users
      </Link>
      <h1 className="mt-2 text-2xl font-bold">Workload: {data.userName}</h1>
      <div className="mt-4 grid grid-cols-2 gap-3 md:max-w-md">
        <Stat label="Open tasks" value={data.openTasks} />
        <Stat label="Overdue tasks" value={data.overdueTasks} />
      </div>
      <div className={`${card} mt-3 md:max-w-md`}>
        <h3 className="mb-2 text-sm font-semibold">Assigned tasks by status</h3>
        <CountBars data={data.assignedByStatus} />
      </div>
    </div>
  );
}