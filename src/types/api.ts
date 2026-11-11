import type {
  Designation,
  IssueSeverity,
  IssueStatus,
  IssueType,
  ProjectRole,
  ProjectStatus,
  TaskPriority,
  TaskStatus,
} from "./enums";

// ---------- Common ----------
export interface Page<T> {
  content: T[];
  page: number; // zero-based
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  fieldErrors?: Record<string, string> | null;
}

export type CountMap = Record<string, number>;

// ---------- Users ----------
export interface UserResponse {
  id: number;
  fullName: string;
  email: string;
  designation: Designation;
  active: boolean;
  phoneNumber?: string | null;
  bio?: string | null;
  location?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserRequest {
  // used for both create (POST) and update (PUT)
  fullName: string;
  email: string;
  designation: Designation;
  phoneNumber?: string;
  bio?: string;
  location?: string;
}

// ---------- Projects ----------
export interface ProjectResponse {
  id: number;
  name: string;
  description?: string | null;
  startDate: string; // YYYY-MM-DD
  endDate?: string | null;
  status: ProjectStatus;
  managerId: number;
  managerName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  managerId: number;
}

export interface UpdateProjectRequest {
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
}

export interface UpdateProjectStatusRequest {
  status: ProjectStatus;
}

// ---------- Members ----------
export interface MemberResponse {
  userId: number;
  fullName: string;
  email: string;
  designation: Designation;
  active: boolean;
  projectRole: ProjectRole;
  joinedOn: string;
}

export interface AddMemberRequest {
  userId: number;
  projectRole: ProjectRole;
}

export interface UpdateMemberRoleRequest {
  projectRole: ProjectRole;
}

// ---------- Labels ----------
export interface LabelResponse {
  id: number;
  name: string;
  colourCode?: string | null; // "#RRGGBB"
  createdAt: string;
  updatedAt: string;
}

export interface LabelRequest {
  // used for both create and update
  name: string;
  colourCode?: string;
}

// ---------- Tasks ----------
export interface TaskResponse {
  id: number;
  title: string;
  description?: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string | null;
  estimatedHours?: number | null;
  overdue: boolean;
  projectId: number;
  assigneeId?: number | null;
  assigneeName?: string | null;
  reporterId: number;
  reporterName: string;
  labels: LabelResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string;
  estimatedHours?: number; // 0.5 - 500
  assigneeId?: number;
  reporterId: number;
}

export interface UpdateTaskRequest {
  // no assigneeId here: assignment is a separate PATCH
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate?: string;
  estimatedHours?: number;
}

export interface UpdateTaskStatusRequest {
  status: TaskStatus;
}

export interface UpdateAssigneeRequest {
  assigneeId: number | null; // null unassigns (tasks and issues)
}

// ---------- Comments ----------
export interface CommentResponse {
  id: number;
  taskId: number;
  authorId: number;
  authorName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentRequest {
  authorId: number;
  content: string; // max 2000
}

export interface UpdateCommentRequest {
  content: string;
}

// ---------- Issues ----------
export interface IssueResponse {
  id: number;
  title: string;
  description?: string | null;
  type: IssueType;
  severity: IssueSeverity;
  status: IssueStatus;
  resolvedAt?: string | null;
  projectId: number;
  assigneeId?: number | null;
  assigneeName?: string | null;
  reporterId: number;
  reporterName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIssueRequest {
  title: string;
  description?: string;
  type: IssueType;
  severity?: IssueSeverity;
  assigneeId?: number;
  reporterId: number;
}

export interface UpdateIssueRequest {
  title: string;
  description?: string;
  type: IssueType;
  severity: IssueSeverity;
}

export interface UpdateIssueStatusRequest {
  status: IssueStatus;
}

// ---------- Reports ----------
export interface ProjectProgressResponse {
  projectId: number;
  projectName: string;
  totalTasks: number;
  doneTasks: number;
  progressPercent: number;
  tasksByStatus: CountMap;
}

export interface ProjectSummaryResponse {
  projectId: number;
  name: string;
  status: ProjectStatus;
  startDate: string;
  endDate?: string | null;
  managerName: string;
  memberCount: number;
  overdueTasks: number;
  progress: ProjectProgressResponse;
}

export interface UserWorkloadResponse {
  userId: number;
  userName: string;
  openTasks: number;
  overdueTasks: number;
  assignedByStatus: CountMap;
}

export interface AssigneeBugCount {
  assigneeId: number;
  assigneeName: string;
  openBugs: number;
}

export interface IssueStatisticsResponse {
  projectId: number;
  totalIssues: number;
  openIssues: number;
  openBugs: number;
  byStatus: CountMap;
  byType: CountMap;
  bySeverity: CountMap;
  openBugsByAssignee: AssigneeBugCount[];
}

export interface DashboardResponse {
  totalProjects: number;
  projectsByStatus: CountMap;
  totalTasks: number;
  tasksByStatus: CountMap;
  overdueTasks: number;
  totalUsers: number;
  activeUsers: number;
}