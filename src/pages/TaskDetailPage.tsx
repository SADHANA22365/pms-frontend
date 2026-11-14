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
import { btn, btnDanger, btnPrimary, card, link } from "../lib/ui";
import { TASK_TRANSITIONS, type TaskStatus } from "../types/enums";
import LabelsSection from "../components/LabelsSection";
import CommentsSection from "../components/CommentsSection";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  FolderKanban,
  Edit,
  Trash2,
  CheckCircle2,
} from "lucide-react";

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

  if (isPending) return <Loading label="Loading task details..." />;
  if (isError) return <ErrorBox error={error} onRetry={() => refetch()} />;

  const assignable = (members.data ?? []).filter(
    (m) => m.active || m.userId === task.assigneeId,
  );

  const transitions = TASK_TRANSITIONS[task.status];

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Link
          to={`/projects/${task.projectId}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Project #{task.projectId}</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            className={`${btn} h-9 text-xs`}
            onClick={() => setEditing(true)}
          >
            <Edit className="h-3.5 w-3.5 mr-1" />
            Edit Task
          </button>
          <button
            className={`${btnDanger} h-9 text-xs`}
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Delete
          </button>
        </div>
      </div>

      {/* Two-Column Responsive Layout (Main Content Left, Details Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content (Left, 2 cols on lg) */}
        <div className="lg:col-span-2 space-y-6">
          <div className={card}>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge value={task.status} />
              <Badge value={task.priority} />
              {task.overdue && (
                <span className="inline-flex items-center gap-1 rounded-full border border-danger-border bg-danger-bg px-2.5 py-0.5 text-xs font-semibold text-danger">
                  <Clock className="h-3 w-3" />
                  Overdue
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-navy">
              {task.title}
            </h1>

            <div className="mt-4 pt-4 border-t border-border/60">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                Description
              </h3>
              {task.description ? (
                <p className="text-sm text-text-main leading-relaxed whitespace-pre-line">
                  {task.description}
                </p>
              ) : (
                <p className="text-sm text-text-muted italic">
                  No description provided for this task.
                </p>
              )}
            </div>
          </div>

          {/* Attached Labels Section */}
          <LabelsSection task={task} />

          {/* Comments and Discussion Thread */}
          <CommentsSection task={task} />
        </div>

        {/* Details Side Panel (Right, 1 col on lg) */}
        <div className="space-y-6">
          {/* Status Transitions Card */}
          <div className={card}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy mb-3 pb-2 border-b border-border/60">
              Workflow & Status
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-text-muted block mb-1">Current State:</span>
                <Badge value={task.status} />
              </div>

              {transitions.length > 0 ? (
                <div className="pt-2 border-t border-border/40">
                  <span className="text-xs font-medium text-navy block mb-2">
                    Move to state:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {transitions.map((s) => (
                      <button
                        key={s}
                        className={`${btnPrimary} h-8 px-3 text-xs`}
                        disabled={changeStatus.isPending}
                        onClick={() => changeStatus.mutate(s)}
                      >
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        {formatEnum(s)}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-text-muted italic pt-2">
                  No further status transitions available.
                </p>
              )}
            </div>
          </div>

          {/* Task Details Side Panel */}
          <div className={card}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy mb-3 pb-2 border-b border-border/60">
              Task Attributes
            </h3>

            <dl className="space-y-4 text-xs">
              {/* Assignee */}
              <div>
                <dt className="text-text-muted font-medium mb-1.5 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-navy/70" />
                  <span>Assignee</span>
                </dt>
                <dd>
                  <select
                    className="w-full h-9 rounded-lg border border-border bg-white px-3 text-xs font-semibold text-navy focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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

              {/* Reporter */}
              <div>
                <dt className="text-text-muted font-medium mb-1 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-navy/70" />
                  <span>Reporter</span>
                </dt>
                <dd className="font-semibold text-navy pl-5">
                  {task.reporterName}
                </dd>
              </div>

              {/* Due Date */}
              <div>
                <dt className="text-text-muted font-medium mb-1 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-navy/70" />
                  <span>Due Date</span>
                </dt>
                <dd className={`pl-5 font-semibold ${task.overdue ? "text-danger" : "text-navy"}`}>
                  {formatDate(task.dueDate)}
                  {task.overdue && " (Overdue)"}
                </dd>
              </div>

              {/* Estimated Hours */}
              <div>
                <dt className="text-text-muted font-medium mb-1 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-navy/70" />
                  <span>Estimated Effort</span>
                </dt>
                <dd className="font-semibold text-navy pl-5">
                  {task.estimatedHours != null ? `${task.estimatedHours} hours` : "Not estimated"}
                </dd>
              </div>

              {/* Project */}
              <div className="pt-2 border-t border-border/40">
                <dt className="text-text-muted font-medium mb-1 flex items-center gap-1.5">
                  <FolderKanban className="h-3.5 w-3.5 text-navy/70" />
                  <span>Project</span>
                </dt>
                <dd className="pl-5">
                  <Link to={`/projects/${task.projectId}`} className={link}>
                    Project #{task.projectId}
                  </Link>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {editing && (
        <TaskFormModal projectId={task.projectId} task={task} onClose={() => setEditing(false)} />
      )}
      {confirmDelete && (
        <ConfirmDialog
          title="Delete task"
          message={`Are you sure you want to delete "${task.title}"?`}
          busy={remove.isPending}
          onConfirm={() => remove.mutate()}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </div>
  );
}
