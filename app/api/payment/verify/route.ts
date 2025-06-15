import { apiResponse, db } from "@/lib/dynamoClient";
import { notifyTelegram } from "@/lib/notifyTelegram";
import { createShiprocketOrder } from "@/lib/orderUtils";
import { sendOrderConfirmationEmail } from "@/lib/resend";
import { verifyUser } from "@/lib/verifyUser";
import { OrderConfirmation } from "@/types/Mail";
import {
  OrderEnum,
  PaymentStatusEnum,
  ShiprocketOrderInput,
} from "@/types/Order";
import { GetCommand, TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import crypto from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let userId;
  try {
    userId = await verifyUser(req);
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

    const orderData = await db.send(
      new GetCommand({
        TableName: "Orders",
        Key: { OrderId: orderId },
      })
    );

    if (!paymentData.Item || !orderData.Item) {
      return NextResponse.json(
        apiResponse({
          success: false,
          error: "Payment/order not found",
          status: 404,
        })
      );
    }

    const { RazorpayOrderId, OrderId } = paymentData.Item;
    const items = orderData.Item.Items as {
      ProductId: string;
      Quantity: number;
    }[];

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
          ...items.map(({ ProductId, Quantity }) => ({
            Update: {
              TableName: "Inventory",
              Key: { ProductId },
              UpdateExpression: "SET Stock = Stock - :q",
              ConditionExpression: "Stock >= :q",
              ExpressionAttributeValues: {
                ":q": Quantity,
              },
            },
          })),
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
          ...items.map(({ ProductId }) => ({
            Delete: {
              TableName: "ReservedItems",
              Key: {
                UserId: userId,
                ProductId: ProductId,
              },
            },
          })),
        ],
      })
    );
    const orderItem = orderData.Item;

    await createShiprocketOrder(orderItem as ShiprocketOrderInput);

    await sendOrderConfirmationEmail(orderItem as OrderConfirmation);
    await notifyTelegram(orderItem as ShiprocketOrderInput);

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
