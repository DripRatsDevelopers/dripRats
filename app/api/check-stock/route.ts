import { apiResponse, db } from "@/lib/dynamoClient";
import { getReservedStock } from "@/lib/productUtils";
import { BatchGetCommand } from "@aws-sdk/lib-dynamodb";
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

    const reservedCounts: Record<string, number> = await getReservedStock(
      products
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
