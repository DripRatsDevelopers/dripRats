import { dripRatsFetch, Method } from "@/lib/apiClient";
import {
  InfiniteData,
  QueryFunctionContext,
  useInfiniteQuery,
  UseInfiniteQueryResult,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";

export interface PaginatedResponse<T> {
  Items: T[];
  LastEvaluatedKey?: Record<string, number | string | boolean> | null;
}

interface UseInfinitePaginatedQueryOptions<T> {
  queryKey: [string];
  fetchPage: (
    lastKey: Record<string, number | string | boolean> | null
  ) => Promise<PaginatedResponse<T>>;
  enabled?: boolean;
}

interface IDripRatsQuery<TData, TError> {
  queryKey: string | unknown[];
  apiParams?: {
    url: string;
    options?: RequestInit;
    headers?: Record<string, string>;
  };
  queryFn?: () => Promise<TData>;
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">;
}

interface IDripratsMutation<TData, TError, TVariables> {
  apiParams: {
    method?: Method;
    url: string;
    body?: unknown;
    headers?: Record<string, string>;
  };
  mutationFn?: (variables: TVariables) => Promise<TData>;
  options?: Omit<
    UseMutationOptions<TData, TError, TVariables, unknown>,
    "mutationFn"
  >;
}
export function useInfinitePaginatedQuery<T>({
  queryKey,
  fetchPage,
  enabled = true,
}: UseInfinitePaginatedQueryOptions<T>): UseInfiniteQueryResult<
  InfiniteData<PaginatedResponse<T>>,
  Error
> {
  return useInfiniteQuery<
    PaginatedResponse<T>,
    Error,
    InfiniteData<PaginatedResponse<T>>,
    [string],
    Record<string, number | string | boolean> | null
  >({
    queryKey,
    queryFn: async ({
      pageParam,
    }: QueryFunctionContext<
      [string],
      Record<string, number | string | boolean> | null
    >) => await fetchPage(pageParam),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.LastEvaluatedKey ?? undefined,
    enabled,
    staleTime: 1000 * 60 * 20,
    refetchOnWindowFocus: false,
  });
}

export function useDripratsQuery<TData, TError = Error>({
  queryKey,
  apiParams,
  queryFn,
  options,
}: IDripRatsQuery<TData, TError>): UseQueryResult<TData, TError> {
  return useQuery({
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
    queryFn: queryFn ? queryFn : () => dripRatsFetch(apiParams),
    staleTime: 1000 * 60 * 20,
    refetchOnWindowFocus: false,
    ...options,
  });
}

export function useDripratsMutation<TData, TVariables = void, TError = Error>({
  mutationFn,
  apiParams,
  options,
}: IDripratsMutation<TData, TError, TVariables>): UseMutationResult<
  TData,
  TError,
  TVariables
> {
  return useMutation({
    mutationFn: mutationFn ? mutationFn : () => dripRatsFetch(apiParams),
    ...options,
  });
}
