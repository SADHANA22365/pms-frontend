import { formatEnum } from "../lib/format";
import type { CountMap } from "../types/api";

export default function CountBars({ data }: { data: CountMap }) {
  const entries = Object.entries(data);
  if (entries.length === 0) {
    return <p className="text-sm text-text-muted italic py-2">No data recorded</p>;
  }
  const max = Math.max(1, ...entries.map(([, v]) => v));
  const total = entries.reduce((acc, [, v]) => acc + v, 0);

  return (
    <ul className="space-y-3">
      {entries.map(([k, v]) => {
        const percentage = Math.round((v / (total || 1)) * 100);
        return (
          <li key={k} className="text-sm">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-navy">{formatEnum(k)}</span>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-text-main">{v}</span>
                <span className="text-text-muted text-[11px]">({percentage}%)</span>
              </div>
            </div>
            <div className="h-2 w-full rounded-full bg-surface-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${(v / max) * 100}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
