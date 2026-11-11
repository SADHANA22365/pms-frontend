import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { listProjectTasks } from "../api/tasks";
import { EmptyState, ErrorBox, Loading } from "./Feedback";
import Pagination from "./Pagination";
import TaskFormModal from "./TaskFormModal";
import TaskTable from "./TaskTable";
import { items, pageOf } from "../lib/unwrap";
import { btnPrimary } from "../lib/ui";
import type { ProjectStatus } from "../types/enums";

export default function TasksPanel({
  projectId,
  projectStatus,
}: {
  projectId: number;
  projectStatus: ProjectStatus;
}) {
  const [page, setPage] = useState(0);
  const [creating, setCreating] = useState(false);
  const closed = projectStatus === "COMPLETED" || projectStatus === "CANCELLED";

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["tasks", projectId, { page }],
    queryFn: () => listProjectTasks(projectId, page),
    placeholderData: keepPreviousData,
  });
  const list = items(data);
  const pg = pageOf(data);

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <button
          className={btnPrimary}
          disabled={closed}
          title={closed ? "Tasks can't be added to a completed or cancelled project" : ""}
          onClick={() => setCreating(true)}
        >
          New task
        </button>
      </div>
      {isPending && <Loading />}
      {isError && <ErrorBox error={error} onRetry={() => refetch()} />}
      {data && list.length === 0 && <EmptyState message="No tasks in this project yet." />}
      {list.length > 0 && <TaskTable tasks={list} />}
      {pg && <Pagination page={pg.page} totalPages={pg.totalPages} onChange={setPage} />}
      {creating && <TaskFormModal projectId={projectId} onClose={() => setCreating(false)} />}
    </div>
  );
}