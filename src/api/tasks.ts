import { api } from "./client";
import type {
  CreateTaskRequest,
  Page,
  TaskResponse,
  UpdateTaskRequest,
} from "../types/api";
import type { TaskStatus } from "../types/enums";

type TaskList = Page<TaskResponse> | TaskResponse[];

export const listProjectTasks = (projectId: number, page: number) =>
  api.get<TaskList>(`/projects/${projectId}/tasks`, { page, size: 10 });
export const listOverdueTasks = (page: number) =>
  api.get<TaskList>("/tasks/overdue", { page, size: 10 });
export const getTask = (id: number) => api.get<TaskResponse>(`/tasks/${id}`);
export const createTask = (projectId: number, b: CreateTaskRequest) =>
  api.post<TaskResponse>(`/projects/${projectId}/tasks`, b);
export const updateTask = (id: number, b: UpdateTaskRequest) =>
  api.put<TaskResponse>(`/tasks/${id}`, b);
export const deleteTask = (id: number) => api.delete(`/tasks/${id}`);
export const updateTaskStatus = (id: number, status: TaskStatus) =>
  api.patch<TaskResponse>(`/tasks/${id}/status`, { status });
export const updateTaskAssignee = (id: number, assigneeId: number | null) =>
  api.patch<TaskResponse>(`/tasks/${id}/assignee`, { assigneeId });