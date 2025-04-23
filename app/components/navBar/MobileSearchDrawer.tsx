"use client";

import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ArrowRight, ChevronLeft, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";

export function MobileSearchDrawer() {
  const [searchText, setSearchText] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  // Handle clearing input
  const handleClearSearch = () => {
    setSearchText("");
  };

  const handleSearch = () => {
    if (!searchText.trim()) return;
    router.push(`/shop/search?term=${encodeURIComponent(searchText.trim())}`);
    setIsOpen(false); // Close the sheet
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="py-2 px-1 text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white">
          <Search className="h-5 w-5" />
        </button>
      </SheetTrigger>

      <SheetContent
        side="bottom"
        className="h-[80vh] rounded-t-xl px-4 pt-4 [&>button:last-child]:hidden overflow-auto"
      >
        {/* Back arrow and search input row */}
        <div className="flex items-center gap-2 mb-4">
          <SheetClose asChild>
            <button className="text-gray-500 hover:text-black dark:hover:text-white text-xl font-medium">
              <ChevronLeft className="h-6 w-6" />
            </button>
          </SheetClose>

          {/* Search input */}
          <div className="flex items-center w-full bg-muted rounded-lg px-3">
            <Search className="h-5 w-5 text-gray-500" />
            <Input
              autoFocus
              placeholder="Search Driprats..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="flex-1 text-md bg-transparent border-none outline-none"
            />
            {/* Clear button */}
            {searchText && (
              <button onClick={handleClearSearch} className="text-gray-500">
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Suggested Tags */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Popular Searches</p>
          <div className="flex gap-2 flex-wrap">
            {["Chains", "Earrings", "Rings", "Luxury Sets"].map((item) => (
              <button
                key={item}
                className="bg-muted px-3 py-1 rounded-full text-sm hover:bg-primary/10"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        {searchText.trim() ? (
          <div className="pb-4">
            <Button
              variant="ghost"
              onClick={handleSearch}
              className="w-full text-primary font-semibold"
            >
              Search for &quot;{searchText?.trim()}&quot; <ArrowRight />
            </Button>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
