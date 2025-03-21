"use client";

import { useCartContext } from "@/context/CartContext";
import { CartType } from "@/types/Cart";
import { Product } from "@/types/Products";

export const useCart = () => {
  const { cart, setCart } = useCartContext();

  const updateLocalStorage = (cart: CartType[]) => {
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const addToCart = (product: Product) => {
    const updatedCart = isInCart(product.id)
      ? cart.map((item: CartType) => {
          if (item.id === product.id) {
            return { ...item, quantity: (item.quantity || 1) + 1 };
          }
          return { ...item } as CartType;
        })
      : ([...cart, product] as CartType[]);
    setCart(updatedCart);
    updateLocalStorage(updatedCart);
  };

  const removeFromCart = (productId: string) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    updateLocalStorage(updatedCart);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const updatedCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );
    setCart(updatedCart);
    updateLocalStorage(updatedCart);
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
