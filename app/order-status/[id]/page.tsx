"use client";

import { OrderEnum, PaymentStatusEnum } from "@/types/Order";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle,
  Loader2,
  LucideProps,
  Package,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import {
  ForwardRefExoticComponent,
  RefAttributes,
  useCallback,
  useEffect,
  useState,
} from "react";

interface statusStep {
  key: PaymentStatusEnum | OrderEnum;
  label: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  hideOn?: (PaymentStatusEnum | OrderEnum)[];
}

const statusSteps: statusStep[] = [
  {
    key: PaymentStatusEnum.INITIATED,
    label: "Payment Initiated",
    icon: CheckCircle,
  },
  {
    key: PaymentStatusEnum.VERIFYING,
    label: "Verifying Payment",
    icon: Loader2,
    hideOn: [PaymentStatusEnum.INITIATED],
  },
  {
    key: PaymentStatusEnum.PAID,
    label: "Payment Successful",
    icon: CheckCircle,
    hideOn: [
      PaymentStatusEnum.INITIATED,
      PaymentStatusEnum.VERIFYING,
      PaymentStatusEnum.FAILED,
    ],
  },
  {
    key: OrderEnum.CONFIRMED,
    label: "Order Confirmed",
    icon: Package,
    hideOn: [
      PaymentStatusEnum.INITIATED,
      PaymentStatusEnum.VERIFYING,
      PaymentStatusEnum.FAILED,
      PaymentStatusEnum.PAID,
    ],
  },
  {
    key: PaymentStatusEnum.FAILED,
    label: "Something Went Wrong",
    icon: AlertTriangle,
    hideOn: [
      PaymentStatusEnum.INITIATED,
      PaymentStatusEnum.VERIFYING,
      PaymentStatusEnum.PAID,
      OrderEnum.CONFIRMED,
    ],
  },
];

export default function OrderStatus() {
  const { id: orderId } = useParams();
  const router = useRouter();

  const [status, setStatus] = useState<PaymentStatusEnum | OrderEnum>(
    PaymentStatusEnum.INITIATED
  );
  const [showDetails, setShowDetails] = useState(false);

  const currentStepIndex = statusSteps.findIndex((s) => s.key === status);

  const checkOrderStatus = useCallback(async (orderId: string) => {
    setStatus(PaymentStatusEnum.VERIFYING);
    try {
      if (!orderId) {
        return;
      }
      const res = await fetch(
        `/api/order/get-order-status?order_id=${orderId}`
      );

      const {
        body: { data },
      } = await res.json();
      const status = data?.Status;

      if ([PaymentStatusEnum.PAID, OrderEnum.CONFIRMED].includes(status)) {
        setStatus(status);
        triggerTransition();
        return;
      } else {
        verifyPayment(orderId);
      }
    } catch (error) {
      console.error(error);
      setStatus(PaymentStatusEnum.FAILED);
    }
  }, []);

  useEffect(() => {
    if (!orderId) {
      setStatus(PaymentStatusEnum.FAILED);
      return;
    }
    checkOrderStatus(orderId as string);
  }, [orderId, checkOrderStatus]);

  const verifyPayment = async (orderId: string) => {
    try {
      const res = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const {
        body: {
          data: { Status },
        },
      } = await res.json();
      setStatus(Status);
    } catch (error) {
      console.error(error);
      setStatus(PaymentStatusEnum.FAILED);
    }
  };

  const triggerTransition = () => {
    setTimeout(() => {
      setShowDetails(true);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Payment Status</h1>

      <motion.div
        className="relative w-80 flex flex-col items-start"
        initial={{ opacity: 1, scale: 1 }}
        animate={
          showDetails
            ? { opacity: 0, scale: 0.8, x: -200 }
            : { opacity: 1, scale: 1, x: 0 }
        }
        transition={{ duration: 0.5 }}
      >
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
                        height:
                          statusSteps.findIndex((s) => s.key === status) >=
                          index
                            ? "100%"
                            : "50%",
                      }}
                      transition={{ duration: 0.5 }}
                      className={`absolute left-6 -top-6 w-1 ${
                        statusSteps.findIndex((s) => s.key === status) >= index
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
                      {status === PaymentStatusEnum.VERIFYING &&
                      step.key === PaymentStatusEnum.VERIFYING ? (
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
        {status === PaymentStatusEnum.FAILED && (
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
      </motion.div>
      {/* Order Details Section */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, x: 200 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-6 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md w-80"
        >
          <h2 className="text-xl font-semibold mb-2">Order Details</h2>
          <p>Order ID: {orderId}</p>
          <p>
            Status:{" "}
            {status === OrderEnum.CONFIRMED
              ? "Payment Successful"
              : "Something went wrong"}
          </p>
          {status === OrderEnum.CONFIRMED && (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 5 }}
              className="text-sm text-gray-500 dark:text-gray-400 mt-2"
            >
              Redirecting you in 5 seconds...
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}
