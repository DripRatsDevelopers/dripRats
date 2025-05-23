import { useRecentSearches } from "@/hooks/useRecentSearch";
import RecentSearches from "./RecentSearches";
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
        <RecentSearches
          handleSearch={(q) => {
            handleSearch(q);
          }}
          recent={recent}
          clearAll={clearAll}
          removeQuery={removeQuery}
        />
      )}
      <SearchSuggestions
        query={query}
        onSelect={(query) => {
          onSelect();
          addSearch(query);
        }}
        handleSearch={(searchTerm) => {
          handleSearch(searchTerm);
          addSearch(searchTerm);
        }}
      />
    </div>
  );
}
