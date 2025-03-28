import { mutate } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const { orderId, amount, currency = "INR" } = await req.json();

    if (!orderId || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Convert amount to paisa
    const options = {
      amount: amount,
      currency,
      receipt: orderId,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Store in database
    await mutate(
      "INSERT INTO payments (orderId, razorpayOrderId, amount, status) VALUES ($1, $2, $3, $4)",
      [orderId, razorpayOrder.id, amount, "pending"]
    );

    return NextResponse.json(
      { razorpayOrderId: razorpayOrder.id, status: "success" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { error: "Internal Server Error", status: "error" },
      { status: 500 }
    );
  }
}
