// app/(checkout)/checkout/CheckoutPayment.tsx
"use client";

import RazorpayButton from "@/components/payment/RazorPayButton";
import { Card, CardContent } from "@/components/ui/card";
import { CartType } from "@/types/Cart";
import { ShippingInfo } from "@/types/Order";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

const CheckoutPayment = ({
  totalAmount,
  shippingInfo,
  items,
  isPaymentLoading,
  setIsPaymentLoading,
}: {
  totalAmount: number;
  shippingInfo: ShippingInfo;
  items: CartType[];
  isPaymentLoading: boolean;
  setIsPaymentLoading: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();

  const onPaymentUpdate = (
    orderId: string,
    error?: { error: { description: string } }
  ) => {
    console.log("payment success", { error, orderId });
    if (error) {
      router.replace("/order-failed");
    }
    router.replace(`/order-success/${orderId}`);
  };

  return (
    <Card>
      <CardContent>
        <h2 className="text-xl font-bold mb-4">Complete Your Payment</h2>
        <p className="mb-2">Total Amount: ₹{totalAmount}</p>
        <RazorpayButton
          amount={totalAmount}
          onPaymentUpdate={onPaymentUpdate}
          shippingInfo={shippingInfo}
          items={items}
          isLoading={isPaymentLoading}
          setIsLoading={setIsPaymentLoading}
        />
      </CardContent>
    </Card>
  );
};

export default CheckoutPayment;
