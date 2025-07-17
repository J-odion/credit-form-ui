import { QueryClient } from "@tanstack/react-query"

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: how long data is considered fresh (5 minutes)
      staleTime: 5 * 60 * 1000,
      // Cache time: how long data stays in cache when not used (10 minutes)
      gcTime: 10 * 60 * 1000,
      // Retry failed requests 3 times with exponential backoff
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus for better UX
      refetchOnWindowFocus: false,
      // Don't refetch on reconnect for form submissions
      refetchOnReconnect: false,
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
      retryDelay: 2000,
    },
  },
})
