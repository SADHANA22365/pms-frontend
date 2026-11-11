import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "../api/reports";
import CountBars from "../components/CountBars";
import { ErrorBox, Loading } from "../components/Feedback";
import Stat from "../components/Stat";
import { card } from "../lib/ui";

export default function HomePage() {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {isPending && <Loading />}
      {isError && (
        <div className="mt-4">
          <ErrorBox error={error} onRetry={() => refetch()} />
        </div>
      )}
      {data && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            <Stat label="Projects" value={data.totalProjects} />
            <Stat label="Tasks" value={data.totalTasks} />
            <Stat label="Overdue tasks" value={data.overdueTasks} />
            <Stat label="Active / total users" value={`${data.activeUsers} / ${data.totalUsers}`} />
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className={card}>
              <h2 className="mb-2 font-semibold">Projects by status</h2>
              <CountBars data={data.projectsByStatus} />
            </div>
            <div className={card}>
              <h2 className="mb-2 font-semibold">Tasks by status</h2>
              <CountBars data={data.tasksByStatus} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}