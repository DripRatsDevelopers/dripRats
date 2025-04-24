"use client";

import { ApiWrapper } from "@/components/common/ApiWrapper";
import InfiniteScroll from "@/components/common/InfiniteScroll";
import FilterBar from "@/components/navBar/FilterBar";
import { Skeleton } from "@/components/ui/skeleton";
import { useInfinitePaginatedQuery } from "@/hooks/useTanstackQuery";
import { useWishlist } from "@/hooks/useWishlist";
import { fetchAllProducts } from "@/lib/productUtils";
import { CartType } from "@/types/Cart";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import ProductCard from "./components/ProductCard";

const ShopPage = () => {
  const router = useRouter();
  const searchQuery = useSearchParams().get("search");

  useEffect(() => {
    if (!searchQuery) {
      router.replace("/shop/all"); // Redirect to 'shop/all' page
    }
  }, [searchQuery, router]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfinitePaginatedQuery<CartType>({
      queryKey: "products",
      fetchPage: fetchAllProducts,
    });
  const products = data?.pages.flatMap((page) => page.Items);

  const { toggleWishlist, isInWishlist } = useWishlist();

  const handleSortChange = (value: string) => {
    console.log(value);

    // Trigger your product fetch/sort logic
  };

  let title = "All Products";

  if (searchQuery) {
    title = `Search Results for "${searchQuery}"`;
  }

  return (
    <div className="m-4 md:m-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mb-6 gap-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <FilterBar onSortChange={handleSortChange} />
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
    </div>
  );
};

export default ShopPage;
