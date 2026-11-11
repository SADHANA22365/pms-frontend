import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { listOverdueTasks } from "../api/tasks";
import { EmptyState, ErrorBox, Loading } from "../components/Feedback";
import Pagination from "../components/Pagination";
import TaskTable from "../components/TaskTable";
import { items, pageOf } from "../lib/unwrap";

export default function OverdueTasksPage() {
  const [page, setPage] = useState(0);
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["tasks", "overdue", { page }],
    queryFn: () => listOverdueTasks(page),
    placeholderData: keepPreviousData,
  });
  const list = items(data);
  const pg = pageOf(data);

  return (
    <div>
      <h1 className="text-2xl font-bold">Overdue tasks</h1>
      <div className="mt-4">
        {isPending && <Loading />}
        {isError && <ErrorBox error={error} onRetry={() => refetch()} />}
        {data && list.length === 0 && <EmptyState message="Nothing is overdue." />}
        {list.length > 0 && <TaskTable tasks={list} showProject />}
        {pg && <Pagination page={pg.page} totalPages={pg.totalPages} onChange={setPage} />}
      </div>
    </div>
  );
}