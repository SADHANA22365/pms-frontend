import { getErrorMessage } from "../api/client";

export function Loading({ label = "Loading..." }: { label?: string }) {
  return <p className="py-6 text-center text-slate-500">{label}</p>;
}

export function ErrorBox({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  return (
    <div className="rounded border border-red-200 bg-red-50 p-4 text-red-800">
      <p>{getErrorMessage(error)}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-2 text-sm font-medium underline">
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded border border-dashed bg-white p-8 text-center text-slate-500">
      {message}
    </div>
  );
}