import { apiResponse, getUserItem } from "@/lib/dynamoClient";
import { verifyUser } from "@/lib/verifyUser";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
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
  try {
    const userData = await getUserItem({ UserId });
    return NextResponse.json(
      apiResponse({
        data: userData,
        status: 200,
        success: true,
      })
    );
  } catch (err) {
    console.error("Failed to fetch user details", err);
    return NextResponse.json(
      apiResponse({
        success: false,
        error: "Something went wrong while getting user details",
        status: 500,
      })
    );
  }
}
