import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="py-12 text-center">
      <h1 className="text-2xl font-bold">Page not found</h1>
      <Link to="/" className="mt-3 inline-block text-indigo-600 underline">
        Back to dashboard
      </Link>
    </div>
  );
}