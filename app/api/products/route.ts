import { apiResponse } from "@/lib/dynamoClient";
import { db } from "@/lib/firebase"; // Adjust based on your Firebase setup
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { NextResponse } from "next/server";

// const CACHE_EXPIRY = 3600 * 1000;

export async function GET(req: Request) {
  // const CACHE_PATH = `cache/products`;
  try {
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const pageSize = 12;

    let q;

    if (cursor) {
      const cursorDoc = await getDoc(doc(db, "Products", cursor));
      if (!cursorDoc.exists()) {
        return NextResponse.json({ products: [], nextCursor: null });
      }

      q = query(
        collection(db, "Products"),
        orderBy("Name"),
        startAfter(cursorDoc),
        limit(pageSize)
      );
    } else {
      q = query(collection(db, "Products"), orderBy("Name"), limit(pageSize));
    }

    const snapshot = await getDocs(q);

    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const nextCursor =
      snapshot.docs.length > 0
        ? snapshot.docs[snapshot.docs.length - 1].id
        : null;

    return NextResponse.json(
      apiResponse({
        success: true,
        data: { products, nextCursor },
        status: 200,
      })
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      apiResponse({
        data: { error: "Failed to fetch product" },
        status: 500,
        success: false,
      })
    );
  }
}
