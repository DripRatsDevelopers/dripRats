"use client";

import { useUser } from "@/context/UserContext";
import { CartItem } from "@/types/Cart";

export const useCart = () => {
  const {
    cart,
    setCart,
    totalCartAmount,
    totalOriginalCartAmount,
    totalCartDiscount,
  } = useUser();

  const addToCart = (productId: string) => {
    const updatedCart = isInCart(productId)
      ? cart.map((item: CartItem) => {
          if (item.ProductId === productId) {
            return {
              ProductId: productId,
              quantity: (item.quantity || 1) + 1,
            };
          }
          return { ...item } as CartItem;
        })
      : ([...cart, { ProductId: productId, quantity: 1 }] as CartItem[]);
    setCart(updatedCart);
  };

  const removeFromCart = (productId: string) => {
    const updatedCart = cart.filter((item) => item.ProductId !== productId);
    setCart(updatedCart);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const updatedCart = cart.map((item) =>
      item.ProductId === productId ? { ...item, quantity } : item
    );
    setCart(updatedCart);
  };

  const isInCart = (productId: string) => {
    return cart.some((item) => item.ProductId === productId);
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    isInCart,
    totalAmount: totalCartAmount,
    totalOriginalAmount: totalOriginalCartAmount,
    totalDiscount: totalCartDiscount,
  };
};
