"use client";

import { ApiWrapper } from "@/components/common/ApiWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePagination } from "@/hooks/usePagination";
import { OrderDetails, OrderEnum } from "@/types/Order";
import { ArrowRightFromLine } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AllOrdersPage() {
  const {
    data: orders,
    loading,
    // loadMore,
    // hasMore,
    error,
  } = usePagination(`/api/order`);

  const router = useRouter();

  const handleViewOrder = (orderId: string) => {
    router.push(`/orders/${orderId}`);
  };

  return (
    <ApiWrapper
      loading={loading}
      error={error}
      data={orders}
      skeleton={<Skeleton className="w-full h-20 mb-4" />}
    >
      <div className="container mx-auto p-4">
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
            (orders as OrderDetails[]).map((order) => (
              <Card key={order.OrderId} className="mb-4 relative">
                <CardContent className="flex flex-row justify-between items-center mx-4 px-0 md:px-6">
                  {order.FirstItemImage && (
                    <div className="flex flex-row items-center gap-2">
                      <div>
                        <Image
                          src={order.FirstItemImage || "/placeholder.jpg"}
                          alt={order.FirstItemName}
                          className="w-20 h-20 object-cover rounded-lg border"
                          width={20}
                          height={20}
                        />
                        <p className="text-base font-medium text-xs md:text-sm">
                          {order.FirstItemName}
                        </p>{" "}
                      </div>
                      {order.Items?.length > 1 ? (
                        <p className="text-sm text-muted-foreground">
                          + {order.Items?.length - 1} more
                        </p>
                      ) : null}
                    </div>
                  )}
                  <div className="flex flex-col justify-between h-full">
                    <p className="text-md font-semibold">
                      ₹{order.TotalAmount.toFixed(2)}
                    </p>
                    <p
                      className={`text-sm hidden md:block ${
                        order.Status === OrderEnum.DELIVERED
                          ? "text-green-600"
                          : order.Status !== OrderEnum.PENDING
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      Order{" "}
                      {order.Status.charAt(0).toUpperCase() +
                        order.Status.slice(1)}
                    </p>
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
                      <ArrowRightFromLine />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600 text-right absolute right-2 bottom-2">
                    Order Placed On:{" "}
                    {new Date(order.CreatedAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </ApiWrapper>
  );
}
