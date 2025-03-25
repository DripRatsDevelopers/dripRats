import { getCache, setCache } from "@/lib/cache";
import { db } from "@/lib/firebase"; // Adjust based on your Firebase setup
import { collection, getDocs, query, where } from "firebase/firestore";
import { NextResponse } from "next/server";

const CACHE_EXPIRY = 3600 * 1000;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const CACHE_PATH = `cache/products/${params.id}`;

  try {
    const cachedProduct = await getCache(CACHE_PATH, CACHE_EXPIRY);

    if (cachedProduct) {
      console.log("✅ Serving from cache");
      return NextResponse.json(cachedProduct);
    }

    const productQuery = query(
      collection(db, "Products"),
      where("id", "==", params.id)
    );

    const productDoc = (await getDocs(productQuery))?.docs?.[0];
    if (productDoc.exists()) {
      const productData = { id: params.id, ...productDoc.data() };
      await setCache(CACHE_PATH, productData);
      return NextResponse.json(productData);
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
