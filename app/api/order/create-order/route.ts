import { mutate } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId, totalAmount, status, shippingAddress } = await req.json();

    if (!userId || !totalAmount || !shippingAddress) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const order = await mutate(
      "INSERT INTO orders (userId, totalAmount, status, shippingAddress) VALUES ($1, $2, $3, $4) RETURNING id",
      [userId, totalAmount, status || "pending", shippingAddress]
    );

    const orderId = order.rows[0]?.id;

    if (orderId) {
      return NextResponse.json(
        { message: "Order created successfully", orderId, status: "success" },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { error: "Failed to create order", status: "error" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Internal Server Error", status: "error" },
      { status: 500 }
    );
  }
}
