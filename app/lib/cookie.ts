"use server"; // ✅ Next.js Server Action

import { cookies } from "next/headers";

export const storePayment = async (
  orderId: string,
  paymentId: string,
  signature: string
) => {
  const cookieStore = await cookies();

  cookieStore.set(`payment_id_${orderId}`, paymentId, {
    httpOnly: true,
    secure: true,
  });
  cookieStore.set(`signature_${orderId}`, signature, {
    httpOnly: true,
    secure: true,
  });
};
