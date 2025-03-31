import axios, { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";

let cachedToken = "";
let tokenExpiry = 0;

async function getAuthToken() {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const response = await fetch(
    "https://apiv2.shiprocket.in/v1/external/auth/login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD,
      }),
    }
  );

  const data = await response.json();
  cachedToken = data.token;
  tokenExpiry = Date.now() + 15 * 60 * 1000;
  return cachedToken;
}

export async function GET(request: NextRequest) {
  // Extract query parameters
  const { searchParams } = new URL(request.url);

  const token = await getAuthToken();
  const deliveryPincode = searchParams.get("pincode");

  if (!token || !deliveryPincode) {
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
          pickup_postcode: "600066",
          delivery_postcode: deliveryPincode,
          weight: 0.5,
          cod: 0,
        },
      }
    );

    return NextResponse.json(response.data || "Not Available");
  } catch (error) {
    console.error(
      "Serviceability Error:",
      (error as AxiosError).response?.data || (error as Error).message
    );
    return NextResponse.json(
      { message: "Failed to fetch delivery time" },
      { status: 500 }
    );
  }
}
