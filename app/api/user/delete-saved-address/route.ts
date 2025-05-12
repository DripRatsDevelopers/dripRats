import { apiResponse, db } from "@/lib/dynamoClient";
import { verifyUser } from "@/lib/verifyUser";
import { ShippingInfo } from "@/types/Order";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
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

  const { addressId } = await req.json();

  if (!addressId || !UserId) {
    return NextResponse.json({ error: "Data missing" }, { status: 400 });
  }

  try {
    const result = await db.send(
      new GetCommand({
        TableName: "Users",
        Key: { UserId },
      })
    );

    const existing = result.Item;

    if (!existing) {
      return NextResponse.json(
        { error: "Address is not available" },
        { status: 400 }
      );
    }
    const addresses = Array.isArray(existing.Addresses)
      ? existing.Addresses
      : [];

    const updatedAddresses = [
      ...addresses.filter((a: ShippingInfo) => a.id !== addressId),
    ];

    await db.send(
      new PutCommand({
        TableName: "Users",
        Item: {
          ...existing,
          Addresses: updatedAddresses,
        },
      })
    );

    return NextResponse.json({ success: true, updatedAddresses });
  } catch (err) {
    console.error("DynamoDB Error:", err);
    return NextResponse.json(
      apiResponse({
        success: false,
        error: "Failed to delete address",
        status: 500,
      })
    );
  }
}
