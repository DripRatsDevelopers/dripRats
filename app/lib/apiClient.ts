"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";

export type Method = "GET" | "POST" | "PUT" | "DELETE";

interface ApiOptions {
  method?: Method;
  body?: any;
  headers?: Record<string, string>;
}

interface FetchOptions {
  url: string;
  method?: Method;
  body?: any;
  headers?: Record<string, string>;
  autoFetch?: boolean;
  queryParams?: Record<string, any>;
  skip?: boolean;
}

export async function apiFetch<T = any>(
  url: string,
  options: ApiOptions = {}
): Promise<T> {
  const auth = getAuth();
  const user = auth.currentUser;
  const token = user ? await user.getIdToken() : null;

  const res = await fetch(url, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || error?.data?.message || "API Error");
  }

  return res.json();
}

export function useApiRequest<T = any>({
  url,
  method = "GET",
  body,
  headers = {},
  autoFetch = true,
  queryParams,
  skip = false,
}: FetchOptions) {
  const auth = getAuth();
  const user = auth.currentUser;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const buildUrlWithParams = (apiQueryParams?: Record<string, any>): string => {
    const apiParams = apiQueryParams || queryParams;
    if (!apiParams) return url;
    const query = new URLSearchParams(apiParams).toString();
    return `${url}?${query}`;
  };

  const fetchData = async (apiQueryParams?: Record<string, any>) => {
    if (!url || skip) return;
    const token = user ? await user.getIdToken() : null;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(buildUrlWithParams(apiQueryParams), {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      const response = await res.json();
      if (!res.ok || response?.body?.error)
        setError(
          response.message ||
            response?.data?.message ||
            response?.error ||
            "API Error"
        );
      else if (response?.body?.success) {
        const data = response?.body?.data;
        setData(data);
        return data;
      }
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch && !skip) {
      fetchData();
    }
  }, []);

  return { data, error, loading, refetch: fetchData, setData };
}

export async function dripRatsFetch({
  url,
  method = "GET",
  body,
  headers = {},
}: FetchOptions) {
  if (!url) return;
  const auth = getAuth();
  const user = auth.currentUser;

  const token = user ? await user.getIdToken() : null;

  const res = await fetch(url, {
    method: method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const response = await res.json();
  if (!res.ok) {
    throw new Error(response.message || response?.data?.message || "API Error");
  }
  const data = response?.body?.data;
  return data;
}
