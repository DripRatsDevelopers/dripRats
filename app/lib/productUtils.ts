import { CartType } from "@/types/Cart";

export const fetchProduct = async (
  id: string
): Promise<CartType | undefined> => {
  try {
    const response = await fetch(`/api/firebase/products/${id}`);
    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      console.error("Error fetching product:", data.error);
    }
  } catch (error) {
    console.error("Failed to fetch product:", error);
  }
};

export const fetchAllProducts = async (): Promise<CartType[] | undefined> => {
  try {
    const response = await fetch("/api/firebase/products");
    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      console.error("Error fetching products:", data.error);
    }
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }
};
