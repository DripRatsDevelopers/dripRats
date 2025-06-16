import { NEW_ADRESS_ID } from "@/constants/DeliveryConstants";
import { cartKey, wishlistKey } from "@/constants/UserConstants";
import useAuthState from "@/hooks/useAuthState";
import {
  useDripratsMutation,
  useDripratsQuery,
} from "@/hooks/useTanstackQuery";
import { apiFetch } from "@/lib/apiClient";
import {
  clearLocalCart,
  clearLocalWishlist,
  getLocalCart,
  getLocalWishlist,
} from "@/lib/userUtils";
import { CartItem } from "@/types/Cart";
import { ShippingInfo } from "@/types/Order";
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

type UserContextType = {
  cart: CartItem[];
  setCart: (newCart: CartItem[]) => void;
  totalItemsInCart: number;
  wishlist: string[];
  setWishlist: (newWishlist: string[]) => void;
  totalWishlistItems: number;
  savedAddresses?: ShippingInfo[];
  setSavedAddresses: (items: ShippingInfo[]) => void;
  updateSavedAddress: (address: ShippingInfo) => Promise<void>;
  deleteAddress: (addressId: string) => Promise<void>;
  fetchingAddress: boolean;
  totalCartAmount: number;
  isAddressUpdating: boolean;
};

