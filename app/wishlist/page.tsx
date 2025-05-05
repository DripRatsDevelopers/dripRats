"use client";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { WishlistCard } from "./WishlistCard";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart, cart } = useCart();

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
