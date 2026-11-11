import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listAllUsers } from "../api/users";
import { listMembers } from "../api/members";
import { useToast } from "../toast/toast-context";

// Runs the call, then refreshes all data, shows a success toast and runs onDone.
// Failures are already toasted by the query client (QueryProvider).
export function useApiMutation<TData, TVars = void>(
  fn: (vars: TVars) => Promise<TData>,
  successMessage?: string,
  onDone?: (data: TData) => void,
) {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: fn,
    onSuccess: (data) => {
      qc.invalidateQueries();
      if (successMessage) toast.success(successMessage);
      onDone?.(data);
    },
  });
}

export function useAllUsers() {
  return useQuery({ queryKey: ["users", "all"], queryFn: listAllUsers });
}

export function useMembers(projectId: number) {
  return useQuery({
    queryKey: ["members", projectId],
    queryFn: () => listMembers(projectId),
  });
}