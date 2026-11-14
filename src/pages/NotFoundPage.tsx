import { Link } from "react-router-dom";
import { btnPrimary } from "../lib/ui";
import { FolderKanban } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      {/* Large 404 */}
      <div className="mb-6 text-[96px] font-black leading-none tracking-tighter text-navy-soft select-none">
        404
      </div>

      {/* Icon */}
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-soft">
        <FolderKanban size={32} className="text-primary" />
      </div>

      {/* Heading & desc */}
      <h1 className="mb-2 text-2xl font-bold text-navy">Page not found</h1>
      <p className="mb-8 max-w-sm text-sm text-muted">
        The page you're looking for doesn't exist or has been moved. Let's get
        you back on track.
      </p>

      {/* CTA */}
      <Link to="/" className={btnPrimary}>
        Go to Dashboard
      </Link>
    </div>
  );
}
