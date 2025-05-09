"use client";

import { useUser } from "@/context/UserContext";

export const useWishlist = () => {
  const { wishlist, setWishlist } = useUser();
  const { cart, setCart } = useUser();

  const addToWishlist = (productId: string) => {
    if (!isInWishlist(productId)) {
      const updatedWishlist = [...wishlist, productId];
      setWishlist(updatedWishlist);
    }
  };

  const removeFromWishlist = (productId: string) => {
    const filteredWishlist = wishlist.filter((itemId) => itemId !== productId);
    setWishlist(filteredWishlist);
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((itemId) => itemId === productId);
  };

  const toggleWishlist = async (productId: string) => {
    const isAdded = isInWishlist(productId);
    const updatedWishlist: string[] = isAdded
      ? wishlist.filter((itemId: string) => itemId !== productId)
      : [...wishlist, productId];

    setWishlist(updatedWishlist);
    return;
  };

  const moveToWishlist = (productId: string) => {
    const updatedCart = cart.filter((p) => p.ProductId !== productId);
    setCart(updatedCart);
    const updatedWishlist = [...wishlist, productId];
    setWishlist(updatedWishlist);
  };

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    moveToWishlist,
  };
};
