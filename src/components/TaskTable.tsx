import { Link } from "react-router-dom";
import Badge from "./Badge";
import { formatDate } from "../lib/format";
import { link, td, th } from "../lib/ui";
import type { TaskResponse } from "../types/api";

export default function TaskTable({
  tasks,
  showProject,
}: {
  tasks: TaskResponse[];
  showProject?: boolean;
}) {
  return (
    <div className="overflow-x-auto rounded border bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-slate-50 text-slate-500">
          <tr>
            <th className={th}>Title</th>
            <th className={th}>Priority</th>
            <th className={th}>Status</th>
            <th className={th}>Assignee</th>
            <th className={th}>Due</th>
            {showProject && <th className={th}>Project</th>}
          </tr>
        </thead>
        <tbody>
          {tasks.map((t) => (
            <tr key={t.id} className="border-b last:border-0">
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
              <td className={td}>{t.assigneeName ?? <span className="text-slate-400">-</span>}</td>
              <td className={td}>
                <span className={t.overdue ? "font-medium text-red-600" : ""}>
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
  );
}