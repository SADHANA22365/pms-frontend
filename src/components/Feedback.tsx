import type { ReactNode } from "react";
import { AlertCircle, Inbox, RefreshCw } from "lucide-react";
import { getErrorMessage } from "../api/client";
import { btnPrimary } from "../lib/ui";

export function Skeleton({ className = "h-4 w-full" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-surface-muted ${className}`}
      aria-hidden="true"
    />
  );
}

export function Loading({
  label = "Loading...",
  rows = 4,
}: {
  label?: string;
  rows?: number;
}) {
  return (
    <div className="w-full py-10 px-4" role="status" aria-label={label}>
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            {label}
          </span>
        </div>
        <div className="rounded-xl border border-border bg-white p-6 shadow-xs space-y-4">
          <Skeleton className="h-6 w-1/3" />
          <div className="space-y-3 pt-2">
            {Array.from({ length: rows }).map((_, i) => (
              <Skeleton
                key={i}
                className={`h-9 ${i % 2 === 0 ? "w-full" : "w-5/6"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ErrorBox({
  error,
  onRetry,
}: {
  error: unknown;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="my-4 rounded-xl border border-danger-border bg-danger-bg/40 p-4 sm:p-5 text-danger-text"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 shrink-0 text-danger mt-0.5" />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-danger">Something went wrong</h4>
          <p className="mt-1 text-sm text-text-main/90 break-words">{getErrorMessage(error)}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-danger-border bg-white px-3 py-1.5 text-xs font-semibold text-danger hover:bg-danger-bg active:bg-danger-border transition-colors cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Try again</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function EmptyState({
  message,
  actionLabel,
  onAction,
  icon,
}: {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
}) {
  return (
    <div className="my-4 flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-white/70 py-12 px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-soft text-navy mb-3">
        {icon ?? <Inbox className="h-6 w-6 text-navy/70" />}
      </div>
      <p className="text-sm font-medium text-navy max-w-sm">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className={`${btnPrimary} mt-4 text-xs h-9`}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
