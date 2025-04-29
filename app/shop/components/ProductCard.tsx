import { cn } from "@/lib/utils";
import { Product } from "@/types/Products";
import { HeartIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProductCard {
  product: Product;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: Product) => void;
  category?: string;
}

const ProductCard = ({
  product,
  isInWishlist,
  toggleWishlist,
  category,
}: ProductCard) => {
  const { ProductId, Name, Price, ImageUrls, DiscountedPrice } = product;

  const discounted = DiscountedPrice && DiscountedPrice < Price;
  const categoryName = category ? category : "all";

  return (
    <Link
      key={ProductId}
      href={`/shop/${categoryName}/${ProductId}`}
      className="flex flex-col gap-2 w-full transition-transform hover:scale-[1.02]"
    >
      <div className="relative aspect-[3/4] w-full rounded-md overflow-hidden bg-[#f7f7f7] dark:bg-[#1a1a1a]">
        <Image
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
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product);
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
