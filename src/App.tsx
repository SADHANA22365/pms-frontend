import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import UsersPage from "./pages/UsersPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import OverdueTasksPage from "./pages/OverdueTasksPage";
import TaskDetailPage from "./pages/TaskDetailPage";
import LabelsPage from "./pages/LabelsPage";
import IssueDetailPage from "./pages/IssueDetailPage";
import UserWorkloadPage from "./pages/UserWorkloadPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route
          path="projects/:projectId"
          element={<ProjectDetailPage />} />
        <Route
          path="tasks/overdue"
          element={<OverdueTasksPage />}
        />
        <Route path="tasks/:taskId" element={<TaskDetailPage />} />
        <Route path="labels" element={<LabelsPage />} />
        <Route path="issues/:issueId" element={<IssueDetailPage />} />
        <Route path="users/:userId/workload" element={<UserWorkloadPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}