"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";

type Method = "GET" | "POST" | "PUT" | "DELETE";

interface ApiOptions {
  method?: Method;
  body?: any;
  headers?: Record<string, string>;
  immediate?: boolean;
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

export function useApiRequest<T = any>(
  url: string,
  options: ApiOptions = { immediate: true }
) {
  const auth = getAuth();
  const user = auth.currentUser;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async (endPoint?: any) => {
    const apiUrl = endPoint || url;
    if (!apiUrl) return;
    const token = user ? await user.getIdToken() : null;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(apiUrl, {
        method: options.method || "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        body: options?.body ? JSON.stringify(options?.body) : undefined,
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
        setData(response?.body?.data);
      }
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options?.immediate !== false && url && !loading && !data) {
      fetchData();
    }
  }, [url, loading, data, options?.immediate]);

  return { data, error, loading, refetch: fetchData, setData };
}
