import axios from "axios";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/auth/login",
      {
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD,
      }
    );

    return NextResponse.json({ token: response.data.token });
  } catch (error) {
    console.error("Auth Error:", error.response?.data || error.message);
    return NextResponse.json(
      { message: "Authentication failed" },
      { status: 500 }
    );
  }
}
