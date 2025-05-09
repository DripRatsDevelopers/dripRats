// pages/api/products.ts or app/api/products/route.ts (Next.js App Router)

import { apiResponse } from "@/lib/dynamoClient";
import { db } from "@/lib/firebase";
import {
  collection,
  documentId,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { productIds } = await request.json();

    const productQuery = query(
      collection(db, "ProductSummary"),
      where(documentId(), "in", productIds.slice(0, 10))
    );

    const snapshot = await getDocs(productQuery);

    const summaryData = snapshot.docs.map((doc) => ({
      ProductId: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(
      apiResponse({ success: true, data: { summaryData }, status: 200 })
    );
  } catch (error) {
    console.error("Error fetching Products:", error);
    return NextResponse.json(
      apiResponse({
        error: "Internal Server Error",
        success: false,
        status: 500,
      })
    );
  }
}
