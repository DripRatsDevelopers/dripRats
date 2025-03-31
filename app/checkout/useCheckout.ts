import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/hooks/useCart";
import { fetchProduct } from "@/lib/productUtils";
import { CartType } from "@/types/Cart";
import {
  deliveryPartnerDetails,
  DeliveryType,
  ShippingInfo,
} from "@/types/Order";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const isPinCodeValid = (pincode: string) => {
  return pincode?.length === 6;
};

const isPhoneValid = (phoneNumber: string) => {
  return phoneNumber?.length === 10;
};

const useCheckout = () => {
  const { cart } = useCart();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: "",
    houseNumber: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    deliveryType: DeliveryType.STANDARD,
  });
  const [error, setError] = useState<Record<string, string>>({});

  const [deliveryDetails, setDeliveryDetails] =
    useState<deliveryPartnerDetails>();

  const searchParams = useSearchParams();

  const productId = searchParams.get("productId");
  const quantity = Number(searchParams.get("quantity")) || 1;
  const [checkoutItems, setCheckoutItems] = useState<Record<string, CartType>>(
    {}
  );

  useEffect(() => {
    if (productId) {
      const fetchData = async () => {
        const productdata = await fetchProduct(productId);
        if (productdata) {
          setCheckoutItems({ [productdata.id]: { ...productdata, quantity } });
        }
      };
      fetchData();
    } else {
      setCheckoutItems(
        cart.reduce((acc, item) => ({ ...acc, [item.id]: item }), {})
      );
    }
  }, [cart, productId, quantity]);

  const checkoutItemsList = Object.values(checkoutItems);

  const subtotal = checkoutItemsList.reduce(
    (acc, item) => acc + item.Price * (item.quantity || 1),
    0
  );

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/auth/login?redirect=${window.location.pathname}`);
    }
  }, [user, loading, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const trimmedValue = value?.trim();
    if (["phone", "pincode"].includes(name) && !/^\d*$/.test(trimmedValue))
      return;
    if (name === "pincode" && value.length > 6) {
      return;
    }
    if (
      (name === "pincode" && isPinCodeValid(value)) ||
      (name === "phone" && isPhoneValid(value)) ||
      value ||
      value?.length
    ) {
      if (error.hasOwnProperty(name)) {
        const updatedErrorDetails = error;
        delete updatedErrorDetails[name];
        setError(updatedErrorDetails);
      }
    }
    setShippingInfo({ ...shippingInfo, [name]: trimmedValue });
  };

  const handleInputBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, placeholder } = e.target;
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
        case "phone": {
          if (value?.length !== 10) {
            setError((prev) => ({
              ...prev,
              [name]: `Enter valid Phone Number`,
            }));
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
    setShippingInfo({ ...shippingInfo, deliveryType: value });
  };

  const handleQuantityChange = (id: string, increment: boolean) => {
    setCheckoutItems((prev) => {
      const item = prev[id];
      const newQty = increment
        ? item.quantity + 1
        : Math.max(item.quantity - 1, 1);
      return { ...prev, [id]: { ...item, quantity: newQty } };
    });
  };

  const isDeliveryAvailable = typeof deliveryDetails === "object";

  const isShippingInfoComplete =
    Object.values(shippingInfo).every((val) => val.trim() !== "") &&
    !Object.values(error)?.length &&
    isDeliveryAvailable;

  const handleStepChange = (direction: "next" | "prev") => {
    setCurrentStep((prev) => (direction === "next" ? prev + 1 : prev - 1));
  };

  const savings = subtotal * 0.1;
  const deliveryCharge = deliveryDetails?.price || 0;

  const grandTotal = subtotal - savings + deliveryCharge;

  return {
    items: {
      checkoutItems,
      checkoutItemsList,
      handleQuantityChange,
      grandTotal,
      subtotal,
      savings,
    },
    shippingDetails: {
      shippingInfo,
      handleInputChange,
      handleDeliveryTypeChange,
      handleInputBlur,
      isShippingInfoComplete,
      setDeliveryDetails,
      deliveryDetails,
      deliveryCharge,
      error,
    },
    form: {
      currentStep,
      setCurrentStep,
      handleStepChange,
    },
  };
};

export default useCheckout;
