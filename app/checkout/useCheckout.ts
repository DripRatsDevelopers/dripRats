import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/hooks/useCart";
import { fetchProduct } from "@/lib/productUtils";
import { CartType } from "@/types/Cart";
import { addressDetails, deliveryPartnerDetails } from "@/types/Order";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const savedAddresses: addressDetails[] = [
  {
    id: "1",
    houseNumber: "F1",
    street: "JP Nagar",
    area: "Surapet",
    city: "Chennai",
    landmark: "Behind Velammal School",
    state: "Tamilnadu",
    pincode: "600066",
  },
  {
    id: "2",
    houseNumber: "5",
    street: "",
    area: "Podavur",
    city: "Kanchipuram",
    state: "Tamilnadu",
    pincode: "602108",
  },
];

const useCheckout = ({
  deliveryDetails,
}: {
  deliveryDetails?: deliveryPartnerDetails;
}) => {
  const { cart } = useCart();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [currentStep, setCurrentStep] = useState<number>(1);

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

  const handleQuantityChange = (id: string, increment: boolean) => {
    setCheckoutItems((prev) => {
      const item = prev[id];
      const newQty = increment
        ? item.quantity + 1
        : Math.max(item.quantity - 1, 1);
      return { ...prev, [id]: { ...item, quantity: newQty } };
    });
  };

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
    shippingInfo: {
      deliveryCharge,
      savedAddresses,
    },
    form: {
      currentStep,
      setCurrentStep,
      handleStepChange,
    },
  };
};

export default useCheckout;
