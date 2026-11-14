import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { deleteLabel, listLabels } from "../api/labels";
import ConfirmDialog from "../components/ConfirmDialog";
import { EmptyState, ErrorBox, Loading } from "../components/Feedback";
import LabelChip from "../components/LabelChip";
import LabelFormModal from "../components/LabelFormModal";
import PageHeader from "../components/PageHeader";
import { useApiMutation } from "../lib/hooks";
import { items } from "../lib/unwrap";
import { btn, btnPrimary, td, th } from "../lib/ui";
import type { LabelResponse } from "../types/api";
import { Plus, Tag } from "lucide-react";

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
      <PageHeader
        title="Labels"
        subtitle="Categorize tasks and issues with custom color-coded tags."
        action={
          <button className={btnPrimary} onClick={() => setEditing("new")}>
            <Plus className="mr-1.5 h-4 w-4" />
            New label
          </button>
        }
      />

      <div className="mt-4">
        {isPending && <Loading label="Loading labels..." />}
        {isError && <ErrorBox error={error} onRetry={() => refetch()} />}
        {data && list.length === 0 && (
          <EmptyState
            message="No labels yet."
            icon={<Tag className="h-6 w-6 text-navy/70" />}
            actionLabel="Create first label"
            onAction={() => setEditing("new")}
          />
        )}

        {list.length > 0 && (
          <div className="rounded-xl border border-border bg-white shadow-xs overflow-hidden">
            {/* Mobile Stacked Cards (< md) */}
            <div className="divide-y divide-border/60 md:hidden">
              {list.map((l) => (
                <div key={l.id} className="p-4 flex items-center justify-between gap-3">
                  <div className="flex flex-col gap-1.5">
                    <LabelChip label={l} />
                    <span className="text-[11px] font-mono text-text-muted">
                      {l.colourCode ?? "#0B3B6F"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className={`${btn} h-8 px-3 text-xs`}
                      onClick={() => setEditing(l)}
                    >
                      Edit
                    </button>
                    <button
                      className={`${btn} h-8 px-3 text-xs text-danger hover:border-danger/30 hover:bg-danger-bg/40`}
                      onClick={() => setDeleting(l)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table (>= md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr>
                    <th className={th}>Label</th>
                    <th className={th}>Color Code</th>
                    <th className={`${th} text-right`}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {list.map((l) => (
                    <tr
                      key={l.id}
                      className="hover:bg-navy-subtle/30 transition-colors"
                    >
                      <td className={td}>
                        <LabelChip label={l} />
                      </td>
                      <td className={td}>
                        <div className="flex items-center gap-2 font-mono text-xs text-text-muted">
                          <span
                            className="inline-block h-3.5 w-3.5 rounded border border-border shrink-0"
                            style={{ backgroundColor: l.colourCode ?? "#0B3B6F" }}
                          />
                          <span>{l.colourCode ?? "-"}</span>
                        </div>
                      </td>
                      <td className={`${td} space-x-1.5 text-right`}>
                        <button
                          className={`${btn} h-8 px-2.5 text-xs`}
                          onClick={() => setEditing(l)}
                        >
                          Edit
                        </button>
                        <button
                          className={`${btn} h-8 px-2.5 text-xs text-danger hover:border-danger/30 hover:bg-danger-bg/40`}
                          onClick={() => setDeleting(l)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
