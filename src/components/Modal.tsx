import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

export default function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-navy/40 backdrop-blur-[2px] p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col w-full max-h-[92vh] sm:max-h-[85vh] sm:max-w-xl rounded-t-2xl sm:rounded-xl bg-white shadow-xl border-t sm:border border-border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile handle indicator */}
        <div className="flex justify-center pt-2 sm:hidden">
          <div className="h-1.5 w-12 rounded-full bg-border" />
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border/80 px-5 py-3.5 sm:py-4">
          <h2 className="text-lg font-bold text-navy tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:text-navy hover:bg-navy-soft transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {children}
        </div>
      </div>
    </div>
  );
}
