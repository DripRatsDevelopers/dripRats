"use client";

import { cartKey, wishlistKey } from "@/constants/UserConstants";
import { useUser } from "@/context/UserContext";
import { Product } from "@/types/Products";

export const useWishlist = () => {
  const { wishlist, setWishlist } = useUser();
  const { cart, setCart } = useUser();

  const addToWishlist = (product: Product) => {
    if (!isInWishlist(product.id)) {
      setWishlist((prev) => [...prev, product]);
    }
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  const toggleWishlist = async (product: Product) => {
    // if (!user) {
    setWishlist((prev) => {
      const updatedWishlist = isInWishlist(product.id)
        ? prev.filter((item: Product) => product.id !== item.id)
        : [...prev, product];

      localStorage.setItem(wishlistKey, JSON.stringify(updatedWishlist));
      return updatedWishlist as Product[];
    });
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
    const updatedCart = cart.filter((p) => p.id !== product.id);
    setCart(updatedCart);
    localStorage.setItem(wishlistKey, JSON.stringify(updatedCart));
    const updatedWishlist = [...wishlist, product];
    setWishlist(updatedWishlist);
    localStorage.setItem(cartKey, JSON.stringify(updatedWishlist));
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
