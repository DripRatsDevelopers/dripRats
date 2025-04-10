import { CartType } from "@/types/Cart";
import { InventoryItem } from "@/types/Products";
import { apiFetch } from "./apiClient";

export const fetchProduct = async (
  id: string
): Promise<CartType | undefined> => {
  try {
    const response = await apiFetch(`/api/products/${id}`);
    const data = response;
    return data;
  } catch (error) {
    console.error("Failed to fetch product:", error);
  }
};

export const fetchAllProducts = async (): Promise<CartType[] | undefined> => {
  try {
    const response = await apiFetch("/api/products");
    const data = response;
    return data;
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }
};

export const getProductStock = async (products: string[]) => {
  try {
    const response = await apiFetch("/api/check-stock", {
      method: "POST",
      body: { products },
    });
    const {
      body: {
        data: { stocks },
        success,
      },
    } = response;
    if (success) {
      return stocks;
    }
  } catch (error) {
    console.error("Failed to fetch stock data:", error);
  }
};

export const isAnyProductOutOfStock = (
  requiredProducts: { id: string; quantity: number }[],
  availableProducts: InventoryItem[]
) => {
  const availableProductsMap: Record<string, number> =
    availableProducts?.reduce(
      (acc: Record<string, number>, cur: InventoryItem) => {
        acc[cur.ProductId] = cur.Stock;
        return acc;
      },
      {}
    );

  let isOutOfStock = false;
  requiredProducts?.forEach(({ id, quantity }) => {
    if (!availableProductsMap?.[id] || availableProductsMap?.[id] < quantity) {
      isOutOfStock = true;
    }
  });
  return isOutOfStock;
};
