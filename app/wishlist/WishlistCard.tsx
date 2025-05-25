// components/wishlist/WishlistCard.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DripratsImage from "@/components/ui/DripratsImage";
import { Product } from "@/types/Products";
import { Share2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function WishlistCard({
  product,
  addToCart,
  removeFromWishlist,
  isInCart,
}: {
  product: Product;
  addToCart: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInCart: (productId: string) => boolean;
}) {
  const productLink = `/shop/${product.Category}/${product.ProductId}`;
  const isAddedToCart = isInCart(product.ProductId);
  const router = useRouter();

  const handleShare = () => {
    try {
      if (navigator.share) {
        navigator.share({
          title: product?.Name,
          text: `Check out this product: ${product?.Name}`,
          url: window.location.href,
        });
      } else {
        const link = `${window.location.origin}${productLink}`;
        navigator.clipboard.writeText(link);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleMoveToCart = () => {
    if (isAddedToCart) {
      router.push("/cart");
    } else {
      addToCart(product.ProductId);
      removeFromWishlist(product.ProductId);
    }
  };

  return (
    <Card className="flex flex-row items-center gap-4 p-3 border border-gray-200 rounded-xl shadow-sm md:w-full w-auto max-w-3xl mx-auto relative md:flex">
      {/* Image Section */}
      <Link
        href={productLink}
        className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-md overflow-hidden"
      >
        <DripratsImage
          src={product.ImageUrls[0]}
          alt={product.Name}
          fill
          className="object-cover"
        />
      </Link>

      {/* Text Section */}
      <div className="flex flex-col justify-between w-full">
        <Link href={productLink} className="block">
          <h2 className="text-sm font-medium text-gray-900 truncate">
            {product.Name}
          </h2>
        </Link>

        <div className="flex items-center justify-between text-sm text-gray-900 mt-2">
          <div>
            ₹{product.Price}
            {product.DiscountedPrice &&
              product.Price > product.DiscountedPrice && (
                <span className="ml-2 text-xs text-gray-400 line-through">
                  ₹{product.Price}
                </span>
              )}
          </div>
          <Badge
            variant={product.InStock ? "default" : "destructive"}
            className="absolute top-0 left-0 md:static"
          >
            {product.InStock ? "In Stock" : "Out of Stock"}
          </Badge>
        </div>

        <div className="flex justify-center md:justify-start gap-2 mt-3">
          <Button
            size="sm"
            disabled={!product.InStock}
            onClick={handleMoveToCart}
            className="text-xs md:text-sm"
          >
            {isAddedToCart ? "Go to Cart" : "Add to Cart"}
          </Button>
          <Button size="sm" variant="outline" onClick={handleShare}>
            <Share2 />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => removeFromWishlist(product.ProductId)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
