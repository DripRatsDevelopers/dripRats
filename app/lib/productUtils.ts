import { PaginatedResponse } from "@/hooks/useTanstackQuery";
import { CartType } from "@/types/Cart";
import { InventoryItem, Product } from "@/types/Products";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import {
  collection,
  documentId,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { apiFetch } from "./apiClient";
import { db } from "./dynamoClient";
import { db as firestoreDB } from "./firebase";

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

export const fetchAllProducts = async (
  pageParam: Record<string, number | string | boolean> | null
): Promise<PaginatedResponse<CartType>> => {
  const response = await apiFetch(`/api/products?cursor=${pageParam ?? ""}`);

  if (!response?.body?.success) throw new Error("Failed to fetch products");

  const {
    body: { data },
  } = response;

  return {
    Items: data?.products,
    LastEvaluatedKey: data.nextCursor ? (data.nextCursor ?? null) : null,
  };
};

export const getProductPrice = async (productIds: string[]) => {
  const productQuery = query(
    collection(firestoreDB, "ProductSummary"),
    where(documentId(), "in", productIds.slice(0, 10))
  );

  const snapshot = await getDocs(productQuery);

  const summaryData = snapshot.docs.map((doc) => ({
    ProductId: doc.id,
    ...doc.data(),
  }));

  return summaryData;
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
  requiredProducts: { ProductId: string; quantity: number }[],
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
  requiredProducts?.forEach(({ ProductId, quantity }) => {
    if (
      !availableProductsMap?.[ProductId] ||
      availableProductsMap?.[ProductId] < quantity
    ) {
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

export function sliceFromProductId(
  size: number,
  productIds?: string[],
  fromProductId?: string | null
): {
  slicedProductIds: string[];
  nextCursor?: string | null;
} {
  if (productIds) {
    const startIndex = fromProductId ? productIds.indexOf(fromProductId) : 0;

    if (startIndex === -1) {
      // If the productId is not found, return an empty array
      return { slicedProductIds: [] };
    }
    const slicedProductIds = productIds.slice(startIndex, startIndex + size);

    return {
      slicedProductIds: productIds.slice(startIndex, startIndex + (size - 1)),
      nextCursor:
        slicedProductIds?.length > size - 1
          ? slicedProductIds[slicedProductIds?.length - 1]
          : null,
    };
  } else {
    return { slicedProductIds: [] };
  }
}
