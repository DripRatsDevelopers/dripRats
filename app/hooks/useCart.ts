"use client";

import { useCartContext } from "@/context/CartContext";
import { CartType } from "@/types/Cart";
import { Product } from "@/types/Products";
import { useEffect } from "react";

export const useCart = () => {
  const { cart, setCart } = useCartContext();

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart((prevCart: CartType[]) => {
      const exists = prevCart.find((item) => item.id === product.id);
      if (exists) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }] as CartType[];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const isInCart = (productId: string) => {
    return cart.some((item) => item.id === productId);
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    isInCart,
  };
};
