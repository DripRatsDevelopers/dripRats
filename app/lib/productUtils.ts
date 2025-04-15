import { CartType } from "@/types/Cart";
import { InventoryItem, Product } from "@/types/Products";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { apiFetch } from "./apiClient";
import { db } from "./dynamoClient";

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

export const fetchMultipleProducts = async (productIds: string[]) => {
  const res = await apiFetch("/api/products/getMultipleProducts", {
    method: "POST",
    body: productIds,
  });

  const {
    body: { success },
  } = res;

  if (!success) {
    return {};
  }

  const data = res?.body?.data;
  return data as Record<string, Product>;
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

export const getReservedStock = async (
  products: string[]
): Promise<Record<string, number>> => {
  const reservedCounts: Record<string, number> = {};

  await Promise.all(
    products.map(async (ProductId) => {
      const res = await db.send(
        new QueryCommand({
          TableName: "ReservedItems",
          IndexName: "GSI_ProductId",
          KeyConditionExpression: "ProductId = :sk",
          ExpressionAttributeValues: {
            ":sk": ProductId,
          },
          ProjectionExpression: "Quantity, #ttl",
          ExpressionAttributeNames: {
            "#ttl": "ttl",
          },
        })
      );

      const now = Math.floor(Date.now() / 1000);

      const totalReserved =
        res.Items?.reduce((sum, item) => {
          if (item.ttl > now) {
            return sum + (item.Quantity ?? 0);
          }
          return sum;
        }, 0) ?? 0;

      reservedCounts[ProductId] = totalReserved;
    })
  );
  return reservedCounts;
};
