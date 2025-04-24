import SearchSuggestions from "./SearchSuggestions";

type Props = {
  query: string;
  show: boolean;
  onSelect: () => void;
};

export default function SearchFloater({ query, show, onSelect }: Props) {
  if (!show || !query) return null;

  return (
    <div className="bg-secondary absolute top-full mt-2 w-full  z-50 border border-white/20 dark:border-white/10 shadow-xl rounded-xl p-4">
      <SearchSuggestions query={query} onSelect={onSelect} />
    </div>
  );
}
