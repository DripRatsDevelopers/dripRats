import { PAGE_SIZE } from "@/constants/GeneralConstants";
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

    const productsRef = collection(db, "SearchIndex");

    const constraints = [];

    if (productIds && productIds.length > 0) {
      constraints.push(where("ProductId", "in", productIds));
    } else if (category) {
      constraints.push(where("Category", "==", category));
    }

    if (sortField && sortDirection) {
      constraints.push(orderBy(sortField, sortDirection));
    } else {
      constraints.push(orderBy("ProductId", "asc"));
    }

    if (cursor) {
      try {
        const parsedCursor = JSON.parse(cursor);
        constraints.push(startAfter(parsedCursor));
      } catch (e) {
        console.error("Invalid cursor format:", cursor, e);
      }
    }

    constraints.push(limit(PAGE_SIZE + 1));

    const q = query(productsRef, ...constraints);

    const snapshot = await getDocs(q);
    const docs = snapshot.docs;
    const products = docs.slice(0, PAGE_SIZE).map((doc) => ({ ...doc.data() }));

    const hasMore = docs.length > PAGE_SIZE;
    // Determine next cursor if there are more products

    const nextCursor = hasMore
      ? !sortField
        ? docs[PAGE_SIZE - 1].data().ProductId
        : docs[PAGE_SIZE - 1].data()[sortField]
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
