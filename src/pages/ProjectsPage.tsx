import { useState } from "react";
import { Link } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { listProjects } from "../api/projects";
import Badge from "../components/Badge";
import { EmptyState, ErrorBox, Loading } from "../components/Feedback";
import Pagination from "../components/Pagination";
import ProjectFormModal from "../components/ProjectFormModal";
import { formatDate, formatEnum } from "../lib/format";
import { btnPrimary, input, link, td, th } from "../lib/ui";
import { PROJECT_STATUSES } from "../types/enums";

export default function ProjectsPage() {
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState("");
  const [creating, setCreating] = useState(false);

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["projects", { page, status }],
    queryFn: () => listProjects(page, status),
    placeholderData: keepPreviousData,
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Projects</h1>
        <div className="flex gap-2">
          <select
            className={`${input} w-44`}
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(0); // a new filter restarts at the first page
            }}
          >
            <option value="">All statuses</option>
            {PROJECT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {formatEnum(s)}
              </option>
            ))}
          </select>
          <button className={btnPrimary} onClick={() => setCreating(true)}>
            New project
          </button>
        </div>
      </div>

      <div className="mt-4">
        {isPending && <Loading />}
        {isError && <ErrorBox error={error} onRetry={() => refetch()} />}
        {data && data.content.length === 0 && <EmptyState message="No projects found." />}
        {data && data.content.length > 0 && (
          <div className="overflow-x-auto rounded border bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-slate-50 text-slate-500">
                <tr>
                  <th className={th}>Name</th>
                  <th className={th}>Status</th>
                  <th className={th}>Manager</th>
                  <th className={th}>Start</th>
                  <th className={th}>End</th>
                </tr>
              </thead>
              <tbody>
                {data.content.map((p) => (
                  <tr key={p.id} className="border-b last:border-0">
                    <td className={td}>
                      <Link to={`/projects/${p.id}`} className={link}>
                        {p.name}
                      </Link>
                    </td>
                    <td className={td}>
                      <Badge value={p.status} />
                    </td>
                    <td className={td}>{p.managerName}</td>
                    <td className={td}>{formatDate(p.startDate)}</td>
                    <td className={td}>{formatDate(p.endDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {data && <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />}
      </div>

      {creating && <ProjectFormModal onClose={() => setCreating(false)} />}
    </div>
  );
}