import type { ReactNode } from "react";

type StatVariant = "default" | "danger" | "success" | "warning";

const variantStyles: Record<StatVariant, { icon: string; value: string }> = {
  default: { icon: "bg-navy-soft text-navy", value: "text-navy" },
  danger: { icon: "bg-danger-bg text-danger-text", value: "text-danger-text" },
  success: { icon: "bg-success-bg text-success-text", value: "text-success" },
  warning: { icon: "bg-warning-bg text-warning-text", value: "text-warning-text" },
};

export default function Stat({
  label,
  value,
  icon,
  helper,
  variant = "default",
}: {
  label: string;
  value: string | number;
  icon?: ReactNode;
  helper?: string;
  variant?: StatVariant;
}) {
  const styles = variantStyles[variant];

  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-xs transition-shadow hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            {label}
          </p>
          <p className={`mt-1.5 text-2xl font-bold tracking-tight ${styles.value}`}>
            {value}
          </p>
          {helper && (
            <p className="mt-1 text-xs text-text-muted">{helper}</p>
          )}
        </div>
        {icon && (
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${styles.icon}`}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
