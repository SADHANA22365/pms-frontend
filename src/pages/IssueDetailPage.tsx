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
import { btn, btnDanger, card, input, link } from "../lib/ui";
import { ISSUE_STATUSES, type IssueStatus } from "../types/enums";

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

  if (isPending) return <Loading />;
  if (isError) return <ErrorBox error={error} onRetry={() => refetch()} />;

  const assignable = (members.data ?? []).filter(
    (m) => m.active || m.userId === issue.assigneeId,
  );

  return (
    <div>
      <Link to={`/projects/${issue.projectId}`} className={`text-sm ${link}`}>
        ← Back to project
      </Link>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-2xl font-bold">{issue.title}</h1>
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
          <Badge value={issue.status} />
          <Badge value={issue.severity} />
          <span className="text-sm text-slate-600">{formatEnum(issue.type)}</span>
        </div>
        {issue.description && <p className="mt-3 text-slate-700">{issue.description}</p>}
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
          <div>
            <dt className="text-slate-500">Reporter</dt>
            <dd>{issue.reporterName}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Created</dt>
            <dd>{formatDate(issue.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Resolved</dt>
            <dd>{formatDate(issue.resolvedAt)}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Assignee</dt>
            <dd>
              <select
                className={input}
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
        </dl>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-4">
          <span className="text-sm text-slate-500">Move to:</span>
          {ISSUE_STATUSES.filter((s) => s !== issue.status).map((s) => (
            <button
              key={s}
              className={btn}
              disabled={changeStatus.isPending}
              onClick={() => changeStatus.mutate(s)}
            >
              {formatEnum(s)}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Illegal moves are refused by the backend, and the toast lists the allowed ones.
        </p>
      </div>

      {editing && (
        <IssueFormModal projectId={issue.projectId} issue={issue} onClose={() => setEditing(false)} />
      )}
      {confirmDelete && (
        <ConfirmDialog
          title="Delete issue"
          message={`Delete "${issue.title}"?`}
          busy={remove.isPending}
          onConfirm={() => remove.mutate()}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </div>
  );
}