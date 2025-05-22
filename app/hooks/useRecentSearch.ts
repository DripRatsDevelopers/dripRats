import { useEffect, useState } from "react";

const STORAGE_KEY = "recent_searches";
const MAX_ITEMS = 5;

export function useRecentSearches() {
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setRecent(JSON.parse(stored));
  }, []);

  const addSearch = (query: string) => {
    const updated = [query, ...recent.filter((q) => q !== query)].slice(
      0,
      MAX_ITEMS
    );
    setRecent(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const clearAll = () => {
    localStorage.removeItem(STORAGE_KEY);
    setRecent([]);
  };

  const removeQuery = (query: string) => {
    const updated = recent.filter((q) => q !== query);
    setRecent(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return { recent, addSearch, clearAll, removeQuery };
}
