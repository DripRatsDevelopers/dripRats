/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAuth } from "firebase/auth";

type Method = "GET" | "POST" | "PUT" | "DELETE";

interface ApiOptions {
  method?: Method;
  body?: any;
  headers?: Record<string, string>;
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
    throw new Error(error.message || "API Error");
  }

  return res.json();
}
