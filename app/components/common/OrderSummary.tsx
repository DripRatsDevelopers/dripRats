import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

import { FLAT_SHIPPING_COSTS } from "@/constants/DeliveryConstants";
import { cn } from "@/lib/utils";
import { CartType } from "@/types/Cart";
import { deliveryPartnerDetails, ShippingInfo } from "@/types/Order";
import { Separator } from "@radix-ui/react-select";
import { CircleAlert, Trash2, TriangleAlert } from "lucide-react";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface OrderSummary {
  shippingDetails: ShippingInfo;
  deliveryDetails?: deliveryPartnerDetails;
  checkoutItemsList: CartType[];
  isProductOutOfStock: boolean;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  productStocksMap?: Record<string, number>;
  savings: number;
  subtotal: number;
  deliveryDiscount: number;
  grandTotal: number;
  amountLeftForFreeShipping: string;
  handleRemoveItem: (id: string) => void;
  handleQuantityChange: (id: string, increment: boolean) => void;
}

const OrderSummary = ({
  shippingDetails,
  deliveryDetails,
  checkoutItemsList,
  isProductOutOfStock,
  setCurrentStep,
  productStocksMap,
  savings,
  subtotal,
  deliveryDiscount,
  grandTotal,
  amountLeftForFreeShipping,
  handleRemoveItem,
  handleQuantityChange,
}: OrderSummary) => {
  return (
    <Card className="p-4 shadow-lg">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Shipping Address */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Shipping Address</h3>
            <p>{shippingDetails.fullName}</p>
            <p>
              {shippingDetails.houseNumber}, {shippingDetails.street}
            </p>
            <p>
              {shippingDetails.city}, {shippingDetails.state} -{" "}
              {shippingDetails.pincode}
            </p>
            <p>Phone: {shippingDetails.phone}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => setCurrentStep(1)}
            >
              Edit Address
            </Button>
          </div>

          {deliveryDetails?.etd &&
          !isProductOutOfStock &&
          checkoutItemsList?.length ? (
            <p className="text-orange-600 text-center font-md font-bold">
              Arriving By {deliveryDetails?.etd}
            </p>
          ) : null}

          {/* Product List */}
          <ul className="space-y-4">
            {checkoutItemsList.map((item) => {
              const availableQuantity = productStocksMap?.[item.ProductId] || 0;
              const isOutOfStock =
                !availableQuantity || availableQuantity === 0;

              const isQuantityInStock =
                (availableQuantity || 0) >= item.quantity;
              return (
                <li
                  key={item.ProductId}
                  className={cn(
                    "p-4 border rounded-lg relative",
                    isOutOfStock ? "border-red-500" : ""
                  )}
                >
                  {isOutOfStock && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(item.ProductId)}
                      className="mt-2 absolute right-1 text-red-500"
                    >
                      <Trash2 className="w-5 h-5" />{" "}
                    </Button>
                  )}
                  <div
                    className={cn(
                      "flex justify-between items-center",
                      isOutOfStock ? "opacity-50 pointer-events-none" : ""
                    )}
                  >
                    <Image
                      src={item.ImageUrls[0]}
                      alt={item.Name}
                      className="w-24 h-24 object-contain rounded"
                      width={20}
                      height={20}
                    />
                    {/* Product Details */}
                    <div className="flex-1 ml-4">
                      <p className="font-semibold text-md">{item.Name}</p>
                      <p>₹{item.Price}</p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() =>
                            handleQuantityChange(item.ProductId, false)
                          }
                          className="p-1 border rounded"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() =>
                            handleQuantityChange(item.ProductId, true)
                          }
                          className="p-1 border rounded"
                          disabled={item.quantity >= availableQuantity}
                        >
                          +
                        </button>
                      </div>

                      {/* Item Total */}
                      <p className="mt-1">
                        Total: ₹{item.Price * item.quantity}
                      </p>
                    </div>
                  </div>
                  <div>
                    {isOutOfStock && (
                      <div className="text-red-500 text-sm justify-center mt-2 flex items-center gap-1">
                        <TriangleAlert className="w-4 h-4" />
                        Out of stock
                      </div>
                    )}
                    {!isQuantityInStock && !isOutOfStock ? (
                      <div className="text-yellow-500 text-sm mt-1 flex items-center justify-center gap-1">
                        Only {productStocksMap?.[item.ProductId]} items left.
                        Reduce quantity.
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
          {deliveryDiscount > 0 ? (
            <Badge
              variant="default"
              className="bg-green-100 text-green-700 w-full text-sm"
            >
              🎉 You’ve unlocked Free Shipping!
            </Badge>
          ) : (
            <Badge
              variant="default"
              className="text-muted-foreground w-full text-sm bg-secondary -background"
            >
              Purchase for <b>₹{amountLeftForFreeShipping}</b> more to unlock
              free shipping 🚚
            </Badge>
          )}
          {/* Price Details */}
          <div className="p-4 border rounded-lg bg-gray-50 space-y-1 text-sm">
            <div className="flex items-center justify-between">
              <p>Subtotal:</p>
              <p className="font-semibold"> ₹{subtotal.toFixed(2)}</p>
            </div>
            <div className="flex items-center justify-between text-green-600">
              <p>Savings:</p>
              <p className="font-semibold"> - ₹{savings.toFixed(2)}</p>
            </div>
            <div className="flex items-center justify-between">
              <p>Shipping Charges:</p>
              <p className="font-semibold">
                + ₹{FLAT_SHIPPING_COSTS.toFixed(2)}
              </p>
            </div>
            <div className="flex items-center justify-between text-green-600">
              <p>Shipping discount:</p>
              <p className="font-semibold">- ₹{deliveryDiscount.toFixed(2)}</p>
            </div>
            <Separator className="border" />
            <div className="flex items-center justify-between">
              <p className="font-bold text-lg">Grand Total:</p>
              <p className="font-semibold"> ₹{grandTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>
        {isProductOutOfStock ? (
          <div className="text-red-500 text-sm font-semibold justify-center mt-2 flex items-start md:items-center gap-1">
            <CircleAlert className="w-6 h-6" />
            <p>
              Some items chosen are not available, please remove those to
              proceed
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
