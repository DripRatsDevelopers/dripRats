import { apiResponse, db } from "@/lib/dynamoClient";
import { verifyUser } from "@/lib/verifyUser";
import { OrderEnum, PaymentStatusEnum } from "@/types/Order";
import { GetCommand, TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import crypto from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await verifyUser(req);
  } catch {
    return NextResponse.json(
      { error: "Unauthorized" },
      {
        status: 401,
      }
    );
  }
  try {
    const { orderId } = await req.json();

    const cookieStore = await cookies();

    const RazorpayPaymentId = cookieStore.get(
      `razorpay_payment_id_${orderId}`
    )?.value;
    const RazorpaySignature = cookieStore.get(`signature_${orderId}`)?.value;
    const PaymentId = cookieStore.get(`paymentId_${orderId}`)?.value;

    const UpdatedAt = new Date().toISOString();

    // Step 1: Retrieve the stored Payment entry using RazorpayOrderId
    const paymentData = await db.send(
      new GetCommand({
        TableName: "Payments",
        Key: { PaymentId },
      })
    );

    if (!paymentData.Item) {
      return NextResponse.json(
        apiResponse({ success: false, error: "Payment not found", status: 404 })
      );
    }

    const { RazorpayOrderId, OrderId } = paymentData.Item;

    // Step 2: Verify Razorpay Signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET!)
      .update(RazorpayOrderId + "|" + RazorpayPaymentId)
      .digest("hex");

    if (generatedSignature !== RazorpaySignature) {
      return NextResponse.json(
        { success: false, error: "Invalid signature" },
        { status: 400 }
      );
    }

    // Step 3: Use Transaction to update both Payment & Order
    await db.send(
      new TransactWriteCommand({
        TransactItems: [
          {
            Update: {
              TableName: "Payments",
              Key: { PaymentId },
              UpdateExpression:
                "SET #Status = :status, RazorpayPaymentId = :razorpayPaymentId, UpdatedAt = :updatedAt",
              ExpressionAttributeValues: {
                ":status": PaymentStatusEnum.PAID,
                ":razorpayPaymentId": RazorpayPaymentId,
                ":updatedAt": UpdatedAt,
              },
              ExpressionAttributeNames: {
                "#Status": "Status",
              },
            },
          },
          {
            Update: {
              TableName: "Orders",
              Key: { OrderId },
              UpdateExpression: "SET #Status = :status, UpdatedAt = :updatedAt",
              ExpressionAttributeValues: {
                ":status": OrderEnum.CONFIRMED,
                ":updatedAt": UpdatedAt,
              },
              ExpressionAttributeNames: {
                "#Status": "Status",
              },
            },
          },
        ],
      })
    );

    return NextResponse.json(
      apiResponse({
        success: true,
        data: { OrderId, Status: OrderEnum.CONFIRMED },
      })
    );
  } catch (error) {
    console.error("Payment verification failed:", error);

    return NextResponse.json(
      apiResponse({
        success: false,
        error: "Payment verification failed",
        status: 500,
      })
    );
  }
}
