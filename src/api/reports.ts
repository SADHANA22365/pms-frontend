import { api } from "./client";
import type { DashboardResponse } from "../types/api";

export const getDashboard = () => api.get<DashboardResponse>("/dashboard");