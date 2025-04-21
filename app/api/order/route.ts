// /app/api/orders/route.ts

import { apiResponse, db } from "@/lib/dynamoClient";
import { verifyUser } from "@/lib/verifyUser";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  let userId;
  try {
    userId = await verifyUser(request);
  } catch {
    return NextResponse.json(
      { error: "Unauthorized" },
      {
        status: 401,
      }
    );
  }
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const lastEvaluatedKey = url.searchParams.get("lastEvaluatedKey")
      ? JSON.parse(url.searchParams.get("lastEvaluatedKey")!)
      : undefined;

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const params = {
      TableName: "Orders",
      IndexName: "UserId-index",
      KeyConditionExpression: "UserId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
      Limit: limit,
      ExclusiveStartKey: lastEvaluatedKey,
    };

    const command = new QueryCommand(params);
    const data = await db.send(command);

    if (data.Items) {
      return NextResponse.json(
        apiResponse({
          success: true,
          data: {
            orders: data.Items,
            lastEvaluatedKey: !!data.LastEvaluatedKey
              ? JSON.stringify(data.LastEvaluatedKey)
              : null,
          },
        })
      );
    } else {
      return NextResponse.json(
        apiResponse({
          success: true,
          data: { message: "No orders found for this user", orders: [] },
          status: 404,
        })
      );
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      apiResponse({
        error: "Internal Server Error",
        success: false,
        status: 500,
      })
    );
  }
}
