"use client";

import AddressForm from "@/components/common/AddressForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useAddressForm from "@/hooks/useAddressForm";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import CheckoutPayment from "./CheckoutPayment";
import useCheckout from "./useCheckout";

const CheckoutPage: React.FC = () => {
  const addressData = useAddressForm();

  const { items, shippingInfo, form } = useCheckout({
    deliveryDetails: addressData?.deliveryDetails,
  });

  const { shippingDetails, deliveryDetails } = addressData;

  const {
    checkoutItemsList,
    handleQuantityChange,
    grandTotal,
    subtotal,
    savings,
  } = items;

  const { currentStep, setCurrentStep, handleStepChange } = form;

  const { deliveryCharge } = shippingInfo;

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

      {currentStep === 1 && (
        <Card className="py-4 px-2 shadow-lg">
          <CardHeader className="px-3">
            <CardTitle>Shipping Information</CardTitle>
          </CardHeader>
          <CardContent className="px-3">
            <div className="grid grid-cols-1 gap-5">
              <AddressForm addressData={addressData} />
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

              {deliveryDetails?.etd ? (
                <p className="text-orange-600 text-center font-md font-bold">
                  Arriving By {deliveryDetails?.etd}
                </p>
              ) : null}

              {/* Product List */}
              <ul className="space-y-4">
                {checkoutItemsList.map((item) => (
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
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, true)}
                          className="p-1 border rounded"
                        >
                          +
                        </button>
                      </div>

                      {/* Item Total */}
                      <p className="mt-1">
                        Total: ₹{item.Price * item.quantity}
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

      {currentStep === 3 && (
        <CheckoutPayment
          totalAmount={grandTotal}
          shippingInfo={shippingDetails}
          items={checkoutItemsList}
        />
      )}

      {/* Navigation Buttons */}
      <div
        className={`flex mt-4 ${
          currentStep > 1 ? "justify-between" : "justify-end"
        }`}
      >
        {currentStep > 1 && (
          <Button onClick={() => handleStepChange("prev")} variant="outline">
            <ArrowLeft /> Previous
          </Button>
        )}
        {currentStep < 3 && (
          <Button
            onClick={() => handleStepChange("next")}
            disabled={currentStep === 1 && Boolean(addressData.disableConfirm)}
          >
            Next <ArrowRight />
          </Button>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
