import { useCart } from "@/hooks/useCart";
import { fetchProduct } from "@/lib/productUtils";
import { CartType } from "@/types/Cart";
import { deliveryPartnerDetails } from "@/types/Order";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const useCheckout = ({
  deliveryDetails,
  updateAddress,
}: {
  deliveryDetails?: deliveryPartnerDetails;
  updateAddress: () => Promise<void>;
}) => {
  const { cart } = useCart();
  const [currentStep, setCurrentStep] = useState<number>(1);

  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [saveAddress, setSaveAddress] = useState(false);

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

  const handleQuantityChange = (id: string, increment: boolean) => {
    setCheckoutItems((prev) => {
      const item = prev[id];
      const newQty = increment
        ? item.quantity + 1
        : Math.max(item.quantity - 1, 1);
      return { ...prev, [id]: { ...item, quantity: newQty } };
    });
  };

  const handleStepChange = async (direction: "next" | "prev") => {
    if (direction === "next" && saveAddress) {
      await updateAddress();
    }
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
    shippingInfo: {
      deliveryCharge,
      saveAddress,
      setSaveAddress,
    },
    form: {
      currentStep,
      setCurrentStep,
      handleStepChange,
    },
    payment: {
      isPaymentLoading,
      setIsPaymentLoading,
    },
  };
};

export default useCheckout;
