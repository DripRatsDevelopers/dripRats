import { db } from "@/lib/firebase"; // Adjust based on your Firebase setup
import { collection, getDocs, query, where } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log({ id: params.id });
  try {
    const productQuery = query(
      collection(db, "Products"),
      where("id", "==", params.id)
    );

    const productDoc = (await getDocs(productQuery))?.docs?.[0];
    if (productDoc.exists()) {
      const productData = { id: params.id, ...productDoc.data() };
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
