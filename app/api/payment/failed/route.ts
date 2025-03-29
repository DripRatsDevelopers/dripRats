import { apiResponse, db } from "@/lib/dynamoClient";
import { OrderEnum, PaymentStatusEnum } from "@/types/Order";
import { TransactWriteCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { OrderId } = await req.json();

    if (!OrderId) {
      return NextResponse.json(
        apiResponse({
          success: false,
          error: "OrderId is required",
          status: 400,
        })
      );
    }

    // Fetch PaymentId linked to the OrderId
    const paymentQuery = await db.send(
      new UpdateCommand({
        TableName: "Payments",
        Key: { OrderId },
        UpdateExpression: "SET #status = :failed, #updatedAt = :updatedAt",
        ExpressionAttributeNames: {
          "#status": "Status",
          "#updatedAt": "UpdatedAt",
        },
        ExpressionAttributeValues: {
          ":failed": PaymentStatusEnum.FAILED,
          ":updatedAt": new Date().toISOString(),
        },
        ReturnValues: "ALL_NEW",
      })
    );

    if (!paymentQuery.Attributes) {
      return NextResponse.json(
        apiResponse({ success: false, error: "Payment not found", status: 404 })
      );
    }

    const { PaymentId } = paymentQuery.Attributes;

    // Use transactions to update both Payment and Order
    await db.send(
      new TransactWriteCommand({
        TransactItems: [
          {
            Update: {
              TableName: "Payments",
              Key: { PaymentId },
              UpdateExpression:
                "SET #status = :failed, #updatedAt = :updatedAt",
              ExpressionAttributeNames: {
                "#status": "Status",
                "#updatedAt": "UpdatedAt",
              },
              ExpressionAttributeValues: {
                ":failed": PaymentStatusEnum.FAILED,
                ":updatedAt": new Date().toISOString(),
              },
            },
          },
          {
            Update: {
              TableName: "Orders",
              Key: { OrderId },
              UpdateExpression:
                "SET #status = :pending, #updatedAt = :updatedAt",
              ExpressionAttributeNames: {
                "#status": "Status",
                "#updatedAt": "UpdatedAt",
              },
              ExpressionAttributeValues: {
                ":pending": OrderEnum.PENDING,
                ":updatedAt": new Date().toISOString(),
              },
            },
          },
        ],
      })
    );

    return NextResponse.json(
      apiResponse({
        success: true,
        data: { message: "Payment marked as failed." },
      })
    );
  } catch (error) {
    console.error("Error updating payment status:", error);
    return NextResponse.json(
      apiResponse({
        success: false,
        error: "Failed to update payment status",
        status: 500,
      })
    );
  }
}
