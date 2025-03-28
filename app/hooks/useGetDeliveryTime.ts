import { useCallback, useState } from "react";

const useGetDeliveryTime = () => {
  const [deliveryTime, setDeliveryTime] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const checkDeliveryTime = useCallback(async (pincode: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/create-delivery-time?pincode=${pincode}`
      );
      const deliveryTime = await response.json();
      setDeliveryTime(deliveryTime.data.available_courier_companies[0]?.etd);
    } catch (error) {
      console.error("Error checking delivery time:", error);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array since this function doesn't depend on any external values

  return { checkDeliveryTime, deliveryTime, setDeliveryTime, loading };
};

export default useGetDeliveryTime;
