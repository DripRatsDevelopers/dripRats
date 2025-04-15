// app/api/get-products/route.ts

import { apiResponse } from "@/lib/dynamoClient";
import { db } from "@/lib/firebase";
import { Product } from "@/types/Products";
import { collection, getDocs, query, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const productIds = await req.json();

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { error: "Invalid ProductIds" },
        { status: 400 }
      );
    }

    const productsRef = collection(db, "Products");

    const chunks = [];
    for (let i = 0; i < productIds.length; i += 10) {
      chunks.push(productIds.slice(i, i + 10));
    }

    const result: Record<string, Product> = {};

    for (const chunk of chunks) {
      const q = query(productsRef, where("id", "in", chunk));
      const snapshot = await getDocs(q);
      snapshot.docs.forEach((doc) => {
        const data = doc.data() as Product;
        result[data.id] = data;
      });
    }

    return NextResponse.json(
      apiResponse({ data: result, success: true, status: 200 })
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      apiResponse({
        success: false,
        error: "Failed to fetch products",
        status: 500,
      })
    );
  }
}
