import { mutate } from "@/lib/db";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const razorpaySecret = process.env.RAZORPAY_WEBHOOK_SECRET!;
    if (!razorpaySecret) {
      console.error("RAZORPAY_WEBHOOK_SECRET is missing");
      return NextResponse.json(
        { error: "Server misconfiguration" },
        { status: 500 }
      );
    }

    // Get raw body & headers
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", razorpaySecret)
      .update(rawBody)
      .digest("hex");
    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Parse the payload
    const event = JSON.parse(rawBody);
    const { order_id, payment_id, status } = event.payload.payment.entity;

    if (!order_id || !payment_id || !status) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Map Razorpay status to our DB status
    const statusMap: Record<string, string> = {
      captured: "paid",
      failed: "failed",
      refunded: "refunded",
    };

    const newStatus = statusMap[status] || "pending";

    // Update payment in DB
    await mutate(
      "UPDATE payments SET razorpayPaymentId = $1, status = $2 WHERE razorpayOrderId = $3",
      [payment_id, newStatus, order_id]
    );

    return NextResponse.json({
      success: true,
      message: "Payment updated via webhook",
    });
  } catch (error) {
    console.error("Error processing Razorpay webhook:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
