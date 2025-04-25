"use client";

import { ApiWrapper } from "@/components/common/ApiWrapper";
import InfiniteScroll from "@/components/common/InfiniteScroll";
import FilterBar from "@/components/navBar/FilterBar";
import { Skeleton } from "@/components/ui/skeleton";
import { sortOptions } from "@/constants/GeneralConstants";
import { useInfiniteProducts } from "@/hooks/useInfiniteProducts";
import { useWishlist } from "@/hooks/useWishlist";
import { capitalize } from "@/lib/utils";
import { useParams } from "next/navigation";
import { useState } from "react";
import ProductCard from "../components/ProductCard";

export default function ProductsPage() {
  const { category } = useParams();
  const categoryName: string | undefined =
    category?.toString().toLowerCase() !== "all" ? category?.toString() : "";

  const [sortKey, setSortKey] = useState(sortOptions[0]?.value);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteProducts({ category: categoryName, sort: sortKey });

  const products = data?.pages.flatMap((page) => page.Items);

  const { toggleWishlist, isInWishlist } = useWishlist();

  const handleSortChange = (value: string) => {
    setSortKey(value);
  };

  let title = "All Products";
  if (categoryName) {
    title = `${capitalize(categoryName.toString())} Collections`;
  }

  return (
    <div className="m-4 md:m-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mb-6 gap-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <FilterBar onSortChange={handleSortChange} sortKey={sortKey} />
      </div>
      <div className={"w-full"}>
        <ApiWrapper
          data={products?.length}
          loading={isLoading}
          skeleton={
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5  gap-4">
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5  gap-4">
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5  gap-4">
              {products &&
                products.map((product, index) => (
                  <ProductCard
                    key={`${product.ProductId}-${index}`}
                    product={product}
                    isInWishlist={isInWishlist}
                    toggleWishlist={toggleWishlist}
                    category={categoryName}
                  />
                ))}
            </div>
          </InfiniteScroll>
        </ApiWrapper>
      </div>
    </div>
  );
}
