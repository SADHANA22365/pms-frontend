import type { ReactNode } from "react";

export default function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="mb-4 block">
      <span className="mb-1.5 block text-sm font-semibold text-navy">{label}</span>
      {children}
      {error && (
        <span className="mt-1.5 block text-xs font-medium text-danger">{error}</span>
      )}
    </label>
  );
}
