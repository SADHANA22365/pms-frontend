import { useState } from "react";
import { Link } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { listUsers, setUserActive } from "../api/users";
import { EmptyState, ErrorBox, Loading } from "../components/Feedback";
import Pagination from "../components/Pagination";
import UserFormModal from "../components/UserFormModal";
import PageHeader from "../components/PageHeader";
import { useApiMutation } from "../lib/hooks";
import { formatEnum } from "../lib/format";
import { btn, btnPrimary, link, td, th } from "../lib/ui";
import type { UserResponse } from "../types/api";
import { Plus, Mail, Briefcase, Activity } from "lucide-react";

export default function UsersPage() {
  const [page, setPage] = useState(0);
  const [editing, setEditing] = useState<UserResponse | "new" | null>(null);

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["users", { page }],
    queryFn: () => listUsers(page),
    placeholderData: keepPreviousData,
  });

  const toggle = useApiMutation(
    (u: UserResponse) => setUserActive(u.id, !u.active),
    "User updated",
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div>
      <PageHeader
        title="Users"
        subtitle="Manage team members, roles, and view individual workloads."
        action={
          <button className={btnPrimary} onClick={() => setEditing("new")}>
            <Plus className="mr-1.5 h-4 w-4" />
            New user
          </button>
        }
      />

      <div className="mt-4">
        {isPending && <Loading label="Loading users..." />}
        {isError && <ErrorBox error={error} onRetry={() => refetch()} />}
        {data && data.content.length === 0 && (
          <EmptyState
            message="No users yet."
            actionLabel="Add first user"
            onAction={() => setEditing("new")}
          />
        )}

        {data && data.content.length > 0 && (
          <div className="rounded-xl border border-border bg-white shadow-xs overflow-hidden">
            {/* Mobile Stacked Cards (< md) */}
            <div className="divide-y divide-border/60 md:hidden">
              {data.content.map((u) => (
                <div key={u.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-soft text-navy font-bold text-xs border border-navy-border/60">
                        {getInitials(u.fullName)}
                      </div>
                      <div className="min-w-0">
                        <Link
                          to={`/users/${u.id}/workload`}
                          className="font-bold text-navy hover:text-primary transition-colors text-sm truncate block"
                        >
                          {u.fullName}
                        </Link>
                        <span className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                          <Briefcase className="h-3 w-3 shrink-0" />
                          {formatEnum(u.designation)}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold shrink-0 border ${
                        u.active
                          ? "bg-success-bg text-success-text border-success-border"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          u.active ? "bg-success" : "bg-slate-400"
                        }`}
                      />
                      {u.active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="text-xs text-text-muted flex items-center gap-1.5 pt-0.5">
                    <Mail className="h-3.5 w-3.5 text-navy/60 shrink-0" />
                    <span className="truncate">{u.email}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/40">
                    <button
                      className={`${btn} flex-1 h-9 text-xs justify-center`}
                      onClick={() => setEditing(u)}
                    >
                      Edit
                    </button>
                    <button
                      className={`${btn} flex-1 h-9 text-xs justify-center`}
                      disabled={toggle.isPending}
                      onClick={() => toggle.mutate(u)}
                    >
                      {u.active ? "Deactivate" : "Activate"}
                    </button>
                    <Link
                      to={`/users/${u.id}/workload`}
                      className={`${btn} flex-1 h-9 text-xs justify-center`}
                    >
                      <Activity className="h-3.5 w-3.5 mr-1 text-primary" />
                      Workload
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table (>= md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr>
                    <th className={th}>Name</th>
                    <th className={th}>Email</th>
                    <th className={th}>Designation</th>
                    <th className={th}>Status</th>
                    <th className={`${th} text-right`}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {data.content.map((u) => (
                    <tr
                      key={u.id}
                      className="hover:bg-navy-subtle/30 transition-colors"
                    >
                      <td className={td}>
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-soft text-navy font-bold text-xs border border-navy-border/50">
                            {getInitials(u.fullName)}
                          </div>
                          <Link
                            to={`/users/${u.id}/workload`}
                            className={`${link} font-semibold`}
                          >
                            {u.fullName}
                          </Link>
                        </div>
                      </td>
                      <td className={td}>
                        <span className="text-text-muted">{u.email}</span>
                      </td>
                      <td className={td}>
                        <span className="font-medium text-navy">
                          {formatEnum(u.designation)}
                        </span>
                      </td>
                      <td className={td}>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                            u.active
                              ? "bg-success-bg text-success-text border-success-border"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              u.active ? "bg-success" : "bg-slate-400"
                            }`}
                          />
                          {u.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className={`${td} space-x-1.5 text-right whitespace-nowrap`}>
                        <Link
                          to={`/users/${u.id}/workload`}
                          className={`${btn} h-8 px-2.5 text-xs inline-flex items-center`}
                        >
                          Workload
                        </Link>
                        <button
                          className={`${btn} h-8 px-2.5 text-xs`}
                          onClick={() => setEditing(u)}
                        >
                          Edit
                        </button>
                        <button
                          className={`${btn} h-8 px-2.5 text-xs`}
                          disabled={toggle.isPending}
                          onClick={() => toggle.mutate(u)}
                        >
                          {u.active ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {data && (
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            onChange={setPage}
          />
        )}
      </div>

      {editing && (
        <UserFormModal
          user={editing === "new" ? undefined : editing}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
