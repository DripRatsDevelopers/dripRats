import axios from "axios";
import { useState } from "react";

const useGetDeliveryTime = () => {
  const [deliveryTime, setDeliveryTime] = useState("");
  const [loading, setLoading] = useState(false);

  const checkDeliveryTime = async (deliveryPincode: string) => {
    setLoading(true);

    try {
      // Step 1: Get Auth Token
      const authResponse = await axios.post("/api/shiprocket/auth", {
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD,
      });

      const token = authResponse.data.token;

      // Step 2: Fetch Delivery Time
      const serviceResponse = await axios.get("/api/shiprocket/delivery-time", {
        params: {
          token,
          pickupPincode: "600066",
          deliveryPincode,
          weight: 1,
          cod: 0,
        },
      });

      setDeliveryTime(
        serviceResponse.data.data.available_courier_companies[0]?.etd ||
          "Not Available"
      );
    } catch (error) {
      console.error("Error fetching delivery time:", error);
      setDeliveryTime("Failed to fetch");
    }

    setLoading(false);
  };

  return { checkDeliveryTime, loading, deliveryTime, setDeliveryTime };
};

export default useGetDeliveryTime;
