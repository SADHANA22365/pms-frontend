import { formatEnum } from "../lib/format";
import type { CountMap } from "../types/api";

export default function CountBars({ data }: { data: CountMap }) {
  const entries = Object.entries(data);
  if (entries.length === 0) return <p className="text-sm text-slate-500">No data</p>;
  const max = Math.max(1, ...entries.map(([, v]) => v));
  return (
    <ul className="space-y-2">
      {entries.map(([k, v]) => (
        <li key={k} className="text-sm">
          <div className="flex justify-between">
            <span>{formatEnum(k)}</span>
            <span className="font-medium">{v}</span>
          </div>
          <div className="mt-1 h-2 rounded bg-slate-100">
            <div
              className="h-2 rounded bg-indigo-500"
              style={{ width: `${(v / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}