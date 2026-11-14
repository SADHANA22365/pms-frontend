import { useState } from "react";
import { addMember, removeMember, updateMemberRole } from "../api/members";
import ConfirmDialog from "./ConfirmDialog";
import { EmptyState, ErrorBox, Loading } from "./Feedback";
import { useAllUsers, useApiMutation, useMembers } from "../lib/hooks";
import { formatDate, formatEnum } from "../lib/format";
import { btn, btnPrimary, td, th } from "../lib/ui";
import { PROJECT_ROLES, type ProjectRole } from "../types/enums";
import type { MemberResponse } from "../types/api";
import { UserPlus, Users, Trash2, Calendar, Briefcase } from "lucide-react";

export default function MembersPanel({ projectId }: { projectId: number }) {
  const members = useMembers(projectId);
  const users = useAllUsers();
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState<ProjectRole>("MEMBER");
  const [removing, setRemoving] = useState<MemberResponse | null>(null);

  const add = useApiMutation(
    () => addMember(projectId, Number(userId), role),
    "Member added",
    () => setUserId(""),
  );
  const changeRole = useApiMutation(
    (v: { userId: number; role: ProjectRole }) => updateMemberRole(projectId, v.userId, v.role),
    "Role updated",
  );
  const remove = useApiMutation(
    (uid: number) => removeMember(projectId, uid),
    "Member removed",
    () => setRemoving(null),
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

  if (members.isPending) return <Loading label="Loading project members..." />;
  if (members.isError) return <ErrorBox error={members.error} onRetry={() => members.refetch()} />;

  const memberIds = new Set(members.data.map((m) => m.userId));
  const candidates = (users.data?.content ?? []).filter((u) => u.active && !memberIds.has(u.id));

  return (
    <div className="space-y-4">
      {/* Add Member Form (Wrapping row on desktop, stacked on mobile) */}
      <form
        className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2.5 rounded-xl border border-border bg-white p-4 shadow-2xs"
        onSubmit={(e) => {
          e.preventDefault();
          add.mutate();
        }}
      >
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold uppercase tracking-wider text-navy mb-1.5">
            Select User
          </label>
          <select
            className="w-full h-10 rounded-lg border border-border bg-white px-3.5 text-sm text-text-main focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={userId}
            required
            onChange={(e) => setUserId(e.target.value)}
          >
            <option value="">Choose a team member...</option>
            {candidates.map((u) => (
              <option key={u.id} value={u.id}>
                {u.fullName} ({formatEnum(u.designation)})
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-44">
          <label className="block text-xs font-semibold uppercase tracking-wider text-navy mb-1.5">
            Project Role
          </label>
          <select
            className="w-full h-10 rounded-lg border border-border bg-white px-3.5 text-sm text-text-main focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={role}
            onChange={(e) => setRole(e.target.value as ProjectRole)}
          >
            {PROJECT_ROLES.map((r) => (
              <option key={r} value={r}>
                {formatEnum(r)}
              </option>
            ))}
          </select>
        </div>

        <button
          className={`${btnPrimary} h-10 px-4 shrink-0`}
          disabled={add.isPending || !userId}
        >
          <UserPlus className="h-4 w-4 mr-1.5" />
          Add member
        </button>
      </form>

      {members.data.length === 0 ? (
        <EmptyState
          message="No members assigned to this project yet."
          icon={<Users className="h-6 w-6 text-navy/70" />}
        />
      ) : (
        <div className="rounded-xl border border-border bg-white shadow-xs overflow-hidden">
          {/* Mobile Stacked Cards (< md) */}
          <div className="divide-y divide-border/60 md:hidden">
            {members.data.map((m) => (
              <div key={m.userId} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-soft text-navy font-bold text-xs border border-navy-border/60">
                      {getInitials(m.fullName)}
                    </div>
                    <div>
                      <div className="font-bold text-navy text-sm">
                        {m.fullName}
                        {!m.active && (
                          <span className="ml-1.5 text-xs text-text-muted font-normal">(inactive)</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-text-muted mt-0.5">
                        <Briefcase className="h-3 w-3 shrink-0" />
                        <span>{formatEnum(m.designation)}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-danger hover:bg-danger-bg/40 cursor-pointer transition-colors"
                    onClick={() => setRemoving(m)}
                    aria-label={`Remove ${m.fullName}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-border/40 text-xs">
                  <div className="flex items-center gap-1.5 text-text-muted">
                    <Calendar className="h-3.5 w-3.5 text-navy/60 shrink-0" />
                    <span>Joined: {formatDate(m.joinedOn)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-text-muted font-medium">Role:</span>
                    <select
                      className="rounded-lg border border-border bg-white px-2.5 py-1 text-xs font-semibold text-navy focus:border-primary focus:outline-none"
                      value={m.projectRole}
                      disabled={changeRole.isPending}
                      onChange={(e) =>
                        changeRole.mutate({ userId: m.userId, role: e.target.value as ProjectRole })
                      }
                    >
                      {PROJECT_ROLES.map((r) => (
                        <option key={r} value={r}>
                          {formatEnum(r)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table (>= md) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr>
                  <th className={th}>Member</th>
                  <th className={th}>Designation</th>
                  <th className={th}>Role</th>
                  <th className={th}>Joined Date</th>
                  <th className={`${th} text-right`}></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {members.data.map((m) => (
                  <tr
                    key={m.userId}
                    className="hover:bg-navy-subtle/30 transition-colors"
                  >
                    <td className={td}>
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-soft text-navy font-bold text-xs border border-navy-border/50">
                          {getInitials(m.fullName)}
                        </div>
                        <span className="font-semibold text-navy">
                          {m.fullName}
                          {!m.active && (
                            <span className="ml-2 text-xs font-normal text-text-muted">(inactive)</span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className={td}>
                      <span className="text-text-main font-medium">{formatEnum(m.designation)}</span>
                    </td>
                    <td className={td}>
                      <select
                        className="rounded-lg border border-border bg-white px-2.5 py-1.5 text-xs font-semibold text-navy focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        value={m.projectRole}
                        disabled={changeRole.isPending}
                        onChange={(e) =>
                          changeRole.mutate({ userId: m.userId, role: e.target.value as ProjectRole })
                        }
                      >
                        {PROJECT_ROLES.map((r) => (
                          <option key={r} value={r}>
                            {formatEnum(r)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className={td}>
                      <span className="text-text-muted">{formatDate(m.joinedOn)}</span>
                    </td>
                    <td className={`${td} text-right`}>
                      <button
                        className={`${btn} h-8 px-2.5 text-xs text-danger hover:border-danger/30 hover:bg-danger-bg/40`}
                        onClick={() => setRemoving(m)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {removing && (
        <ConfirmDialog
          title="Remove member"
          message={`Are you sure you want to remove ${removing.fullName} from this project?`}
          confirmLabel="Remove"
          busy={remove.isPending}
          onConfirm={() => remove.mutate(removing.userId)}
          onCancel={() => setRemoving(null)}
        />
      )}
    </div>
  );
}
