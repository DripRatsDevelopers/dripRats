import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request) {
  // Extract query parameters
  const { searchParams } = new URL(request.url);

  const token = searchParams.get("token");
  const pickupPincode = searchParams.get("pickupPincode");
  const deliveryPincode = searchParams.get("deliveryPincode");
  const weight = searchParams.get("weight");
  const cod = searchParams.get("cod");

  if (!token || !pickupPincode || !deliveryPincode) {
    return NextResponse.json(
      { message: "Missing required parameters" },
      { status: 400 }
    );
  }

  try {
    const response = await axios.get(
      "https://apiv2.shiprocket.in/v1/external/courier/serviceability/",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          pickup_postcode: pickupPincode,
          delivery_postcode: deliveryPincode,
          weight,
          cod,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(
      "Serviceability Error:",
      error.response?.data || error.message
    );
    return NextResponse.json(
      { message: "Failed to fetch delivery time" },
      { status: 500 }
    );
  }
}
