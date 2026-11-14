import { useState } from "react";
import { Link } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { listIssues } from "../api/issues";
import Badge from "./Badge";
import { EmptyState, ErrorBox, Loading } from "./Feedback";
import IssueFormModal from "./IssueFormModal";
import IssueStats from "./IssueStats";
import Pagination from "./Pagination";
import { formatEnum } from "../lib/format";
import { items, pageOf } from "../lib/unwrap";
import { btnPrimary, link, td, th } from "../lib/ui";
import { ISSUE_SEVERITIES, ISSUE_STATUSES, ISSUE_TYPES } from "../types/enums";
import { Plus, Filter, User, AlertCircle } from "lucide-react";

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
}) {
  return (
    <select
      className="w-full sm:w-40 rounded-lg border border-border bg-white px-3 py-2 text-xs font-medium text-text-main focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">All {label}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {formatEnum(o)}
        </option>
      ))}
    </select>
  );
}

export default function IssuesPanel({ projectId }: { projectId: number }) {
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [severity, setSeverity] = useState("");
  const [creating, setCreating] = useState(false);

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["issues", projectId, { page, status, type, severity }],
    queryFn: () => listIssues(projectId, { page, status, type, severity }),
    placeholderData: keepPreviousData,
  });
  const list = items(data);
  const pg = pageOf(data);

  // Changing a filter restarts at page 0.
  const filter = (set: (v: string) => void) => (v: string) => {
    set(v);
    setPage(0);
  };

  const hasFilters = status || type || severity;
  const clearFilters = () => {
    setStatus("");
    setType("");
    setSeverity("");
    setPage(0);
  };

  return (
    <div className="space-y-4">
      <IssueStats projectId={projectId} />

      {/* Filter Row: wrapping row on desktop, full-width stacked on mobile */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-xl border border-border bg-white p-3.5 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-navy shrink-0" />
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Filters:
            </span>
          </div>
          <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-2">
            <FilterSelect label="statuses" value={status} options={ISSUE_STATUSES} onChange={filter(setStatus)} />
            <FilterSelect label="types" value={type} options={ISSUE_TYPES} onChange={filter(setType)} />
            <FilterSelect label="severities" value={severity} options={ISSUE_SEVERITIES} onChange={filter(setSeverity)} />
          </div>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-xs font-semibold text-primary hover:text-primary-hover underline cursor-pointer self-end sm:self-auto ml-1"
            >
              Reset
            </button>
          )}
        </div>

        <button
          className={`${btnPrimary} w-full sm:w-auto shrink-0`}
          onClick={() => setCreating(true)}
        >
          <Plus className="mr-1.5 h-4 w-4" />
          New issue
        </button>
      </div>

      {isPending && <Loading label="Loading project issues..." />}
      {isError && <ErrorBox error={error} onRetry={() => refetch()} />}
      {data && list.length === 0 && (
        <EmptyState
          message={hasFilters ? "No issues match your current filters." : "No issues logged for this project yet."}
          icon={<AlertCircle className="h-6 w-6 text-navy/70" />}
          actionLabel={hasFilters ? "Clear filters" : "Report first issue"}
          onAction={hasFilters ? clearFilters : () => setCreating(true)}
        />
      )}

      {list.length > 0 && (
        <div className="rounded-xl border border-border bg-white shadow-xs overflow-hidden">
          {/* Mobile Stacked Cards (< md) */}
          <div className="divide-y divide-border/60 md:hidden">
            {list.map((i) => (
              <div key={i.id} className="p-4 space-y-2.5 transition-colors hover:bg-navy-soft/20">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    to={`/issues/${i.id}`}
                    className="font-bold text-navy hover:text-primary transition-colors text-sm leading-snug"
                  >
                    {i.title}
                  </Link>
                  <Badge value={i.status} />
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-navy bg-navy-soft px-2 py-0.5 rounded">
                    {formatEnum(i.type)}
                  </span>
                  <Badge value={i.severity} />
                </div>

                <div className="flex items-center justify-between text-xs text-text-muted pt-1 border-t border-border/40">
                  <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-navy/60 shrink-0" />
                    <span>{i.assigneeName ?? "Unassigned"}</span>
                  </div>
                  <Link to={`/issues/${i.id}`} className={link}>
                    View issue →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table (>= md) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr>
                  <th className={th}>Title</th>
                  <th className={th}>Type</th>
                  <th className={th}>Severity</th>
                  <th className={th}>Status</th>
                  <th className={th}>Assignee</th>
                  <th className={`${th} text-right`}></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {list.map((i) => (
                  <tr
                    key={i.id}
                    className="hover:bg-navy-subtle/30 transition-colors"
                  >
                    <td className={td}>
                      <Link to={`/issues/${i.id}`} className={`${link} font-semibold text-navy`}>
                        {i.title}
                      </Link>
                    </td>
                    <td className={td}>
                      <span className="font-medium text-navy text-xs bg-navy-soft px-2 py-0.5 rounded">
                        {formatEnum(i.type)}
                      </span>
                    </td>
                    <td className={td}>
                      <Badge value={i.severity} />
                    </td>
                    <td className={td}>
                      <Badge value={i.status} />
                    </td>
                    <td className={td}>
                      <span className="text-text-main font-medium">
                        {i.assigneeName ?? <span className="text-text-muted/60">-</span>}
                      </span>
                    </td>
                    <td className={`${td} text-right`}>
                      <Link to={`/issues/${i.id}`} className={link}>
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {pg && <Pagination page={pg.page} totalPages={pg.totalPages} onChange={setPage} />}
      {creating && <IssueFormModal projectId={projectId} onClose={() => setCreating(false)} />}
    </div>
  );
}
