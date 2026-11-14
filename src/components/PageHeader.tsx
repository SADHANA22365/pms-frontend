import type { ReactNode } from "react";

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  badge?: ReactNode;
  breadcrumbs?: ReactNode;
  icon?: ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  action,
  badge,
  breadcrumbs,
  icon,
}: PageHeaderProps) {
  return (
    <div className="mb-6 border-b border-border/60 pb-2">
      {breadcrumbs && (
        <div className="mb-2 text-xs text-text-muted">{breadcrumbs}</div>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            {icon && (
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft">
                {icon}
              </span>
            )}
            <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
              {title}
            </h1>
            {badge && <div className="inline-flex shrink-0">{badge}</div>}
          </div>
          {subtitle && (
            <p className="mt-1 text-sm leading-relaxed text-text-muted">
              {subtitle}
            </p>
          )}
        </div>
        {action && (
          <div className="w-full shrink-0 sm:w-auto flex flex-wrap items-center gap-2.5 [&>button]:w-full sm:[&>button]:w-auto [&>a]:w-full sm:[&>a]:w-auto">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
