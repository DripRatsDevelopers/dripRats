"use client";

import { ApiWrapper } from "@/components/common/ApiWrapper";
import OrderStatusTimeline from "@/components/common/OrderStatusTimeline";
import { ShipmentTrackingModal } from "@/components/common/ShippingTrackInfoModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDripratsMutation,
  useDripratsQuery,
} from "@/hooks/useTanstackQuery";
import { formatDate } from "@/lib/utils";
import { OrderDetails } from "@/types/Order";
import { Product } from "@/types/Products";
import { Separator } from "@radix-ui/react-select";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function OrderDetailsPage() {
  const { id: orderId } = useParams();
  const router = useRouter();

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

  return (
    <div className="px-4">
      <Button
        variant="ghost"
        onClick={() => router.push("/orders")}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground md:text-lg"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Orders
      </Button>
      <div className="max-w-6xl mx-auto space-y-6">
        <h3 className="text-lg font-semibold text-center md:text-start">
          Order Details
        </h3>
        <div className="md:flex flex-row w-full justify-between space-y-6 md:space-x-6">
          <div className="md:flex flex-col items-start gap-4 space-y-6 md:w-[70%]">
            <Card className="py-3 w-full">
              <CardContent className="p-3 py-3 space-y-3">
                <div className="space-y-2">
                  <h3 className="font-medium text-muted-foreground">Status</h3>
                  <OrderStatusTimeline currentStatus={order.Status} />
                </div>
                <p className="text-sm text-muted-foreground">
                  Order placed on {formatDate(order.CreatedAt)}
                </p>
                <div className="w-full flex justify-center">
                  <ShipmentTrackingModal
                    shipmentId={order.ShiprocketShipmentId}
                  />
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
                          <Image
                            src={
                              productDetails?.[Number(item.ProductId)]
                                .ImageUrls?.[0]
                            }
                            alt={productDetails?.[Number(item.ProductId)].Name}
                            className="w-20 h-20 rounded object-cover border"
                            width={400}
                            height={400}
                          />
                          <div className="space-y-1">
                            <div className="text-sm font-medium">
                              {productDetails?.[item.ProductId].Name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Qty: {item.Quantity} × ₹{item.Price}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm font-medium">
                          ₹{item.Price * item.Quantity}
                        </div>
                      </div>
                    ))}
                </div>
                <Separator className="flex-grow border" />
                <div className="flex justify-between text-sm font-medium">
                  <span>Total</span>
                  <span>₹{order.TotalAmount}</span>
                </div>
              </CardContent>
            </Card>
          </ApiWrapper>
        </div>
      </div>
    </div>
  );
}
