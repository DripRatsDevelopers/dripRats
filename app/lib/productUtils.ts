import { CartType } from "@/types/Cart";
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
