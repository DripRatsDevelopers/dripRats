import { X } from "lucide-react";

interface IRecentSearch {
  clearAll: () => void;
  recent: string[];
  handleSearch: (query: string) => void;
  removeQuery: (query: string) => void;
}

const RecentSearches = ({
  clearAll,
  recent,
  handleSearch,
  removeQuery,
}: IRecentSearch) => {
  return (
    <div className="text-sm space-y-1">
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
            className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full cursor-pointer hover:bg-muted/70"
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
  );
};

export default RecentSearches;
