import { api } from "./client";
import type {
  DashboardResponse,
  ProjectSummaryResponse,
  UserWorkloadResponse,
} from "../types/api";

export const getDashboard = () => api.get<DashboardResponse>("/dashboard");
export const getProjectSummary = (projectId: number) =>
  api.get<ProjectSummaryResponse>(`/projects/${projectId}/summary`);
export const getUserWorkload = (userId: number) =>
  api.get<UserWorkloadResponse>(`/users/${userId}/workload`);