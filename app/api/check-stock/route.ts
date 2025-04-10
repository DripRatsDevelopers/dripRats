import { apiResponse, db } from "@/lib/dynamoClient";
import { BatchGetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const products = body.products as string[];
    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: "No products provided" },
        { status: 400 }
      );
    }

    const keys = products.map((id) => ({ ProductId: id }));

    const command = new BatchGetCommand({
      RequestItems: {
        Inventory: {
          Keys: keys,
        },
      },
    });

    const result = await db.send(command);
    const stocks = result.Responses?.Inventory ?? [];

    const reservedCounts: Record<string, number> = {};

    await Promise.all(
      products.map(async (ProductId) => {
        const res = await db.send(
          new QueryCommand({
            TableName: "ReservedItems",
            IndexName: "GSI_ProductId",
            KeyConditionExpression: "ProductId = :sk",
            ExpressionAttributeValues: {
              ":sk": ProductId,
            },
            ProjectionExpression: "Quantity, #ttl",
            ExpressionAttributeNames: {
              "#ttl": "ttl",
            },
          })
        );

        const now = Math.floor(Date.now() / 1000);

        const totalReserved =
          res.Items?.reduce((sum, item) => {
            if (item.ttl > now) {
              return sum + (item.Quantity ?? 0);
            }
            return sum;
          }, 0) ?? 0;

        reservedCounts[ProductId] = totalReserved;
      })
    );

    const updatedStocks = stocks?.map(({ ProductId, Stock }) => ({
      ProductId,
      Stock: Stock - reservedCounts[ProductId],
    }));
    return NextResponse.json(
      apiResponse({ data: { stocks: updatedStocks }, success: true })
    );
  } catch (err) {
    console.error("Check stock error:", err);
    return NextResponse.json(
      apiResponse({
        success: false,
        error: "Failed to get stock",
        status: 500,
      })
    );
  }
}
