import { apiResponse, db } from "@/lib/dynamoClient";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const OrderId = searchParams.get("order_id");

    if (!OrderId) {
      return NextResponse.json(
        apiResponse({
          success: false,
          error: "OrderId is required",
          status: 400,
        })
      );
    }

    // Fetch payment details for the given OrderId
    const result = await db.send(
      new GetCommand({
        TableName: "Orders",
        Key: { OrderId },
      })
    );

    if (!result.Item) {
      return NextResponse.json(
        apiResponse({ success: false, error: "No payment found", status: 404 })
      );
    }

    const order = result.Item;

    return NextResponse.json(
      apiResponse({
        success: true,
        data: {
          Status: order.Status,
          Items: order.Items,
        },
      })
    );
  } catch (error) {
    console.error("Error fetching payment status:", error);
    return NextResponse.json(
      apiResponse({
        success: false,
        error: "Failed to fetch payment status",
        status: 500,
      })
    );
  }
}
