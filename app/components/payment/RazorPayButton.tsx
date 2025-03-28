// components/checkout/RazorpayButton.tsx
"use client";

import { Button } from "@/components/ui/button";
import { storePayment } from "@/lib/cookie";
import { useState } from "react";

interface RazorpayButtonProps {
  amount: number;
  onPaymentUpdate: (
    orderId: string,
    error?: { error: { description: string } }
  ) => void;
}

interface RazorpayWindow extends Window {
  Razorpay: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}
const RazorpayButton: React.FC<RazorpayButtonProps> = ({
  amount,
  onPaymentUpdate,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const amountInPaisa = Math.round(amount * 100);

  const isScriptLoaded =
    typeof window !== "undefined" &&
    (window as unknown as RazorpayWindow).Razorpay;

  const handlePayment = async () => {
    if (!isScriptLoaded) {
      alert("Razorpay is not ready. Please try again.");
      return;
    }

    setIsLoading(true);

    const response = await fetch("/api/order/create-order", {
      method: "POST",
      body: JSON.stringify({
        totalAmount: amountInPaisa,
        userId: "user123",
        shippingAddress: JSON.stringify({ pincode: "Some address" }),
      }),
      headers: { "Content-Type": "application/json" },
    });

    const { orderId } = await response.json();

    const paymentOrderResponse = await fetch("/api/payment/create-payment", {
      method: "POST",
      body: JSON.stringify({
        orderId,
        amount: amountInPaisa,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const { razorpayOrderId } = await paymentOrderResponse.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: Math.round(amount * 100), // Amount in paisa (1 INR = 100 paisa)
      currency: "INR",
      name: "Driprats",
      description: "Fashion Jewelry",
      image: "/logo.png",
      order_id: razorpayOrderId,
      handler: async (response: {
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => {
        setIsLoading(false);
        // Verify the payment

        await storePayment(
          orderId,
          response.razorpay_payment_id,
          response.razorpay_signature
        );

        onPaymentUpdate(orderId);
      },
      prefill: {
        name: "John Doe",
        email: "john@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "Driprats Corporate Office",
      },
      theme: {
        color: "#528FF0",
      },
      modal: {
        escape: false,
      },
    };

    const razorpay = new (window as unknown as RazorpayWindow).Razorpay(
      options
    );

    razorpay.on(
      "payment.failed",
      (response: { error: { description: string } }) => {
        setIsLoading(false);
        onPaymentUpdate(orderId, { error: response.error });
      }
    );

    try {
      razorpay.open();
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      alert("Payment process interrupted. Please try again.");
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={isLoading || !isScriptLoaded}
      className="w-full mt-4"
    >
      {isLoading ? "Processing..." : "Pay Now"}
    </Button>
  );
};

export default RazorpayButton;
