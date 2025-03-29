"use client";

import { Button } from "@/components/ui/button";
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

  const [status, setStatus] = useState<
    PaymentStatusEnum | OrderEnum | undefined
  >();
  const [showDetails, setShowDetails] = useState(false);

  const currentStepIndex = statusSteps.findIndex((s) => s.key === status);

  const checkOrderStatus = useCallback(
    async (orderId: string) => {
      try {
        if (!orderId) {
          return;
        }
        const res = await fetch(
          `/api/order/get-order-status?order_id=${orderId}`
        );

        const {
          body: { data, error, success },
        } = await res.json();

        if (success) {
          const status = data?.Status;

          setStatus(status);
          if ([PaymentStatusEnum.PAID, OrderEnum.CONFIRMED].includes(status)) {
            triggerTransition();
            return;
          } else {
            verifyPayment(orderId);
          }
        } else if (error) {
          router.replace("/");
        }
      } catch (error) {
        console.error(error);
        setStatus(PaymentStatusEnum.FAILED);
      }
    },
    [router]
  );

  useEffect(() => {
    if (!orderId) {
      setStatus(PaymentStatusEnum.FAILED);
      router.replace("/");
      return;
    }
    checkOrderStatus(orderId as string);
  }, [orderId, checkOrderStatus, router]);

  const verifyPayment = async (orderId: string) => {
    setStatus(PaymentStatusEnum.VERIFYING);

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

  if (showDetails) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center"
        >
          <CheckCircle className="w-40 h-40 p-10 text-green-500 mb-4 bg-green-100 rounded-full" />
          <h1 className="text-2xl font-bold mb-2">Order Confirmed</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Thank you for your purchase!
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Your order is on its way and will reach you soon
          </p>
          <div className="mt-6 flex space-x-4">
            <Button onClick={() => router.replace(`/order-details/${orderId}`)}>
              View Order Details
            </Button>
            <Button variant="outline" onClick={() => router.replace("/")}>
              Go to Home
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Payment Status</h1>

      <motion.div
        initial={{ x: 0 }}
        animate={{ x: showDetails ? "-40%" : "0%" }}
        transition={{ duration: 0.5 }}
        className="relative flex flex-col items-start"
      >
        <div className="relative flex flex-col ">
          {status &&
            statusSteps.map((step, index) => {
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
            <Button onClick={() => router.replace("/orders")}>
              Go to Orders
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
