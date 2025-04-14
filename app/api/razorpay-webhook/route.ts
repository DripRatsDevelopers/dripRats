import { db } from "@/lib/dynamoClient";
import { OrderEnum, PaymentStatusEnum } from "@/types/Order";
import {
  GetCommand,
  QueryCommand,
  TransactWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import crypto from "crypto";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

const RAZORPAY_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const apiHeaders = await headers();
  const signature = apiHeaders.get("x-razorpay-signature");

  // 1. ✅ Verify signature
  const expectedSignature = crypto
    .createHmac("sha256", RAZORPAY_SECRET)
    .update(rawBody)
    .digest("hex");

  if (expectedSignature !== signature) {
    return new Response("Invalid signature", { status: 400 });
  }

  const event = JSON.parse(rawBody);

  if (event.event !== "payment.captured") {
    return new Response("Event not handled", { status: 200 });
  }

  const payload = event.payload.payment.entity;
  const razorpayOrderId = payload.order_id;
  const razorpayPaymentId = payload.id;
  console.log({ payload, razorpayOrderId, razorpayPaymentId });
  // 2. ✅ Fetch the order using RazorpayOrderId
  const orderRes = await db.send(
    new GetCommand({
      TableName: "Orders",
      Key: { RazorpayOrderId: razorpayOrderId },
    })
  );

  const order = orderRes.Item;
  if (!order) return new Response("Order not found", { status: 404 });

  console.log({ order });

  // 3. ✅ Skip if already confirmed
  if (order.Status !== OrderEnum.PENDING) {
    return new Response("Already confirmed", { status: 200 });
  }

  const UserId = order.UserId;
  const orderId = order.OrderId;
  const Items = order.Items;
  const UpdatedAt = new Date().toISOString();

  console.log({ UserId, orderId, Items, UpdatedAt });

  const PaymentRes = await db.send(
    new QueryCommand({
      TableName: "Payments",
      IndexName: "OrderId-CreatedAt-index",
      KeyConditionExpression: "order_id = :orderId",
      ExpressionAttributeValues: {
        ":orderId": orderId,
      },
    })
  );

  const payment = PaymentRes.Items?.[0];
  if (!payment) return new Response("Payment not found", { status: 404 });

  // 4. ✅ Construct transaction items
  const transactItems = Items.map(
    (item: { ProductId: string; Quantity: number }) => ({
      Update: {
        TableName: "Inventory",
        Key: { ProductId: item.ProductId },
        UpdateExpression: "SET Stock = Stock - :qty",
        ConditionExpression: "Stock >= :qty",
        ExpressionAttributeValues: {
          ":qty": item.Quantity,
        },
      },
    })
  );

  transactItems.push({
    Update: {
      TableName: "Payments",
      Key: { PaymentId: payment?.PaymentId },
      UpdateExpression:
        "SET #Status = :status, RazorpayPaymentId = :razorpayPaymentId, UpdatedAt = :updatedAt",
      ExpressionAttributeValues: {
        ":status": PaymentStatusEnum.PAID,
        ":razorpayPaymentId": razorpayPaymentId,
        ":updatedAt": UpdatedAt,
      },
      ExpressionAttributeNames: {
        "#Status": "Status",
      },
    },
  });

  transactItems.push(
    // 5. ✅ Update order status
    {
      Update: {
        TableName: "Orders",
        Key: { OrderId: orderId },
        UpdateExpression: "SET #status = :confirmed, UpdatedAt = :updatedAt",
        ExpressionAttributeNames: { "#status": "Status" },
        ExpressionAttributeValues: {
          ":confirmed": OrderEnum.CONFIRMED,
          ":updatedAt": UpdatedAt,
        },
      },
    }
  );

  transactItems.push(
    // 6. ✅ Delete reserved items
    ...(
      Items as {
        ProductId: string;
        Quantity: number;
      }[]
    ).map(({ ProductId }) => ({
      Delete: {
        TableName: "ReservedItems",
        Key: {
          UserId: UserId,
          ProductId: ProductId,
        },
      },
    }))
  );

  // 7. ✅ Execute transaction
  try {
    await db.send(
      new TransactWriteCommand({
        TransactItems: transactItems,
      })
    );
    return new Response("Stock reduced and order confirmed", { status: 200 });
  } catch (err) {
    console.error("Webhook transaction failed:", err);
    return new Response("Transaction failed", { status: 500 });
  }
}
