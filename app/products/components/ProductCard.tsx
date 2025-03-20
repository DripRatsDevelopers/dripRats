import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/hooks/useCart";
import { Product } from "@/types/Products";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

interface ProductCard {
  product: Product;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: Product) => void;
}
const ProductCard = ({
  product,
  toggleWishlist,
  isInWishlist,
}: ProductCard) => {
  const { isInCart, addToCart } = useCart();

  const [imageIndex, setImageIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const isAddedToCart = isInCart(product.id);

  const startRotation = () => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setImageIndex((prev) => (prev + 1) % product?.ImageUrls.length);
      }, 2000);
    }
  };

  const stopRotation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <Card
      key={product.id}
      className="relative p-4 shadow-lg hover:shadow-xl hover:scale-110 transition-shadow duration-300 rounded-lg group"
      onMouseEnter={startRotation}
      onMouseLeave={stopRotation}
    >
      <CardHeader className="relative">
        <CardTitle>
          {product.Name}
          <button
            className={`absolute right-2 pr-2 rounded-full transition-all 
          ${
            isInWishlist(product.id) ? "text-red-500" : "text-gray-400"
          } hover:scale-110`}
            onClick={() => toggleWishlist(product)}
          >
            <Heart
              fill={isInWishlist(product.id) ? "currentColor" : "none"}
              stroke="currentColor"
            />
          </button>
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full">
        <Link href={`/products/${product.id}`}>
          <Image
            src={product?.ImageUrls?.[imageIndex]}
            alt={product.Name}
            width={300}
            height={400}
            className="rounded-lg object-cover transition-opacity duration-200"
            loading="lazy"
          />
        </Link>
        <Button
          onClick={() => {
            if (isAddedToCart) {
              router.push("/cart");
            } else {
              addToCart(product);
            }
          }}
          className="mt-2 w-full hover:scale-110 md:opacity-0 group-hover:opacity-100"
        >
          {isAddedToCart ? "Go to Cart" : "Add to Cart"}
        </Button>
        <p className="text-lg font-semibold mt-2">₹{product.Price}</p>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
