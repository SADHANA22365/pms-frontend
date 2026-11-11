import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { deleteLabel, listLabels } from "../api/labels";
import ConfirmDialog from "../components/ConfirmDialog";
import { EmptyState, ErrorBox, Loading } from "../components/Feedback";
import LabelChip from "../components/LabelChip";
import LabelFormModal from "../components/LabelFormModal";
import { useApiMutation } from "../lib/hooks";
import { items } from "../lib/unwrap";
import { btn, btnPrimary, td, th } from "../lib/ui";
import type { LabelResponse } from "../types/api";

export default function LabelsPage() {
  const [editing, setEditing] = useState<LabelResponse | "new" | null>(null);
  const [deleting, setDeleting] = useState<LabelResponse | null>(null);

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["labels"],
    queryFn: listLabels,
  });
  const remove = useApiMutation((id: number) => deleteLabel(id), "Label deleted", () =>
    setDeleting(null),
  );
  const list = items(data);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Labels</h1>
        <button className={btnPrimary} onClick={() => setEditing("new")}>
          New label
        </button>
      </div>
      <div className="mt-4">
        {isPending && <Loading />}
        {isError && <ErrorBox error={error} onRetry={() => refetch()} />}
        {data && list.length === 0 && <EmptyState message="No labels yet." />}
        {list.length > 0 && (
          <div className="overflow-x-auto rounded border bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-slate-50 text-slate-500">
                <tr>
                  <th className={th}>Label</th>
                  <th className={th}>Colour</th>
                  <th className={th}></th>
                </tr>
              </thead>
              <tbody>
                {list.map((l) => (
                  <tr key={l.id} className="border-b last:border-0">
                    <td className={td}>
                      <LabelChip label={l} />
                    </td>
                    <td className={td}>{l.colourCode ?? "-"}</td>
                    <td className={`${td} space-x-2 text-right`}>
                      <button className={btn} onClick={() => setEditing(l)}>
                        Edit
                      </button>
                      <button className={btn} onClick={() => setDeleting(l)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <LabelFormModal
          label={editing === "new" ? undefined : editing}
          onClose={() => setEditing(null)}
        />
      )}
      {deleting && (
        <ConfirmDialog
          title="Delete label"
          message={`Delete "${deleting.name}"? It can't be deleted while a task uses it.`}
          busy={remove.isPending}
          onConfirm={() => remove.mutate(deleting.id)}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}