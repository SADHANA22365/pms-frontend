import { NavLink, Outlet } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/projects", label: "Projects", end: false },
  { to: "/users", label: "Users", end: false },
  { to: "/tasks/overdue", label: "Overdue tasks", end: false },
  { to: "/labels", label: "Labels", end: false },
];

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b bg-white">
        <nav className="mx-auto flex max-w-6xl items-center gap-1 px-4 py-3">
          <span className="mr-4 text-lg font-bold text-indigo-600">PMS</span>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `rounded px-3 py-1.5 text-sm font-medium ${
                  isActive
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}