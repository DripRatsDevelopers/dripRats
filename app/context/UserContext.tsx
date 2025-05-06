import { NEW_ADRESS_ID } from "@/constants/DeliveryConstants";
import { cartKey, wishlistKey } from "@/constants/UserConstants";
import useAuthState from "@/hooks/useAuthState";
import { useDripratsQuery } from "@/hooks/useTanstackQuery";
import { apiFetch } from "@/lib/apiClient";
import { CartType } from "@/types/Cart";
import { ShippingInfo } from "@/types/Order";
import { Product } from "@/types/Products";
import React, { createContext, useContext, useEffect, useState } from "react";

type UserContextType = {
  cart: CartType[];
  setCart: React.Dispatch<React.SetStateAction<CartType[]>>;
  totalItemsInCart: number;
  wishlist: Product[];
  setWishlist: React.Dispatch<React.SetStateAction<Product[]>>;
  totalWishlistItems: number;
  savedAddresses?: ShippingInfo[];
  setSavedAddresses: (items: ShippingInfo[]) => void;
  updateSavedAddress: (address: ShippingInfo) => Promise<void>;
  fetchingAddress: boolean;
};

type UserDetails = {
  Addresses: [];
  Wishlist: string[];
  Cart: [];
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthState();

  const { data, isLoading } = useDripratsQuery<UserDetails>({
    queryKey: ["/api/user/get-user-data"],
    apiParams: {
      url: `/api/user/get-user-data`,
    },
    options: { enabled: !!user },
  });

  const [cart, setCart] = useState<CartType[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [savedAddresses, setSavedAddresses] = useState<
    ShippingInfo[] | undefined
  >();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem(cartKey) || "[]");
    const storedWishlist = JSON.parse(
      localStorage.getItem(wishlistKey) || "[]"
    );

    if (storedCart) setCart(storedCart);
    if (storedWishlist) setWishlist(storedWishlist);
  }, []);

  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (
      user &&
      Array.isArray(data?.Addresses) &&
      !Array.isArray(savedAddresses)
    ) {
      const fetchSavedAddresses = async () => {
        if (user) {
          try {
            setSavedAddresses(data?.Addresses);
          } catch (err) {
            console.error("Address fetch error:", err);
          }
        }
      };
      fetchSavedAddresses();
    }
  }, [user, savedAddresses, data]);

  // const clearLocalCart = () => {
  //   localStorage.removeItem(cartKey);
  // };

  // const clearLocalWishlist = () => {
  //   localStorage.removeItem(wishlistKey);
  // };

  const updateSavedAddress = async (address: ShippingInfo) => {
    if (user) {
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

      const updatedAddresses = await apiFetch("/api/user/update-address", {
        method: "POST",
        body: payload,
      });
      setSavedAddresses(updatedAddresses);
    }
  };

  const totalItemsInCart = cart.reduce((sum, item) => sum + item.quantity, 0);

  const totalWishlistItems = wishlist.length;

  return (
    <UserContext.Provider
      value={{
        cart,
        setCart,
        totalItemsInCart,
        wishlist,
        setWishlist,
        totalWishlistItems,
        savedAddresses,
        setSavedAddresses,
        updateSavedAddress,
        fetchingAddress: isLoading,
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
