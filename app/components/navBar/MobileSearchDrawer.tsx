"use client";

import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PRODUCT_CATEGORY } from "@/constants/GeneralConstants";
import { useRecentSearches } from "@/hooks/useRecentSearch";
import { ArrowRight, ChevronLeft, Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import RecentSearches from "./RecentSearches";
import SearchSuggestions from "./SearchSuggestions";

export function MobileSearchDrawer() {
  const [searchText, setSearchText] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const { recent, addSearch, clearAll, removeQuery } = useRecentSearches();

  const handleClearSearch = () => {
    setSearchText("");
  };

  const handleSearch = (query?: string) => {
    const searchQuery = query ?? searchText;
    if (!searchQuery.trim()) return;
    addSearch(searchQuery.trim());
    router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    setIsOpen(false);
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
          <div className="flex items-center relative w-full">
            <Search className="h-5 w-5 text-gray-500 absolute left-2" />
            <Input
              autoFocus
              placeholder="Search the Drip..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="p-2 pl-10 rounded-full border-0 bg-gray-100 text-sm"
            />

            {searchText && (
              <Button
                onClick={handleClearSearch}
                className="text-gray-500 absolute right-1"
                variant="ghost"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        {recent.length > 0 && (
          <RecentSearches
            handleSearch={(q) => {
              setSearchText(q);
              handleSearch();
            }}
            recent={recent}
            clearAll={clearAll}
            removeQuery={removeQuery}
          />
        )}
        {searchText ? (
          <SearchSuggestions
            query={searchText}
            isMobile
            onSelect={(query) => {
              setIsOpen(false);
              addSearch(query);
            }}
          />
        ) : null}

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Popular Searches</p>
          <div className="flex gap-2 flex-wrap">
            {PRODUCT_CATEGORY.map((item) => (
              <Button
                key={item.slug}
                className="bg-muted font-normal px-3 py-1 rounded-full text-sm hover:bg-primary/10"
                onClick={() => {
                  setIsOpen(false);
                }}
                variant="link"
              >
                <Link
                  key={item.slug}
                  href={`/shop/${item.slug}`}
                  className="w-full"
                >
                  {item.name}
                </Link>
              </Button>
            ))}
          </div>
        </div>

        {searchText.trim() ? (
          <div className="pb-4">
            <Button
              variant="ghost"
              onClick={() => handleSearch()}
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
