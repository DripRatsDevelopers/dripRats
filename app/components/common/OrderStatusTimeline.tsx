import { OrderEnum } from "@/types/Order";
import { CheckCircle2, CircleDot } from "lucide-react";

const statusSteps: { label: string; value: OrderEnum }[] = [
  { label: "Confirmed", value: OrderEnum.CONFIRMED },
  { label: "Shipped", value: OrderEnum.SHIPPED },
  { label: "Out For Delivery", value: OrderEnum.OUTFORDELIVERY },
  { label: "Delivered", value: OrderEnum.DELIVERED },
];

interface Props {
  currentStatus: OrderEnum;
}

export default function OrderStatusTimeline({ currentStatus }: Props) {
  const currentIndex = statusSteps.findIndex(
    (step) => step.value === currentStatus
  );

  return (
    <div className="flex justify-between w-full max-w-4xl mx-auto my-6">
      {statusSteps.map((step, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div
            key={step.value}
            className="flex-1 flex flex-col items-center relative"
          >
            {/* Icon */}
            <div
              className={`z-10 rounded-full p-1 ${
                isCompleted ? "bg-green-600" : "bg-gray-300"
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className={"text-white w-10 h-10"} />
              ) : (
                <CircleDot className="text-white w-10 h-10" />
              )}
            </div>

            {/* Label */}
            <span
              className={`mt-2 text-center ${
                isCurrent
                  ? "font-semibold text-black dark:text-white text-sm"
                  : "text-muted-foreground text-xs md:text-sm"
              }`}
            >
              {step.label}
            </span>

            {/* Connector */}
            {index !== statusSteps.length - 1 && (
              <div
                className={`absolute top-5 left-1/2  w-full h-0.5 -translate-y-1/2 z-0 ${
                  index < currentIndex ? "bg-green-600" : "bg-gray-300"
                }`}
              ></div>
            )}
          </div>
        );
      })}
    </div>
  );
}
