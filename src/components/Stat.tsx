export default function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded border bg-white p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}