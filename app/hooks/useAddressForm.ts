import { apiFetch } from "@/lib/apiClient";
import {
  addressDetails,
  deliveryPartnerDetails,
  DeliveryType,
  ShippingInfo,
} from "@/types/Order";
import { useEffect, useState } from "react";
import usePlacesAutocomplete, { getGeocode } from "use-places-autocomplete";

interface placesTypes {
  description?: string;
  address_components?: google.maps.GeocoderAddressComponent[];
  formatted_address?: string;
}

const useAddressForm = () => {
  const [error, setError] = useState<Record<string, string>>({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [shippingDetails, setShippingDetails] = useState<ShippingInfo>({
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
    deliveryType: DeliveryType.STANDARD,
  });
  const [open, setOpen] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<addressDetails[]>([]);

  const [deliveryDetails, setDeliveryDetails] =
    useState<deliveryPartnerDetails>();

  useEffect(() => {
    const fetchAddress = async () => {
      const response = await apiFetch("/api/user/get-saved-address");
      const {
        body: {
          data: { savedAddress },
          success,
        },
      } = response;
      if (success) {
        setSavedAddresses(savedAddress);
      }
    };
    fetchAddress();
  }, []);

  const { suggestions, setValue, clearSuggestions } = usePlacesAutocomplete({
    requestOptions: { componentRestrictions: { country: "IN" } },
  });

  const handleSelect = async (place: placesTypes) => {
    if (place.description) {
      setValue(place.description, false);
      clearSuggestions();
    }
    const address = place?.description || place?.formatted_address;

    const components = place.address_components?.length
      ? place.address_components
      : (await getGeocode({ address: place.description }))?.[0]
          ?.address_components;

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

    setShippingDetails({
      ...shippingDetails,
      address,
      street,
      houseNumber,
      city,
      state,
      pincode,
      landmark,
      area,
    });
    // Pass data to parent component
  };

  // Get current location using Geolocation API
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

  const handleDeliveryTypeChange = (value: DeliveryType) => {
    setShippingDetails({ ...shippingDetails, deliveryType: value });
  };

  const isDeliveryAvailable = typeof deliveryDetails === "object";

  const handleClear = () => {
    setShippingDetails((prev) => ({
      ...prev,
      address: "",
    }));
    setShowSuggestions(false);
  };

  const removeErrorIfExists = (name: string) => {
    if (error.hasOwnProperty(name)) {
      const updatedErrorDetails = error;
      delete updatedErrorDetails[name];
      setError(updatedErrorDetails);
    }
  };

  const updateAddress = async () => {
    const payload = {
      address: JSON.stringify({
        id: shippingDetails?.id,
        houseNumber: shippingDetails?.houseNumber,
        street: shippingDetails?.street,
        landmark: shippingDetails?.landmark,
        area: shippingDetails?.area,
        city: shippingDetails?.city,
        state: shippingDetails?.state,
        pincode: shippingDetails?.pincode,
      }),
    };

    await apiFetch("/api/user/update-address", {
      method: "POST",
      body: payload,
    });
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
    ) ||
    Boolean(Object.values(error)?.length) ||
    !isDeliveryAvailable;

  return {
    deliveryDetails,
    setDeliveryDetails,
    shippingDetails,
    setShippingDetails,
    showSuggestions,
    suggestions,
    setShowSuggestions,
    disableConfirm,
    handleSelect,
    handleInputBlur,
    handleClear,
    error,
    setError,
    getCurrentLocation,
    setValue,
    removeErrorIfExists,
    handleDeliveryTypeChange,
    open,
    setOpen,
    updateAddress,
    savedAddresses,
    setSavedAddresses,
  };
};

export default useAddressForm;
