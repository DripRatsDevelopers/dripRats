import { apiResponse } from "@/lib/dynamoClient";
import { getShiprocketToken } from "@/lib/orderUtils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const shipmentId = req.nextUrl.searchParams.get("shipment_id");

    const token = await getShiprocketToken();

    const res = await fetch(
      `https://apiv2.shiprocket.in/v1/external/courier/track/shipment/${shipmentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await res.json();

    return NextResponse.json(
      apiResponse({
        success: true,
        data,
        status: 200,
      })
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      apiResponse({
        success: false,
        data: { message: "Order tracking failed" },
        status: 500,
      })
    );
  }
}
