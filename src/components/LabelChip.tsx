import type { LabelResponse } from "../types/api";

export default function LabelChip({
  label,
}: {
  label: Pick<LabelResponse, "name" | "colourCode">;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-2.5 py-0.5 text-xs font-semibold text-navy shadow-2xs transition-colors hover:border-navy-border">
      <span
        className="inline-block h-2 w-2 rounded-full shrink-0"
        style={{ backgroundColor: label.colourCode ?? "#0B3B6F" }}
      />
      <span className="truncate max-w-[150px]">{label.name}</span>
    </span>
  );
}
