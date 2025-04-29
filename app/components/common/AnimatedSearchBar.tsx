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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSearchTerm("");
        handleSearch(searchTerm);
        setShowSuggestions(false);
      }}
    >
      <div className="relative flex items-center" ref={containerRef}>
        <Input
          type="text"
          placeholder="Search the Drip..."
          className="w-100 p-2 pl-10 rounded-full border-0 focus:border focus:border-gray-300 bg-gray-100 focus:bg-transparent  focus:ring-2 focus:ring-blue-500"
          onChange={(e) => {
            setShowSuggestions(true);
            setSearchTerm(e.target.value);
          }}
          onFocus={() => {
            if (searchTerm.length) {
              setShowSuggestions(true);
            }
          }}
          value={searchTerm}
        />
        <Button
          variant="link"
          className={cn(
            "absolute left-1",
            !searchTerm?.trim() ? "pointer-events-none" : "cursor-pointer"
          )}
        >
          <SearchIcon className="h-5 w-5 text-gray-400" />
        </Button>{" "}
        <SearchFloater
          query={searchTerm}
          show={showSuggestions}
          onSelect={() => {
            setSearchTerm("");
            setShowSuggestions(false);
          }}
          handleSearch={handleSearch}
        />
      </div>
    </form>
  );
};

export default AnimatedSearchBar;
