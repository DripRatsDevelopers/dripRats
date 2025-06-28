import {
  FLAT_SHIPPING_COSTS,
  FREE_DELIVERY_MINIMUM_AMOUNT,
} from "@/constants/DeliveryConstants";
import { useCart } from "@/hooks/useCart";
import {
  useDripratsMutation,
  useDripratsQuery,
} from "@/hooks/useTanstackQuery";
import { reserveItems } from "@/lib/orderUtils";
import { getProductStock, isAnyProductOutOfStock } from "@/lib/productUtils";
import { CartType } from "@/types/Cart";
import { InventoryItem, Product } from "@/types/Products";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const useCheckout = () => {
  const { cart } = useCart();
  const [currentStep, setCurrentStep] = useState<number>(1);

  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [disableNavigation, setDisableNavigation] = useState(false);
  const searchParams = useSearchParams();

  const productId = searchParams.get("productId");
  const quantity = Number(searchParams.get("quantity")) || 1;
  const { data, isLoading, status } = useDripratsQuery<CartType>({
    queryKey: ["/api/products", productId],
    apiParams: {
      url: `/api/products/${productId}`,
    },
    options: { enabled: !!productId },
  });

  const cartProductIds = cart?.map((cartItem) => cartItem?.ProductId);

  const {
    mutate,
    isPending: cartDataLoading,
    data: cartData,
  } = useDripratsMutation<Record<string, Product>>({
    apiParams: {
      url: `/api/products/getMultipleProducts`,
      body: cartProductIds,
      method: "POST",
    },
  });

  const [checkoutItems, setCheckoutItems] = useState<Record<string, CartType>>({
    initial: {
      ProductId: "",
      Name: "",
      Price: 0,
      ImageUrls: [""],
      quantity: 0,
      Description: "",
    },
  });
  const [stocks, setStocks] = useState<InventoryItem[]>();
  const [reservedItems, setReservedItems] = useState<
    { ProductId: string; Quantity: number }[]
  >([]);
  const router = useRouter();

  const isInitialState = Object.keys(checkoutItems)?.[0] === "initial";

  useEffect(() => {
    if (cart?.length && !cartData && !productId) {
      mutate();
    }
  }, [cart?.length, cartData]);

  useEffect(() => {
    if (cart?.length && cartData && !cartDataLoading) {
      const items = cart.reduce(
        (acc, item) => ({
          ...acc,
          [item.ProductId]: {
            ...cartData?.[item?.ProductId],
            ProductId: item?.ProductId,
            quantity: item?.quantity,
          },
        }),
        {}
      );
      setCheckoutItems(items);
    }
  }, [cart, cartData, cartDataLoading]);

  useEffect(() => {
    if (productId) {
      if (!isLoading && status === "success") {
        setCheckoutItems({
          [productId]: { ...data, quantity },
        });
      }
    }
  }, [data, isLoading, productId, quantity, status]);

  const checkoutItemsList = Object.values(checkoutItems);

  useEffect(() => {
    const fetchProductsStock = async () => {
      const stock = await getProductStock(Object.keys(checkoutItems));
      setStocks(stock);
    };
    if (
      !isInitialState &&
      Object.keys(checkoutItems)?.length > 0 &&
      !Array.isArray(stocks)
    ) {
      fetchProductsStock();
    }
  }, [checkoutItems, stocks, isInitialState]);

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
      ProductId: item.ProductId,
      Quantity: item.quantity,
    }));
    const reservedItems = await reserveItems(reservePayload);
    if (reservedItems?.length) {
      setReservedItems(reservedItems);
    } else {
      setReservedItems([]);
    }
  };

  const reservedItemsMap: Record<string, number> = reservedItems.reduce(
    (
      acc: Record<string, number>,
      cur: { ProductId: string; Quantity: number }
    ) => {
      acc[cur.ProductId] = cur.Quantity;
      return acc;
    },
    {}
  );

  const isStockReserved = reservedItems?.length
    ? checkoutItemsList?.filter(
        ({ ProductId, quantity }) => reservedItemsMap[ProductId] !== quantity
      )?.length === 0
    : false;

  const handleStepChange = async (direction: "next" | "prev") => {
    switch (direction) {
      case "prev": {
        setCurrentStep((prev) => prev - 1);
        break;
      }
      case "next": {
        if (!disableNext)
          switch (currentStep) {
            case 1: {
              try {
                setDisableNavigation(true);
                if (!isStockReserved) {
                  await reserveStockItems();
                }
                setCurrentStep((prev) => prev + 1);
              } catch (error) {
                console.error(error);
                toast.error("Something went wrong", {
                  description: "Something went wrong, please try again",
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

  useEffect(() => {
    if (
      checkoutItemsList?.length === 0 &&
      !isLoading &&
      status === "success" &&
      data &&
      !isInitialState
    ) {
      router.back();
    }
  }, [checkoutItemsList, data, router, isLoading, status, isInitialState]);

  const savings = checkoutItemsList.reduce(
    (acc, item) =>
      acc +
      (item.Price -
        (item?.DiscountedPrice ? item.DiscountedPrice : item.Price)) *
        (item.quantity || 1),
    0
  );

  const deliveryCharge =
    subtotal - savings >= FREE_DELIVERY_MINIMUM_AMOUNT
      ? 0
      : FLAT_SHIPPING_COSTS;

  const deliveryDiscount =
    subtotal - savings >= FREE_DELIVERY_MINIMUM_AMOUNT
      ? FLAT_SHIPPING_COSTS
      : 0;

  const grandTotal = subtotal - savings + deliveryCharge;
  const amountLeftForFreeShipping = (
    FREE_DELIVERY_MINIMUM_AMOUNT - grandTotal
  ).toFixed(2);

  const productStocksMap = stocks?.reduce(
    (acc: Record<string, number>, cur: InventoryItem) => {
      acc[cur.ProductId] = cur.Stock;
      return acc;
    },
    {}
  );

  const isProductOutOfStock = stocks?.length
    ? isAnyProductOutOfStock(
        checkoutItemsList?.map(({ ProductId, quantity }) => ({
          ProductId,
          quantity,
        })),
        stocks
      )
    : true;

  const disableProceed = () => {
    switch (currentStep) {
      case 2: {
        if (isProductOutOfStock || !checkoutItemsList?.length) {
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
      fetchingProductDetails: isLoading || cartDataLoading,
      isInitialState,
    },
    shippingInfo: {
      deliveryDiscount,
      amountLeftForFreeShipping,
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
