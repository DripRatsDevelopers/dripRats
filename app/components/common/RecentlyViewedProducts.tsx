"use client";

import { useDripratsQuery } from "@/hooks/useTanstackQuery";
import { apiFetch } from "@/lib/apiClient";
import ProductCard from "@/shop/components/ProductCard";
import { Product } from "@/types/Products";
import { useEffect, useState } from "react";

export async function fetchRecentlyViewed(ids: string[]): Promise<Product[]> {
  const params = new URLSearchParams();
  if (ids && ids.length > 0) params.set("productIds", ids.join(","));
  const response = await apiFetch(`/api/products?${params.toString()}`);

  if (!response?.body?.success) throw new Error("Failed to fetch products");

  const {
    body: { data },
  } = response;
  return data?.products;
}

export default function RecentlyViewedProducts() {
  const [productIds, setProductIds] = useState<string[]>([]);

  useEffect(() => {
    const ids = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
    setProductIds(ids);
  }, []);

  const { data: products, isLoading } = useDripratsQuery({
    queryKey: ["recentlyViewed", productIds],
    queryFn: () => fetchRecentlyViewed(productIds),
    options: { enabled: productIds.length > 0 }, // Only run if we have IDs
  });

  if (isLoading || !products?.length) return null;

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Recently Viewed Products</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 md:justify-center">
        {products.map((product, index) => (
          <ProductCard
            key={`${product.ProductId}-${index}`}
            product={product}
          />
        ))}
      </div>
    </div>
  );
}
