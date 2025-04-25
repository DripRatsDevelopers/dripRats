import { sortOptions } from "@/constants/GeneralConstants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function FilterBar({
  onSortChange,
  sortKey,
}: {
  onSortChange: (value: string) => void;
  sortKey: string;
}) {
  const placeHolder = sortOptions.find(({ value }) => value === sortKey)?.label;
  return (
    <div className="flex items-center justify-end mb-6">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Sort By:</span>
        <Select onValueChange={onSortChange} value={sortKey}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={placeHolder} />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map(({ value, label }) => {
              return <SelectItem value={value}>{label}</SelectItem>;
            })}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
