"use client";

import { cartKey, wishlistKey } from "@/constants/UserConstants";
import { useUser } from "@/context/UserContext";
import { Product } from "@/types/Products";
import { toast } from "sonner";

export const useWishlist = () => {
  const { wishlist, setWishlist } = useUser();
  const { cart, setCart } = useUser();

  const addToWishlist = (product: Product) => {
    if (!isInWishlist(product.ProductId)) {
      setWishlist((prev) => [...prev, product]);
    }
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((item) => item.ProductId !== productId));
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.ProductId === productId);
  };

  const toggleWishlist = async (product: Product) => {
    const isAdded = isInWishlist(product.ProductId);
    // if (!user) {
    setWishlist((prev) => {
      const updatedWishlist = isAdded
        ? prev.filter((item: Product) => product.ProductId !== item.ProductId)
        : [...prev, product];

      localStorage.setItem(wishlistKey, JSON.stringify(updatedWishlist));
      return updatedWishlist as Product[];
    });
    toast.info(!isAdded ? "Added to wishlist" : "Removed from wishlist");
    return;
    // }

    // const wishlistRef = doc(db, "users", user.uid, wishlistKey, productId);

    // if (wishlist.includes(productId)) {
    //   await deleteDoc(wishlistRef);
    //   setWishlist((prev) => prev.filter((id) => id !== productId));
    // } else {
    //   await setDoc(wishlistRef, {});
    //   setWishlist((prev) => [...prev, productId]);
    // }
  };

  const moveToWishlist = (product: Product) => {
    const updatedCart = cart.filter((p) => p.ProductId !== product.ProductId);
    setCart(updatedCart);
    localStorage.setItem(wishlistKey, JSON.stringify(updatedCart));
    const updatedWishlist = [...wishlist, product];
    setWishlist(updatedWishlist);
    localStorage.setItem(cartKey, JSON.stringify(updatedWishlist));
    toast.info("Moved To wishlist");
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
