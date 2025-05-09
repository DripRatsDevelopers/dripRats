"use client";
import { ApiWrapper } from "@/components/common/ApiWrapper";
import InfiniteScroll from "@/components/common/InfiniteScroll";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import Link from "next/link";
import { WishlistCard } from "./WishlistCard";
import useWishlistData from "./useWishlistData";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart, cart } = useCart();
  const { user } = useAuth();

  const isInCart = (productId: string) =>
    cart.some((product) => product.ProductId === productId);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useWishlistData(wishlist, wishlist.length > 0);

  const wishlistData = data?.pages.flatMap((page) => page.Items);

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center gap-1">
        <h1 className="text-2xl font-bold">Your Wishlist</h1>
        <p className="text-md text-muted-foreground">
          ({wishlist.length} item{wishlist.length !== 1 ? "s" : ""})
        </p>
      </div>
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
        data={wishlistData}
        error={error}
        emptyState={
          <p className="text-center text-muted-foreground">
            Your Wishlist is empty.
          </p>
        }
        skeleton={
          <div className="space-y-4 h-[60vh]">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton
                className="h-1/4 flex flex-row items-center gap-4 p-3 border border-gray-200 rounded-xl shadow-sm md:w-full w-auto max-w-3xl mx-auto relative md:flex"
                key={i}
              />
            ))}
          </div>
        }
      >
        <InfiniteScroll
          hasMore={hasNextPage}
          loadMore={fetchNextPage}
          loading={isFetchingNextPage}
          loader={
            <div className="space-y-4 h-[60vh]">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton
                  className="h-1/4 flex flex-row items-center gap-4 p-3 border border-gray-200 rounded-xl shadow-sm md:w-full w-auto max-w-3xl mx-auto relative md:flex"
                  key={i}
                />
              ))}
            </div>
          }
        >
          <div className="space-y-4">
            {wishlistData &&
              wishlistData.map((product) => (
                <WishlistCard
                  key={product.ProductId}
                  product={product}
                  addToCart={addToCart}
                  removeFromWishlist={removeFromWishlist}
                  isInCart={isInCart}
                />
              ))}
          </div>
        </InfiniteScroll>
      </ApiWrapper>
    </div>
  );
}
