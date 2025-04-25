"use client";

import { ApiWrapper } from "@/components/common/ApiWrapper";
import InfiniteScroll from "@/components/common/InfiniteScroll";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useInfinitePaginatedQuery } from "@/hooks/useTanstackQuery";
import { fetchOrders } from "@/lib/orderUtils";
import { getOrderStatusLabel } from "@/lib/utils";
import { OrderDetails, OrderEnum } from "@/types/Order";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AllOrdersPage() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfinitePaginatedQuery<OrderDetails>({
    queryKey: ["order"],
    fetchPage: fetchOrders,
  });

  const orders = data?.pages.flatMap((page) => page.Items);

  const router = useRouter();

  const handleViewOrder = (orderId: string) => {
    router.push(`/orders/${orderId}`);
  };
  return (
    <div className="container mx-auto p-2 md:p-4 max-w-4xl">
      <ApiWrapper
        loading={isLoading}
        error={error}
        data={orders?.length}
        skeleton={
          <div>
            <h2 className="text-xl font-semibold mb-6">Your Orders</h2>
            <Skeleton className="w-full h-40 mb-4" />
            <Skeleton className="w-full h-40 mb-4" />
            <Skeleton className="w-full h-40 mb-4" />
          </div>
        }
      >
        <h2 className="text-xl font-semibold mb-6">Your Orders</h2>

        <div className="space-y-4">
          {orders?.length === 0 ? (
            <Card>
              <CardHeader className="text-center text-lg font-semibold">
                No orders found
              </CardHeader>
              <CardContent>
                <p>It seems like you haven’t placed any orders yet.</p>
              </CardContent>
            </Card>
          ) : (
            <InfiniteScroll
              loading={isFetchingNextPage || isLoading}
              loadMore={fetchNextPage}
              hasMore={hasNextPage}
            >
              {orders &&
                (orders as OrderDetails[]).map((order) => {
                  const statusLabel = getOrderStatusLabel(order.Status);
                  const deliverydate = new Date(
                    order.CreatedAt
                  ).toLocaleDateString(); //TODO
                  return (
                    <Card
                      key={order.OrderId}
                      className="mb-4 relative py-2 md:py-6 cursor-pointer hover:scale-101 hover:shadow-lg"
                      onClick={() => handleViewOrder(order.OrderId)}
                    >
                      <CardContent className="flex flex-row justify-between items-center mx-2 md:mx-4 px-0 md:px-6 gap-2">
                        {order.FirstItemImage && (
                          <div className="flex flex-row items-center md:gap-2">
                            <div>
                              <Image
                                src={order.FirstItemImage || "/placeholder.jpg"}
                                alt={order.FirstItemName}
                                className="w-20 h-20 rounded-md object-cover border"
                                width={20}
                                height={20}
                              />
                              <div>
                                <p className="text-base font-medium text-xs md:text-sm text-center mt-1">
                                  {order.FirstItemName}
                                </p>
                                {order.Items?.length > 1 ? (
                                  <p className="text-xs text-muted-foreground md:hidden block">
                                    + {order.Items?.length - 1} more
                                  </p>
                                ) : null}
                              </div>
                            </div>
                            {order.Items?.length > 1 ? (
                              <p className="text-sm text-muted-foreground hidden md:block">
                                + {order.Items?.length - 1} more
                              </p>
                            ) : null}
                          </div>
                        )}
                        <div className="flex flex-col items-start justify-start gap-2 h-[5rem]">
                          <p className="text-sm md:text-md font-semibold">
                            ₹{order.TotalAmount.toFixed(2)}
                          </p>
                          <p
                            className={`text-xs hidden md:block ${
                              order.Status === OrderEnum.DELIVERED
                                ? "text-green-600"
                                : order.Status !== OrderEnum.PENDING
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            Order{" "}
                            {statusLabel.charAt(0).toUpperCase() +
                              statusLabel.slice(1)}
                          </p>
                          {deliverydate ? (
                            <p className="text-xs max-w-[90%] md:max-w-[100%] h-[50%]">
                              {order.Status === OrderEnum.DELIVERED ? (
                                <>Delivered on</>
                              ) : (
                                <>Delivery expected by</>
                              )}{" "}
                              {deliverydate}
                            </p>
                          ) : null}
                        </div>

                        <div className="text-center hidden md:block">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewOrder(order.OrderId)}
                          >
                            View Details
                          </Button>
                        </div>
                        <div className="text-center block md:hidden">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewOrder(order.OrderId)}
                          >
                            <ChevronRight />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground text-right absolute right-2 bottom-2">
                          Order Placed On:{" "}
                          {new Date(order.CreatedAt).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
            </InfiniteScroll>
          )}
        </div>
      </ApiWrapper>
    </div>
  );
}
