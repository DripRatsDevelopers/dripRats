import { useRecentSearches } from "@/hooks/useRecentSearch";
import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import SearchFloater from "../navBar/SearchFloater";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const AnimatedSearchBar = ({
  handleSearch,
}: {
  handleSearch: (searchTerm: string) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { recent } = useRecentSearches();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full max-w-lg mx-auto min-w-[400px]",
        // Dark mode container styles
        "bg-white dark:bg-gray-900",
        "border border-gray-200 dark:border-gray-700",
        "rounded-lg shadow-sm dark:shadow-gray-900/20",
        "transition-all duration-200 ease-in-out",
        "hover:shadow-md dark:hover:shadow-gray-900/30",
        showSuggestions && "shadow-lg dark:shadow-gray-900/40"
      )}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSearchTerm("");
          handleSearch(searchTerm);
          setShowSuggestions(false);
        }}
        className="flex items-center"
      >
        <div className="relative flex-1">
          <Input
            className={cn(
              "w-full pr-16 py-3 text-base",
              "bg-transparent",
              "border-none outline-none ring-0 focus-visible:ring-0",
              // Dark mode text and placeholder styles
              "text-gray-900 dark:text-gray-100",
              "placeholder:text-gray-500 dark:placeholder:text-gray-400",
              "transition-colors duration-200"
            )}
            placeholder="Search..."
            onChange={(e) => {
              setShowSuggestions(true);
              setSearchTerm(e.target.value);
            }}
            onFocus={() => {
              if (searchTerm.length || recent?.length > 0) {
                setShowSuggestions(true);
              }
            }}
            value={searchTerm}
          />

          {/* Search Button - positioned inside input */}
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className={cn(
              "absolute right-2 top-1/2 transform -translate-y-1/2",
              "h-8 px-3 rounded-md",
              // Dark mode button styles
              "text-gray-600 dark:text-gray-400",
              "hover:text-gray-900 dark:hover:text-gray-100",
              "hover:bg-gray-100 dark:hover:bg-gray-700",
              "transition-all duration-200",
              "text-sm font-medium"
            )}
          >
            <SearchIcon className="h-4 w-4" />
          </Button>
        </div>
      </form>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && (
        <div
          className={cn(
            "absolute top-full left-0 right-0 mt-1 z-50",
            // Dark mode dropdown styles
            "bg-white dark:bg-gray-800",
            "border border-gray-200 dark:border-gray-700",
            "rounded-lg shadow-lg dark:shadow-gray-900/40",
            "transition-all duration-200 ease-in-out"
          )}
        >
          <SearchFloater
            searchTerm={searchTerm}
            onClose={() => {
              setSearchTerm("");
              setShowSuggestions(false);
            }}
            handleSearch={handleSearch}
          />
        </div>
      )}
    </div>
  );
};

export default AnimatedSearchBar;
