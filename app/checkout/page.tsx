"use client";

import { ApiWrapper } from "@/components/common/ApiWrapper";
import OrderSummary from "@/components/common/OrderSummary";
import { OrderSummaryPanel } from "@/components/common/OrderSummaryPanel";
import { SessionExpiredModal } from "@/components/common/SessionExpiryModal";
import ShippingForm from "@/components/common/ShippingForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCheckoutSession } from "@/hooks/useCheckoutSession";
import useShippingForm from "@/hooks/useShippingForm";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import CheckoutPayment from "./CheckoutPayment";
import useCheckout from "./useCheckout";

const CheckoutPage: React.FC = () => {
  const addressData = useShippingForm();

  const { items, shippingInfo, form, payment } = useCheckout();
  const { isExpired, isSessionInvalid } = useCheckoutSession();

  const { shippingDetails, deliveryOptions, fetchingAddress } = addressData;

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
    fetchingProductDetails,
    isInitialState,
  } = items;

  const {
    currentStep,
    setCurrentStep,
    handleStepChange,
    disableNext,
    disableNavigation,
  } = form;

  const { deliveryDiscount, amountLeftForFreeShipping, shippingCharge } =
    shippingInfo;

  if ((isExpired || isSessionInvalid) && !isPaymentLoading) {
    return (
      <SessionExpiredModal
        isExpired={isExpired}
        isSessionInvalid={isSessionInvalid}
      />
    );
  }

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
    <div
      className={cn(
        "p-6 space-y-6 max-w-3xl mx-auto md:bg-transparent ",
        currentStep === 1 ? "mt-6 md:mt-0 " : ""
      )}
    >
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
        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
          <Card className="py-2 md:py-4 px-1 md:px-2 shadow-lg w-full flex-1">
            <CardHeader className="px-3">
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="px-1 md:px-3">
              <ApiWrapper
                loading={fetchingAddress}
                data={addressData?.shippingDetails?.id}
                skeleton={
                  <div>
                    <Skeleton className="h-100 w-full" />
                  </div>
                }
              >
                <ShippingForm
                  addressData={addressData}
                  handleStepChange={handleStepChange}
                />
              </ApiWrapper>
            </CardContent>
          </Card>
          <div className="block absolute w-full right-0 md:right-10 top-[3rem] md:top-[9.5rem] md:w-[300px]">
            <ApiWrapper
              loading={fetchingProductDetails || isInitialState}
              data={checkoutItemsList?.length && !isInitialState}
              skeleton={
                <div className="hidden md:block">
                  <Skeleton className="h-60 w-full" />
                </div>
              }
            >
              <OrderSummaryPanel
                products={checkoutItemsList}
                productStocksMap={productStocksMap}
                subTotal={subtotal}
                savings={savings}
              />
            </ApiWrapper>
          </div>
        </div>
      )}

      {/* Step 2: Order Summary */}
      {currentStep === 2 && (
        <OrderSummary
          shippingDetails={shippingDetails}
          deliveryDetails={deliveryOptions}
          checkoutItemsList={checkoutItemsList}
          isProductOutOfStock={isProductOutOfStock}
          setCurrentStep={setCurrentStep}
          productStocksMap={productStocksMap}
          savings={savings}
          subtotal={subtotal}
          grandTotal={grandTotal}
          handleRemoveItem={handleRemoveItem}
          handleQuantityChange={handleQuantityChange}
          deliveryDiscount={deliveryDiscount}
          amountLeftForFreeShipping={amountLeftForFreeShipping}
        />
      )}

      {currentStep === 3 && (
        <CheckoutPayment
          totalAmount={grandTotal}
          shippingInfo={shippingDetails}
          items={checkoutItemsList}
          shippingCharge={shippingCharge}
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
        {currentStep === 2 && (
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
