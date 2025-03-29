// app/(checkout)/checkout/CheckoutPayment.tsx
"use client";

import RazorpayButton from "@/components/payment/RazorPayButton";
import { CartType } from "@/types/Cart";
import { ShippingInfo } from "@/types/Order";
import { useRouter } from "next/navigation";

const CheckoutPayment = ({
  totalAmount,
  shippingInfo,
  items,
}: {
  totalAmount: number;
  shippingInfo: ShippingInfo;
  items: CartType[];
}) => {
  const router = useRouter();

  const onPaymentUpdate = (
    orderId: string,
    error?: { error: { description: string } }
  ) => {
    if (error) {
      router.replace("/order-failed");
    }
    router.replace(`/order-status/${orderId}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Complete Your Payment</h2>
      <p className="mb-2">Total Amount: ₹{totalAmount}</p>

      <RazorpayButton
        amount={totalAmount}
        onPaymentUpdate={onPaymentUpdate}
        shippingInfo={shippingInfo}
        items={items}
      />
    </div>
  );
};

export default CheckoutPayment;
