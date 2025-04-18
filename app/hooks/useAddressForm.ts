import { NEW_ADRESS_ID } from "@/constants/DeliveryConstants";
import { useUser } from "@/context/UserContext";
import { ShippingInfo } from "@/types/Order";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import useGetDeliveryTime from "./useGetDeliveryTime";

interface placesTypes {
  address_components: google.maps.GeocoderAddressComponent[];
  formatted_address: string;
}

const useAddressForm = ({
  shippingDetails,
  setShippingDetails,
}: {
  shippingDetails: ShippingInfo;
  setShippingDetails: Dispatch<SetStateAction<ShippingInfo>>;
}) => {
  const [error, setError] = useState<Record<string, string>>({});
  const [address, setAddress] = useState<ShippingInfo>({
    fullName: shippingDetails?.fullName,
    phone: shippingDetails.phone,
    id: shippingDetails?.id,
    address: shippingDetails?.address,
    houseNumber: shippingDetails?.houseNumber,
    street: shippingDetails?.street,
    landmark: shippingDetails?.landmark,
    area: shippingDetails?.area,
    city: shippingDetails?.city,
    state: shippingDetails?.state,
    pincode: shippingDetails?.pincode,
  });

  const { updateSavedAddress } = useUser();

  const updatedAddress: ShippingInfo =
    shippingDetails?.id !== NEW_ADRESS_ID ? address : shippingDetails;

  const setUpdatedAddress =
    shippingDetails?.id !== NEW_ADRESS_ID ? setAddress : setShippingDetails;

  const { checkDeliveryTime, deliveryOptions, loading, setDeliveryOptions } =
    useGetDeliveryTime();

  useEffect(() => {
    const deliveryPincode = updatedAddress.pincode;
    if (deliveryPincode && deliveryPincode?.length === 6 && !deliveryOptions) {
      checkDeliveryTime(deliveryPincode);
    }
  }, [checkDeliveryTime, updatedAddress.pincode, deliveryOptions]);

  const handleSelect = async (place: placesTypes) => {
    const addressData = place?.formatted_address;
    const components = place.address_components;

    const getComponent = (type: string) =>
      components.find((comp) => comp.types.includes(type))?.long_name || "";

    const street = getComponent("route");
    const houseNumber = getComponent("street_number");
    const landmark =
      getComponent("point_of_interest") || getComponent("premise");
    const area =
      getComponent("sublocality_level_1") ||
      getComponent("sublocality_level_2");
    const city =
      getComponent("locality") || getComponent("administrative_area_level_2");
    const state = getComponent("administrative_area_level_1");
    const pincode = getComponent("postal_code");
    setDeliveryOptions(undefined);
    setError({});
    setUpdatedAddress({
      ...updatedAddress,
      address: addressData,
      street,
      houseNumber,
      city,
      state,
      pincode,
      landmark,
      area,
    });
  };

  const getCurrentLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
        );
        const data = await response.json();
        if (data.results.length > 0) {
          handleSelect({
            address_components: data.results[0].address_components,
            formatted_address: data.results[0].formatted_address,
          });
        }
      });
    } else {
      alert("Geolocation is not supported.");
    }
  };

  const handleInputBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, placeholder } = e.target;
    const value = e.target.value?.trim();
    if (name !== "landmark")
      if (!value || value?.length === 0) {
        setError((prev) => ({ ...prev, [name]: `${placeholder} is required` }));
      } else {
        switch (name) {
          case "pincode": {
            if (value?.length !== 6) {
              setError((prev) => ({ ...prev, [name]: `Enter valid Pincode` }));
            } else {
              if (error.hasOwnProperty(name)) {
                const updatedErrorDetails = error;
                delete updatedErrorDetails[name];
                setError(updatedErrorDetails);
              }
            }
            break;
          }
          default: {
            if (value || value?.length) {
              if (error.hasOwnProperty(name)) {
                const updatedErrorDetails = error;
                delete updatedErrorDetails[name];
                setError(updatedErrorDetails);
              }
            }
          }
        }
      }
  };

  const isDeliveryAvailable = !loading && deliveryOptions?.etd;

  const removeErrorIfExists = (name: string) => {
    if (error.hasOwnProperty(name)) {
      const updatedErrorDetails = error;
      delete updatedErrorDetails[name];
      setError(updatedErrorDetails);
    }
  };

  const updateAddress = async () => {
    await updateSavedAddress(updatedAddress);
  };
  const disableConfirm =
    Boolean(
      !updatedAddress?.fullName?.length ||
        !updatedAddress?.phone?.length ||
        !updatedAddress?.houseNumber?.length ||
        !updatedAddress?.street?.length ||
        !updatedAddress?.city?.length ||
        !updatedAddress?.state?.length ||
        !updatedAddress?.pincode?.length ||
        !updatedAddress?.area?.length
    ) ||
    Boolean(Object.values(error)?.length) ||
    !isDeliveryAvailable;

  return {
    disableConfirm,
    handleSelect,
    handleInputBlur,
    error,
    setError,
    getCurrentLocation,
    removeErrorIfExists,
    updateAddress,
    deliveryOptions,
    setDeliveryOptions,
    fetchingDeliveryTime: loading,
    updatedAddress,
    setUpdatedAddress,
  };
};

export default useAddressForm;
