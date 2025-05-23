"use client";

import { Badge } from "@/components/ui/badge";
import DripratsImage from "@/components/ui/DripratsImage";
import { cn } from "@/lib/utils";
import { Product } from "@/types/Products";
import { motion } from "framer-motion";
import { HeartIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

interface ProductCard {
  product: Product;
  isInWishlist?: (productId: string) => boolean;
  toggleWishlist?: (productId: string) => void;
  category?: string;
}

const ProductCard = ({
  product,
  isInWishlist,
  toggleWishlist,
  category,
}: ProductCard) => {
  const { ProductId, Name, Price, ImageUrls, DiscountedPrice, InStock } =
    product;

  const discounted = InStock && DiscountedPrice && DiscountedPrice < Price;
  const categoryName = category ? category : "all";

  useEffect(() => {
    if (!product?.ProductId) return;

    const key = "recentlyViewed";
    const existing = JSON.parse(localStorage.getItem(key) || "[]");

    const filtered = existing.filter(
      (p: Product) => p.ProductId !== product.ProductId
    );
    const updated = [product.ProductId, ...filtered].slice(0, 10); // keep max 10

    localStorage.setItem(key, JSON.stringify(updated));
  }, [product]);

  return (
    <Link
      key={ProductId}
      href={`/shop/${categoryName}/${ProductId}`}
      className="flex flex-col gap-2 w-full transition-transform hover:scale-[1.02]"
    >
      <div className="relative aspect-[3/4] w-full rounded-md overflow-hidden bg-[#f7f7f7] dark:bg-[#1a1a1a]">
        <div className="absolute top-2 left-2 space-y-2 z-10">
          {discounted && (
            <motion.div
              className="relative rounded-md"
              animate={{
                boxShadow: [
                  "0 0 0px rgba(255, 191, 0, 0.7)",
                  "0 0 20px rgba(255, 191, 0, 0.9)",
                  "0 0 0px rgba(255, 191, 0, 0.7)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop",
              }}
            >
              <Badge className="tracking-widest bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold text-xs px-2 py-1 dark:from-yellow-300 dark:to-yellow-500">
                SALE
              </Badge>
            </motion.div>
          )}
          {!InStock && <Badge variant="destructive">Out of Stock</Badge>}
        </div>
        <DripratsImage
          src={ImageUrls[0]}
          alt={Name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
          className="object-cover transition-all duration-300 hover:scale-105"
        />
      </div>

      <div className="flex flex-col gap-1 px-1">
        <div className="flex items-start justify-between px-1">
          <h3 className="text-sm font-semibold text-foreground truncate">
            {Name}
          </h3>
          {isInWishlist && toggleWishlist ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleWishlist(product.ProductId);
              }}
              className="p-1 -mr-1 rounded-full hover:bg-accent"
            >
              <HeartIcon
                className={cn(
                  "w-4 h-4 text-muted-foreground",
                  isInWishlist(ProductId) && "fill-red-500 text-red-500"
                )}
              />
            </button>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          {discounted ? (
            <span className="text-xs text-muted-foreground line-through">
              ₹{Price}
            </span>
          ) : null}
          <span className="text-xs font-bold">
            ₹{discounted ? DiscountedPrice : Price}
          </span>
        </div>
      </div>
    </Link>
  );
};
export default ProductCard;
