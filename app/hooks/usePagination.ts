// hooks/usePagination.tsx

"use client";

import { useApiRequest } from "@/lib/apiClient";
import { useEffect, useState } from "react";

export const usePagination = (
  url: string,
  params?: Record<string, string>,
  limit: number = 10
) => {
  const [nextKey, setNextKey] = useState<string | null>(null);

  const queryString = new URLSearchParams({
    ...params,
    limit: limit.toString(),
    lastEvaluatedKey: nextKey || "",
  }).toString();

  const updatedUrl = `${url}?${queryString}`;

  const { data, setData, loading, refetch, error } = useApiRequest(updatedUrl);

  useEffect(() => {
    if (data?.lastEvaluatedKey !== nextKey) {
      setNextKey(data?.lastEvaluatedKey);
    }
  }, [data, nextKey]);

  const loadMore = () => {
    refetch(updatedUrl);
  };

  const resetPagination = () => {
    setNextKey(null);
    setData(null);
  };

  return {
    data: data?.orders || [],
    loading,
    error,
    hasMore: !!nextKey,
    loadMore,
    resetPagination,
  };
};
