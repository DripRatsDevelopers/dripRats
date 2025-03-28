import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("order_id");

  if (!orderId)
    return NextResponse.json({ error: "Missing order ID" }, { status: 400 });

  try {
    const rows = await query("SELECT paymentstatus FROM orders WHERE id = $1", [
      orderId,
    ]);
    if (rows?.length) {
      return NextResponse.json({ status: rows[0]?.paymentstatus || "Pending" });
    } else {
      return NextResponse.json(
        { error: "Order not available" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error fetching order status:", error);
    return NextResponse.json(
      { error: "Failed to fetch status" },
      { status: 500 }
    );
  }
}
