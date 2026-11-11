import type { LabelResponse } from "../types/api";

export default function LabelChip({ label }: { label: Pick<LabelResponse, "name" | "colourCode"> }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs">
      <span
        className="inline-block h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: label.colourCode ?? "#94a3b8" }}
      />
      {label.name}
    </span>
  );
}