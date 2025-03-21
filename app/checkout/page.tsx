"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/hooks/useCart";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface CartItem {
  id: string;
  Name: string;
  Price: number;
  quantity: number;
  ImageUrls: string[];
  checkoutQuantity?: number;
}

interface ShippingInfo {
  houseNumber: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  deliveryMethod: "standard" | "express";
}

const CheckoutPage = () => {
  const { cart, totalAmount } = useCart();
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    houseNumber: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    deliveryMethod: "standard",
  });

  const searchParams = useSearchParams();
  const buyNowItemId = searchParams.get("buyNowItemId");

  const buyNowItem = cart.find((item) => item.id === buyNowItemId);

  const displayedItems = buyNowItem ? [buyNowItem] : cart;

  const recommendedItems = cart
    .slice(0, 5)
    .filter((item) => item.id !== buyNowItemId);

  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const buyNowItem = cart.find((item: CartItem) => item.id === buyNowItemId);
    const initialItems = buyNowItem ? [buyNowItem] : cart;
    setCheckoutItems(
      initialItems.map((item) => ({ ...item, checkoutQuantity: item.quantity }))
    );
  }, [buyNowItemId, cart]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handleDeliveryMethodChange = (
    value: ShippingInfo["deliveryMethod"]
  ) => {
    setShippingInfo({ ...shippingInfo, deliveryMethod: value });
  };

  const handlePlaceOrder = () => {
    // Handle order placement logic here
    alert("Order placed successfully!");
  };

  const handleQuantityChange = (id: string, increment: boolean) => {
    setCheckoutItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              checkoutQuantity: Math.max(
                1,
                (item.checkoutQuantity || 1) + (increment ? 1 : -1)
              ),
            }
          : item
      )
    );
  };

  const deliveryCharge = shippingInfo.deliveryMethod === "express" ? 100 : 50; // Express: ₹100, Standard/Store Pickup: ₹50
  const savings = totalAmount * 0.1; // Assuming a 10% discount on total price
  const finalPrice =
    checkoutItems.reduce(
      (sum, item) => sum + item.Price * (item.checkoutQuantity || 1),
      0
    ) +
    deliveryCharge -
    savings;

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4">
      {/* Shipping Details */}
      <div className="w-full md:w-2/3">
        <Card className="p-6 space-y-4 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Shipping Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="House Number"
                name="houseNumber"
                value={shippingInfo.houseNumber}
                onChange={handleInputChange}
              />
              <Input
                placeholder="Street"
                name="street"
                value={shippingInfo.street}
                onChange={handleInputChange}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="City"
                  name="city"
                  value={shippingInfo.city}
                  onChange={handleInputChange}
                />
                <Input
                  placeholder="State"
                  name="state"
                  value={shippingInfo.state}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Pincode"
                  name="pincode"
                  value={shippingInfo.pincode}
                  onChange={handleInputChange}
                />
                <Input
                  placeholder="Phone"
                  name="phone"
                  value={shippingInfo.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Select
                  onValueChange={handleDeliveryMethodChange}
                  value={shippingInfo.deliveryMethod}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">
                      Standard (₹50, 4-6 days)
                    </SelectItem>
                    <SelectItem value="express">
                      Express (₹100, 1-2 days)
                    </SelectItem>
                    <SelectItem value="pickup">Store Pickup (₹50)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Summary */}
      <div className="w-full md:w-1/3">
        <Card className="p-4 shadow-lg">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {displayedItems.length === 0 ? (
              <p>No items for checkout.</p>
            ) : (
              <>
                <ul className="space-y-2 mb-4">
                  {checkoutItems.map((item) => (
                    <li
                      key={item.id}
                      className="flex justify-between items-center"
                    >
                      <div className="flex gap-2 items-center">
                        <Image
                          src={item.ImageUrls[0]}
                          alt={item.Name}
                          className="w-14 h-14 object-cover rounded"
                          width={20}
                          height={20}
                        />
                        <span>{item.Name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="secondary"
                          onClick={() => handleQuantityChange(item.id, false)}
                        >
                          -
                        </Button>
                        <span>{item.checkoutQuantity}</span>
                        <Button
                          variant="secondary"
                          onClick={() => handleQuantityChange(item.id, true)}
                        >
                          +
                        </Button>
                        <span>
                          ₹{item.Price * (item.checkoutQuantity || 1)}
                        </span>
                      </div>
                    </li>
                  ))}
                  <li className="font-semibold flex justify-between items-center">
                    <span>Subtotal </span>₹{totalAmount}
                  </li>
                  <li className="font-semibold flex justify-between items-center">
                    <span>Delivery Charges</span>+ ₹{deliveryCharge}
                  </li>
                  <li className="text-green-600 font-semibold mb-2 flex justify-between items-center">
                    <span>Savings</span> - ₹{savings.toFixed(2)} 🎉
                  </li>
                  <li className="font-bold text-lg mb-4 flex justify-between items-center">
                    <span>Total</span> ₹{finalPrice.toFixed(2)}
                  </li>
                </ul>

                <Button className="w-full mt-2" onClick={handlePlaceOrder}>
                  Place Order
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Recommended Items */}
        {buyNowItem && recommendedItems.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">
              You might also want to add:
            </h3>
            <ul className="space-y-2">
              {recommendedItems.map((item) => (
                <li key={item.id} className="flex justify-between items-center">
                  <span>{item.Name}</span>
                  <Button onClick={() => handleQuantityChange(item.id, true)}>
                    Add to Checkout
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
