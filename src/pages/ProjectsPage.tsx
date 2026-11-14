import { useState } from "react";
import { Link } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { listProjects } from "../api/projects";
import Badge from "../components/Badge";
import { EmptyState, ErrorBox, Loading } from "../components/Feedback";
import Pagination from "../components/Pagination";
import ProjectFormModal from "../components/ProjectFormModal";
import PageHeader from "../components/PageHeader";
import { formatDate, formatEnum } from "../lib/format";
import { btn, btnPrimary, link, td, th } from "../lib/ui";
import { PROJECT_STATUSES } from "../types/enums";
import { Plus, Filter, Calendar, User, ArrowRight } from "lucide-react";

export default function ProjectsPage() {
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState("");
  const [creating, setCreating] = useState(false);

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["projects", { page, status }],
    queryFn: () => listProjects(page, status),
    placeholderData: keepPreviousData,
  });

  return (
    <div>
      <PageHeader
        title="Projects"
        subtitle="Overview and monitoring of all client deliverables and projects."
        action={
          <button className={btnPrimary} onClick={() => setCreating(true)}>
            <Plus className="mr-1.5 h-4 w-4" />
            New project
          </button>
        }
      />

      {/* Filter Row: wrapping row on desktop, full-width on mobile */}
      <div className="mb-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-xl border border-border bg-white p-3.5 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-navy shrink-0" />
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Status Filter
            </span>
          </div>
          <select
            className="w-full sm:w-56 rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-main focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(0);
            }}
          >
            <option value="">All statuses</option>
            {PROJECT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {formatEnum(s)}
              </option>
            ))}
          </select>
        </div>

        {status && (
          <button
            onClick={() => {
              setStatus("");
              setPage(0);
            }}
            className="text-xs font-semibold text-primary hover:text-primary-hover underline self-end sm:self-auto cursor-pointer"
          >
            Reset filter
          </button>
        )}
      </div>

      <div className="mt-4">
        {isPending && <Loading label="Loading projects..." />}
        {isError && <ErrorBox error={error} onRetry={() => refetch()} />}
        {data && data.content.length === 0 && (
          <EmptyState
            message={status ? `No projects with status "${formatEnum(status)}".` : "No projects found."}
            actionLabel={status ? "Clear filter" : "Create first project"}
            onAction={status ? () => setStatus("") : () => setCreating(true)}
          />
        )}

        {data && data.content.length > 0 && (
          <div className="rounded-xl border border-border bg-white shadow-xs overflow-hidden">
            {/* Mobile Stacked Cards (< md) */}
            <div className="divide-y divide-border/60 md:hidden">
              {data.content.map((p) => (
                <div key={p.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      to={`/projects/${p.id}`}
                      className="font-bold text-navy hover:text-primary transition-colors text-base leading-snug"
                    >
                      {p.name}
                    </Link>
                    <Badge value={p.status} />
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-xs text-text-muted pt-1">
                    <div className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-navy/70 shrink-0" />
                      <span className="text-text-main font-medium">{p.managerName}</span>
                      <span className="text-text-muted">(Manager)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-navy/70 shrink-0" />
                      <span>
                        {formatDate(p.startDate)} – {p.endDate ? formatDate(p.endDate) : "Ongoing"}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/40">
                    <Link
                      to={`/projects/${p.id}`}
                      className={`${btn} w-full h-9 text-xs justify-center`}
                    >
                      <span>View Project Details</span>
                      <ArrowRight className="h-3.5 w-3.5 ml-1" />
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
                    <th className={th}>Project Name</th>
                    <th className={th}>Status</th>
                    <th className={th}>Manager</th>
                    <th className={th}>Start Date</th>
                    <th className={th}>End Date</th>
                    <th className={`${th} text-right`}></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {data.content.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-navy-subtle/30 transition-colors"
                    >
                      <td className={td}>
                        <Link
                          to={`/projects/${p.id}`}
                          className={`${link} font-bold text-navy`}
                        >
                          {p.name}
                        </Link>
                      </td>
                      <td className={td}>
                        <Badge value={p.status} />
                      </td>
                      <td className={td}>
                        <div className="flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-navy/60 shrink-0" />
                          <span className="font-medium text-text-main">{p.managerName}</span>
                        </div>
                      </td>
                      <td className={td}>
                        <span className="text-text-muted">{formatDate(p.startDate)}</span>
                      </td>
                      <td className={td}>
                        <span className="text-text-muted">
                          {p.endDate ? formatDate(p.endDate) : <span className="italic">Ongoing</span>}
                        </span>
                      </td>
                      <td className={`${td} text-right`}>
                        <Link
                          to={`/projects/${p.id}`}
                          className={`${btn} h-8 px-2.5 text-xs`}
                        >
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

        {data && (
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            onChange={setPage}
          />
        )}
      </div>

      {creating && <ProjectFormModal onClose={() => setCreating(false)} />}
    </div>
  );
}
