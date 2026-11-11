export default function PlaceholderPage({ title, phase }: { title: string; phase: string }) {
  return (
    <div>
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="mt-2 text-slate-500">Built in phase {phase}.</p>
    </div>
  );
}