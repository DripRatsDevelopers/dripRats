import { apiResponse, db } from "@/lib/dynamoClient";
import { verifyUser } from "@/lib/verifyUser";
import { OrderEnum, PaymentStatusEnum } from "@/types/Order";
import { GetCommand, TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { v4 as uuidv4 } from "uuid";

// Create Razorpay Order
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_SECRET!,
});

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
    const { OrderId } = await req.json();
    const PaymentId = uuidv4();
    const CreatedAt = new Date().toISOString();
    const UpdatedAt = CreatedAt;

    if (!OrderId) {
      return NextResponse.json(
        apiResponse({
          success: false,
          error: "Missing required fields",
          status: 500,
        })
      );
    }
    // Fetch order details
    const orderData = await db.send(
      new GetCommand({
        TableName: "Orders",
        Key: { OrderId },
      })
    );

    if (!orderData.Item) {
      return NextResponse.json(
        apiResponse({ success: false, error: "Order not found", status: 404 })
      );
    }

    if (orderData.Item.Status !== OrderEnum.PENDING) {
      return NextResponse.json(
        apiResponse({
          success: false,
          error: "Order is not in a payable state",
          status: 400,
        })
      );
    }

    const { TotalAmount, UserId } = orderData.Item;

    const razorpayOrder = await razorpay.orders.create({
      amount: TotalAmount,
      currency: "INR",
      receipt: OrderId,
    });

    // Transaction: Store Payment + Update Order to 'Payment Initiated'
    await db.send(
      new TransactWriteCommand({
        TransactItems: [
          {
            Put: {
              TableName: "Payments",
              Item: {
                PaymentId,
                OrderId,
                UserId,
                TotalAmount,
                RazorpayOrderId: razorpayOrder.id,
                Status: PaymentStatusEnum.INITIATED,
                CreatedAt,
                UpdatedAt,
              },
            },
          },
          {
            Update: {
              TableName: "Orders",
              Key: { OrderId },
              UpdateExpression: "SET #Status = :status, UpdatedAt = :updatedAt",
              ExpressionAttributeValues: {
                ":status": OrderEnum.PENDING,
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
        data: { RazorpayOrderId: razorpayOrder.id, PaymentId },
      })
    );
  } catch (error) {
    console.error("Payment creation failed:", error);
    return NextResponse.json(
      apiResponse({
        success: false,
        error: "Payment creation failed",
        status: 500,
      })
    );
  }
}
