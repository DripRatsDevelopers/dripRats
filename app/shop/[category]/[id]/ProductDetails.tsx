"use client";

import { ApiWrapper } from "@/components/common/ApiWrapper";
import AuthFormModal from "@/components/common/AuthFormModal";
import Breadcrumbs from "@/components/common/BreadCrumbs";
import ProductGallery from "@/components/common/ProductGallery";
import RecentlyViewedProducts from "@/components/common/RecentlyViewedProducts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/hooks/useCart";
import { useCheckoutSession } from "@/hooks/useCheckoutSession";
import useGetDeliveryTime from "@/hooks/useGetDeliveryTime";
import { useDripratsQuery } from "@/hooks/useTanstackQuery";
import { useWishlist } from "@/hooks/useWishlist";
import { cn } from "@/lib/utils";
import { Product } from "@/types/Products";
import {
  Album,
  Edit,
  Heart,
  Minus,
  Plus,
  Rocket,
  Share,
  Snowflake,
  Tag,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import "./page.css";

const ProductDetails = () => {
  const [pincode, setPincode] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { user } = useAuth();

  const path = usePathname();
  const router = useRouter();
  const [id] = path.split("/").slice(-1);
  const { data: product, isLoading } = useDripratsQuery<Product>({
    queryKey: ["/api/products", id],
    apiParams: {
      url: `/api/products/${id}`,
    },
    options: { enabled: !!id },
  });

  const {
    checkDeliveryTime,
    loading: deliveryLoading,
    deliveryOptions,
    setDeliveryOptions,
  } = useGetDeliveryTime();

  const inStock = product?.InStock;

  const hasDiscount =
    product?.DiscountedPrice &&
    product?.DiscountedPrice < product.Price &&
    inStock;

  const discountPercentage =
    product?.DiscountedPrice && hasDiscount
      ? Math.round(
          ((product?.Price - product.DiscountedPrice) / product.Price) * 100
        )
      : 0;

  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, wishlist } = useWishlist();

  const isAddedToCart = product?.ProductId
    ? isInCart(product?.ProductId)
    : false;

  const isInWishlist = (productId: string) =>
    wishlist.some((itemId) => itemId === productId);

  const { initSession } = useCheckoutSession();

  const shareProduct = () => {
    try {
      if (navigator.share) {
        navigator.share({
          title: product?.Name,
          text: `Check out this product: ${product?.Name}`,
          url: window.location.href,
        });
      } else {
        alert("Sharing not supported in this browser.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleBuyNow = () => {
    const sessionId = product
      ? initSession([{ productId: id, quantity }], "product")
      : "";

    router.push(
      `/checkout?sessionId=${sessionId}&productId=${id}&quantity=${quantity}`
    );
  };

  const handlePincodeCheck = () => {
    checkDeliveryTime(pincode);
  };

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => quantity > 1 && setQuantity(quantity - 1);

  return (
    <div>
      <ApiWrapper
        loading={isLoading}
        data={product}
        skeleton={
          <div className="flex flex-col md:flex-row gap-8 p-3 md:p-6 animate-pulse md:m-6">
            <div className="flex-1 w-full flex flex-col md:flex-row gap-4">
              <Skeleton className="w-full h-[500px] rounded-lg" />

              <div className="flex md:flex-col flex-row gap-3 md:gap-4 overflow-x-auto md:overflow-visible">
                {[...Array(4)].map((_, index) => (
                  <Skeleton
                    key={index}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-md flex-shrink-0"
                  />
                ))}
              </div>
            </div>

            {/* Right: Product Details */}
            <div className="flex-1 w-full flex flex-col gap-6">
              {/* Title */}
              <Skeleton className="h-8 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />

              {/* Price */}
              <Skeleton className="h-6 w-1/4 rounded-md" />

              {/* Options like size/color */}
              <div className="flex flex-col gap-3 mt-4">
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              <div className="md:flex-col flex gap-2">
                <Skeleton className="h-12 w-[48%] md:w-full rounded-md mt-6" />
                <Skeleton className="h-12 w-[48%] md:w-full rounded-md mt-6" />
              </div>
            </div>
          </div>
        }
      >
        {product ? (
          <div className="flex flex-col md:flex-row gap-8 p-3 md:p-6 bg-background text-foreground">
            {/* Left - Images */}
            <div className=" flex-1 flex flex-col">
              <Breadcrumbs />

              <ProductGallery
                images={product.ImageUrls.map((url) => ({ src: url, alt: "" }))}
              />
            </div>
            {/* Right - Product Details */}
            <div className="flex-1 space-y-4">
              {/* Title and Icons */}
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">{product.Name}</h1>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      toggleWishlist(product.ProductId);
                    }}
                    className={`pr-5 rounded-full transition-all 
            ${
              isInWishlist(product.ProductId)
                ? "text-red-500 hover:text-red-500"
                : "text-gray-700 dark:text-gray-300 hover:text-red-500"
            } hover:scale-110`}
                  >
                    <Heart
                      fill={
                        isInWishlist(product.ProductId)
                          ? "currentColor"
                          : "none"
                      }
                      stroke="currentColor"
                      className="w-6 h-6 !size-auto"
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    className="pr-5 rounded-full transition-all hover:scale-110"
                    onClick={() => shareProduct()}
                  >
                    <Share className="text-gray-700 dark:text-gray-300 w-6 h-6 !size-auto" />
                  </Button>
                </div>
              </div>

              {/* Product Description */}

              <p>{product.Description}</p>

              {/* Price */}
              <div className="flex items-center space-x-3 mt-2">
                <span className="text-2xl font-semibold relative">
                  <span
                    className={cn(
                      hasDiscount
                        ? "strike-animation text-gray-400 dark:text-gray-500"
                        : !inStock
                          ? "text-muted-foreground font-bold"
                          : "font-bold"
                    )}
                  >
                    ₹{product.Price}
                  </span>
                  {product?.DiscountedPrice && hasDiscount ? (
                    <span className="ml-2 font-bold discount-price">
                      ₹{product.DiscountedPrice.toFixed(2)}
                    </span>
                  ) : null}
                </span>
                {discountPercentage > 0 ? (
                  <span className="bg-gradient-to-r from-blue-500 to-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-md discount-tag">
                    {discountPercentage}% OFF
                  </span>
                ) : null}
              </div>
              {!inStock && (
                <p className="font-semibold text-2xl">Currently Unavailable</p>
              )}

              {inStock ? (
                <div className="space-y-2">
                  <p className="text-gray-600 dark:text-gray-300 font-semibold">
                    Select Quantity:
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={decreaseQuantity}
                      variant="outline"
                      className="p-2"
                    >
                      <Minus size={16} />
                    </Button>
                    <p className="text-lg">{quantity}</p>
                    <Button
                      onClick={increaseQuantity}
                      variant="outline"
                      className="p-2"
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                </div>
              ) : null}

              {/* Offers */}
              <div className="mt-4 space-y-2">
                <p className="text-gray-600 dark:text-gray-300 font-semibold flex gap-2">
                  <Tag stroke="currentColor" /> Offers:
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline" className="bg-[#4CAF50] text-white">
                    10% Off on Orders Above ₹2000
                  </Badge>
                  <Badge variant="outline" className="bg-[#FF9800] text-white">
                    Buy 2, Get 1 Free
                  </Badge>
                  <Badge variant="outline" className="bg-[#03A9F4] text-white">
                    Free Shipping for Members
                  </Badge>
                </div>
              </div>
              <Accordion type="multiple" className="my-6">
                {product?.DetailedDescription ? (
                  <AccordionItem value="details">
                    <AccordionTrigger className="text-lg font-medium no-underline hover:no-underline">
                      <div className="text-gray-600 dark:text-gray-300 flex items-center gap-1">
                        <Album stroke="currentColor" />
                        Product Details
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <ul className="list-disc ml-6 space-y-2">
                        {Object.keys(product?.DetailedDescription)?.map(
                          (key) => {
                            return (
                              <li key={key}>
                                <strong>{key}:</strong>{" "}
                                {product?.DetailedDescription?.[key]}
                              </li>
                            );
                          }
                        )}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ) : null}
                {inStock ? (
                  <AccordionItem value="shipping">
                    <AccordionTrigger className="text-lg font-medium no-underline hover:no-underline">
                      <div className="text-gray-600 dark:text-gray-300 flex gap-1 items-center">
                        <Rocket stroke="currentColor" /> Shipping Details
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <p>
                        Delivered in 5-7 business days. Free shipping on orders
                        over ₹1000.
                      </p>
                      <div className="mt-2 flex gap-2">
                        {pincode &&
                        pincode?.length === 6 &&
                        deliveryOptions?.etd ? (
                          <div className="flex items-center">
                            <strong>Delivery by {deliveryOptions?.etd}</strong>
                            <Button
                              variant="link"
                              className="underline text-blue-500"
                              onClick={() => {
                                setDeliveryOptions(undefined);
                              }}
                            >
                              Edit Pincode <Edit />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Input
                              type="text"
                              value={pincode}
                              onChange={(e) => setPincode(e.target.value)}
                              placeholder="Enter Pincode"
                              className="w-80 border-gray-400"
                            />
                            <Button
                              onClick={handlePincodeCheck}
                              className="bg-gray-600 dark:bg-gray-300  hover:bg-gray-500 hover:dark:bg-gray-300"
                              disabled={!pincode}
                            >
                              {deliveryLoading ? "Checking..." : "Check"}
                            </Button>
                          </>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ) : null}

                <AccordionItem value="suggestions">
                  <AccordionTrigger className="text-lg font-medium no-underline hover:no-underline">
                    <div className="text-gray-600 dark:text-gray-300 flex gap-1 items-center">
                      <Snowflake stroke="currentColor" /> Style Suggestions
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <p>Pair it with:</p>
                    <ul className="list-disc ml-6 space-y-2">
                      <li>Classic black outfit for a bold look</li>
                      <li>White shirt and denim for a casual vibe</li>
                      <li>Formal wear for a sophisticated touch</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="z-20 md:flex-col gap-2 fixed md:static w-full bottom-0 left-0 p-2 md:p-0 shadow-[-4px_-4px_10px_-2px_rgba(0,0,0,0.3)] md:shadow-none flex bg-background rounded-md md:rounded-none">
                <Button
                  className="w-[48%] md:w-full bg-white hover:bg-gray-100"
                  onClick={() => {
                    if (isAddedToCart) {
                      router.push("/cart");
                    } else addToCart(product.ProductId);
                  }}
                  variant="outline"
                  disabled={!inStock}
                >
                  {isAddedToCart ? "Go to Cart" : "Add to Cart"}
                </Button>
                <Button
                  className="w-[48%] md:w-full"
                  onClick={() => {
                    if (!user) {
                      setShowAuthModal(true);
                    } else {
                      handleBuyNow();
                    }
                  }}
                  disabled={!inStock}
                >
                  Buy Now
                </Button>
              </div>
            </div>
            {/* Buy Now & Add to Cart */}
          </div>
        ) : null}
      </ApiWrapper>
      <div className="p-3 md:p-6 ">
        <Separator />
        <RecentlyViewedProducts />
      </div>
      {showAuthModal ? (
        <AuthFormModal
          isAuthModalOpen={showAuthModal}
          setIsAuthModalOpen={setShowAuthModal}
          handleAuthSuccess={() => {
            setShowAuthModal(false);
            handleBuyNow();
          }}
        />
      ) : null}
    </div>
  );
};

export default ProductDetails;
