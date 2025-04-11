"use client";

import AddressForm from "@/components/common/AddressForm";
import OrderSummary from "@/components/common/OrderSummary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import useAddressForm from "@/hooks/useAddressForm";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
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
        <OrderSummary
          shippingDetails={shippingDetails}
          deliveryDetails={deliveryDetails}
          checkoutItemsList={checkoutItemsList}
          isProductOutOfStock={isProductOutOfStock}
          setCurrentStep={setCurrentStep}
          productStocksMap={productStocksMap}
          savings={savings}
          subtotal={subtotal}
          deliveryCharge={deliveryCharge}
          grandTotal={grandTotal}
          handleRemoveItem={handleRemoveItem}
          handleQuantityChange={handleQuantityChange}
        />
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
