// components/checkout/RazorpayButton.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface RazorpayButtonProps {
  amount: number;
  onPaymentSuccess: (paymentId: string) => void;
  onPaymentFailure: (error: { error: { description: string } }) => void;
}

interface RazorpayWindow extends Window {
  Razorpay: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}
const RazorpayButton: React.FC<RazorpayButtonProps> = ({
  amount,
  onPaymentSuccess,
  onPaymentFailure,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // Load Razorpay Script
  useEffect(() => {
    const loadRazorpayScript = () => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => setIsScriptLoaded(true);
      script.onerror = () =>
        alert("Failed to load Razorpay. Please try again.");
      document.body.appendChild(script);
    };
    loadRazorpayScript();
  }, []);

  const handlePayment = () => {
    if (!isScriptLoaded) {
      alert("Razorpay is not ready. Please try again.");
      return;
    }

    setIsLoading(true);

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: Math.round(amount * 100), // Amount in paisa (1 INR = 100 paisa)
      currency: "INR",
      name: "Driprats",
      description: "Fashion Jewelry",
      image: "/logo.png",
      handler: (response: { razorpay_payment_id: string }) => {
        setIsLoading(false);
        onPaymentSuccess(response.razorpay_payment_id);
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
        onPaymentFailure({ error: response.error });
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
