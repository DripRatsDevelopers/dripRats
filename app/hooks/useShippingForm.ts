import { NEW_ADRESS_ID } from "@/constants/DeliveryConstants";
import { useUser } from "@/context/UserContext";
import { ShippingInfo } from "@/types/Order";
import { useEffect, useState } from "react";
import useGetDeliveryTime from "./useGetDeliveryTime";

const useShippingForm = () => {
  const [shippingDetails, setShippingDetails] = useState<ShippingInfo>({
    id: NEW_ADRESS_ID,
    address: "",
    houseNumber: "",
    street: "",
    landmark: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
    fullName: "",
    phone: "",
  });
  const {
    savedAddresses,
    setSavedAddresses,
    fetchingAddress,
    updateSavedAddress,
  } = useUser();
  const [open, setOpen] = useState(false);

  const { checkDeliveryTime, deliveryOptions, loading, setDeliveryOptions } =
    useGetDeliveryTime();

  useEffect(() => {
    const deliveryPincode = shippingDetails.pincode;
    if (deliveryPincode && deliveryPincode?.length === 6 && !deliveryOptions) {
      checkDeliveryTime(deliveryPincode);
    }
  }, [
    checkDeliveryTime,
    shippingDetails.pincode,
    deliveryOptions,
    shippingDetails?.id,
  ]);

  useEffect(() => {
    if (!fetchingAddress && savedAddresses?.length === 0) {
      setOpen(true);
    }
  }, [savedAddresses, fetchingAddress]);

  useEffect(() => {
    if (
      !open &&
      savedAddresses?.length &&
      (!shippingDetails?.id || shippingDetails?.id === NEW_ADRESS_ID)
    ) {
      setShippingDetails(savedAddresses[0]);
    }
  }, [open, savedAddresses, shippingDetails?.id]);

  const isDeliveryAvailable = !loading && deliveryOptions?.etd;

  const updateAddress = async () => {
    await updateSavedAddress(shippingDetails);
  };
  const disableConfirm =
    Boolean(
      !shippingDetails?.fullName?.length ||
        !shippingDetails?.phone?.length ||
        !shippingDetails?.houseNumber?.length ||
        !shippingDetails?.street?.length ||
        !shippingDetails?.city?.length ||
        !shippingDetails?.state?.length ||
        !shippingDetails?.pincode?.length ||
        !shippingDetails?.area?.length
    ) || !isDeliveryAvailable;

  return {
    shippingDetails,
    setShippingDetails,
    disableConfirm,
    open,
    setOpen,
    updateAddress,
    savedAddresses,
    setSavedAddresses,
    deliveryOptions,
    setDeliveryOptions,
    fetchingDeliveryTime: loading,
  };
};

export default useShippingForm;
