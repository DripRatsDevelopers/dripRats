"use client";

import AddressForm from "@/components/common/AddressForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import useAddressForm from "@/hooks/useAddressForm";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  CircleAlert,
  Loader2,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import Image from "next/image";
import CheckoutPayment from "./CheckoutPayment";
import useCheckout from "./useCheckout";

const CheckoutPage: React.FC = () => {
  const addressData = useAddressForm();

  const { items, shippingInfo, form, payment } = useCheckout({
    deliveryDetails: addressData?.deliveryDetails,
    updateAddress: addressData?.updateAddress,
    disableConfirm: addressData?.disableConfirm,
  });

  const { shippingDetails, deliveryDetails } = addressData;

  const { isPaymentLoading } = payment;

  const {
    checkoutItemsList,
    handleQuantityChange,
    grandTotal,
    subtotal,
    savings,
    productStocksMap,
    isProductOutOfStock,
    handleRemoveItem,
  } = items;

  const {
    currentStep,
    setCurrentStep,
    handleStepChange,
    disableNext,
    disableNavigation,
  } = form;

  const { deliveryCharge, saveAddress, setSaveAddress } = shippingInfo;

  if (isPaymentLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-900 p-6 rounded shadow-md flex flex-col items-center space-y-4">
          <span className="text-lg font-medium text-gray-900 dark:text-white">
            Processing Payment...
          </span>
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      </div>
    );
  }
  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      {/* Step Navigation */}
      <div className="flex justify-center items-center mb-6 space-x-4">
        {["Shipping", "Summary", "Payment"].map((step, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              className={`flex items-center justify-center h-8 w-8 rounded-full ${
                currentStep >= index + 1
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              {index + 1}
            </div>
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
            <div className="flex items-center space-x-2 mt-4">
              <Checkbox
                id="save-address"
                checked={saveAddress}
                onCheckedChange={(val) => setSaveAddress(!!val)}
              />
              <Label htmlFor="save-address" className="text-sm font-normal">
                {shippingDetails?.id
                  ? "Edit the selected address"
                  : "Save this address for future checkouts"}
              </Label>
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
                {checkoutItemsList.map((item) => {
                  const isOutOfStock =
                    !productStocksMap?.[item.id] ||
                    productStocksMap?.[item.id] === 0;

                  const isQuantityInStock =
                    (productStocksMap?.[item.id] || 0) >= item.quantity;
                  return (
                    <li
                      key={item.id}
                      className={cn(
                        "p-4 border rounded-lg relative",
                        isOutOfStock ? "border-red-500" : ""
                      )}
                    >
                      {isOutOfStock && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(item.id)}
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
                                handleQuantityChange(item.id, false)
                              }
                              className="p-1 border rounded"
                            >
                              -
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              onClick={() =>
                                handleQuantityChange(item.id, true)
                              }
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
                            Only {productStocksMap?.[item.id]} items left.
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
      )}

      {currentStep === 3 && (
        <CheckoutPayment
          totalAmount={grandTotal}
          shippingInfo={shippingDetails}
          items={checkoutItemsList}
          {...payment}
        />
      )}

      {/* Navigation Buttons */}
      <div
        className={`flex mt-4 ${
          currentStep > 1 ? "justify-between" : "justify-end"
        }`}
      >
        {currentStep > 1 && (
          <Button
            onClick={() => handleStepChange("prev")}
            variant="outline"
            disabled={disableNavigation}
          >
            <ArrowLeft /> Previous
          </Button>
        )}
        {currentStep < 3 && (
          <Button
            onClick={() => handleStepChange("next")}
            disabled={disableNext || disableNavigation}
          >
            {disableNavigation ? (
              <>Loading...</>
            ) : (
              <>
                Next <ArrowRight />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
