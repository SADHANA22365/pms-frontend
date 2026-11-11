import Modal from "./Modal";
import Field from "./Field";
import { createIssue, updateIssue } from "../api/issues";
import { fieldErrorsOf } from "../api/client";
import { useApiMutation, useMembers } from "../lib/hooks";
import { useFields } from "../lib/useFields";
import { blankToUndefined, formatEnum } from "../lib/format";
import { btn, btnPrimary, input } from "../lib/ui";
import {
  ISSUE_SEVERITIES,
  ISSUE_TYPES,
  type IssueSeverity,
  type IssueType,
} from "../types/enums";
import type { IssueResponse } from "../types/api";

export default function IssueFormModal({
  projectId,
  issue,
  onClose,
}: {
  projectId: number;
  issue?: IssueResponse;
  onClose: () => void;
}) {
  const members = useMembers(projectId);
  const active = (members.data ?? []).filter((m) => m.active);

  const { values, bind } = useFields({
    title: issue?.title ?? "",
    description: issue?.description ?? "",
    type: issue?.type ?? "BUG",
    severity: issue?.severity ?? "",
    reporterId: "",
    assigneeId: "",
  });

  const save = useApiMutation(
    () => {
      const common = {
        title: values.title.trim(),
        description: blankToUndefined(values.description),
        type: values.type as IssueType,
      };
      if (issue) {
        return updateIssue(issue.id, {
          ...common,
          severity: values.severity as IssueSeverity,
        });
      }
      return createIssue(projectId, {
        ...common,
        severity: (values.severity || undefined) as IssueSeverity | undefined,
        reporterId: Number(values.reporterId),
        assigneeId: values.assigneeId ? Number(values.assigneeId) : undefined,
      });
    },
    issue ? "Issue updated" : "Issue created",
    onClose,
  );
  const fe = fieldErrorsOf(save.error);

  return (
    <Modal title={issue ? "Edit issue" : "New issue"} onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
      >
        <Field label="Title" error={fe.title}>
          <input className={input} {...bind("title")} />
        </Field>
        <Field label="Description (optional)" error={fe.description}>
          <textarea rows={3} className={input} {...bind("description")} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Type" error={fe.type}>
            <select className={input} {...bind("type")}>
              {ISSUE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {formatEnum(t)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Severity" error={fe.severity}>
            <select className={input} required={!!issue} {...bind("severity")}>
              {!issue && <option value="">Default</option>}
              {ISSUE_SEVERITIES.map((s) => (
                <option key={s} value={s}>
                  {formatEnum(s)}
                </option>
              ))}
            </select>
          </Field>
        </div>
        {!issue && (
          <>
            <Field label="Reporter" error={fe.reporterId}>
              <select className={input} required {...bind("reporterId")}>
                <option value="">Who is reporting this?</option>
                {active.map((m) => (
                  <option key={m.userId} value={m.userId}>
                    {m.fullName}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Assignee (optional)" error={fe.assigneeId}>
              <select className={input} {...bind("assigneeId")}>
                <option value="">Unassigned</option>
                {active.map((m) => (
                  <option key={m.userId} value={m.userId}>
                    {m.fullName}
                  </option>
                ))}
              </select>
            </Field>
          </>
        )}
        <div className="flex justify-end gap-2">
          <button type="button" className={btn} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={btnPrimary} disabled={save.isPending}>
            {save.isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
}