import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { attachLabel, detachLabel, listLabels } from "../api/labels";
import LabelChip from "./LabelChip";
import { useApiMutation } from "../lib/hooks";
import { items } from "../lib/unwrap";
import { btn, card, input } from "../lib/ui";
import type { TaskResponse } from "../types/api";

export default function LabelsSection({ task }: { task: TaskResponse }) {
  const [labelId, setLabelId] = useState("");
  const all = useQuery({ queryKey: ["labels"], queryFn: listLabels });
  const attachedIds = new Set(task.labels.map((l) => l.id));
  const available = items(all.data).filter((l) => !attachedIds.has(l.id));

  const attach = useApiMutation(() => attachLabel(task.id, Number(labelId)), "Label attached", () =>
    setLabelId(""),
  );
  const detach = useApiMutation((id: number) => detachLabel(task.id, id), "Label removed");

  return (
    <section className={`${card} mt-4`}>
      <h2 className="mb-3 font-semibold">Labels</h2>
      <div className="flex flex-wrap gap-2">
        {task.labels.length === 0 && <span className="text-sm text-slate-400">No labels</span>}
        {task.labels.map((l) => (
          <span key={l.id} className="inline-flex items-center gap-1">
            <LabelChip label={l} />
            <button
              aria-label={`Remove ${l.name}`}
              className="text-slate-400 hover:text-red-600"
              disabled={detach.isPending}
              onClick={() => detach.mutate(l.id)}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      {available.length > 0 && (
        <div className="mt-3 flex gap-2">
          <select
            className={`${input} w-56`}
            value={labelId}
            onChange={(e) => setLabelId(e.target.value)}
          >
            <option value="">Add a label...</option>
            {available.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
          <button className={btn} disabled={!labelId || attach.isPending} onClick={() => attach.mutate()}>
            Attach
          </button>
        </div>
      )}
    </section>
  );
}