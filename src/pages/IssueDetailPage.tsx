import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  deleteIssue,
  getIssue,
  updateIssueAssignee,
  updateIssueStatus,
} from "../api/issues";
import Badge from "../components/Badge";
import ConfirmDialog from "../components/ConfirmDialog";
import { ErrorBox, Loading } from "../components/Feedback";
import IssueFormModal from "../components/IssueFormModal";
import { useApiMutation, useMembers } from "../lib/hooks";
import { formatDate, formatEnum } from "../lib/format";
import { btn, btnDanger, btnPrimary, card, link } from "../lib/ui";
import { ISSUE_STATUSES, type IssueStatus } from "../types/enums";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  FolderKanban,
  User,
  Edit,
  Trash2,
} from "lucide-react";

export default function IssueDetailPage() {
  const id = Number(useParams().issueId);
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { data: issue, isPending, isError, error, refetch } = useQuery({
    queryKey: ["issue", id],
    queryFn: () => getIssue(id),
  });
  const members = useMembers(issue?.projectId ?? 0);

  const changeStatus = useApiMutation(
    (s: IssueStatus) => updateIssueStatus(id, s),
    "Status updated",
  );
  const assign = useApiMutation(
    (assigneeId: number | null) => updateIssueAssignee(id, assigneeId),
    "Assignee updated",
  );
  const remove = useApiMutation(() => deleteIssue(id), "Issue deleted", () =>
    navigate(`/projects/${issue?.projectId ?? ""}`),
  );

  if (isPending) return <Loading label="Loading issue details..." />;
  if (isError) return <ErrorBox error={error} onRetry={() => refetch()} />;

  const assignable = (members.data ?? []).filter(
    (m) => m.active || m.userId === issue.assigneeId,
  );

  const otherStatuses = ISSUE_STATUSES.filter((s) => s !== issue.status);

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Link
          to={`/projects/${issue.projectId}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Project #{issue.projectId}</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            className={`${btn} h-9 text-xs`}
            onClick={() => setEditing(true)}
          >
            <Edit className="h-3.5 w-3.5 mr-1" />
            Edit Issue
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
              <Badge value={issue.status} />
              <Badge value={issue.severity} />
              <span className="font-semibold text-xs text-navy bg-navy-soft px-2.5 py-0.5 rounded-full border border-navy-border/50">
                {formatEnum(issue.type)}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-navy">
              {issue.title}
            </h1>

            <div className="mt-4 pt-4 border-t border-border/60">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                Description
              </h3>
              {issue.description ? (
                <p className="text-sm text-text-main leading-relaxed whitespace-pre-line">
                  {issue.description}
                </p>
              ) : (
                <p className="text-sm text-text-muted italic">
                  No description provided for this issue.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Details Side Panel (Right, 1 col on lg) */}
        <div className="space-y-6">
          {/* Status Transitions Card */}
          <div className={card}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy mb-3 pb-2 border-b border-border/60">
              Workflow Status
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-text-muted block mb-1">Current State:</span>
                <Badge value={issue.status} />
              </div>

              <div className="pt-2 border-t border-border/40">
                <span className="text-xs font-medium text-navy block mb-2">
                  Transition to state:
                </span>
                <div className="flex flex-wrap gap-2">
                  {otherStatuses.map((s) => (
                    <button
                      key={s}
                      className={`${btnPrimary} h-8 px-2.5 text-xs`}
                      disabled={changeStatus.isPending}
                      onClick={() => changeStatus.mutate(s)}
                    >
                      {formatEnum(s)}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-[11px] text-text-muted leading-tight">
                  Status transitions follow project workflow permissions.
                </p>
              </div>
            </div>
          </div>

          {/* Issue Details Side Panel */}
          <div className={card}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy mb-3 pb-2 border-b border-border/60">
              Issue Attributes
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
                    value={issue.assigneeId ?? ""}
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
                  {issue.reporterName}
                </dd>
              </div>

              {/* Created Date */}
              <div>
                <dt className="text-text-muted font-medium mb-1 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-navy/70" />
                  <span>Created On</span>
                </dt>
                <dd className="pl-5 font-semibold text-navy">
                  {formatDate(issue.createdAt)}
                </dd>
              </div>

              {/* Resolved Date */}
              <div>
                <dt className="text-text-muted font-medium mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-navy/70" />
                  <span>Resolved On</span>
                </dt>
                <dd className="pl-5 font-semibold text-navy">
                  {issue.resolvedAt ? formatDate(issue.resolvedAt) : <span className="text-text-muted font-normal italic">Unresolved</span>}
                </dd>
              </div>

              {/* Project */}
              <div className="pt-2 border-t border-border/40">
                <dt className="text-text-muted font-medium mb-1 flex items-center gap-1.5">
                  <FolderKanban className="h-3.5 w-3.5 text-navy/70" />
                  <span>Project</span>
                </dt>
                <dd className="pl-5">
                  <Link to={`/projects/${issue.projectId}`} className={link}>
                    Project #{issue.projectId}
                  </Link>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {editing && (
        <IssueFormModal projectId={issue.projectId} issue={issue} onClose={() => setEditing(false)} />
      )}
      {confirmDelete && (
        <ConfirmDialog
          title="Delete issue"
          message={`Are you sure you want to delete "${issue.title}"?`}
          busy={remove.isPending}
          onConfirm={() => remove.mutate()}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </div>
  );
}
