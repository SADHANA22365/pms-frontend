import { api } from "./client";
import type {
  CreateIssueRequest,
  IssueResponse,
  IssueStatisticsResponse,
  Page,
  UpdateIssueRequest,
} from "../types/api";
import type { IssueStatus } from "../types/enums";

export const listIssues = (
  projectId: number,
  f: { page: number; status?: string; type?: string; severity?: string },
) =>
  api.get<Page<IssueResponse> | IssueResponse[]>(`/projects/${projectId}/issues`, {
    page: f.page,
    size: 10,
    status: f.status,
    type: f.type,
    severity: f.severity,
  });
export const getIssue = (id: number) => api.get<IssueResponse>(`/issues/${id}`);
export const createIssue = (projectId: number, b: CreateIssueRequest) =>
  api.post<IssueResponse>(`/projects/${projectId}/issues`, b);
export const updateIssue = (id: number, b: UpdateIssueRequest) =>
  api.put<IssueResponse>(`/issues/${id}`, b);
export const deleteIssue = (id: number) => api.delete(`/issues/${id}`);
export const updateIssueStatus = (id: number, status: IssueStatus) =>
  api.patch<IssueResponse>(`/issues/${id}/status`, { status });
export const updateIssueAssignee = (id: number, assigneeId: number | null) =>
  api.patch<IssueResponse>(`/issues/${id}/assignee`, { assigneeId });
export const getIssueStatistics = (projectId: number) =>
  api.get<IssueStatisticsResponse>(`/projects/${projectId}/issues/statistics`);