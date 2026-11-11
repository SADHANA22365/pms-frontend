import { formatEnum } from "../lib/format";

const colors: Record<string, string> = {
  PLANNED: "bg-slate-100 text-slate-700",
  ACTIVE: "bg-green-100 text-green-700",
  ON_HOLD: "bg-amber-100 text-amber-700",
  COMPLETED: "bg-blue-100 text-blue-700",
  CANCELLED: "bg-red-100 text-red-700",
  TODO: "bg-slate-100 text-slate-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  IN_REVIEW: "bg-purple-100 text-purple-700",
  BLOCKED: "bg-red-100 text-red-700",
  DONE: "bg-green-100 text-green-700",
  LOW: "bg-slate-100 text-slate-600",
  MEDIUM: "bg-sky-100 text-sky-700",
  HIGH: "bg-orange-100 text-orange-700",
  CRITICAL: "bg-red-100 text-red-700",
  OPEN: "bg-amber-100 text-amber-700",
  RESOLVED: "bg-green-100 text-green-700",
  CLOSED: "bg-slate-200 text-slate-700",
  REOPENED: "bg-orange-100 text-orange-700",
  MINOR: "bg-slate-100 text-slate-600",
  MAJOR: "bg-orange-100 text-orange-700",
  BLOCKER: "bg-red-200 text-red-800",
};

export default function Badge({ value }: { value: string }) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded px-2 py-0.5 text-xs font-medium ${
        colors[value] ?? "bg-slate-100 text-slate-700"
      }`}
    >
      {formatEnum(value)}
    </span>
  );
}