// components/checkout/RazorpayButton.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/apiClient";
import { storePayment } from "@/lib/cookie";
import { CartType } from "@/types/Cart";
import { ShippingInfo } from "@/types/Order";
import { Dispatch, SetStateAction } from "react";

interface RazorpayButtonProps {
  amount: number;
  onPaymentUpdate: (
    orderId: string,
    error?: { error: { description: string } }
  ) => void;
  shippingInfo: ShippingInfo;
  items: CartType[];
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

interface RazorpayWindow extends Window {
  Razorpay: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}
const RazorpayButton: React.FC<RazorpayButtonProps> = ({
  amount,
  onPaymentUpdate,
  shippingInfo,
  items,
  isLoading,
  setIsLoading,
}) => {
  const { user } = useAuth();
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

    const response = await apiFetch("/api/order/create-order", {
      method: "POST",
      body: {
        TotalAmount: amountInPaisa,
        UserId: user?.uid,
        ShippingAddress: JSON.stringify(shippingInfo),
        Items: items?.map((item) => ({
          ProductId: item.id,
          Quantity: item.quantity,
          Price: item.Price,
        })),
      },
    });

    const {
      body: {
        data: { OrderId },
      },
    } = response;

    const paymentOrderResponse = await apiFetch("/api/payment/create-payment", {
      method: "POST",
      body: {
        OrderId,
      },
    });

    const {
      body: {
        data: { RazorpayOrderId, PaymentId },
      },
    } = paymentOrderResponse;

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: Math.round(amount * 100),
      currency: "INR",
      name: "Driprats",
      description: "Drip Fashion",
      image: "/logo.png",
      order_id: RazorpayOrderId,
      handler: async (response: {
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => {
        await storePayment(
          OrderId,
          response.razorpay_payment_id,
          response.razorpay_signature,
          PaymentId
        );

        onPaymentUpdate(OrderId);
      },
      prefill: {
        name: "John Doe",
        email: "john@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "Driprats Office",
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
        console.log("payment failed");
        setIsLoading(false);
        onPaymentUpdate(OrderId, { error: response.error });
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
      className="w-full mt-4 bg-green-500"
    >
      {isLoading ? "Processing..." : "Pay Now"}
    </Button>
  );
};

export default RazorpayButton;
