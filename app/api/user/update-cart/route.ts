import { apiResponse } from "@/lib/dynamoClient";
import { updateCartInDynamo } from "@/lib/userUtils";
import { verifyUser } from "@/lib/verifyUser";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
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
    const { cart } = await request.json();
    if (!Array.isArray(cart)) {
      return NextResponse.json(
        apiResponse({
          success: false,
          status: 400,
          data: { message: "Invalid format" },
        })
      );
    }

    await updateCartInDynamo(userId, cart);
    return NextResponse.json(
      apiResponse({
        success: true,
        status: 200,
        data: { message: "Cart updated" },
      })
    );
  } catch (error) {
    console.error("Error updating Cart:", error);
    return NextResponse.json(
      apiResponse({
        error: "Internal Server Error",
        success: false,
        status: 500,
      })
    );
  }
}
