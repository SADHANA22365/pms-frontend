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
import { Plus, ListTodo } from "lucide-react";

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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Project Tasks ({list.length})
        </div>
        <button
          className={`${btnPrimary} w-full sm:w-auto`}
          disabled={closed}
          title={closed ? "Tasks can't be added to a completed or cancelled project" : ""}
          onClick={() => setCreating(true)}
        >
          <Plus className="mr-1.5 h-4 w-4" />
          New task
        </button>
      </div>

      {isPending && <Loading label="Loading project tasks..." />}
      {isError && <ErrorBox error={error} onRetry={() => refetch()} />}
      {data && list.length === 0 && (
        <EmptyState
          message="No tasks in this project yet."
          icon={<ListTodo className="h-6 w-6 text-navy/70" />}
          actionLabel={closed ? undefined : "Add first task"}
          onAction={closed ? undefined : () => setCreating(true)}
        />
      )}
      {list.length > 0 && <TaskTable tasks={list} />}
      {pg && <Pagination page={pg.page} totalPages={pg.totalPages} onChange={setPage} />}
      {creating && <TaskFormModal projectId={projectId} onClose={() => setCreating(false)} />}
    </div>
  );
}
