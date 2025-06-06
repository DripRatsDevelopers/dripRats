"use client";

import { ApiWrapper } from "@/components/common/ApiWrapper";
import InfiniteScroll from "@/components/common/InfiniteScroll";
import RecentlyViewedProducts from "@/components/common/RecentlyViewedProducts";
import FilterBar from "@/components/navBar/FilterBar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { sortOptions } from "@/constants/GeneralConstants";
import { useInfiniteProducts } from "@/hooks/useInfiniteProducts";
import { useSearchIndex } from "@/hooks/useSearchIndex";
import { useSearchResults } from "@/hooks/useSearchSuggestions";
import { useWishlist } from "@/hooks/useWishlist";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard";

const LandingPage = () => {
  const router = useRouter();
  const searchQuery = useSearchParams().get("search");

  useEffect(() => {
    if (!searchQuery) {
      router.replace("/shop/all");
    }
  }, [searchQuery, router]);

  const { data: indexData } = useSearchIndex();

  const [sortKey, setSortKey] = useState(sortOptions[0]?.value);

  const searchResults = useSearchResults(indexData, searchQuery);

  const productIds = searchResults.map(({ ProductId }) => ProductId);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteProducts({
      productIds,
      sort: sortKey,
      enabled: !!productIds?.length,
    });

  const products = data?.pages.flatMap((page) => page.Items);

  const { toggleWishlist, isInWishlist } = useWishlist();

  const handleSortChange = (value: string) => {
    setSortKey(value);
  };

  const clearSearch = () => {
    if (searchQuery) {
      const params = new URLSearchParams(searchQuery.toString());

      params.delete("search");

      router.replace(`?${params.toString()}`, { scroll: false });
    }
  };

  let title = "All Products";

  if (searchQuery) {
    title = `Search Results for "${searchQuery}"`;
  }

  return (
    <div className="m-4 md:m-6">
      {!productIds?.length ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">No results found</h2>
          <p className="text-muted-foreground mt-2">
            We couldn’t find anything matching your search.
          </p>
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 text-destructive hover:text-destructive"
              onClick={clearSearch}
            >
              Clear Search
            </Button>
          )}
          <RecentlyViewedProducts />
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mb-6 gap-4">
            <h2 className="text-xl font-semibold">
              {title}
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 text-destructive hover:text-destructive"
                  onClick={clearSearch}
                >
                  Clear Search
                </Button>
              )}
            </h2>
            <FilterBar onSortChange={handleSortChange} sortKey={sortKey} />
          </div>
          <div className={"w-full"}>
            <ApiWrapper
              data={products?.length}
              loading={isLoading}
              skeleton={
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div className="flex flex-col gap-2" key={i}>
                      <Skeleton className="aspect-[3/4] w-full rounded-md" />
                      <Skeleton className="h-4 w-3/4" />
                      <div className="flex gap-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              }
            >
              <InfiniteScroll
                hasMore={hasNextPage}
                loadMore={fetchNextPage}
                loading={isFetchingNextPage}
                loader={
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div className="flex flex-col gap-2" key={i}>
                        <Skeleton className="aspect-[3/4] w-full rounded-md" />
                        <Skeleton className="h-4 w-3/4" />
                        <div className="flex gap-2">
                          <Skeleton className="h-4 w-1/4" />
                          <Skeleton className="h-4 w-1/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                }
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:justify-center">
                  {products &&
                    products.map((product, index) => (
                      <ProductCard
                        key={`${product.ProductId}-${index}`}
                        product={product}
                        isInWishlist={isInWishlist}
                        toggleWishlist={toggleWishlist}
                      />
                    ))}
                </div>
              </InfiniteScroll>
            </ApiWrapper>
          </div>
        </>
      )}
    </div>
  );
};

export default LandingPage;
