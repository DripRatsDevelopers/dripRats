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
import useAuthState from "@/hooks/useAuthState";
import { useCart } from "@/hooks/useCart";
import { fetchProduct } from "@/lib/productUtils";
import { CartType } from "@/types/Cart";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CheckoutPayment from "./CheckoutPayment";

interface ShippingInfo {
  fullName: string;
  houseNumber: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  deliveryType: string;
}

const shippingFormDetails = [
  {
    label: "Full Name",
    value: "fullName",
  },
  {
    label: "House Number",
    value: "houseNumber",
  },
  {
    label: "Street",
    value: "street",
  },
  {
    label: "City",
    value: "city",
  },
  {
    label: "State",
    value: "state",
  },
];

const CheckoutPage: React.FC = () => {
  const { cart } = useCart();
  const router = useRouter();
  const { user, loading } = useAuthState();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: "",
    houseNumber: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    deliveryType: "Standard",
  });

  const [tempQuantities, setTempQuantities] = useState<Record<string, number>>(
    {}
  );
  const searchParams = useSearchParams();

  const productId = searchParams.get("productId");
  const quantity = Number(searchParams.get("quantity")) || 1;
  const [checkoutItems, setCheckoutItems] = useState<CartType[]>([]);

  useEffect(() => {
    if (productId) {
      const fetchData = async () => {
        const productdata = await fetchProduct(productId);
        if (productdata) {
          setCheckoutItems([{ ...productdata, quantity }]);
        }
      };
      fetchData();
    } else {
      setCheckoutItems(cart);
    }
  }, [cart, productId, quantity]);

  const subtotal = checkoutItems.reduce(
    (acc, item) => acc + item.Price * (tempQuantities[item.id] || 1),
    0
  );

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/auth/login?redirect=${window.location.pathname}`);
    }
  }, [user, loading, router]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setTempQuantities(
      checkoutItems.reduce(
        (acc, item) => ({ ...acc, [item.id]: item.quantity }),
        {}
      )
    );
  }, [checkoutItems]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (["phone", "pincode"].includes(name) && !/^\d*$/.test(value)) return;
    setShippingInfo({ ...shippingInfo, [name]: value });
  };

  const handleDeliveryTypeChange = (value: string) => {
    setShippingInfo({ ...shippingInfo, deliveryType: value });
  };

  const handleQuantityChange = (id: string, increment: boolean) => {
    setTempQuantities((prev) => {
      const newQty = increment ? prev[id] + 1 : Math.max(prev[id] - 1, 1);
      return { ...prev, [id]: newQty };
    });
  };

  const isShippingInfoComplete = Object.values(shippingInfo).every(
    (val) => val.trim() !== ""
  );

  const handleStepChange = (direction: "next" | "prev") => {
    setCurrentStep((prev) => (direction === "next" ? prev + 1 : prev - 1));
  };

  const savings = subtotal * 0.1;
  const deliveryCharge = 50;
  const grandTotal = subtotal - savings + deliveryCharge;

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      {/* Step Navigation */}
      <div className="flex justify-center items-center mb-6 space-x-4">
        {["Shipping", "Summary", "Payment"].map((step, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Button
              className={`flex items-center justify-center h-8 w-8 rounded-full cursor-pointer ${
                currentStep >= index + 1
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-400"
              }`}
              variant="ghost"
              onClick={() => setCurrentStep(index + 1)}
              disabled={currentStep < index + 1}
            >
              {index + 1}
            </Button>
            <p className="hidden sm:block text-gray-600">{step}</p>
            {index < 2 && <div className="w-16 sm:w-24 h-px bg-gray-400" />}
          </div>
        ))}
      </div>

      {/* Step 1: Shipping Information */}
      {currentStep === 1 && (
        <Card className="p-4 shadow-lg">
          <CardHeader>
            <CardTitle>Shipping Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              {shippingFormDetails.map((field, idx) => (
                <Input
                  key={idx}
                  placeholder={field.label}
                  name={field.value}
                  value={shippingInfo[field.value as keyof ShippingInfo]}
                  onChange={handleInputChange}
                  className="w-full"
                  required
                />
              ))}
              <Input
                placeholder="Pincode"
                name="pincode"
                value={shippingInfo.pincode}
                onChange={handleInputChange}
                className="w-full"
                required
              />
              <Input
                placeholder="Phone"
                name="phone"
                value={shippingInfo.phone}
                onChange={handleInputChange}
                className="w-full"
                required
              />
              <Select
                onValueChange={handleDeliveryTypeChange}
                value={shippingInfo.deliveryType}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Delivery Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Standard">Standard Delivery</SelectItem>
                  <SelectItem value="Express">Express Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Order Summary */}
      {currentStep === 2 && (
        <Card className="p-4 shadow-lg">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Shipping Address */}
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Shipping Address</h3>
                <p>{shippingInfo.fullName}</p>
                <p>
                  {shippingInfo.houseNumber}, {shippingInfo.street}
                </p>
                <p>
                  {shippingInfo.city}, {shippingInfo.state} -{" "}
                  {shippingInfo.pincode}
                </p>
                <p>Phone: {shippingInfo.phone}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => setCurrentStep(1)}
                >
                  Edit Address
                </Button>
              </div>

              {/* Product List */}
              <ul className="space-y-4">
                {checkoutItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between items-center p-4 border rounded-lg"
                  >
                    {/* Product Image */}
                    <Image
                      src={item.ImageUrls[0]}
                      alt={item.Name}
                      className="w-24 h-24 object-contain rounded"
                      width={20}
                      height={20}
                    />

                    {/* Product Details */}
                    <div className="flex-1 ml-4">
                      <p className="font-semibold text-lg">{item.Name}</p>
                      <p>₹{item.Price}</p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, false)}
                          className="p-1 border rounded"
                        >
                          -
                        </button>
                        <span>{tempQuantities[item.id]}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, true)}
                          className="p-1 border rounded"
                        >
                          +
                        </button>
                      </div>

                      {/* Item Total */}
                      <p className="mt-1">
                        Total: ₹{item.Price * tempQuantities[item.id]}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Price Details */}
              <div className="p-4 border rounded-lg bg-gray-50 space-y-2">
                <p>Subtotal: ₹{subtotal}</p>
                <p className="text-green-600">
                  Savings: -₹{savings.toFixed(2)}
                </p>
                <p>Delivery Charge: ₹{deliveryCharge}</p>
                <p className="font-bold text-lg">Grand Total: ₹{grandTotal}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && <CheckoutPayment totalAmount={grandTotal} />}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-4">
        {currentStep > 1 && (
          <Button onClick={() => handleStepChange("prev")} variant="outline">
            <ArrowLeft /> Previous
          </Button>
        )}
        {currentStep < 3 && (
          <Button
            onClick={() => handleStepChange("next")}
            disabled={currentStep === 1 && !isShippingInfoComplete}
          >
            Next <ArrowRight />
          </Button>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
