import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  deleteTask,
  getTask,
  updateTaskAssignee,
  updateTaskStatus,
} from "../api/tasks";
import Badge from "../components/Badge";
import ConfirmDialog from "../components/ConfirmDialog";
import { ErrorBox, Loading } from "../components/Feedback";
import TaskFormModal from "../components/TaskFormModal";
import { useApiMutation, useMembers } from "../lib/hooks";
import { formatDate, formatEnum } from "../lib/format";
import { btn, btnDanger, btnPrimary, card, input, link } from "../lib/ui";
import { TASK_TRANSITIONS, type TaskStatus } from "../types/enums";
import LabelsSection from "../components/LabelsSection";
import CommentsSection from "../components/CommentsSection";

export default function TaskDetailPage() {
  const id = Number(useParams().taskId);
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { data: task, isPending, isError, error, refetch } = useQuery({
    queryKey: ["task", id],
    queryFn: () => getTask(id),
  });
  // Members of the task's project (disabled until the task is loaded).
  const members = useMembers(task?.projectId ?? 0);

  const changeStatus = useApiMutation(
    (s: TaskStatus) => updateTaskStatus(id, s),
    "Status updated",
  );
  const assign = useApiMutation(
    (assigneeId: number | null) => updateTaskAssignee(id, assigneeId),
    "Assignee updated",
  );
  const remove = useApiMutation(() => deleteTask(id), "Task deleted", () =>
    navigate(`/projects/${task?.projectId ?? ""}`),
  );

  if (isPending) return <Loading />;
  if (isError) return <ErrorBox error={error} onRetry={() => refetch()} />;

  const assignable = (members.data ?? []).filter(
    (m) => m.active || m.userId === task.assigneeId,
  );

  return (
    <div>
      <Link to={`/projects/${task.projectId}`} className={`text-sm ${link}`}>
        ← Back to project
      </Link>

      <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-2xl font-bold">{task.title}</h1>
        <div className="flex gap-2">
          <button className={btn} onClick={() => setEditing(true)}>
            Edit
          </button>
          <button className={btnDanger} onClick={() => setConfirmDelete(true)}>
            Delete
          </button>
        </div>
      </div>

      <div className={`${card} mt-4`}>
        <div className="flex flex-wrap items-center gap-2">
          <Badge value={task.status} />
          <Badge value={task.priority} />
          {task.overdue && <span className="text-sm font-medium text-red-600">Overdue</span>}
        </div>
        {task.description && <p className="mt-3 text-slate-700">{task.description}</p>}
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
          <div>
            <dt className="text-slate-500">Reporter</dt>
            <dd>{task.reporterName}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Due</dt>
            <dd>{formatDate(task.dueDate)}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Estimate</dt>
            <dd>{task.estimatedHours != null ? `${task.estimatedHours} h` : "-"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Assignee</dt>
            <dd>
              <select
                className={input}
                value={task.assigneeId ?? ""}
                disabled={assign.isPending}
                onChange={(e) =>
                  assign.mutate(e.target.value === "" ? null : Number(e.target.value))
                }
              >
                <option value="">Unassigned</option>
                {assignable.map((m) => (
                  <option key={m.userId} value={m.userId}>
                    {m.fullName}
                  </option>
                ))}
              </select>
            </dd>
          </div>
        </dl>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-4">
          <span className="text-sm text-slate-500">Move to:</span>
          {TASK_TRANSITIONS[task.status].map((s) => (
            <button
              key={s}
              className={btnPrimary}
              disabled={changeStatus.isPending}
              onClick={() => changeStatus.mutate(s)}
            >
              {formatEnum(s)}
            </button>
          ))}
        </div>
      </div>

      <LabelsSection task={task} />
      <CommentsSection task={task} />

      {editing && (
        <TaskFormModal projectId={task.projectId} task={task} onClose={() => setEditing(false)} />
      )}
      {confirmDelete && (
        <ConfirmDialog
          title="Delete task"
          message={`Delete "${task.title}"?`}
          busy={remove.isPending}
          onConfirm={() => remove.mutate()}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </div>
  );
}