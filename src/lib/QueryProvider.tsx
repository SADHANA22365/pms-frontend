import { useState, type ReactNode } from "react";
import { MutationCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getErrorMessage } from "../api/client";
import { useToast } from "../toast/toast-context";

export default function QueryProvider({ children }: { children: ReactNode }) {
  const toast = useToast();

  const [client] = useState(
    () =>
      new QueryClient({
        // Any failed mutation (create, update, delete, status change) shows a toast.
        mutationCache: new MutationCache({
          onError: (error) => toast.error(getErrorMessage(error)),
        }),
        defaultOptions: {
          queries: { retry: false, refetchOnWindowFocus: false },
        },
      }),
  );

  return (
    <QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}