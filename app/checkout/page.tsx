"use client";

import AddressForm, { SELECTED_ADDRESS } from "@/components/common/AddressForm";
import DeliveryOptions from "@/components/common/DeliveryOption";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  deliveryPartnerDetails,
  DeliveryType,
  ShippingInfo,
} from "@/types/Order";
import { Separator } from "@radix-ui/react-select";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import CheckoutPayment from "./CheckoutPayment";
import useCheckout from "./useCheckout";

const CheckoutPage: React.FC = () => {
  const { items, shippingDetails, form } = useCheckout();

  const {
    checkoutItemsList,
    handleQuantityChange,
    grandTotal,
    subtotal,
    savings,
  } = items;

  const { currentStep, setCurrentStep, handleStepChange } = form;
  const {
    shippingInfo,
    handleInputChange,
    handleDeliveryTypeChange,
    handleInputBlur,
    isShippingInfoComplete,
    setDeliveryDetails,
    error,
    deliveryDetails,
    deliveryCharge,
    savedAddresses,
    setShippingInfo,
    selectedAddress,
    setSelectedAddress,
  } = shippingDetails;

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
            <div className="grid grid-cols-1 gap-5">
              {savedAddresses?.length ? (
                <p className="text-xs text-muted-foreground text-center">
                  You can choose any of the saved address <b>if saved</b>, or
                  use a new one. You can also edit the selected address.
                </p>
              ) : null}
              <RadioGroup
                onValueChange={(value) => {
                  let address;
                  if (value === SELECTED_ADDRESS) {
                    address = selectedAddress;
                  } else {
                    address = savedAddresses.find((addr) => addr.id === value);
                  }
                  const updatedAddress = {
                    ...address,
                    phone: shippingInfo.phone,
                    fullName: shippingInfo.fullName,
                    deliveryType: DeliveryType.STANDARD,
                  } as ShippingInfo;

                  setShippingInfo(updatedAddress);
                }}
              >
                <AddressForm
                  onSelectAddress={(data) => {
                    const updatedAddress = {
                      ...data,
                      phone: shippingInfo.phone,
                      fullName: shippingInfo.fullName,
                      deliveryType: DeliveryType.STANDARD,
                    } as ShippingInfo;

                    setSelectedAddress(data);

                    setShippingInfo(updatedAddress);
                  }}
                  selectedAddress={selectedAddress}
                  selectedAddressId={shippingInfo?.id}
                />
                {savedAddresses?.length ? (
                  <>
                    <div className="relative flex items-center my-1">
                      <Separator className="flex-grow border" />
                      <span className="mx-3 text-xs text-muted-foreground uppercase font-medium">
                        OR
                      </span>
                      <Separator className="flex-grow border" />
                    </div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                      Saved Addresses:
                    </h4>
                    <div className="overflow-x-auto flex gap-4">
                      {savedAddresses.map((addr) => (
                        <Label className="font-normal" key={addr.id}>
                          <Card
                            key={addr.id}
                            className={`py-3 px-2 min-w-[200px] max-w-[250px] flex items-start flex-row border  ${
                              shippingInfo?.id === addr.id
                                ? "border-primary bg-gray-50"
                                : "border-muted"
                            }`}
                          >
                            <RadioGroupItem
                              value={addr.id || ""}
                              id={addr.id || ""}
                              checked={addr.id === shippingInfo?.id}
                            />
                            <CardContent className="px-0 py-0 text-xs">
                              <div>
                                <p>
                                  {addr.houseNumber}, {addr.street}
                                </p>
                                <p>
                                  {addr.area} ,
                                  {addr?.landmark ? <>{addr?.landmark},</> : ""}
                                </p>
                                <p>
                                  {addr.city}, {addr.state} - {addr.pincode}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </Label>
                      ))}
                    </div>
                  </>
                ) : null}
              </RadioGroup>
              <Input
                placeholder="Full Name"
                name="fullName"
                value={shippingInfo.fullName}
                onChange={handleInputChange}
                className="w-full"
                required
                onBlur={handleInputBlur}
              />
              {error?.fullName ? (
                <p className="text-sm text-destructive">{error?.fullName}</p>
              ) : null}
              <Input
                placeholder="Phone"
                name="phone"
                value={shippingInfo.phone}
                onChange={handleInputChange}
                className="w-full"
                required
                onBlur={handleInputBlur}
              />
              {error?.phone ? (
                <p className="text-sm text-destructive">{error?.phone}</p>
              ) : null}
              {shippingInfo?.pincode && shippingInfo?.pincode?.length === 6 ? (
                <DeliveryOptions
                  deliveryPincode={shippingInfo?.pincode}
                  onSelect={(
                    deliveryType: DeliveryType,
                    deliveryDetails?: deliveryPartnerDetails | string
                  ) => {
                    handleDeliveryTypeChange(deliveryType);
                    if (deliveryDetails && typeof deliveryDetails === "object")
                      setDeliveryDetails(deliveryDetails);
                  }}
                  selectedDeliveryType={shippingInfo?.deliveryType}
                  deliveryDetails={deliveryDetails}
                />
              ) : null}
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
          shippingInfo={shippingInfo}
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
