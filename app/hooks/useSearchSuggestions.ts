import { SearchIndex } from "@/types/Products";
import Fuse from "fuse.js";
import { useMemo } from "react";

export function useSearchResults(query: string, data: SearchIndex[]) {
  return useMemo(() => {
    if (!query.trim() || !data?.length) return [];

    const fuse = new Fuse(data, {
      keys: ["Name", "Category", "Tags"],
      threshold: 0.3,
    });

    return fuse.search(query).map((res) => res.item);
  }, [query, data]);
}
