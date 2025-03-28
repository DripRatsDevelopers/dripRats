"use client";

import { OrderStatusEnum } from "@/types/Order";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Loader2, Package } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const statusSteps = [
  {
    key: OrderStatusEnum.INITIATED,
    label: "Payment Initiated",
    icon: CheckCircle,
  },
  {
    key: OrderStatusEnum.VERIFYING,
    label: "Verifying Payment",
    icon: Loader2,
    hideOn: [OrderStatusEnum.INITIATED],
  },
  {
    key: OrderStatusEnum.SUCCESS,
    label: "Payment Successful",
    icon: CheckCircle,
    hideOn: [
      OrderStatusEnum.INITIATED,
      OrderStatusEnum.VERIFYING,
      OrderStatusEnum.ERROR,
    ],
  },
  {
    key: OrderStatusEnum.CONFIRMED,
    label: "Order Confirmed",
    icon: Package,
    hideOn: [
      OrderStatusEnum.INITIATED,
      OrderStatusEnum.VERIFYING,
      OrderStatusEnum.ERROR,
    ],
  },
  {
    key: OrderStatusEnum.ERROR,
    label: "Something Went Wrong",
    icon: AlertTriangle,
    hideOn: [
      OrderStatusEnum.INITIATED,
      OrderStatusEnum.VERIFYING,
      OrderStatusEnum.SUCCESS,
      OrderStatusEnum.CONFIRMED,
    ],
  },
];

export default function OrderStatus() {
  const { id: orderId } = useParams();
  const router = useRouter();

  const [status, setStatus] = useState<OrderStatusEnum>(
    OrderStatusEnum.INITIATED
  );
  const currentStepIndex = statusSteps.findIndex((s) => s.key === status);

  const checkOrderStatus = useCallback(async (orderId: string) => {
    setStatus(OrderStatusEnum.VERIFYING);
    try {
      if (!orderId) {
        return;
      }
      const res = await fetch(
        `/api/order/get-order-payment-status?order_id=${orderId}`
      );
      const data = await res.json();

      if (data.status === "paid") {
        setStatus(OrderStatusEnum.SUCCESS);
        return;
      } else {
        verifyPayment(orderId);
      }
    } catch (error) {
      console.error(error);
      setStatus(OrderStatusEnum.ERROR);
    }
  }, []);

  useEffect(() => {
    if (status === OrderStatusEnum.CONFIRMED) {
      setTimeout(() => {
        router.replace(`/orders/${orderId}`);
      }, 5000);
    }
  }, [status, orderId, router]);

  useEffect(() => {
    if (!orderId) {
      setStatus(OrderStatusEnum.ERROR);
      return;
    }
    // checkOrderStatus(orderId as string);
  }, [orderId, checkOrderStatus]);

  const verifyPayment = async (orderId: string) => {
    try {
      const res = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();
      setStatus(data.success ? OrderStatusEnum.SUCCESS : OrderStatusEnum.ERROR);
    } catch (error) {
      console.error(error);
      setStatus(OrderStatusEnum.ERROR);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Payment Status</h1>

      <div className="relative flex flex-col ">
        {statusSteps.map((step, index) => {
          if (!step.hideOn?.includes(status)) {
            return (
              <div
                key={step.key}
                className="flex items-center mb-6 relative w-full"
              >
                {/* Vertical Connecting Line */}
                {index > 0 && (
                  <motion.div
                    initial={{ height: "0%" }}
                    animate={{
                      height: currentStepIndex >= index ? "100%" : "50%",
                    }}
                    transition={{ duration: 0.5 }}
                    className={`absolute left-6 -top-6 w-1 ${
                      currentStepIndex >= index
                        ? "bg-blue-500"
                        : "bg-gray-300 dark:bg-gray-700"
                    }`}
                  />
                )}

                {/* Icon & Label */}
                <div className="flex items-center space-x-4 z-10">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: status === step.key ? 1.2 : 1 }}
                    transition={{ duration: 0.3 }}
                    className={`w-12 h-12 flex items-center justify-center rounded-full border-2 ${
                      currentStepIndex === index
                        ? "border-blue-500 bg-blue-100 dark:bg-blue-900"
                        : "border-gray-300 dark:border-gray-700 bg-gray-200 dark:bg-gray-800"
                    }`}
                  >
                    {status === "verifying" && step.key === "verifying" ? (
                      <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                    ) : (
                      <step.icon
                        className={`w-6 h-6 ${
                          currentStepIndex === index
                            ? "text-blue-500 "
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      />
                    )}
                  </motion.div>
                  <span
                    className={`font-medium ${
                      currentStepIndex === index
                        ? "text-blue-500 text-2xl"
                        : "text-gray-500 dark:text-gray-400 text-lg"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              </div>
            );
          } else {
            return null;
          }
        })}
      </div>
      {status === OrderStatusEnum.ERROR && (
        <div className="mt-6 text-center">
          <p className="text-red-500 text-lg">
            Something went wrong from our side. Please try again later.
          </p>
          <button
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={() => router.push("/orders")}
          >
            Go to Orders
          </button>
        </div>
      )}

      {status === OrderStatusEnum.CONFIRMED && (
        <div className="mt-6 flex items-center space-x-2">
          <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
          <span className="text-gray-600 dark:text-gray-300">
            Redirecting to order details in 5 seconds...
          </span>
        </div>
      )}
    </div>
  );
}
