import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/types/Products";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
  const [imageIndex, setImageIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

  const { id, Name, Price, ImageUrls } = product;

  return (
    <Link href={`/products/${id}`} className="block">
      <Card
        className="relative group overflow-hidden py-2 gap-0 shadow-lg hover:shadow-xl"
        onMouseEnter={startRotation}
        onMouseLeave={stopRotation}
      >
        <CardHeader className="relative">
          <div className="relative w-full h-70 overflow-hidden">
            {/* Image with object-contain */}
            <Image
              src={ImageUrls[imageIndex]}
              alt={Name}
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-4/5">
              <Button
                variant="default"
                className="w-full bg-white text-black shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-100"
              >
                View Product
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-2 px-6">
          <CardTitle className="text-lg font-semibold flex items-center">
            {Name}
            <button
              className={`absolute right-2 pr-2 rounded-full transition-all 
              ${
                isInWishlist(id) ? "text-red-500" : "text-gray-400"
              } hover:scale-110`}
              onClick={(e) => {
                e.preventDefault();
                toggleWishlist(product);
              }}
            >
              <Heart
                fill={isInWishlist(id) ? "currentColor" : "none"}
                stroke="currentColor"
              />
            </button>
          </CardTitle>
          <p className="text-gray-500">{`₹${Price}`}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
