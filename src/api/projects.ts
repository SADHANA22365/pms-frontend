import { api } from "./client";
import type {
  CreateProjectRequest,
  Page,
  ProjectResponse,
  UpdateProjectRequest,
} from "../types/api";
import type { ProjectStatus } from "../types/enums";

export const listProjects = (page: number, status?: string, size = 10) =>
  api.get<Page<ProjectResponse>>("/projects", { page, size, status });
export const getProject = (id: number) => api.get<ProjectResponse>(`/projects/${id}`);
export const createProject = (b: CreateProjectRequest) =>
  api.post<ProjectResponse>("/projects", b);
export const updateProject = (id: number, b: UpdateProjectRequest) =>
  api.put<ProjectResponse>(`/projects/${id}`, b);
export const updateProjectStatus = (id: number, status: ProjectStatus) =>
  api.patch<ProjectResponse>(`/projects/${id}/status`, { status });
export const deleteProject = (id: number) => api.delete(`/projects/${id}`);