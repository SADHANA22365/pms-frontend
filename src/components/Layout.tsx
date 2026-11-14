import { useState, useEffect } from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Clock,
  Tag,
  Menu,
  X,
} from "lucide-react";

interface NavItem {
  to: string;
  label: string;
  end: boolean;
  icon: typeof LayoutDashboard;
}

const navLinks: NavItem[] = [
  { to: "/", label: "Dashboard", end: true, icon: LayoutDashboard },
  { to: "/projects", label: "Projects", end: false, icon: FolderKanban },
  { to: "/users", label: "Users", end: false, icon: Users },
  { to: "/tasks/overdue", label: "Overdue tasks", end: false, icon: Clock },
  { to: "/labels", label: "Labels", end: false, icon: Tag },
];

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Handle escape key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
      }
    };
    if (mobileOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  // Lock body scroll when drawer is open on mobile
  useEffect(() => {
    if (mobileOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [mobileOpen]);

  const navContent = (
    <div className="flex h-full flex-col justify-between">
      <div>
        {/* Brand Header in Sidebar */}
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy text-white font-bold text-lg shadow-xs">
              <span className="text-white">P</span>
              <span className="text-primary">M</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-navy leading-none">
                PMS<span className="text-primary">.</span>
              </span>
              <span className="text-[11px] font-medium text-text-muted leading-tight mt-0.5">
                Workspace Hub
              </span>
            </div>
          </Link>
          {/* Close button inside drawer (mobile/tablet only) */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg text-text-muted hover:bg-navy-soft hover:text-navy cursor-pointer transition-colors"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="px-3 py-4">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-text-muted/80 mb-2">
            Main Menu
          </p>
          <nav className="space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all border-l-4 ${
                      isActive
                        ? "border-primary bg-primary-soft text-navy shadow-2xs"
                        : "border-transparent text-text-muted hover:bg-navy-soft/60 hover:text-navy"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`h-4 w-4 transition-colors ${
                          isActive
                            ? "text-primary"
                            : "text-text-muted group-hover:text-navy"
                        }`}
                      />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Sidebar Footer info */}
      <div className="border-t border-border p-4 m-3 rounded-xl bg-surface-subtle">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs font-semibold text-navy">System Active</span>
        </div>
        <p className="text-[11px] text-text-muted mt-0.5">Connected to API v1.0</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-bg text-text-main flex flex-col lg:flex-row">
      {/* Desktop Fixed Sidebar (>= 1024px) */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-60 lg:flex-col lg:border-r lg:border-border lg:bg-surface">
        {navContent}
      </aside>

      {/* Mobile / Tablet Off-canvas Drawer (< 1024px) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-navy/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          {/* Drawer panel */}
          <div className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-surface shadow-2xl transition-transform animate-in slide-in-from-left duration-200">
            {navContent}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-60 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-border bg-surface/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            {/* Hamburger Button for Mobile / Tablet */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-navy hover:bg-navy-soft transition-colors cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Mobile Brand Name */}
            <Link to="/" className="flex items-center gap-2 lg:hidden">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-navy text-white font-bold text-sm">
                <span>P</span>
                <span className="text-primary">M</span>
              </div>
              <span className="font-bold text-navy text-base">PMS</span>
            </Link>

            {/* Desktop Topbar Title / Context */}
            <div className="hidden lg:flex items-center gap-2 text-sm text-text-muted">
              <span className="font-medium text-navy">Project Management System</span>
            </div>
          </div>

          {/* Top Bar Right Actions / Badges */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-subtle px-3 py-1 text-xs font-semibold text-navy">
              <span className="h-2 w-2 rounded-full bg-primary" />
              SaaS Edition
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-white text-xs font-bold border border-navy-border shadow-xs">
              AD
            </div>
          </div>
        </header>

        {/* Content Container (max-w-7xl) */}
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
