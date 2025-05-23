"use client";

import { Badge } from "@/components/ui/badge";
import { useSearchIndex } from "@/hooks/useSearchIndex";
import { useSearchResults } from "@/hooks/useSearchSuggestions";
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
              <Skeleton className="w-1/2 h-5" />
              <Skeleton className="w-1/4 h-4" />
            </div>
            <div className="text-xs mt-2">
              <Skeleton className="w-1/4 mt-2 h-3" />
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
                  className="text-xs cursor-pointer p-2 rounded-xl bg-gray-50"
                >
                  {cat}
                </Badge>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
      {!isMobile ? (
        <div>
          <Button
            variant="ghost"
            className="w-full text-primary font-semibold border-top"
            onClick={() => {
              onSelect(query);
              if (handleSearch) handleSearch(query);
            }}
          >
            Search for &quot;{query?.trim()}&quot; <ArrowRight />
          </Button>
        </div>
      ) : null}
    </div>
  );
}
