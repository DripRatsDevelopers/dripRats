// app/(checkout)/checkout/CheckoutPayment.tsx
"use client";

import RazorpayButton from "@/components/payment/RazorPayButton";
import { useRouter } from "next/navigation";

const CheckoutPayment = ({ totalAmount }: { totalAmount: number }) => {
  const router = useRouter();

  const onPaymentUpdate = (
    orderId: string,
    error?: { error: { description: string } }
  ) => {
    if (error) {
      router.push("/order-failed");
    }
    router.push(`/order-status/${orderId}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Complete Your Payment</h2>
      <p className="mb-2">Total Amount: ₹{totalAmount}</p>

      <RazorpayButton amount={totalAmount} onPaymentUpdate={onPaymentUpdate} />
    </div>
  );
};

export default CheckoutPayment;
