import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { attachLabel, detachLabel, listLabels } from "../api/labels";
import { useApiMutation } from "../lib/hooks";
import { items } from "../lib/unwrap";
import { btnPrimary, card } from "../lib/ui";
import type { TaskResponse } from "../types/api";
import { Tag, Plus, X } from "lucide-react";

export default function LabelsSection({ task }: { task: TaskResponse }) {
  const [labelId, setLabelId] = useState("");
  const all = useQuery({ queryKey: ["labels"], queryFn: listLabels });
  const attachedIds = new Set(task.labels.map((l) => l.id));
  const available = items(all.data).filter((l) => !attachedIds.has(l.id));

  const attach = useApiMutation(
    () => attachLabel(task.id, Number(labelId)),
    "Label attached",
    () => setLabelId(""),
  );
  const detach = useApiMutation((id: number) => detachLabel(task.id, id), "Label removed");

  return (
    <section className={card}>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/60">
        <Tag className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-navy">
          Labels ({task.labels.length})
        </h2>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {task.labels.length === 0 && (
          <span className="text-xs text-text-muted italic">No labels attached yet</span>
        )}
        {task.labels.map((l) => (
          <span
            key={l.id}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-white pr-1 pl-2 py-0.5 text-xs shadow-2xs group hover:border-navy-border transition-colors"
          >
            <span
              className="inline-block h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: l.colourCode ?? "#0B3B6F" }}
            />
            <span className="font-semibold text-navy mr-1 truncate max-w-[120px]">
              {l.name}
            </span>
            <button
              aria-label={`Remove ${l.name}`}
              className="inline-flex h-4 w-4 items-center justify-center rounded-full text-text-muted hover:bg-danger-bg hover:text-danger cursor-pointer transition-colors"
              disabled={detach.isPending}
              onClick={() => detach.mutate(l.id)}
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </span>
        ))}
      </div>

      {available.length > 0 && (
        <div className="mt-4 pt-3 border-t border-border/60 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <select
            className="flex-1 h-9 rounded-lg border border-border bg-white px-3 text-xs text-text-main focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={labelId}
            onChange={(e) => setLabelId(e.target.value)}
          >
            <option value="">Select a label to attach...</option>
            {available.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
          <button
            className={`${btnPrimary} h-9 px-3.5 text-xs shrink-0`}
            disabled={!labelId || attach.isPending}
            onClick={() => attach.mutate()}
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Attach
          </button>
        </div>
      )}
    </section>
  );
}
