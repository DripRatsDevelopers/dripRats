import { deliveryDetails } from "@/types/Order";
import { useCallback, useState } from "react";

const useGetDeliveryTime = () => {
  const [deliveryOptions, setDeliveryOptions] = useState<deliveryDetails>();
  const [loading, setLoading] = useState(false);

  const checkDeliveryTime = useCallback(async (pincode: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/delivery/get-delivery-time?pincode=${pincode}`
      );
      const deliveryTime = await response.json();
      const courierOptions = deliveryTime.data.available_courier_companies;
      // Sort by delivery time (fastest) and then by rating (highest)
      const expressSorted = [...courierOptions].sort((a, b) => {
        if (a.delivery_days !== b.delivery_days) {
          return (
            Number(a.estimated_delivery_days) -
            Number(b.estimated_delivery_days)
          ); // Fastest first
        }
        return b.rating - a.rating; // Higher rating first
      });

      // Sort by price (cheapest) and then by rating (highest)
      const standardSorted = [...courierOptions].sort((a, b) => {
        if (a.rate !== b.rate) {
          return a.rate - b.rate; // Cheapest first
        }
        if (a.rating !== b.rating) {
          return b.rating - a.rating; // Higher rating first
        }
        return (
          Number(a.estimated_delivery_days) - Number(b.estimated_delivery_days)
        );
      });
      const expressDelivery = expressSorted.find(
        (courier) => courier.estimated_delivery_days <= 3
      ); // Fastest delivery
      const standardDelivery = standardSorted[0];
      setDeliveryOptions({
        expressDelivery: expressDelivery
          ? {
              name: expressDelivery.courier_name,
              price: expressDelivery.rate,
              estimatedDays: expressDelivery.estimated_delivery_days,
              rating: expressDelivery.rating,
              id: expressDelivery.id,
              etd: expressDelivery.etd,
            }
          : "No express delivery available",

        standardDelivery: standardDelivery
          ? {
              name: standardDelivery.courier_name,
              price: standardDelivery.rate,
              estimatedDays: standardDelivery.estimated_delivery_days,
              rating: standardDelivery.rating,
              id: standardDelivery.id,
              etd: standardDelivery.etd,
            }
          : "No standard delivery available",
      });
    } catch (error) {
      console.error("Error checking delivery time:", error);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array since this function doesn't depend on any external values

  const hasStandardDelivery =
    typeof deliveryOptions?.standardDelivery === "object";

  const hasExpressDelivery =
    typeof deliveryOptions?.expressDelivery === "object";

  return {
    checkDeliveryTime,
    deliveryOptions,
    setDeliveryOptions,
    loading,
    hasExpressDelivery,
    hasStandardDelivery,
  };
};

export default useGetDeliveryTime;
