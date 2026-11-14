import { formatEnum } from "../lib/format";

const colors: Record<string, string> = {
  // Project statuses
  PLANNED: "bg-navy-soft text-navy border-navy-border/70",
  ACTIVE: "bg-success-bg text-success-text border-success-border",
  ON_HOLD: "bg-warning-bg text-warning-text border-warning-border",
  COMPLETED: "bg-emerald-50 text-emerald-800 border-emerald-200",
  CANCELLED: "bg-slate-100 text-slate-600 border-slate-200",

  // Task statuses
  TODO: "bg-slate-100 text-slate-700 border-slate-200",
  IN_PROGRESS: "bg-primary-soft text-primary-active border-primary-border",
  IN_REVIEW: "bg-navy-soft text-navy border-navy-border",
  BLOCKED: "bg-danger-bg text-danger-text border-danger-border",
  DONE: "bg-success-bg text-success-text border-success-border",

  // Priority
  LOW: "bg-slate-100 text-slate-600 border-slate-200",
  MEDIUM: "bg-info-bg text-info-text border-info-border",
  HIGH: "bg-primary-soft text-primary-active border-primary-border",
  CRITICAL: "bg-danger-bg text-danger-text border-danger-border",

  // Issue statuses
  OPEN: "bg-info-bg text-info-text border-info-border",
  RESOLVED: "bg-success-bg text-success-text border-success-border",
  CLOSED: "bg-slate-100 text-slate-600 border-slate-200",
  REOPENED: "bg-warning-bg text-warning-text border-warning-border",

  // Issue severities
  MINOR: "bg-slate-100 text-slate-600 border-slate-200",
  MAJOR: "bg-primary-soft text-primary-active border-primary-border",
  BLOCKER: "bg-danger-bg text-danger-text border-danger-border",
};

export default function Badge({ value }: { value: string }) {
  const colorClass = colors[value] ?? "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold ${colorClass}`}
    >
      {formatEnum(value)}
    </span>
  );
}
