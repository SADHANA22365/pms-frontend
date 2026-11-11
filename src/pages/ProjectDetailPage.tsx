import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { deleteProject, getProject, updateProjectStatus } from "../api/projects";
import Badge from "../components/Badge";
import ConfirmDialog from "../components/ConfirmDialog";
import { ErrorBox, Loading } from "../components/Feedback";
import ProjectFormModal from "../components/ProjectFormModal";
import { useApiMutation } from "../lib/hooks";
import { formatDate, formatEnum } from "../lib/format";
import { btn, btnDanger, btnPrimary, link } from "../lib/ui";
import { PROJECT_TRANSITIONS, type ProjectStatus } from "../types/enums";

type Tab = "overview" | "tasks" | "members" | "issues";
const TABS: Tab[] = ["overview", "tasks", "members", "issues"];

export default function ProjectDetailPage() {
  const id = Number(useParams().projectId);
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { data: project, isPending, isError, error, refetch } = useQuery({
    queryKey: ["project", id],
    queryFn: () => getProject(id),
  });

  const changeStatus = useApiMutation(
    (s: ProjectStatus) => updateProjectStatus(id, s),
    "Status updated",
  );
  const remove = useApiMutation(() => deleteProject(id), "Project deleted", () =>
    navigate("/projects"),
  );

  if (isPending) return <Loading />;
  if (isError) return <ErrorBox error={error} onRetry={() => refetch()} />;

  const moves = PROJECT_TRANSITIONS[project.status];

  return (
    <div>
      <Link to="/projects" className={`text-sm ${link}`}>
        ← All projects
      </Link>

      <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">
            {project.name} <Badge value={project.status} />
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manager: {project.managerName} · {formatDate(project.startDate)} to{" "}
            {formatDate(project.endDate)}
          </p>
          {project.description && <p className="mt-2 text-slate-700">{project.description}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          {moves.map((s) => (
            <button
              key={s}
              className={btnPrimary}
              disabled={changeStatus.isPending}
              onClick={() => changeStatus.mutate(s)}
            >
              Mark {formatEnum(s)}
            </button>
          ))}
          <button className={btn} onClick={() => setEditing(true)}>
            Edit
          </button>
          <button className={btnDanger} onClick={() => setConfirmDelete(true)}>
            Delete
          </button>
        </div>
      </div>

      <div className="mt-6 flex gap-1 border-b">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium ${
              tab === t
                ? "border-b-2 border-indigo-600 text-indigo-700"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {formatEnum(t)}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {tab === "overview" && <p className="text-slate-500">Overview: phase F9</p>}
        {tab === "tasks" && <p className="text-slate-500">Tasks: phase F6</p>}
        {tab === "members" && <p className="text-slate-500">Members: phase F5</p>}
        {tab === "issues" && <p className="text-slate-500">Issues: phase F8</p>}
      </div>

      {editing && <ProjectFormModal project={project} onClose={() => setEditing(false)} />}
      {confirmDelete && (
        <ConfirmDialog
          title="Delete project"
          message={`Delete "${project.name}" with all its tasks, issues, comments and members? This cannot be undone.`}
          busy={remove.isPending}
          onConfirm={() => remove.mutate()}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </div>
  );
}