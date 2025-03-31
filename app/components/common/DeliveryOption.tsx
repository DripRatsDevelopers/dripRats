"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import useGetDeliveryTime from "@/hooks/useGetDeliveryTime";
import { deliveryPartnerDetails, DeliveryType } from "@/types/Order";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useEffect } from "react";
import { Card, CardContent } from "../ui/card";

export default function DeliveryOptions({
  deliveryPincode,
  onSelect,
  selectedDeliveryType,
  deliveryDetails,
}: {
  deliveryPincode: string;
  onSelect: (
    option: DeliveryType,
    deliveryDetails?: deliveryPartnerDetails | string
  ) => void;
  selectedDeliveryType: DeliveryType;
  deliveryDetails?: deliveryPartnerDetails | string;
}) {
  const { checkDeliveryTime, deliveryOptions, loading } = useGetDeliveryTime();

  const hasStandardDelivery =
    typeof deliveryOptions?.standardDelivery === "object";

  const hasExpressDelivery =
    typeof deliveryOptions?.expressDelivery === "object";

  useEffect(() => {
    if (deliveryPincode && deliveryPincode?.length === 6) {
      checkDeliveryTime(deliveryPincode);
    }
  }, [checkDeliveryTime, deliveryPincode]);

  useEffect(() => {
    if (
      (hasStandardDelivery || hasExpressDelivery) &&
      selectedDeliveryType &&
      !deliveryDetails
    ) {
      const deliveryDetails =
        selectedDeliveryType === DeliveryType.EXPRESS
          ? deliveryOptions?.expressDelivery
          : deliveryOptions?.standardDelivery;
      onSelect(selectedDeliveryType, deliveryDetails);
    }
  }, [
    deliveryDetails,
    deliveryOptions?.expressDelivery,
    deliveryOptions?.standardDelivery,
    hasExpressDelivery,
    hasStandardDelivery,
    onSelect,
    selectedDeliveryType,
  ]);

  const handleSelectionChange = (value: DeliveryType) => {
    const deliveryDetails =
      value === DeliveryType.EXPRESS
        ? deliveryOptions?.expressDelivery
        : deliveryOptions?.standardDelivery;
    onSelect(value, deliveryDetails);
  };

  return (
    <div className="space-y-4">
      {!hasStandardDelivery && !hasExpressDelivery && !loading ? (
        <p className="text-destructive text-sm">
          Delivery Not available for this pincode, please try some other pincode
        </p>
      ) : (
        <>
          <h3 className="text-md font-semibold">Choose Delivery Option</h3>
          {loading ? (
            <div className="flex flex-col justify-center items-center md:flex-row gap-3">
              <Skeleton className="h-30 w-50" />
              <Skeleton className="h-30 w-50" />
            </div>
          ) : (
            <RadioGroup
              value={selectedDeliveryType}
              onValueChange={handleSelectionChange}
              className="flex flex-col justify-center items-center md:flex-row md:space-x-4"
            >
              {typeof deliveryOptions?.standardDelivery === "object" && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <Label className="cursor-pointer">
                    <Card
                      className={`w-50 p-4 text-center border-2 ${
                        selectedDeliveryType === DeliveryType.STANDARD
                          ? "border-blue-500 shadow-lg bg-blue-50 text-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      <CardContent className="p-2">
                        <strong>Standard Delivery</strong>
                        <p className="text-sm text-gray-500">
                          ₹{deliveryOptions.standardDelivery.price}
                        </p>
                        <p className="text-xs text-gray-500">
                          Arrives by {deliveryOptions.standardDelivery.etd}
                        </p>
                      </CardContent>
                    </Card>
                    <RadioGroupItem
                      value={DeliveryType.STANDARD}
                      className="absolute inset-0 opacity-0"
                    />
                  </Label>
                  {selectedDeliveryType === DeliveryType.STANDARD && (
                    <CheckCircle
                      className="absolute top-2 right-2 text-blue-500"
                      size={18}
                    />
                  )}
                </motion.div>
              )}

              {typeof deliveryOptions?.expressDelivery === "object" && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <Label className="cursor-pointer">
                    <Card
                      className={`w-50 p-4 text-center border-2 ${
                        selectedDeliveryType === DeliveryType.EXPRESS
                          ? "border-green-500 shadow-lg bg-green-50 text-green-500"
                          : "border-gray-300"
                      }`}
                    >
                      <CardContent className="p-2">
                        <strong>Express Delivery</strong>
                        <p className="text-sm text-gray-500">
                          ₹{deliveryOptions.expressDelivery.price}
                        </p>
                        <p className="text-xs text-gray-500">
                          Arrives by {deliveryOptions.expressDelivery.etd}
                        </p>
                      </CardContent>
                    </Card>
                    <RadioGroupItem
                      value={DeliveryType.EXPRESS}
                      className="absolute inset-0 opacity-0"
                    />
                  </Label>
                  {selectedDeliveryType === DeliveryType.EXPRESS && (
                    <CheckCircle
                      className="absolute top-2 right-2 text-green-500"
                      size={18}
                    />
                  )}
                </motion.div>
              )}
            </RadioGroup>
          )}
        </>
      )}
    </div>
  );
}
