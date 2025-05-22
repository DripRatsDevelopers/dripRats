import { useRecentSearches } from "@/hooks/useRecentSearch";
import { X } from "lucide-react";
import SearchSuggestions from "./SearchSuggestions";

type Props = {
  query: string;
  show: boolean;
  onSelect: () => void;
  handleSearch: (searchTerm: string) => void;
};

export default function SearchFloater({
  query,
  show,
  onSelect,
  handleSearch,
}: Props) {
  const { recent, addSearch, clearAll, removeQuery } = useRecentSearches();

  if (!show || !query) return null;

  return (
    <div className="bg-secondary absolute top-full mt-2 w-full  z-50 border border-white/20 dark:border-white/10 shadow-xl rounded-xl p-4">
      {recent.length > 0 && (
        <div className="text-sm space-y-1 mb-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Recent searches</span>
            <button className="text-xs text-red-500" onClick={clearAll}>
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recent.map((q) => (
              <div
                key={q}
                className="flex items-center bg-white dark:bg-black gap-1 border px-3 py-1 rounded-full cursor-pointer hover:bg-muted/70"
                onClick={() => {
                  handleSearch(q);
                }}
              >
                <span>{q}</span>
                <X
                  className="h-3 w-3 text-muted-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeQuery(q);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      <SearchSuggestions
        query={query}
        onSelect={onSelect}
        handleSearch={(searchTerm) => {
          handleSearch(searchTerm);
          addSearch(searchTerm);
        }}
      />
    </div>
  );
}
