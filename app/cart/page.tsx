"use client";

import { ApiWrapper } from "@/components/common/ApiWrapper";
import AuthFormModal from "@/components/common/AuthFormModal";
import InfiniteScroll from "@/components/common/InfiniteScroll";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/hooks/useCart";
import { useCheckoutSession } from "@/hooks/useCheckoutSession";
import { useWishlist } from "@/hooks/useWishlist";
import { Heart, Minus, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DripratsImage from "../components/ui/DripratsImage";
import useCartData from "./useCartData";

const Cart = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    totalAmount,
    totalOriginalAmount,
    totalDiscount,
  } = useCart();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const productIds = cart.map((item) => item.ProductId);

  const cartQuantityMap: Record<string, number> = cart.reduce(
    (acc: Record<string, number>, cur) => {
      acc[cur.ProductId] = cur.quantity;
      return acc;
    },
    {}
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useCartData(productIds, productIds.length > 0);

  const cartData = data?.pages.flatMap((page) => page.Items);

  const { moveToWishlist } = useWishlist();
  const { initSession } = useCheckoutSession();
  const { user } = useAuth();
  const router = useRouter();

  const handleCheckout = () => {
    const sessionId = initSession(
      cart?.map((item) => ({
        productId: item?.ProductId,
        quantity: item?.quantity,
      })),
      "cart"
    );
    router.push(`/checkout?sessionId=${sessionId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
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
      <ApiWrapper
        loading={isLoading}
        data={cartData?.length}
        error={error}
        emptyState={
          <p className="text-center text-muted-foreground">
            Your cart is empty.
          </p>
        }
        skeleton={
          <div className="flex flex-col md:flex-row gap-6 h-[60vh]">
            <div className="flex-1 flex flex-col gap-6 h-full">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton
                  className="p-2 h-1/3 md:p-4 w-full rounded-md"
                  key={i}
                />
              ))}
            </div>
            <Skeleton className="md:w-1/3 h-1/2" />
          </div>
        }
      >
        {cartData ? (
          <div className="flex flex-col md:flex-row gap-6">
            <InfiniteScroll
              hasMore={hasNextPage}
              loadMore={fetchNextPage}
              loading={isFetchingNextPage}
              loader={
                <div className="flex flex-col md:flex-row gap-6 h-[60vh]">
                  <div className="flex-1 flex flex-col gap-6 h-full">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton
                        className="p-2 h-1/3 md:p-4 w-full rounded-md"
                        key={i}
                      />
                    ))}
                  </div>
                  <Skeleton className="md:w-1/3 h-1/2" />
                </div>
              }
              className="flex-1 flex flex-col gap-6"
            >
              {cartData.map((item) => {
                if (item) {
                  const hasDiscount =
                    item.DiscountedPrice && item.Price > item.DiscountedPrice;

                  return (
                    <div
                      key={item.ProductId}
                      className="flex items-center gap-4 p-2 md:p-4 border rounded-lg shadow-sm"
                    >
                      <Link
                        href={`/shop/${item.Category}/${item.ProductId}`}
                        className="block"
                      >
                        <DripratsImage
                          src={item.ImageUrls[0]}
                          alt={item.Name}
                          className="w-30 h-30 object-cover rounded-lg"
                          width={300}
                          height={200}
                        />
                      </Link>
                      <div className="flex-1">
                        <p className="font-semibold">{item.Name}</p>
                        <p className="text-sm font-semibold text-muted-foreground">
                          ₹{hasDiscount ? item.DiscountedPrice : item.Price}
                          {hasDiscount && (
                            <span className="ml-2 text-xs text-gray-400 line-through">
                              ₹{item.Price}
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Delivers in 3-5 days
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              updateQuantity(
                                item.ProductId,
                                cartQuantityMap[item.ProductId] - 1
                              )
                            }
                            disabled={cartQuantityMap[item.ProductId] <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-6 text-center">
                            {cartQuantityMap[item.ProductId]}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              updateQuantity(
                                item.ProductId,
                                cartQuantityMap[item.ProductId] + 1
                              )
                            }
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-col md:flex-row">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => moveToWishlist(item.ProductId)}
                          title="Move to Wishlist"
                        >
                          <Heart className="w-5 h-5" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => removeFromCart(item.ProductId)}
                          title="Remove from Cart"
                        >
                          <Trash className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  );
                } else {
                  return <></>;
                }
              })}
            </InfiniteScroll>

            {/* Checkout Summary - Right Section (only on md+ screens) */}
            <div className="md:w-1/3 p-4 bg-secondary rounded-lg shadow-lg h-fit">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="flex justify-between text-base">
                <span>Subtotal</span>
                <span>₹{totalOriginalAmount.toFixed(2)}</span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between text-base text-green-600">
                  <span>Discount</span>
                  <span>- ₹{totalDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-medium border-t mt-2 pt-2">
                <span>Total</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
              <Button
                className="mt-4 w-full bg-primary text-primary-foreground"
                onClick={() => {
                  if (!user) {
                    setShowAuthModal(true);
                  } else {
                    handleCheckout();
                  }
                }}
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        ) : null}
      </ApiWrapper>
      {showAuthModal ? (
        <AuthFormModal
          isAuthModalOpen={showAuthModal}
          setIsAuthModalOpen={setShowAuthModal}
          handleAuthSuccess={() => {
            setShowAuthModal(false);
            handleCheckout();
          }}
        />
      ) : null}
    </div>
  );
};

export default Cart;
