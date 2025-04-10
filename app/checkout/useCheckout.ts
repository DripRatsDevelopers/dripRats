import { useCart } from "@/hooks/useCart";
import { reserveItems } from "@/lib/orderUtils";
import {
  fetchProduct,
  getProductStock,
  isAnyProductOutOfStock,
} from "@/lib/productUtils";
import { CartType } from "@/types/Cart";
import { deliveryPartnerDetails } from "@/types/Order";
import { InventoryItem } from "@/types/Products";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const useCheckout = ({
  deliveryDetails,
  updateAddress,
  disableConfirm,
}: {
  deliveryDetails?: deliveryPartnerDetails;
  updateAddress: () => Promise<void>;
  disableConfirm: boolean;
}) => {
  const { cart } = useCart();
  const [currentStep, setCurrentStep] = useState<number>(1);

  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [saveAddress, setSaveAddress] = useState(false);
  const [disableNavigation, setDisableNavigation] = useState(false);
  const searchParams = useSearchParams();

  const productId = searchParams.get("productId");
  const quantity = Number(searchParams.get("quantity")) || 1;
  const [checkoutItems, setCheckoutItems] = useState<Record<string, CartType>>(
    {}
  );
  const [stocks, setStocks] = useState<InventoryItem[]>();
  const [isStockReserved, setIsStockReserved] = useState(false);

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

  useEffect(() => {
    const fetchProductsStock = async () => {
      const stock = await getProductStock(Object.keys(checkoutItems));
      setStocks(stock);
    };
    if (Object.keys(checkoutItems)?.length > 0 && !stocks?.length) {
      fetchProductsStock();
    }
  }, [checkoutItems, stocks]);

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

  const handleRemoveItem = (id: string) => {
    const updatedCheckoutItems = { ...checkoutItems };
    if (updatedCheckoutItems?.[id]) {
      delete updatedCheckoutItems?.[id];
      setCheckoutItems(updatedCheckoutItems);
    }
  };

  const reserveStockItems = async () => {
    const reservePayload = checkoutItemsList.map((item) => ({
      ProductId: item.id,
      Quantity: item.quantity,
    }));
    const isReserved = await reserveItems(reservePayload);
    setIsStockReserved(isReserved);
  };

  const handleStepChange = async (direction: "next" | "prev") => {
    switch (direction) {
      case "prev": {
        setCurrentStep((prev) => prev - 1);
        break;
      }
      case "next": {
        switch (currentStep) {
          case 1: {
            try {
              setDisableNavigation(true);
              await updateAddress();
              await reserveStockItems();
              setCurrentStep((prev) => prev + 1);
            } catch (error) {
              console.error(error);
              toast.error("Something went wrong", {
                description: "Something went wrong,please try again",
              });
            }
            setDisableNavigation(false);
            break;
          }
          case 2: {
            try {
              if (!isStockReserved) {
                setDisableNavigation(true);
                await reserveStockItems();
              }
              setDisableNavigation(false);
              setCurrentStep((prev) => prev + 1);
            } catch (error) {
              console.error(error);
              toast.error("Something went wrong", {
                description: "Something went wrong,please try again",
              });
            }
            break;
          }
        }
      }
    }
  };

  const savings = subtotal * 0.1;
  const deliveryCharge = deliveryDetails?.price || 0;

  const grandTotal = subtotal - savings + deliveryCharge;

  const productStocksMap = stocks?.reduce(
    (acc: Record<string, number>, cur: InventoryItem) => {
      acc[cur.ProductId] = cur.Stock;
      return acc;
    },
    {}
  );

  const isProductOutOfStock = stocks?.length
    ? isAnyProductOutOfStock(
        checkoutItemsList?.map(({ id, quantity }) => ({ id, quantity })),
        stocks
      )
    : true;

  const disableProceed = () => {
    switch (currentStep) {
      case 1: {
        if (Boolean(disableConfirm)) {
          return true;
        }
        return false;
      }
      case 2: {
        if (isProductOutOfStock) {
          return true;
        }
        return false;
      }

      default: {
        return false;
      }
    }
  };

  const disableNext = disableProceed();

  return {
    items: {
      checkoutItems,
      checkoutItemsList,
      handleQuantityChange,
      grandTotal,
      subtotal,
      savings,
      isProductOutOfStock,
      productStocksMap,
      handleRemoveItem,
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
      disableNext,
      disableNavigation,
      setDisableNavigation,
    },
    payment: {
      isPaymentLoading,
      setIsPaymentLoading,
    },
  };
};

export default useCheckout;
