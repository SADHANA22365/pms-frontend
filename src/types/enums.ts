export const DESIGNATIONS = [
  "PROJECT_MANAGER",
  "DEVELOPER",
  "TESTER",
  "DESIGNER",
  "BUSINESS_ANALYST",
] as const;
export type Designation = (typeof DESIGNATIONS)[number];

export const PROJECT_ROLES = ["LEAD", "MEMBER", "REVIEWER"] as const;
export type ProjectRole = (typeof PROJECT_ROLES)[number];

export const PROJECT_STATUSES = [
  "PLANNED",
  "ACTIVE",
  "ON_HOLD",
  "COMPLETED",
  "CANCELLED",
] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const TASK_STATUSES = [
  "TODO",
  "IN_PROGRESS",
  "IN_REVIEW",
  "BLOCKED",
  "DONE",
] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const ISSUE_STATUSES = [
  "OPEN",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
  "REOPENED",
] as const;
export type IssueStatus = (typeof ISSUE_STATUSES)[number];

export const ISSUE_TYPES = [
  "BUG",
  "FEATURE_REQUEST",
  "IMPROVEMENT",
  "SUPPORT",
] as const;
export type IssueType = (typeof ISSUE_TYPES)[number];

export const ISSUE_SEVERITIES = ["MINOR", "MAJOR", "CRITICAL", "BLOCKER"] as const;
export type IssueSeverity = (typeof ISSUE_SEVERITIES)[number];

// Allowed moves, copied from the backend rules. The backend still has the final say (422).
export const PROJECT_TRANSITIONS: Record<ProjectStatus, ProjectStatus[]> = {
  PLANNED: ["ACTIVE", "CANCELLED"],
  ACTIVE: ["ON_HOLD", "COMPLETED", "CANCELLED"],
  ON_HOLD: ["ACTIVE", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

export const TASK_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  TODO: ["IN_PROGRESS", "BLOCKED"],
  IN_PROGRESS: ["IN_REVIEW", "BLOCKED", "TODO"],
  IN_REVIEW: ["DONE", "IN_PROGRESS"],
  BLOCKED: ["TODO", "IN_PROGRESS"],
  DONE: ["IN_PROGRESS"],
};