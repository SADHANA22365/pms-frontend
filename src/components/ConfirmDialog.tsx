import Modal from "./Modal";
import { btn, btnDanger } from "../lib/ui";
import { AlertTriangle } from "lucide-react";

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
      <div className="flex items-start gap-3.5 py-1">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-danger-bg text-danger">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm leading-relaxed text-text-main">{message}</p>
        </div>
      </div>
      <div className="mt-6 flex flex-col-reverse sm:flex-row justify-end gap-2.5 pt-4 border-t border-border/70">
        <button type="button" className={btn} onClick={onCancel}>
          Cancel
        </button>
        <button
          type="button"
          className={btnDanger}
          onClick={onConfirm}
          disabled={busy}
        >
          {busy ? "Please wait..." : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
