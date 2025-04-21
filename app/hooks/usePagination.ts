// hooks/usePagination.tsx

"use client";

import { useApiRequest } from "@/lib/apiClient";
import { useEffect, useState } from "react";

export function usePagination<T>(
  url: string,
  limit: number = 10,
  responseKey?: string,
  params?: Record<string, string>
) {
  const [allData, setAllData] = useState<T[] | undefined>();
  const [previousKey, setPreviousKey] = useState<string | null>(null);
  const [nextKey, setNextKey] = useState<string | null>(null);

  const { data, setData, loading, refetch, error } = useApiRequest({
    url,
    queryParams: {
      ...params,
      limit: limit.toString(),
      ...(nextKey && { lastEvaluatedKey: nextKey || "" }),
    },
  });

  useEffect(() => {
    const updatedData = responseKey ? data?.[responseKey] : data;
    if (!allData && !loading && updatedData) {
      setAllData(updatedData);
    }
  }, [allData, data, loading, responseKey]);

  useEffect(() => {
    if (!nextKey && data?.lastEvaluatedKey && !previousKey) {
      setNextKey(data?.lastEvaluatedKey);
    }
  }, [data?.lastEvaluatedKey, nextKey, previousKey]);

  const loadMore = async () => {
    if (!loading && previousKey !== nextKey) {
      const paginatedData = await refetch({
        ...params,
        limit: limit.toString(),
        ...(nextKey && { lastEvaluatedKey: nextKey || "" }),
      });
      const responseData = responseKey
        ? paginatedData?.[responseKey]
        : paginatedData;

      setAllData((prev: T[] | undefined) => [
        ...(prev ? prev : []),
        ...responseData,
      ]);
      const storedNextKey = nextKey;
      setPreviousKey(storedNextKey);
      setNextKey(paginatedData?.lastEvaluatedKey);
    }
  };

  const resetPagination = () => {
    setNextKey(null);
    setAllData([]);
    setData(null);
  };

  return {
    allData,
    setAllData,
    loading,
    error,
    hasMore: !!nextKey,
    loadMore,
    resetPagination,
  };
}
