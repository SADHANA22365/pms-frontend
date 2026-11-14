import { Link } from "react-router-dom";
import Badge from "./Badge";
import { formatDate } from "../lib/format";
import { link, td, th } from "../lib/ui";
import type { TaskResponse } from "../types/api";
import { Calendar, User, FolderKanban } from "lucide-react";

export default function TaskTable({
  tasks,
  showProject,
}: {
  tasks: TaskResponse[];
  showProject?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-white shadow-xs overflow-hidden">
      {/* Mobile Card List (< md) */}
      <div className="divide-y divide-border/60 md:hidden">
        {tasks.map((t) => (
          <div key={t.id} className="p-4 space-y-2.5 transition-colors hover:bg-navy-soft/20">
            <div className="flex items-start justify-between gap-2">
              <Link
                to={`/tasks/${t.id}`}
                className="font-semibold text-navy hover:text-primary transition-colors text-sm leading-snug"
              >
                {t.title}
              </Link>
              <div className="flex items-center gap-1.5 shrink-0">
                <Badge value={t.priority} />
                <Badge value={t.status} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-text-muted pt-1">
              <div className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-navy/60 shrink-0" />
                <span className="truncate">{t.assigneeName ?? "Unassigned"}</span>
              </div>
              <div className="flex items-center gap-1.5 justify-end">
                <Calendar className="h-3.5 w-3.5 text-navy/60 shrink-0" />
                <span className={t.overdue ? "font-semibold text-danger" : ""}>
                  {formatDate(t.dueDate)}
                  {t.overdue && " (overdue)"}
                </span>
              </div>
            </div>

            {showProject && (
              <div className="flex items-center gap-1.5 text-xs text-text-muted pt-1 border-t border-border/40">
                <FolderKanban className="h-3.5 w-3.5 text-navy/60 shrink-0" />
                <span>Project:</span>
                <Link to={`/projects/${t.projectId}`} className={link}>
                  #{t.projectId}
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop Table (>= md) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <th className={th}>Title</th>
              <th className={th}>Priority</th>
              <th className={th}>Status</th>
              <th className={th}>Assignee</th>
              <th className={th}>Due Date</th>
              {showProject && <th className={th}>Project</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {tasks.map((t) => (
              <tr
                key={t.id}
                className="hover:bg-navy-subtle/30 transition-colors"
              >
                <td className={td}>
                  <Link to={`/tasks/${t.id}`} className={link}>
                    {t.title}
                  </Link>
                </td>
                <td className={td}>
                  <Badge value={t.priority} />
                </td>
                <td className={td}>
                  <Badge value={t.status} />
                </td>
                <td className={td}>
                  <span className="text-text-main font-medium">
                    {t.assigneeName ?? <span className="text-text-muted/60">-</span>}
                  </span>
                </td>
                <td className={td}>
                  <span
                    className={
                      t.overdue
                        ? "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-danger-bg text-danger-text border border-danger-border"
                        : "text-text-main"
                    }
                  >
                    {formatDate(t.dueDate)}
                    {t.overdue && " (overdue)"}
                  </span>
                </td>
                {showProject && (
                  <td className={td}>
                    <Link to={`/projects/${t.projectId}`} className={link}>
                      #{t.projectId}
                    </Link>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
