import { api } from "./client";
import type { LabelRequest, LabelResponse, Page } from "../types/api";

export const listLabels = () =>
  api.get<Page<LabelResponse> | LabelResponse[]>("/labels", { page: 0, size: 100 });
export const createLabel = (b: LabelRequest) => api.post<LabelResponse>("/labels", b);
export const updateLabel = (id: number, b: LabelRequest) =>
  api.put<LabelResponse>(`/labels/${id}`, b);
export const deleteLabel = (id: number) => api.delete(`/labels/${id}`);
export const attachLabel = (taskId: number, labelId: number) =>
  api.put<unknown>(`/tasks/${taskId}/labels/${labelId}`);
export const detachLabel = (taskId: number, labelId: number) =>
  api.delete<unknown>(`/tasks/${taskId}/labels/${labelId}`);