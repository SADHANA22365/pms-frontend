import { api } from "./client";
import type { MemberResponse } from "../types/api";
import type { ProjectRole } from "../types/enums";

export const listMembers = (projectId: number) =>
  api.get<MemberResponse[]>(`/projects/${projectId}/members`);
export const addMember = (projectId: number, userId: number, projectRole: ProjectRole) =>
  api.post<MemberResponse>(`/projects/${projectId}/members`, { userId, projectRole });
export const updateMemberRole = (projectId: number, userId: number, projectRole: ProjectRole) =>
  api.patch<MemberResponse>(`/projects/${projectId}/members/${userId}`, { projectRole });
export const removeMember = (projectId: number, userId: number) =>
  api.delete(`/projects/${projectId}/members/${userId}`);