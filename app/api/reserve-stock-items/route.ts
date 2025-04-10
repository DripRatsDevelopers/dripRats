import { apiResponse, db } from "@/lib/dynamoClient";
import { verifyUser } from "@/lib/verifyUser";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { NextRequest, NextResponse } from "next/server";

const RESERVED_TTL_MINUTES = 15;

export async function POST(req: NextRequest) {
  try {
    let UserId;
    try {
      UserId = await verifyUser(req);
    } catch {
      return NextResponse.json(
        { error: "Unauthorized" },
        {
          status: 401,
        }
      );
    }

    const { items } = await req.json(); // [{ ProductId: string, Quantity: number }]
    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const unavailable: string[] = [];

    for (const item of items) {
      const result = await db.send(
        new GetCommand({
          TableName: "Inventory",
          Key: { ProductId: item.ProductId },
        })
      );

      const stock = result.Item?.Stock ?? 0;

      if (stock < item.Quantity) {
        unavailable.push(item.ProductId);
      }
    }

    if (unavailable.length > 0) {
      return NextResponse.json(
        apiResponse({ success: false, data: { unavailable } })
      );
    }

    const now = Math.floor(Date.now() / 1000);
    const ttl = now + RESERVED_TTL_MINUTES * 60;

    for (const item of items) {
      await db.send(
        new PutCommand({
          TableName: "ReservedItems",
          Item: {
            UserId,
            ProductId: item.ProductId,
            Quantity: item.Quantity,
            ReservedAt: now,
            ttl,
          },
        })
      );
    }

    return NextResponse.json(
      apiResponse({
        success: true,
        status: 200,
      })
    );
  } catch (err) {
    console.error("Reserve API error:", err);
    return NextResponse.json(
      apiResponse({
        success: false,
        error: "Something went wrong",
        status: 500,
      })
    );
  }
}
