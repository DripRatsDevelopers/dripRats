import { apiFetch } from "@/lib/apiClient";
import { deliveryPartnerDetails } from "@/types/Order";
import { useCallback, useState } from "react";

const useGetDeliveryTime = () => {
  const [deliveryOptions, setDeliveryOptions] =
    useState<deliveryPartnerDetails>();
  const [loading, setLoading] = useState(false);

  const checkDeliveryTime = useCallback(async (pincode: string) => {
    try {
      setLoading(true);
      const response = await apiFetch(
        `/api/delivery/get-delivery-time?pincode=${pincode}`
      );
      const recommendedCourierId =
        response.data?.shiprocket_recommended_courier_id;
      const courierOptions = response?.data?.available_courier_companies;

      const recommendedCourierOption = courierOptions?.find(
        (option: { courier_company_id: string }) =>
          option?.courier_company_id === recommendedCourierId
      );

      setDeliveryOptions({
        name: recommendedCourierOption.courier_name,
        price: recommendedCourierOption.rate,
        estimatedDays: recommendedCourierOption.estimated_delivery_days,
        rating: recommendedCourierOption.rating,
        id: recommendedCourierOption.id,
        etd: recommendedCourierOption.etd,
      });
    } catch (error) {
      console.error("Error checking delivery time:", error);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array since this function doesn't depend on any external values

  return {
    checkDeliveryTime,
    deliveryOptions,
    setDeliveryOptions,
    loading,
  };
};

export default useGetDeliveryTime;
