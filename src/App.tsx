import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import PlaceholderPage from "./pages/PlaceholderPage";
import UsersPage from "./pages/UsersPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="projects" element={<PlaceholderPage title="Projects" phase="F4" />} />
        <Route
          path="projects/:projectId"
          element={<PlaceholderPage title="Project detail" phase="F4" />}
        />
        <Route
          path="tasks/overdue"
          element={<PlaceholderPage title="Overdue tasks" phase="F6" />}
        />
        <Route path="labels" element={<PlaceholderPage title="Labels" phase="F7" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}