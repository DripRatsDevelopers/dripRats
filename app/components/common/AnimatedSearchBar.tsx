import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";

const AnimatedSearchBar = ({
  handleSearch,
}: {
  handleSearch: (searchTerm: string) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch(searchTerm);
      }}
    >
      <div className="relative flex items-center">
        <Input
          type="text"
          placeholder="Search the Drip..."
          className="w-100 p-2 pl-10 rounded-full border-0 focus:border focus:border-gray-300 bg-gray-100 focus:bg-transparent  focus:ring-2 focus:ring-blue-500"
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
        <SearchIcon className="absolute left-3 h-5 w-5 text-gray-400" />
      </div>
    </form>
  );
};

export default AnimatedSearchBar;
