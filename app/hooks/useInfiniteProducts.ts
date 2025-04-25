import { apiFetch } from "@/lib/apiClient";
import { Product } from "@/types/Products";
import {
  PaginatedResponse,
  useInfinitePaginatedQuery,
} from "./useTanstackQuery";

type FetchProductsParams = {
  category?: string;
  productIds?: string[];
  sort?: string; // 'name_asc', 'name_desc', 'price_asc'
  pageParam: Record<string, number | string | boolean> | null;
};

async function fetchProducts({
  category,
  productIds,
  sort = "name_asc",
  pageParam = null,
}: FetchProductsParams): Promise<PaginatedResponse<Product>> {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (productIds && productIds.length > 0)
    params.set("productIds", productIds.join(","));
  if (sort) params.set("sort", sort);

  if (pageParam) {
    params.set("cursor", JSON.stringify(pageParam));
  }

  const response = await apiFetch(`/api/products?${params.toString()}`);

  if (!response?.body?.success) throw new Error("Failed to fetch products");

  const {
    body: { data },
  } = response;

  return {
    Items: data?.products,
    LastEvaluatedKey: data.nextCursor ? data.nextCursor ?? null : null,
  };
}

export function useInfiniteProducts({
  category,
  productIds,
  sort,
}: Omit<FetchProductsParams, "pageParam">) {
  return useInfinitePaginatedQuery<Product>({
    queryKey: [`products"${category}${productIds}${sort}`],
    fetchPage: (pageParam: Record<string, number | string | boolean> | null) =>
      fetchProducts({ category, productIds, sort, pageParam }),
  });
}
