import Modal from "./Modal";
import { btn, btnDanger } from "../lib/ui";

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = "Delete",
  busy,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  confirmLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p className="text-sm text-slate-600">{message}</p>
      <div className="mt-5 flex justify-end gap-2">
        <button className={btn} onClick={onCancel}>
          Cancel
        </button>
        <button className={btnDanger} onClick={onConfirm} disabled={busy}>
          {busy ? "Please wait..." : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}