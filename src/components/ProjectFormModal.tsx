import Modal from "./Modal";
import Field from "./Field";
import { createProject, updateProject } from "../api/projects";
import { fieldErrorsOf } from "../api/client";
import { useAllUsers, useApiMutation } from "../lib/hooks";
import { useFields } from "../lib/useFields";
import { blankToUndefined } from "../lib/format";
import { btn, btnPrimary, input } from "../lib/ui";
import type { ProjectResponse } from "../types/api";

export default function ProjectFormModal({
  project,
  onClose,
}: {
  project?: ProjectResponse;
  onClose: () => void;
}) {
  const users = useAllUsers();
  const activeUsers = (users.data?.content ?? []).filter((u) => u.active);

  const { values, bind } = useFields({
    name: project?.name ?? "",
    description: project?.description ?? "",
    startDate: project?.startDate ?? "",
    endDate: project?.endDate ?? "",
    managerId: "",
  });

  const save = useApiMutation(
    () => {
      const base = {
        name: values.name.trim(),
        description: blankToUndefined(values.description),
        startDate: values.startDate,
        endDate: blankToUndefined(values.endDate),
      };
      return project
        ? updateProject(project.id, base)
        : createProject({ ...base, managerId: Number(values.managerId) });
    },
    project ? "Project updated" : "Project created",
    onClose,
  );
  const fe = fieldErrorsOf(save.error);

  return (
    <Modal title={project ? "Edit project" : "New project"} onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
      >
        <Field label="Name" error={fe.name}>
          <input className={input} {...bind("name")} />
        </Field>
        <Field label="Description (optional)" error={fe.description}>
          <textarea rows={3} className={input} {...bind("description")} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Start date" error={fe.startDate}>
            <input type="date" className={input} {...bind("startDate")} />
          </Field>
          <Field label="End date (optional)" error={fe.endDate}>
            <input type="date" className={input} {...bind("endDate")} />
          </Field>
        </div>
        {!project && (
          <Field label="Manager" error={fe.managerId}>
            <select className={input} required {...bind("managerId")}>
              <option value="">Select a manager...</option>
              {activeUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.fullName}
                </option>
              ))}
            </select>
          </Field>
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