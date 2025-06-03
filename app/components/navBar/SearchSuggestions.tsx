"use client";

import { Badge } from "@/components/ui/badge";
import { useSearchIndex } from "@/hooks/useSearchIndex";
import { useSearchResults } from "@/hooks/useSearchSuggestions";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { ProductSuggestionCard } from "./ProductSuggestionsCard";

type Props = {
  query: string;
  isMobile?: boolean;
  onSelect: (query: string) => void;
  handleSearch?: (searchTerm: string) => void;
};

export default function SearchSuggestions({
  query,
  isMobile,
  onSelect,
  handleSearch,
}: Props) {
  const { data, isLoading } = useSearchIndex();
  const searchResults = useSearchResults(data, query);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="p-3">
            <div className="flex justify-between items-center">
              <Skeleton
                className={cn("w-1/2 h-5", "bg-gray-200 dark:bg-gray-700")}
              />
              <Skeleton
                className={cn("w-1/4 h-4", "bg-gray-200 dark:bg-gray-700")}
              />
            </div>
            <div className="text-xs mt-2">
              <Skeleton
                className={cn("w-1/4 mt-2 h-3", "bg-gray-200 dark:bg-gray-700")}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const results = isMobile ? searchResults.slice(0, 4) : searchResults;
  const matchedCategories = Array.from(new Set(results.map((p) => p.Category)));
  const showProducts = results.length > 0;
  const showCategoriesOnly = !showProducts && matchedCategories.length > 0;

  return (
    <div>
      <div className="space-y-4 max-h-[60vh] overflow-y-auto">
        {showProducts ? (
          <div className="space-y-3">
            {results.map((product, index) => (
              <ProductSuggestionCard
                key={`${product.ProductId}-${index}`}
                product={product}
                onSelect={() => {
                  onSelect(product.Name);
                }}
              />
            ))}
          </div>
        ) : showCategoriesOnly ? (
          <div className="flex flex-wrap gap-2">
            {matchedCategories.map((cat) => (
              <Link key={cat} href={`/shop/${cat}`}>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs cursor-pointer p-2 rounded-xl transition-colors duration-200",
                    // Dark mode category badges
                    "bg-gray-50 dark:bg-gray-700",
                    "text-gray-700 dark:text-gray-300",
                    "border-gray-200 dark:border-gray-600",
                    "hover:bg-gray-100 dark:hover:bg-gray-600"
                  )}
                >
                  {cat}
                </Badge>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
      {!isMobile && (
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="ghost"
            className={cn(
              "w-full font-semibold transition-colors duration-200",
              // Dark mode search button
              "text-blue-600 dark:text-blue-400",
              "hover:text-blue-700 dark:hover:text-blue-300",
              "hover:bg-blue-50 dark:hover:bg-blue-900/20"
            )}
            onClick={() => {
              onSelect(query);
              if (handleSearch) handleSearch(query);
            }}
          >
            Search for &quot;{query?.trim()}&quot;
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