type UserDetails = {
  Addresses: ShippingInfo[];
  Wishlist: string[];
  Cart: CartItem[];
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthState();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [savedAddresses, setSavedAddresses] = useState<
    ShippingInfo[] | undefined
  >();
  const [isAddressUpdating, setIsAddressUpdating] = useState(false);

  const updateCartMutation = useDripratsMutation<void, CartItem[]>({
    apiParams: {
      url: "/api/user/update-cart",
      method: "POST",
    },
    mutationFn: async (newCart: CartItem[]) => {
      return apiFetch("/api/user/update-cart", {
        method: "POST",
        body: { cart: newCart },
      });
    },
  });

  const updateWishlistMutation = useDripratsMutation<void, string[]>({
    apiParams: {
      url: "/api/user/update-wishlist",
      method: "POST",
    },
    mutationFn: async (newWishlist: string[]) => {
      return apiFetch("/api/user/update-wishlist", {
        method: "POST",
        body: { wishlist: newWishlist },
      });
    },
  });

  const { data, isLoading } = useDripratsQuery<UserDetails>({
    queryKey: ["/api/user/get-user-data"],
    apiParams: {
      url: `/api/user/get-user-data`,
    },
    options: { enabled: !!user },
  });

  const {
    mutate,
    data: priceData,
    isIdle,
    isPending,
  } = useDripratsMutation<{
    summaryData: { ProductId: string; Price: number }[];
  }>({
    apiParams: {
      url: `/api/products/get-product-price`,
      body: { productIds: cart.map((item) => item.ProductId) },
      method: "POST",
    },
  });

  useEffect(() => {
    const onUserStatusChanged = async () => {
      if (user && !isLoading && data) {
        const localCart: CartItem[] = getLocalCart();
        const localWishlist: string[] = getLocalWishlist();
        const db = data;

        const mergedWishlist: string[] =
          localWishlist.length > 0
            ? Array.from(new Set([...(db.Wishlist || []), ...localWishlist]))
            : db.Wishlist;

        const mergedCartMap = new Map<string, CartItem>();
        [...(db.Cart || []), ...localCart].forEach((item) => {
          const key = item.ProductId;
          mergedCartMap.set(key, {
            ProductId: key,
            quantity: (mergedCartMap.get(key)?.quantity || 0) + item.quantity,
          });
        });
        const mergedCart = Array.from(mergedCartMap.values());

        setCart(mergedCart);
        setWishlist(mergedWishlist);
        setSavedAddresses(db.Addresses || []);
        if (localCart.length > 0)
          await updateCartMutation.mutateAsync(mergedCart);
        if (localWishlist.length > 0)
          await updateWishlistMutation.mutateAsync(mergedWishlist);

        clearLocalCart();
        clearLocalWishlist();
      } else {
        setCart(getLocalCart());
        setWishlist(getLocalWishlist());
        setSavedAddresses([]);
      }
    };

    onUserStatusChanged();
  }, [data, user]);

  const cartPricedata = priceData?.summaryData;

  useEffect(() => {
    if (!priceData && cart.length && isIdle) {
      mutate();
    }
  }, [priceData, cart.length]);

  useEffect(() => {
    if (
      priceData?.summaryData.length !== cart.length &&
      !isIdle &&
      !isPending
    ) {
      mutate();
    }
  }, [priceData, cart.length, isIdle, isPending]);

  const updateCart = async (newCart: CartItem[]) => {
    try {
      if (user) {
        await updateCartMutation.mutateAsync(newCart);
      } else localStorage.setItem(cartKey, JSON.stringify(newCart));
      setCart(newCart);
      toast.info("Cart Updated");
    } catch (error) {
      toast.error("Error Updating Cart");
      console.error("Error updating cart:", error);
    }
  };

  const updateWishlist = async (newWishlist: string[]) => {
    try {
      if (user) {
        await updateWishlistMutation.mutateAsync(newWishlist);
      } else localStorage.setItem(wishlistKey, JSON.stringify(newWishlist));
      setWishlist(newWishlist);
      toast.info("Wishlist Updated");
    } catch (error) {
      toast.error("Error Updating Wishlist");
      console.error("Error updating Wishlist:", error);
    }
  };

  const updateSavedAddress = async (address: ShippingInfo) => {
    try {
      if (user) {
        setIsAddressUpdating(true);
        const payload = {
          address: JSON.stringify({
            fullName: address?.fullName,
            phone: address?.phone,
            ...(address?.id !== NEW_ADRESS_ID && {
              id: address?.id,
            }),
            houseNumber: address?.houseNumber,
            street: address?.street,
            landmark: address?.landmark,
            area: address?.area,
            city: address?.city,
            state: address?.state,
            pincode: address?.pincode,
          }),
        };

        const { updatedAddresses } = await apiFetch(
          "/api/user/update-address",
          {
            method: "POST",
            body: payload,
          }
        );
        toast.success("Address successfully updated");
        setSavedAddresses(updatedAddresses);
      }
    } catch (error) {
      console.error("Error while updating address:", error);
      toast.error("Something went wrong", {
        description: "Address updation failed. Please try again",
      });
    } finally {
      setIsAddressUpdating(false);
    }
  };

  const deleteAddress = async (addressId: string) => {
    try {
      if (user) {
        setIsAddressUpdating(true);
        const payload = {
          addressId,
        };

        const { updatedAddresses } = await apiFetch(
          "/api/user/delete-saved-address",
          {
            method: "POST",
            body: payload,
          }
        );
        toast.success("Address successfully deleted");
        setSavedAddresses(updatedAddresses);
      }
    } catch (error) {
      console.error("Error while deleting address:", error);
      toast.error("Something went wrong", {
        description: "Address updation failed. Please try again",
      });
    } finally {
      setIsAddressUpdating(false);
    }
  };

  const totalItemsInCart = cart.reduce((sum, item) => sum + item.quantity, 0);

  const totalWishlistItems = wishlist.length;

  const priceMap: Record<string, number> = cartPricedata
    ? cartPricedata?.reduce((acc: Record<string, number>, cur) => {
        acc[cur.ProductId] = cur.Price;
        return acc;
      }, {})
    : {};

  const totalCartAmount = cart.reduce(
    (sum, item) => sum + priceMap[item.ProductId] * item.quantity,
    0
  );

  return (
    <UserContext.Provider
      value={{
        cart,
        totalItemsInCart,
        wishlist,
        setCart: updateCart,
        setWishlist: updateWishlist,
        totalWishlistItems,
        savedAddresses,
        setSavedAddresses,
        updateSavedAddress,
        deleteAddress,
        fetchingAddress: isLoading,
        totalCartAmount,
        isAddressUpdating,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
