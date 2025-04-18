"use client";

import { useUser } from "@/context/UserContext";
import { CartType } from "@/types/Cart";
import { Product } from "@/types/Products";

export const useCart = () => {
  const { cart, setCart } = useUser();

  const addToCart = (product: Product) => {
    const updatedCart = isInCart(product.id)
      ? cart.map((item: CartType) => {
          if (item.id === product.id) {
            return { ...item, quantity: (item.quantity || 1) + 1 };
          }
          return { ...item } as CartType;
        })
      : ([...cart, { ...product, quantity: 1 }] as CartType[]);
    setCart(updatedCart);
  };

  const removeFromCart = (productId: string) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const updatedCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );
    setCart(updatedCart);
  };

  const isInCart = (productId: string) => {
    return cart.some((item) => item.id === productId);
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.Price * item.quantity,
    0
  );

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    isInCart,
    totalAmount,
  };
};
