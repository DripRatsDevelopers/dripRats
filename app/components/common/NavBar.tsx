"use client";

import { useUser } from "@/context/UserContext";
import { Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CategoryDropdown } from "../navBar/CategoryDropdown";
import { MembershipLink } from "../navBar/MembershipLink";
import { MobileNavBar } from "../navBar/MobileNavBar";
import { MobileSearchDrawer } from "../navBar/MobileSearchDrawer";
import { NewArrivalsLink } from "../navBar/NewArrivalsLink";
import AnimatedSearchBar from "./AnimatedSearchBar";
import UserPopover from "./UserPopover";

const Navbar = () => {
  const { totalItemsInCart, totalWishlistItems } = useUser();
  const router = useRouter();

  const handleSearch = (searchTerm: string) => {
    if (searchTerm.trim()) {
      router.push(`/shop?search=${searchTerm.trim()}`);
    }
  };
  return (
    <nav className="flex justify-between items-center p-2 md:p-4 bg-background text-foreground shadow-md sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <MobileNavBar totalWishlistItems={totalWishlistItems} />
        <Link href="/" className="text-xl font-bold tracking-widest">
          DRIPRATS
        </Link>
      </div>
      <div className="flex items-center gap-4 hidden md:flex">
        <CategoryDropdown />
        <NewArrivalsLink />
        <MembershipLink />
      </div>

      <div className="flex items-center gap-4">
        <div className="md:hidden">
          <MobileSearchDrawer />
        </div>
        <div className="hidden md:block">
          <AnimatedSearchBar handleSearch={handleSearch} />
        </div>

        <div className="hidden md:block">
          <Link href="/wishlist" className="relative ">
            <Heart className="w-6 h-6" />
            {totalWishlistItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-1 text-xs">
                {totalWishlistItems}
              </span>
            )}
          </Link>
        </div>

        <Link href="/cart" className="relative">
          <ShoppingCart size={24} />
          {totalItemsInCart > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full px-2">
              {totalItemsInCart}
            </span>
          )}
        </Link>
        <UserPopover />
      </div>
    </nav>
  );
};

export default Navbar;
