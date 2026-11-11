import { api } from "./client";
import type { CommentResponse, CreateCommentRequest } from "../types/api";

export const listComments = (taskId: number) =>
  api.get<CommentResponse[]>(`/tasks/${taskId}/comments`);
export const createComment = (taskId: number, b: CreateCommentRequest) =>
  api.post<CommentResponse>(`/tasks/${taskId}/comments`, b);
export const updateComment = (id: number, content: string) =>
  api.put<CommentResponse>(`/comments/${id}`, { content });
export const deleteComment = (id: number) => api.delete(`/comments/${id}`);