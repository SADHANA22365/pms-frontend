import { useState } from "react";
import { addMember, removeMember, updateMemberRole } from "../api/members";
import ConfirmDialog from "./ConfirmDialog";
import { EmptyState, ErrorBox, Loading } from "./Feedback";
import { useAllUsers, useApiMutation, useMembers } from "../lib/hooks";
import { formatDate, formatEnum } from "../lib/format";
import { btn, btnPrimary, input, td, th } from "../lib/ui";
import { PROJECT_ROLES, type ProjectRole } from "../types/enums";
import type { MemberResponse } from "../types/api";

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

  if (members.isPending) return <Loading />;
  if (members.isError) return <ErrorBox error={members.error} onRetry={() => members.refetch()} />;

  const memberIds = new Set(members.data.map((m) => m.userId));
  const candidates = (users.data?.content ?? []).filter((u) => u.active && !memberIds.has(u.id));

  return (
    <div>
      <form
        className="mb-4 flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          add.mutate();
        }}
      >
        <select
          className={`${input} w-56`}
          value={userId}
          required
          onChange={(e) => setUserId(e.target.value)}
        >
          <option value="">Add a user...</option>
          {candidates.map((u) => (
            <option key={u.id} value={u.id}>
              {u.fullName}
            </option>
          ))}
        </select>
        <select
          className={`${input} w-36`}
          value={role}
          onChange={(e) => setRole(e.target.value as ProjectRole)}
        >
          {PROJECT_ROLES.map((r) => (
            <option key={r} value={r}>
              {formatEnum(r)}
            </option>
          ))}
        </select>
        <button className={btnPrimary} disabled={add.isPending}>
          Add member
        </button>
      </form>

      {members.data.length === 0 ? (
        <EmptyState message="No members yet." />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-slate-50 text-slate-500">
              <tr>
                <th className={th}>Name</th>
                <th className={th}>Designation</th>
                <th className={th}>Role</th>
                <th className={th}>Joined</th>
                <th className={th}></th>
              </tr>
            </thead>
            <tbody>
              {members.data.map((m) => (
                <tr key={m.userId} className="border-b last:border-0">
                  <td className={td}>
                    {m.fullName}
                    {!m.active && <span className="ml-2 text-xs text-slate-400">(inactive)</span>}
                  </td>
                  <td className={td}>{formatEnum(m.designation)}</td>
                  <td className={td}>
                    <select
                      className={`${input} w-32`}
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
                  <td className={td}>{formatDate(m.joinedOn)}</td>
                  <td className={`${td} text-right`}>
                    <button className={btn} onClick={() => setRemoving(m)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {removing && (
        <ConfirmDialog
          title="Remove member"
          message={`Remove ${removing.fullName} from this project?`}
          confirmLabel="Remove"
          busy={remove.isPending}
          onConfirm={() => remove.mutate(removing.userId)}
          onCancel={() => setRemoving(null)}
        />
      )}
    </div>
  );
}