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
    colourCode: label?.colourCode ?? "#4f46e5",
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
        <Field label="Name" error={fe.name}>
          <input className={input} {...bind("name")} />
        </Field>
        <Field label="Colour" error={fe.colourCode}>
          <input type="color" className="h-9 w-20 rounded border" {...bind("colourCode")} />
        </Field>
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