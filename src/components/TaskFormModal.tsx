import Modal from "./Modal";
import Field from "./Field";
import { createTask, updateTask } from "../api/tasks";
import { fieldErrorsOf } from "../api/client";
import { useApiMutation, useMembers } from "../lib/hooks";
import { useFields } from "../lib/useFields";
import { blankToUndefined, formatEnum } from "../lib/format";
import { btn, btnPrimary, input } from "../lib/ui";
import { TASK_PRIORITIES, type TaskPriority } from "../types/enums";
import type { TaskResponse } from "../types/api";

export default function TaskFormModal({
  projectId,
  task,
  onClose,
}: {
  projectId: number;
  task?: TaskResponse;
  onClose: () => void;
}) {
  const members = useMembers(projectId);
  const active = (members.data ?? []).filter((m) => m.active);

  const { values, bind } = useFields({
    title: task?.title ?? "",
    description: task?.description ?? "",
    priority: task?.priority ?? "MEDIUM",
    dueDate: task?.dueDate ?? "",
    estimatedHours: task?.estimatedHours != null ? String(task.estimatedHours) : "",
    reporterId: "",
    assigneeId: "",
  });

  const save = useApiMutation(
    () => {
      const hours = blankToUndefined(values.estimatedHours);
      const common = {
        title: values.title.trim(),
        description: blankToUndefined(values.description),
        priority: values.priority as TaskPriority,
        dueDate: blankToUndefined(values.dueDate),
        estimatedHours: hours ? Number(hours) : undefined,
      };
      return task
        ? updateTask(task.id, common)
        : createTask(projectId, {
            ...common,
            reporterId: Number(values.reporterId),
            assigneeId: values.assigneeId ? Number(values.assigneeId) : undefined,
          });
    },
    task ? "Task updated" : "Task created",
    onClose,
  );
  const fe = fieldErrorsOf(save.error);

  return (
    <Modal title={task ? "Edit task" : "New task"} onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
      >
        <Field label="Task Title" error={fe.title}>
          <input className={input} required placeholder="e.g. Implement user authentication" {...bind("title")} />
        </Field>

        <Field label="Description (optional)" error={fe.description}>
          <textarea rows={3} className={input} placeholder="Provide details, scope, or context..." {...bind("description")} />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="Priority" error={fe.priority}>
            <select className={input} {...bind("priority")}>
              {TASK_PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {formatEnum(p)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Due date" error={fe.dueDate}>
            <input type="date" className={input} {...bind("dueDate")} />
          </Field>
          <Field label="Est. hours" error={fe.estimatedHours}>
            <input type="number" step="0.5" className={input} placeholder="e.g. 4.0" {...bind("estimatedHours")} />
          </Field>
        </div>

        {!task && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
          </div>
        )}

        <div className="sticky bottom-0 -mx-5 -mb-4 mt-6 flex flex-col-reverse sm:flex-row justify-end gap-2.5 border-t border-border bg-white px-5 py-3.5">
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
