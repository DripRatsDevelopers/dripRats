import { toast } from "sonner";
import { apiFetch } from "./apiClient";

export async function reserveItems(
  products: { ProductId: string; Quantity: number }[]
) {
  const response = await apiFetch("/api/reserve-stock-items", {
    method: "POST",
    body: { items: products },
  });

  const { body } = response;
  const success = body?.success;
  if (!success && body?.data?.unavailable?.length) {
    toast.error("Stock unavailable", {
      description:
        "Some items in your cart are out of stock. Please update and try again",
    });
  }
  return success;
}
