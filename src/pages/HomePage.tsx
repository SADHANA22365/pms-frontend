import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import { getDashboard } from "../api/reports";
import { ErrorBox, Loading } from "../components/Feedback";
import type { UserResponse } from "../types/api";

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded border bg-white p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}

export default function HomePage() {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
  });

  // TEMPORARY (remove in F3): a 404 from the backend should appear as a red toast.
  const test404 = useMutation({
    mutationFn: () => api.get<UserResponse>("/users/999999"),
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
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
          <Stat label="Projects" value={data.totalProjects} />
          <Stat label="Tasks" value={data.totalTasks} />
          <Stat label="Overdue tasks" value={data.overdueTasks} />
          <Stat label="Active / total users" value={`${data.activeUsers} / ${data.totalUsers}`} />
        </div>
      )}

      <button
        onClick={() => test404.mutate()}
        className="mt-6 rounded border px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
      >
        Test error toast (404)
      </button>
    </div>
  );
}