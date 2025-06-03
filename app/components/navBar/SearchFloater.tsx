import { useRecentSearches } from "@/hooks/useRecentSearch";
import { cn } from "@/lib/utils";
import RecentSearches from "./RecentSearches";
import SearchSuggestions from "./SearchSuggestions";

type Props = {
  searchTerm: string;
  onClose: () => void;
  handleSearch: (searchTerm: string) => void;
};

export default function SearchFloater({
  searchTerm,
  onClose,
  handleSearch,
}: Props) {
  const { recent, addSearch, clearAll, removeQuery } = useRecentSearches();

  return (
    <div
      className={cn(
        "absolute top-full mt-2 w-full z-50 rounded-xl p-4 max-h-[80vh] overflow-y-auto",
        // Dark mode background and borders
        "bg-white dark:bg-gray-800",
        "border border-gray-200 dark:border-gray-700",
        "shadow-xl dark:shadow-gray-900/40",
        "transition-colors duration-200"
      )}
    >
      {recent.length > 0 && (
        <div className="mb-4">
          <RecentSearches
            handleSearch={(q) => {
              handleSearch(q);
              onClose();
            }}
            recent={recent}
            clearAll={clearAll}
            removeQuery={removeQuery}
          />
        </div>
      )}
      {searchTerm ? (
        <SearchSuggestions
          query={searchTerm}
          onSelect={(query) => {
            onClose();
            addSearch(query);
          }}
          handleSearch={(searchTerm) => {
            handleSearch(searchTerm);
            addSearch(searchTerm);
            onClose();
          }}
        />
      ) : null}
    </div>
  );
}
