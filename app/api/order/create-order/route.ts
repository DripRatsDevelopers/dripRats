import { apiResponse, db } from "@/lib/dynamoClient";
import { verifyUser } from "@/lib/verifyUser";
import { OrderEnum } from "@/types/Order";
import { GetCommand, TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

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
    const { UserId, Items, TotalAmount, ShippingAddress } = await req.json();
    const OrderId = uuidv4();
    const CreatedAt = new Date().toISOString();
    const UpdatedAt = CreatedAt;

    if (!UserId || !Items?.length || !TotalAmount || !ShippingAddress) {
      return NextResponse.json(
        apiResponse({
          success: false,
          error: "Missing required fields",
          status: 500,
        })
      );
    }

    // Check stock for all items
    for (const item of Items) {
      const stockData = await db.send(
        new GetCommand({
          TableName: "Inventory",
          Key: { ProductId: item.ProductId },
        })
      );

      if (!stockData.Item || stockData.Item.Stock < item.Quantity) {
        return NextResponse.json(
          apiResponse({
            success: false,
            error: `Insufficient stock for ${item.ProductId}`,
            status: 400,
          })
        );
      }
    }

    // Transaction: Create Order
    const transactItems = [
      {
        Put: {
          TableName: "Orders",
          Item: {
            OrderId,
            UserId,
            Items,
            TotalAmount,
            ShippingAddress,
            Status: OrderEnum.PENDING,
            CreatedAt,
            UpdatedAt,
          },
        },
      },
    ];

    await db.send(new TransactWriteCommand({ TransactItems: transactItems }));

    return NextResponse.json(
      apiResponse({
        success: true,
        data: { OrderId },
      })
    );
  } catch (error) {
    console.error("Order creation failed:", error);
    return NextResponse.json(
      apiResponse({
        success: false,
        error: "Order creation failed",
        status: 500,
      })
    );
  }
}
