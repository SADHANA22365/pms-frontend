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
import { btn, btnDanger, btnPrimary } from "../lib/ui";
import { PROJECT_TRANSITIONS, type ProjectStatus } from "../types/enums";
import MembersPanel from "../components/MembersPanel";
import TasksPanel from "../components/TasksPanel";
import IssuesPanel from "../components/IssuesPanel";
import ProjectOverview from "../components/ProjectOverview";
import {
  ArrowLeft,
  Calendar,
  User,
  LayoutDashboard,
  ListTodo,
  Users,
  AlertCircle,
  Edit,
  Trash2,
} from "lucide-react";

type Tab = "overview" | "tasks" | "members" | "issues";
const TABS: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "tasks", label: "Tasks", icon: ListTodo },
  { id: "members", label: "Members", icon: Users },
  { id: "issues", label: "Issues", icon: AlertCircle },
];

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

  if (isPending) return <Loading label="Loading project details..." />;
  if (isError) return <ErrorBox error={error} onRetry={() => refetch()} />;

  const moves = PROJECT_TRANSITIONS[project.status];

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <div>
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Projects</span>
        </Link>
      </div>

      {/* Project Header Card */}
      <div className="rounded-xl border border-border bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-navy">
                {project.name}
              </h1>
              <Badge value={project.status} />
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-text-muted pt-1">
              <div className="flex items-center gap-1.5 font-medium text-navy">
                <User className="h-4 w-4 text-primary shrink-0" />
                <span>Manager: {project.managerName}</span>
              </div>
              <span className="text-border hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-navy/60 shrink-0" />
                <span>
                  {formatDate(project.startDate)} to{" "}
                  {project.endDate ? formatDate(project.endDate) : "Ongoing"}
                </span>
              </div>
            </div>

            {project.description && (
              <p className="mt-3 text-sm leading-relaxed text-text-main/90 border-t border-border/60 pt-3">
                {project.description}
              </p>
            )}
          </div>

          {/* Action Buttons: Status transitions + Edit + Delete */}
          <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 shrink-0 border-t lg:border-t-0 border-border/60">
            {moves.map((s) => (
              <button
                key={s}
                className={`${btnPrimary} h-9 text-xs`}
                disabled={changeStatus.isPending}
                onClick={() => changeStatus.mutate(s)}
              >
                Mark {formatEnum(s)}
              </button>
            ))}
            <button
              className={`${btn} h-9 text-xs`}
              onClick={() => setEditing(true)}
            >
              <Edit className="h-3.5 w-3.5 mr-1" />
              Edit
            </button>
            <button
              className={`${btnDanger} h-9 text-xs`}
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Horizontally Scrollable Tab Bar with Orange Underline */}
      <div className="border-b border-border">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar -mb-px">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all whitespace-nowrap border-b-2 cursor-pointer ${
                  active
                    ? "border-primary text-navy font-bold"
                    : "border-transparent text-text-muted hover:text-navy hover:bg-navy-soft/40"
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${
                    active ? "text-primary" : "text-text-muted"
                  }`}
                />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="pt-2">
        {tab === "overview" && <ProjectOverview projectId={id} />}
        {tab === "tasks" && <TasksPanel projectId={id} projectStatus={project.status} />}
        {tab === "members" && <MembersPanel projectId={project.id} />}
        {tab === "issues" && <IssuesPanel projectId={id} />}
      </div>

      {editing && <ProjectFormModal project={project} onClose={() => setEditing(false)} />}
      {confirmDelete && (
        <ConfirmDialog
          title="Delete project"
          message={`Are you sure you want to delete "${project.name}" with all its tasks, issues, comments, and members? This action cannot be undone.`}
          busy={remove.isPending}
          onConfirm={() => remove.mutate()}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </div>
  );
}
