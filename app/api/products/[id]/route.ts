import { cacheHeaders } from "@/constants/UserConstants";
import { getCache, setCache } from "@/lib/cache";
import { apiResponse } from "@/lib/dynamoClient";
import { db } from "@/lib/firebase"; // Adjust based on your Firebase setup
import { collection, getDocs, query, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

const CACHE_EXPIRY = 3600 * 1000;

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: NextRequest, props: Props) {
  const id = (await props.params)?.id;
  console.log("Fetching product with ID:", id);

  const CACHE_PATH = `cache/products/${id}`;

  try {
    console.log("Checking cache for product:", id);
    const cachedProduct = await getCache(CACHE_PATH, CACHE_EXPIRY);

    if (cachedProduct) {
      console.log("✅ Product found in cache:", id);
      return NextResponse.json(cachedProduct);
    }

    console.log("Cache miss, querying Firestore for product:", id);
    const productQuery = query(
      collection(db, "Products"),
      where("ProductId", "==", id)
    );

    // Add timeout to the Firestore query
    const queryPromise = getDocs(productQuery);
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Firestore query timeout")), 8000)
    );

    const queryResult = await Promise.race([queryPromise, timeoutPromise]);
    const productDoc = queryResult?.docs?.[0];

    if (productDoc && productDoc.exists()) {
      console.log("✅ Product found in Firestore:", id);
      const productData = { id: id, ...productDoc.data() };

      // Cache the result asynchronously (don't await to avoid blocking)
      setCache(
        CACHE_PATH,
        apiResponse({
          data: productData,
          success: true,
          status: 200,
        })
      ).catch((err) => console.error("Cache set error:", err));

      return NextResponse.json(
        apiResponse({ data: productData, success: true, status: 200 }),
        cacheHeaders
      );
    } else {
      console.log("❌ Product not found:", id);
      // Product not found
      return NextResponse.json(
        apiResponse({
          data: null,
          success: false,
          status: 404,
          error: "Product not found",
        }),
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error fetching product:", error);

    if (error instanceof Error && error.message.includes("timeout")) {
      return NextResponse.json(
        apiResponse({
          data: null,
          success: false,
          status: 408,
          error: "Request timeout",
        }),
        { status: 408 }
      );
    }

    return NextResponse.json(
      apiResponse({
        data: null,
        success: false,
        status: 500,
        error: "Failed to fetch product",
      }),
      { status: 500 }
    );
  }
}
