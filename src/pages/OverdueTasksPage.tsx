import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { listOverdueTasks } from "../api/tasks";
import { EmptyState, ErrorBox, Loading } from "../components/Feedback";
import Pagination from "../components/Pagination";
import TaskTable from "../components/TaskTable";
import PageHeader from "../components/PageHeader";
import { items, pageOf } from "../lib/unwrap";
import { Clock, CheckCircle2 } from "lucide-react";

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
      <PageHeader
        title="Overdue Tasks"
        subtitle="Tasks across all projects past their due date requiring immediate attention."
        badge={
          list.length > 0 ? (
            <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-danger-bg text-danger-text border border-danger-border">
              <Clock className="h-3 w-3" />
              {list.length} Overdue
            </span>
          ) : undefined
        }
      />

      <div className="mt-4">
        {isPending && <Loading label="Checking overdue tasks..." />}
        {isError && <ErrorBox error={error} onRetry={() => refetch()} />}
        {data && list.length === 0 && (
          <EmptyState
            message="No overdue tasks found. All deadlines are currently on track!"
            icon={<CheckCircle2 className="h-6 w-6 text-success" />}
          />
        )}
        {list.length > 0 && <TaskTable tasks={list} showProject />}
        {pg && (
          <Pagination
            page={pg.page}
            totalPages={pg.totalPages}
            onChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
