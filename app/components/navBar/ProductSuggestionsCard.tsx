// components/ProductSuggestionCard.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SearchIndex } from "@/types/Products";
import Link from "next/link";
import DripratsImage from "../ui/DripratsImage";

interface ProductCardProps {
  product: SearchIndex;
  onSelect: () => void;
}

export const ProductSuggestionCard = ({
  product,
  onSelect,
}: ProductCardProps) => {
  return (
    <Link
      key={product.ProductId}
      href={`/shop/${product.Category}/${product.ProductId}`}
      onClick={onSelect}
    >
      <Card className="hover:bg-muted transition cursor-pointer mb-2 py-2 px-2">
        <CardContent className="p-0">
          <div className="flex justify-between items-center">
            <div className="flex items-start gap-2">
              <DripratsImage
                src={product.ImageUrls?.[0]}
                alt={product.Name}
                className="rounded-md object-cover w-20 h-20 border"
                width={20}
                height={20}
              />
              <div className="flex flex-col justify-between">
                <p className="text-sm font-medium truncate">{product.Name}</p>
                <div className="text-xs text-muted-foreground">
                  in {product.Category}
                </div>
              </div>
            </div>
            <div className="flex flex-col text-sm">
              <span
                className={cn(product.DiscountedPrice ? "line-through" : "")}
              >
                ₹{product.Price}
              </span>
              {product.DiscountedPrice ? (
                <span className="text-foreground font-semibold">
                  ₹{product.DiscountedPrice}
                </span>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
