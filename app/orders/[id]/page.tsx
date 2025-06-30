"use client";

import { ApiWrapper } from "@/components/common/ApiWrapper";
import OrderStatusTimeline from "@/components/common/OrderStatusTimeline";
import { ShipmentTrackingModal } from "@/components/common/ShippingTrackInfoModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DripratsImage from "@/components/ui/DripratsImage";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDripratsMutation,
  useDripratsQuery,
} from "@/hooks/useTanstackQuery";
import { formatDate } from "@/lib/utils";
import { OrderDetails } from "@/types/Order";
import { Product } from "@/types/Products";
import { Separator } from "@radix-ui/react-select";
import { ArrowLeft, Lock, XCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function OrderDetailsPage() {
  const { id: orderId } = useParams();
  const router = useRouter();
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const { data, isLoading, isError } = useDripratsQuery({
    queryKey: ["/api/order/", orderId],
    apiParams: {
      url: `/api/order/${orderId}`,
    },
    options: { enabled: !!orderId },
  });

  const order = data as OrderDetails;
  const productIds = order?.Items?.length
    ? order?.Items?.map(({ ProductId }) => ProductId)
    : [];

  const {
    mutate,
    error,
    isPending: productDataLoading,
    data: productData,
  } = useDripratsMutation({
    apiParams: {
      url: `/api/products/getMultipleProducts`,
      body: productIds,
      method: "POST",
    },
  });
  const productDetails = productData as Record<string, Product> | null;

  useEffect(() => {
    if (
      !productDataLoading &&
      !isLoading &&
      order?.Items?.length &&
      !productDetails
    ) {
      mutate();
    }
  }, [isLoading, order?.Items?.length, productDataLoading, productDetails]);

  async function cancelOrder() {
    setIsCancelling(true);
    try {
      // TODO: Replace with real cancel order API endpoint
      const res = await fetch(`/api/order/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.OrderId }),
      });
      if (!res.ok) throw new Error("Failed to cancel order");
      toast.success("Order cancelled successfully");
      router.refresh();
    } catch {
      toast.error("Failed to cancel order");
    } finally {
      setIsCancelling(false);
      setShowCancelDialog(false);
    }
  }

  if (isError || error) {
    toast.error("Something went wrong", {
      description: "Please try again later",
    });
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl p-6 mx-auto space-y-6">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-70 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!order) return <p className="p-4">Order not found.</p>;
  const shippingDetails = JSON.parse(order.ShippingAddress);

  const totalDiscount =
    order.Items.reduce(
      (acc, item) => acc + (item.DiscountPerItem || 0) * item.Quantity,
      0
    ) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-2 md:px-4 lg:px-0 py-4">
        <Button
          variant="secondary"
          onClick={() => router.push("/orders")}
          className="flex items-center gap-2 mb-6 hover:text-muted-foreground text-foreground rounded-full px-4 py-2 transition-all w-full md:w-fit text-base md:text-lg font-medium"
        >
          <ArrowLeft className="h-5 w-5 md:h-4 md:w-4" />
          <span className="hidden md:inline">Back to Orders</span>
          <span className="md:hidden">Back</span>
        </Button>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-center md:text-start text-gray-800">
              Order Details
            </h3>
            {!["SHIPPED", "OUTFORDELIVERY", "DELIVERED"].includes(
              order.Status
            ) && (
              <Button
                variant="outline"
                size="sm"
                className="rounded-full px-3 flex items-center gap-1 text-red-600 hover:text-red-400 bg-red-50 hover:bg-red-30 transition-colors"
                onClick={() => setShowCancelDialog(true)}
                disabled={isCancelling}
              >
                <XCircle className="w-4 h-4 opacity-60" />
                <span>Cancel Order</span>
              </Button>
            )}
          </div>
          <div className="md:flex flex-row w-full justify-between space-y-6 md:space-x-6 md:space-y-0">
            <div className="md:flex flex-col items-start gap-4 space-y-6 md:w-[70%]">
              <Card className="py-3 w-full">
                <CardContent className="p-3 py-3 space-y-3">
                  <div className="space-y-2">
                    <h3 className="font-medium text-muted-foreground">
                      Status
                    </h3>
                    <OrderStatusTimeline currentStatus={order.Status} />
                    <p className="text-sm text-muted-foreground">
                      Order placed on {formatDate(order.CreatedAt)}
                    </p>
                    {order.ShiprocketShipmentId ? (
                      <div className="w-full flex justify-center">
                        <ShipmentTrackingModal
                          shipmentId={order.ShiprocketShipmentId}
                        />
                      </div>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
              <Card className="md:py-3 w-full">
                <CardContent className="p-6 space-y-3">
                  <h3 className="text-lg font-semibold">Shipping Address</h3>
                  <div className="text-sm leading-relaxed">
                    <p>{shippingDetails.fullName},</p>
                    <p>
                      {shippingDetails.houseNumber}, {shippingDetails.street}
                    </p>
                    <p>
                      {shippingDetails.city}, {shippingDetails.state} -{" "}
                      {shippingDetails.pincode}
                    </p>
                    <p>Phone: {shippingDetails.phone}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            <ApiWrapper
              loading={productDataLoading}
              data={productDetails}
              skeleton={
                <div>
                  <Skeleton className="h-70 w-full" />
                </div>
              }
            >
              <Card className="h-[fit-content] md:w-[30%]">
                <CardContent className="p-3 space-y-3">
                  <h3 className="text-lg font-semibold">Items</h3>
                  <div className="space-y-4">
                    {productDetails &&
                      order.Items.map((item) => (
                        <div
                          key={item.ProductId}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-4">
                            <DripratsImage
                              src={
                                productDetails?.[item.ProductId].ImageUrls?.[0]
                              }
                              alt={productDetails?.[item.ProductId].Name}
                              className="w-20 h-20 rounded object-cover border"
                              width={400}
                              height={400}
                            />
                            <div className="space-y-1">
                              <div className="text-sm font-medium">
                                {productDetails?.[item.ProductId].Name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Qty: {item.Quantity}
                              </div>
                              {item?.DiscountPerItem &&
                              item?.DiscountPerItem > 0 ? (
                                <div className="flex items-baseline gap-2 text-xs">
                                  <span className="line-through text-muted-foreground">
                                    ₹{item.Price + item?.DiscountPerItem}
                                  </span>
                                  <span className="font-semibold text-foreground">
                                    ₹{item.Price}
                                  </span>
                                </div>
                              ) : (
                                <div className="text-xs text-muted-foreground">
                                  Price: ₹{item.Price}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-sm font-medium">
                            ₹{item.Price * item.Quantity}
                          </div>
                        </div>
                      ))}
                  </div>
                  <Separator className="my-2" />
                  {totalDiscount > 0 && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>
                          ₹
                          {order.Items.reduce(
                            (acc, item) =>
                              acc +
                              (item.Price + (item.DiscountPerItem || 0)) *
                                item.Quantity,
                            0
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount</span>
                        <span>- ₹{totalDiscount}</span>
                      </div>
                    </>
                  )}
                  <Separator className="border my-2" />
                  <div className="flex justify-between text-sm font-medium">
                    <span>Total</span>
                    <span>₹{order.TotalAmount}</span>
                  </div>
                </CardContent>
                <div className="flex justify-center items-center gap-2 pt-1 text-xs text-muted-foreground">
                  <Lock className="w-3 h-3" />
                  <span>Securely paid via Razorpay</span>
                </div>
              </Card>
            </ApiWrapper>
          </div>{" "}
        </div>
      </div>
      {showCancelDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90vw] max-w-xs space-y-4">
            <h2 className="text-lg font-semibold text-center">Cancel Order?</h2>
            <p className="text-sm text-muted-foreground text-center">
              Are you sure you want to cancel this order? This action cannot be
              undone.
            </p>
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowCancelDialog(false)}
                disabled={isCancelling}
              >
                No, Go Back
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={cancelOrder}
                disabled={isCancelling}
              >
                {isCancelling ? "Cancelling..." : "Yes, Cancel"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
