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
import { btnPrimary, input, link, td, th } from "../lib/ui";
import { ISSUE_SEVERITIES, ISSUE_STATUSES, ISSUE_TYPES } from "../types/enums";

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
    <select className={`${input} w-40`} value={value} onChange={(e) => onChange(e.target.value)}>
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

  return (
    <div>
      <IssueStats projectId={projectId} />

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <FilterSelect label="statuses" value={status} options={ISSUE_STATUSES} onChange={filter(setStatus)} />
          <FilterSelect label="types" value={type} options={ISSUE_TYPES} onChange={filter(setType)} />
          <FilterSelect label="severities" value={severity} options={ISSUE_SEVERITIES} onChange={filter(setSeverity)} />
        </div>
        <button className={btnPrimary} onClick={() => setCreating(true)}>
          New issue
        </button>
      </div>

      {isPending && <Loading />}
      {isError && <ErrorBox error={error} onRetry={() => refetch()} />}
      {data && list.length === 0 && <EmptyState message="No issues found." />}
      {list.length > 0 && (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-slate-50 text-slate-500">
              <tr>
                <th className={th}>Title</th>
                <th className={th}>Type</th>
                <th className={th}>Severity</th>
                <th className={th}>Status</th>
                <th className={th}>Assignee</th>
              </tr>
            </thead>
            <tbody>
              {list.map((i) => (
                <tr key={i.id} className="border-b last:border-0">
                  <td className={td}>
                    <Link to={`/issues/${i.id}`} className={link}>
                      {i.title}
                    </Link>
                  </td>
                  <td className={td}>{formatEnum(i.type)}</td>
                  <td className={td}>
                    <Badge value={i.severity} />
                  </td>
                  <td className={td}>
                    <Badge value={i.status} />
                  </td>
                  <td className={td}>{i.assigneeName ?? <span className="text-slate-400">-</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {pg && <Pagination page={pg.page} totalPages={pg.totalPages} onChange={setPage} />}
      {creating && <IssueFormModal projectId={projectId} onClose={() => setCreating(false)} />}
    </div>
  );
}