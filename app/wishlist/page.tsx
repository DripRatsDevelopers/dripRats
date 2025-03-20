"use client";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  Name: string;
  Price: number;
  ImageUrls: string[];
}

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart, cart } = useCart();
  const router = useRouter();

  const isInCart = (productId: string) =>
    cart.some((product) => product.id === productId);

  const handleMoveToCart = (product: Product) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Your Wishlist</h1>
      {wishlist.length === 0 ? (
        <p className="text-muted-foreground">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {wishlist.map((product: Product) => {
            const isAddedToCart = isInCart(product.id);
            return (
              <div
                key={product.id}
                className="relative shadow-lg p-4 rounded-lg border-border bg-card text-card-foreground"
              >
                <Image
                  src={product.ImageUrls[0]}
                  alt={product.Name}
                  width={300}
                  height={200}
                  className="rounded-md object-cover w-full h-48"
                />
                <h2 className="text-lg font-semibold mt-2 flex justify-between">
                  {product.Name}
                  <Button
                    variant="ghost"
                    onClick={() => removeFromWishlist(product.id)}
                    className="ml-2 text-red-500"
                    size="icon"
                  >
                    <Trash className="w-5 h-5" />
                  </Button>
                </h2>
                <p className="text-muted-foreground">₹{product.Price}</p>
                <div className="flex justify-between mt-2">
                  {
                    <Button
                      variant="default"
                      onClick={() => {
                        if (isAddedToCart) {
                          router.push("/cart");
                        } else handleMoveToCart(product);
                      }}
                      className="w-full"
                    >
                      {isAddedToCart ? "Go to Cart" : "Move to Cart"}
                    </Button>
                  }
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
