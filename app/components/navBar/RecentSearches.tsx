import { cn } from "@/lib/utils";
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
    <div className="text-sm space-y-3">
      <div className="flex justify-between items-center">
        <span
          className={cn(
            "font-medium transition-colors duration-200",
            "text-gray-600 dark:text-gray-400"
          )}
        >
          Recent searches
        </span>
        <button
          className={cn(
            "text-xs font-medium transition-colors duration-200",
            "text-red-500 dark:text-red-400",
            "hover:text-red-600 dark:hover:text-red-300"
          )}
          onClick={clearAll}
        >
          Clear All
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {recent.map((q) => (
          <div
            key={q}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer transition-all duration-200",
              // Dark mode recent search items
              "bg-gray-100 dark:bg-gray-700",
              "hover:bg-gray-200 dark:hover:bg-gray-600",
              "border border-gray-200 dark:border-gray-600",
              "text-gray-700 dark:text-gray-300"
            )}
            onClick={() => {
              handleSearch(q);
            }}
          >
            <span className="text-sm">{q}</span>
            <button
              className={cn(
                "p-0.5 rounded-full transition-colors duration-200",
                "text-gray-500 dark:text-gray-400",
                "hover:text-gray-700 dark:hover:text-gray-200",
                "hover:bg-gray-200 dark:hover:bg-gray-600"
              )}
              onClick={(e) => {
                e.stopPropagation();
                removeQuery(q);
              }}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentSearches;
