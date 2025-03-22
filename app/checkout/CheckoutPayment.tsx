// app/(checkout)/checkout/CheckoutPayment.tsx
"use client";

import RazorpayButton from "@/components/payment/RazorPayButton";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CheckoutPayment = ({ totalAmount }: { totalAmount: number }) => {
  const router = useRouter();
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "success" | "failed"
  >("idle");

  const handlePaymentSuccess = (paymentId: string) => {
    setPaymentStatus("success");
    alert(`Payment Successful! Payment ID: ${paymentId}`);
    router.push("/order-success");
  };

  const handlePaymentFailure = (error: { error: { description: string } }) => {
    setPaymentStatus("failed");
    console.error("Payment Error:", error);
    alert("Payment failed! Please try again.");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Complete Your Payment</h2>
      <p className="mb-2">Total Amount: ₹{totalAmount}</p>

      <RazorpayButton
        amount={totalAmount}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentFailure={handlePaymentFailure}
      />

      {paymentStatus === "failed" && (
        <p className="text-red-500 mt-2">Payment failed. Please try again.</p>
      )}
    </div>
  );
};

export default CheckoutPayment;
