import { useQuery } from "@tanstack/react-query";

interface UserRow {
  id: number;
  fullName: string;
  email: string;
  designation: string;
  active: boolean;
}

interface Page<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

async function fetchUsers(): Promise<Page<UserRow>> {
  const res = await fetch("http://localhost:8080/api/v1/users?page=0&size=5");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export default function App() {
  // queryKey identifies the cached data; queryFn fetches it.
  const { data, isPending, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["users", { page: 0, size: 5 }],
    queryFn: fetchUsers,
  });

  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-bold text-slate-800">PMS: first API call</h1>

      {isPending && <p className="mt-4 text-slate-500">Loading...</p>}

      {isError && (
        <p className="mt-4 rounded bg-red-50 p-3 text-red-700">
          Failed: {error.message}. Check the browser console for a CORS error.
        </p>
      )}

      {data && (
        <>
          <p className="mt-4 text-slate-600">
            Total users in database: <b>{data.totalElements}</b>
          </p>
          <ul className="mt-3 divide-y rounded border bg-white">
            {data.content.map((u) => (
              <li key={u.id} className="flex justify-between p-3">
                <span>
                  {u.fullName}{" "}
                  <span className="text-sm text-slate-500">({u.email})</span>
                </span>
                <span className={u.active ? "text-green-600" : "text-slate-400"}>
                  {u.active ? "active" : "inactive"}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}

      <button
        onClick={() => refetch()}
        disabled={isFetching}
        className="mt-4 rounded bg-indigo-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {isFetching ? "Refreshing..." : "Refetch"}
      </button>
    </div>
  );
}