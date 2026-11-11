import { useState } from "react";
import { Link } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { listUsers, setUserActive } from "../api/users";
import { EmptyState, ErrorBox, Loading } from "../components/Feedback";
import Pagination from "../components/Pagination";
import UserFormModal from "../components/UserFormModal";
import { useApiMutation } from "../lib/hooks";
import { formatEnum } from "../lib/format";
import { btn, btnPrimary, link, td, th } from "../lib/ui";
import type { UserResponse } from "../types/api";

export default function UsersPage() {
  const [page, setPage] = useState(0);
  const [editing, setEditing] = useState<UserResponse | "new" | null>(null);

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["users", { page }],
    queryFn: () => listUsers(page),
    placeholderData: keepPreviousData, // keeps the old page visible while the next loads
  });

  const toggle = useApiMutation(
    (u: UserResponse) => setUserActive(u.id, !u.active),
    "User updated",
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
        <button className={btnPrimary} onClick={() => setEditing("new")}>
          New user
        </button>
      </div>

      <div className="mt-4">
        {isPending && <Loading />}
        {isError && <ErrorBox error={error} onRetry={() => refetch()} />}
        {data && data.content.length === 0 && <EmptyState message="No users yet." />}
        {data && data.content.length > 0 && (
          <div className="overflow-x-auto rounded border bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-slate-50 text-slate-500">
                <tr>
                  <th className={th}>Name</th>
                  <th className={th}>Email</th>
                  <th className={th}>Designation</th>
                  <th className={th}>Status</th>
                  <th className={th}></th>
                </tr>
              </thead>
              <tbody>
                {data.content.map((u) => (
                  <tr key={u.id} className="border-b last:border-0">
                    <td className={td}>
                      <Link to={`/users/${u.id}/workload`} className={link}>
                        {u.fullName}
                      </Link>
                    </td>
                    <td className={td}>{u.email}</td>
                    <td className={td}>{formatEnum(u.designation)}</td>
                    <td className={td}>
                      <span className={u.active ? "text-green-600" : "text-slate-400"}>
                        {u.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className={`${td} space-x-2 text-right`}>
                      <button className={btn} onClick={() => setEditing(u)}>
                        Edit
                      </button>
                      <button
                        className={btn}
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
        )}
        {data && <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />}
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