"use server"; // ✅ Next.js Server Action

import { cookies } from "next/headers";

export const storePayment = async (
  orderId: string,
  razorpay_paymentId: string,
  signature: string,
  paymentId: string
) => {
  const cookieStore = await cookies();

  cookieStore.set(`paymentId_${orderId}`, paymentId, {
    httpOnly: true,
    secure: true,
  });

  cookieStore.set(`razorpay_payment_id_${orderId}`, razorpay_paymentId, {
    httpOnly: true,
    secure: true,
  });
  cookieStore.set(`signature_${orderId}`, signature, {
    httpOnly: true,
    secure: true,
  });
};
