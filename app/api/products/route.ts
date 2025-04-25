// pages/api/products.ts or app/api/products/route.ts (Next.js App Router)

import { apiResponse } from "@/lib/dynamoClient";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { NextResponse } from "next/server";

const PAGE_SIZE = 8;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const cursor = searchParams.get("cursor");
    const sort = searchParams.get("sort");
    const productIds = searchParams.get("productIds")?.split(",");

    let sortField: "Name" | "DiscountedPrice" | undefined;
    let sortDirection: "asc" | "desc" | undefined;

    if (sort === "name_desc") {
      sortField = "Name";
      sortDirection = "desc";
    } else if (sort === "price_asc") {
      sortField = "DiscountedPrice";
      sortDirection = "asc";
    } else if (sort === "name_asc") {
      sortField = "Name";
      sortDirection = "asc";
    }

    const productsRef = collection(db, "Products");
    let q;

    if (productIds && productIds.length > 0) {
      q = query(
        productsRef,
        where("ProductId", "in", productIds),
        limit(PAGE_SIZE + 1)
      );
    } else if (category) {
      q = query(
        productsRef,
        where("Category", "==", category),
        limit(PAGE_SIZE + 1)
      );
    } else {
      q = query(productsRef, limit(PAGE_SIZE + 1));
    }

    if (sortField && sortDirection) {
      q = query(q, orderBy(sortField, sortDirection));
    }

    if (cursor) {
      q = query(q, startAfter(cursor));
    }

    const snapshot = await getDocs(q);
    const docs = snapshot.docs;
    const products = docs.slice(0, PAGE_SIZE).map((doc) => ({ ...doc.data() }));
    const hasMore = docs.length > PAGE_SIZE;
    // Determine next cursor if there are more products

    const nextCursor = hasMore
      ? !sortField
        ? docs[PAGE_SIZE - 1].data().ProductId
        : sortField === "Name"
        ? docs[PAGE_SIZE - 1].data().Name
        : docs[PAGE_SIZE - 1].data().DiscountedPrice
      : null;

    return NextResponse.json(
      apiResponse({
        success: true,
        data: { products, nextCursor },
        status: 200,
      })
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
