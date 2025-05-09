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

  const CACHE_PATH = `cache/products/${id}`;

  try {
    const cachedProduct = await getCache(CACHE_PATH, CACHE_EXPIRY);

    if (cachedProduct) {
      return NextResponse.json(cachedProduct);
    }

    const productQuery = query(
      collection(db, "Products"),
      where("ProductId", "==", id)
    );

    const productDoc = (await getDocs(productQuery))?.docs?.[0];
    if (productDoc.exists()) {
      const productData = { id: id, ...productDoc.data() };
      await setCache(
        CACHE_PATH,
        apiResponse({
          data: productData,
          success: true,
          status: 200,
        })
      );
      return NextResponse.json(
        apiResponse({ data: productData, success: true, status: 200 })
      );
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
