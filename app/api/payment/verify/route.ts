import { mutate, query } from "@/lib/db";
import crypto from "crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();

    const cookieStore = await cookies();

    const razorpayPaymentId = cookieStore.get(`payment_id_${orderId}`)?.value;
    const razorpaySignature = cookieStore.get(`signature_${orderId}`)?.value;

    if (!orderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Fetch the order from DB
    const payment = await query("SELECT * FROM payments WHERE orderid = $1", [
      orderId,
    ]);

    const razorPayOrderId = payment?.[0]?.razorpayorderid;

    if (!payment.length || !razorPayOrderId) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Verify the signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET!)
      .update(razorPayOrderId + "|" + razorpayPaymentId)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Update payment status
    await mutate(
      "UPDATE payments SET razorpayPaymentId = $1, status = 'paid' WHERE orderid = $2",
      [razorpayPaymentId, orderId]
    );

    await mutate(
      "UPDATE orders SET paymentstatus = 'paid' WHERE id = $1",
      [orderId]
    );

    return NextResponse.json({ success: true, message: "Payment verified" });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
