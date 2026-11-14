import Modal from "./Modal";
import Field from "./Field";
import { createLabel, updateLabel } from "../api/labels";
import { fieldErrorsOf } from "../api/client";
import { useApiMutation } from "../lib/hooks";
import { useFields } from "../lib/useFields";
import { btn, btnPrimary, input } from "../lib/ui";
import type { LabelResponse } from "../types/api";

export default function LabelFormModal({
  label,
  onClose,
}: {
  label?: LabelResponse;
  onClose: () => void;
}) {
  const { values, bind } = useFields({
    name: label?.name ?? "",
    colourCode: label?.colourCode ?? "#FF8A00",
  });
  const save = useApiMutation(
    () => {
      const body = { name: values.name.trim(), colourCode: values.colourCode };
      return label ? updateLabel(label.id, body) : createLabel(body);
    },
    label ? "Label updated" : "Label created",
    onClose,
  );
  const fe = fieldErrorsOf(save.error);

  return (
    <Modal title={label ? "Edit label" : "New label"} onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
      >
        <Field label="Label Name" error={fe.name}>
          <input className={input} required placeholder="e.g. Bug, Feature, Documentation" {...bind("name")} />
        </Field>

        <Field label="Accent Color" error={fe.colourCode}>
          <div className="flex items-center gap-3">
            <input
              type="color"
              className="h-10 w-16 rounded-lg border border-border p-1 bg-white cursor-pointer"
              {...bind("colourCode")}
            />
            <input
              type="text"
              className={`${input} w-32 font-mono uppercase`}
              placeholder="#FF8A00"
              {...bind("colourCode")}
            />
          </div>
        </Field>

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
