import { PAGE_SIZE } from "@/constants/GeneralConstants";
import {
  PaginatedResponse,
  useInfinitePaginatedQuery,
} from "@/hooks/useTanstackQuery";
import { apiFetch } from "@/lib/apiClient";
import { sliceFromProductId } from "@/lib/productUtils";
import { Product } from "@/types/Products";

type FetchProductsParams = {
  productIds?: string[];
  pageParam?: string | null;
  enabled?: boolean;
};

async function fetchWishlistData({
  productIds,
  pageParam = null,
}: FetchProductsParams): Promise<PaginatedResponse<Product, string | null>> {
  const params = new URLSearchParams();

  const { slicedProductIds, nextCursor } = sliceFromProductId(
    PAGE_SIZE + 1,
    productIds,
    pageParam ? pageParam.toString() : null
  );

  if (slicedProductIds.length)
    params.set("productIds", slicedProductIds.join(","));

  const response = await apiFetch(`/api/products?${params.toString()}`);

  if (!response?.body?.success) throw new Error("Failed to fetch products");

  const {
    body: { data },
  } = response;

  return {
    Items: data?.products,
    LastEvaluatedKey: nextCursor,
  };
}

const useWishlistData = (productIds: string[], enabled?: boolean) => {
  return useInfinitePaginatedQuery<Product, string | null>({
    queryKey: [`products"${productIds}`],
    fetchPage: (pageParam: string | null) =>
      fetchWishlistData({ productIds, pageParam }),
    enabled,
  });
};

export default useWishlistData;
