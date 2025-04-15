// app/api/orders/[orderId]/route.ts
import { apiResponse, db } from "@/lib/dynamoClient";
import { verifyUser } from "@/lib/verifyUser";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id: OrderId } = params;

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
    const params = {
      TableName: "Orders",
      Key: { OrderId },
    };

    const { Item } = await db.send(new GetCommand(params));

    if (!Item) {
      return NextResponse.json(
        apiResponse({
          data: { message: "Order not found" },
          success: false,
          status: 404,
        })
      );
    }

    return NextResponse.json(
      apiResponse({ data: Item, status: 200, success: true })
    );
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      apiResponse({
        success: false,
        error: "Failed to fetch order details",
        status: 500,
      })
    );
  }
}
