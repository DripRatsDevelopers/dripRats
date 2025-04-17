import { MAX_SAVED_ADDRESS } from "@/constants/DeliveryConstants";
import { apiResponse, db } from "@/lib/dynamoClient";
import { verifyUser } from "@/lib/verifyUser";
import { addressDetails } from "@/types/Order";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

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

  const { address: addressJson } = await req.json();
  const address = JSON.parse(addressJson);

  if (!address || !UserId) {
    return NextResponse.json({ error: "Data missing" }, { status: 400 });
  }

  if (!address.id) {
    address.id = uuidv4();
  }

  address.CreatedAt ??= new Date().toISOString();

  try {
    const result = await db.send(
      new GetCommand({
        TableName: "Users",
        Key: { UserId },
      })
    );

    const existing = result.Item || {
      UserId,
      Addresses: [],
      Cart: [],
      Wishlist: [],
    };

    const addresses = Array.isArray(existing.Addresses)
      ? existing.Addresses
      : [];

    const updatedAddresses = [
      ...addresses.filter((a: addressDetails) => a.id !== address.id),
      address,
    ];

    if (!existing && addresses?.length >= MAX_SAVED_ADDRESS) {
      return NextResponse.json(
        apiResponse({
          success: false,
          data: { message: "Cannot save more that 5 addresses" },
          status: 400,
        })
      );
    }

    if (existing || addresses?.length < 5)
      await db.send(
        new PutCommand({
          TableName: "Users",
          Item: {
            ...existing,
            Addresses: updatedAddresses,
          },
        })
      );

    return NextResponse.json({ success: true, address });
  } catch (err) {
    console.error("DynamoDB Error:", err);
    return NextResponse.json(
      apiResponse({
        success: false,
        error: "Failed to save address",
        status: 500,
      })
    );
  }
}
