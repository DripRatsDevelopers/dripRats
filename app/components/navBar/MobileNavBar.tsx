"use client";

import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { PRODUCT_CATEGORY } from "@/constants/GeneralConstants";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { motion } from "framer-motion";
import {
  HeartIcon,
  LogOut,
  Menu,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

export function MobileNavBar({
  totalWishlistItems,
}: {
  totalWishlistItems: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      router.push("/auth/login");
    } catch (error) {
      toast.error("Logout failed", {
        description: `Something went wrong!, ${error}`,
      });
    }
  };

  const toggleOpen = () => {
    setIsOpen(!open);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="lg:hidden p-2" onClick={toggleOpen}>
        <Menu className="w-5 h-5 text-black" />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-72 max-w-full p-5 pt-6 bg-white text-black border-r border-gray-200 shadow-xl"
      >
        <div className="text-xl font-extrabold tracking-widest mb-4">
          DRIPRATS
        </div>

        <div className="uppercase text-xs tracking-widest text-gray-400 mb-2">
          Shop Collections
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-2"
        >
          {PRODUCT_CATEGORY.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop/${cat.slug}`}
              className="block px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition text-sm font-medium"
              onClick={toggleOpen}
            >
              {cat.name}
            </Link>
          ))}
        </motion.div>

        <Separator className="my-5" />

        <div className="space-y-3">
          <Link
            href="/new"
            className="flex items-center justify-between px-3 py-2 rounded-md bg-orange-50 hover:bg-orange-100 transition text-sm font-medium"
            onClick={toggleOpen}
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-500" />
              New Arrivals
            </span>
            <span className="text-xs bg-orange-200 text-orange-700 px-2 py-0.5 rounded animate-pulse">
              HOT
            </span>
          </Link>

          <Link
            href="/membership"
            className="flex items-center gap-2 px-3 py-2 rounded-md bg-blue-50 hover:bg-blue-100 transition text-sm font-medium"
            onClick={toggleOpen}
          >
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            Membership
          </Link>
        </div>
        <Separator className="my-5" />

        <div className="space-y-2">
          {/* Your Orders */}
          <Link
            href="/orders"
            className="flex items-center gap-2 py-2 rounded-md transition text-sm "
            onClick={toggleOpen}
          >
            <Truck className="w-6 h-6" />
            Your Orders
          </Link>

          {/* Wishlist with Count Badge */}
          <Link
            href="/wishlist"
            className="flex items-center gap-2 py-2 rounded-md transition text-sm "
            onClick={toggleOpen}
          >
            <HeartIcon className="w-6 h-6" />
            Wishlist
            <span className="ml-2 bg-red-600 text-white rounded-full px-2 text-xs">
              {totalWishlistItems} {/* Dynamically rendered wishlist count */}
            </span>
          </Link>

          {/* Logout */}
          <Button
            variant="outline"
            className="font-medium absolute left-0 bottom-5 w-full"
            onClick={handleLogout}
          >
            <LogOut className="w-6 h-6" />
            Logout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
