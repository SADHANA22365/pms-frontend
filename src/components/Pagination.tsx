import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number; // zero-based
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border/80 pt-4 text-sm text-text-muted">
      <span className="text-xs sm:text-sm order-2 sm:order-1">
        Page <span className="font-semibold text-navy">{page + 1}</span> of{" "}
        <span className="font-semibold text-navy">{totalPages}</span>
      </span>
      <div className="flex items-center gap-2 order-1 sm:order-2 w-full sm:w-auto justify-between sm:justify-end">
        <button
          className="inline-flex items-center justify-center gap-1 min-h-10 px-3.5 text-sm font-semibold rounded-lg border border-border bg-white text-navy hover:bg-navy-soft/60 hover:border-navy-border active:bg-navy-soft transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          disabled={page === 0}
          onClick={() => onChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </button>
        <button
          className="inline-flex items-center justify-center gap-1 min-h-10 px-3.5 text-sm font-semibold rounded-lg border border-border bg-white text-navy hover:bg-navy-soft/60 hover:border-navy-border active:bg-navy-soft transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          disabled={page + 1 >= totalPages}
          onClick={() => onChange(page + 1)}
          aria-label="Next page"
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
