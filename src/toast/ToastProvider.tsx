import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { ToastContext, type ToastApi } from "./toast-context";

interface ToastItem {
  id: number;
  type: "success" | "error";
  message: string;
}

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (type: ToastItem["type"], message: string) => {
      const id = nextId.current++;
      setToasts((list) => [...list, { id, type, message }]);
      window.setTimeout(() => dismiss(id), 5000);
    },
    [dismiss],
  );

  // Stable object, so it is safe to capture in the query client.
  const api = useMemo<ToastApi>(
    () => ({
      success: (m) => push("success", m),
      error: (m) => push("error", m),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        className="fixed top-3 inset-x-3 sm:inset-x-auto sm:right-5 sm:top-5 z-50 flex flex-col gap-2.5 sm:w-96 pointer-events-none"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="alert"
            className={`pointer-events-auto flex items-start justify-between gap-3 rounded-xl border bg-white p-4 text-sm shadow-md transition-all ${
              t.type === "error"
                ? "border-border border-l-4 border-l-danger text-text-main"
                : "border-border border-l-4 border-l-success text-text-main"
            }`}
          >
            <div className="flex items-start gap-2.5 min-w-0">
              {t.type === "error" ? (
                <AlertCircle className="h-5 w-5 shrink-0 text-danger mt-0.5" />
              ) : (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-success mt-0.5" />
              )}
              <span className="font-medium text-text-main leading-snug break-words">
                {t.message}
              </span>
            </div>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss"
              className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-text-muted hover:text-navy hover:bg-navy-soft transition-colors cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
