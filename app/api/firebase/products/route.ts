import { getCache, setCache } from "@/lib/cache";
import { db } from "@/lib/firebase"; // Adjust based on your Firebase setup
import { collection, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

const CACHE_EXPIRY = 3600 * 1000;

export async function GET() {
  const CACHE_PATH = `cache/products`;

  try {
    const cachedProducts = await getCache(CACHE_PATH, CACHE_EXPIRY);

    if (cachedProducts) {
      console.log("✅ Serving from cache");
      return NextResponse.json(cachedProducts);
    }

    const snapshot = await getDocs(collection(db, "Products"));
    if (snapshot.size) {
      const products = snapshot.docs.map((doc) => {
        const product = { id: doc.id, ...doc.data() };
        const productId = doc.data()?.id;
        setCache(`${CACHE_PATH}/${productId}`, product);
        return product;
      });

      return NextResponse.json(products);
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
