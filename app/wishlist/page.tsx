"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import Link from "next/link";
import { WishlistCard } from "./WishlistCard";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart, cart } = useCart();
  const { user } = useAuth();

  const isInCart = (productId: string) =>
    cart.some((product) => product.ProductId === productId);

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center gap-1">
        <h1 className="text-2xl font-bold">Your Wishlist</h1>
        <p className="text-md text-muted-foreground">
          ({wishlist.length} item{wishlist.length !== 1 ? "s" : ""})
        </p>
      </div>
      {!user && (
        <Alert variant="default" className="mb-4">
          <AlertTitle>You&lsquo;re not logged in</AlertTitle>
          <AlertDescription className="flex flex-wrap">
            Items here are saved only on this device.{" "}
            <Link href="/auth/login" className="underline">
              Login
            </Link>
            to save them across devices.
          </AlertDescription>
        </Alert>
      )}
      <div className="space-y-4">
        {wishlist.map((product) => (
          <WishlistCard
            key={product.ProductId}
            product={product}
            addToCart={addToCart}
            removeFromWishlist={removeFromWishlist}
            isInCart={isInCart}
          />
        ))}
      </div>
    </div>
  );
}
