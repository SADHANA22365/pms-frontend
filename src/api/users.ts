import { api } from "./client";
import type { Page, UserRequest, UserResponse } from "../types/api";

export const listUsers = (page: number, size = 10) =>
  api.get<Page<UserResponse>>("/users", { page, size, sort: "fullName,asc" });
export const listAllUsers = () => listUsers(0, 100);
export const getUser = (id: number) => api.get<UserResponse>(`/users/${id}`);
export const createUser = (b: UserRequest) => api.post<UserResponse>("/users", b);
export const updateUser = (id: number, b: UserRequest) =>
  api.put<UserResponse>(`/users/${id}`, b);
export const setUserActive = (id: number, active: boolean) =>
  api.patch<UserResponse>(`/users/${id}/${active ? "activate" : "deactivate"}`);