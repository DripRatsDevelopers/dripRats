"use client";

import { useCartContext } from "@/context/CartContext";
import { useWishlistContext } from "@/context/WishlistContext";
import { Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";
import UserPopover from "./UserPopover";

const Navbar = () => {
  const { totalItems } = useCartContext();
  const { totalWishlistItems } = useWishlistContext();

  return (
    <nav className="flex justify-between p-4 text-foreground shadow-md sticky top-0 z-50">
      <Link href="/" className="text-xl font-bold">
        Drip Rats
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/wishlist" className="relative">
          <Heart className="w-6 h-6" />
          {totalWishlistItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-1 text-xs">
              {totalWishlistItems}
            </span>
          )}
        </Link>

        <Link href="/cart" className="relative">
          <ShoppingCart size={24} />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full px-2">
              {totalItems}
            </span>
          )}
        </Link>
        <UserPopover />
      </div>
    </nav>
  );
};

export default Navbar;
