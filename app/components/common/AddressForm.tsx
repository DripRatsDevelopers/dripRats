"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAddressForm from "@/hooks/useAddressForm";
import { deliveryPartnerDetails, DeliveryType } from "@/types/Order";
import { Separator } from "@radix-ui/react-select";
import { MapPin, Save, X } from "lucide-react";
import DeliveryOptions from "./DeliveryOption";
import SavedAddress from "./SavedAddressDialog";

export const SELECTED_ADDRESS = "SELECTED_ADDRESS";

export default function AddressForm({
  addressData,
}: {
  addressData: ReturnType<typeof useAddressForm>;
}) {
  const {
    shippingDetails,
    setShippingDetails,
    showSuggestions,
    suggestions,
    setShowSuggestions,
    handleSelect,
    handleInputBlur,
    handleClear,
    error,
    getCurrentLocation,
    setValue,
    removeErrorIfExists,
    deliveryDetails,
    handleDeliveryTypeChange,
    setDeliveryDetails,
    open,
    setOpen,
  } = addressData;

  return (
    <div className="flex flex-col justify-center space-y-3 w-full">
      <div className="space-y-2">
        <Label className="gap-0">
          Full Name<span className="text-destructive">*</span>
        </Label>
        <Input
          placeholder="Full Name"
          name="fullName"
          value={shippingDetails.fullName}
          onChange={(e) => {
            const value = e.target.value.trim();
            setShippingDetails((prev) => ({
              ...prev,
              fullName: e.target.value,
            }));
            if (value?.length) {
              removeErrorIfExists("fullName");
            }
          }}
          className="w-full text-sm"
          required
          onBlur={handleInputBlur}
        />
        {error?.fullName ? (
          <p className="text-sm text-destructive">{error?.fullName}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label className="gap-0">
          Phone Number<span className="text-destructive">*</span>
        </Label>
        <Input
          placeholder="Phone"
          name="phone"
          value={shippingDetails.phone}
          onChange={(e) => {
            const value = e.target.value.trim();
            setShippingDetails((prev) => ({
              ...prev,
              phone: e.target.value,
            }));
            if (value?.length) {
              removeErrorIfExists("phone");
            }
          }}
          className="w-full text-sm"
          required
          onBlur={handleInputBlur}
        />
        {error?.phone ? (
          <p className="text-sm text-destructive">{error?.phone}</p>
        ) : null}
      </div>
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={() => {
          setOpen(true);
        }}
      >
        <Save size={18} />
        Choose from saved Address
      </Button>
      <div className="relative flex items-center my-1">
        <Separator className="flex-grow border" />
        <span className="mx-3 text-xs text-muted-foreground uppercase font-medium">
          OR
        </span>
        <Separator className="flex-grow border" />
      </div>
      {open ? (
        <SavedAddress
          setShippingDetails={setShippingDetails}
          shippingDetails={shippingDetails}
          open={open}
          setOpen={setOpen}
        />
      ) : null}
      <div className="space-y-2">
        <Label>Search Address</Label>
        <div className="flex justify-between space-x-3 divide-x-2">
          <div className="relative w-[90%] pr-2">
            <Input
              type="text"
              value={shippingDetails?.address}
              onChange={(e) => {
                setValue(e.target.value);
                setShippingDetails((prev) => ({
                  ...prev,
                  address: e.target.value,
                }));
              }}
              placeholder="Search Address...."
              onBlur={() => {
                setShowSuggestions(false);
              }}
              onFocus={() => {
                setShowSuggestions(true);
              }}
              className="text-sm"
            />
            {shippingDetails?.address && (
              <Button
                variant="link"
                onClick={handleClear}
                className="absolute cursor-pointer bg-white dark:bg-black right-3 top-1/2 -translate-y-1/2 px-0 p-0! w-[fit-content] h-[fit-content]"
              >
                <X className="w-2 h-1" />
              </Button>
            )}
          </div>
          <Button
            onClick={getCurrentLocation}
            variant="outline"
            className="flex items-center gap-2 "
            title="Use Current Location"
          >
            <MapPin size={18} />
            <span className="hidden md:block">Use Current Location</span>
          </Button>
        </div>

        {suggestions.status === "OK" && showSuggestions && (
          <ul
            className="bg-white dark:bg-black border rounded shadow-md mt-1 max-h-40 overflow-y-auto absolute shadow-sm suggestions-list"
            onMouseDown={(e) => e.preventDefault()}
          >
            {suggestions.data.map((suggestion) => (
              <li
                key={suggestion.place_id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelect(suggestion)}
              >
                {suggestion.description}
              </li>
            ))}
          </ul>
        )}
        <p className="text-xs text-muted-foreground">
          Can&#39;t find your address? You can still enter it manually below.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label className="gap-0">
            House/Flat No<span className="text-destructive">*</span>
          </Label>
          <Input
            onBlur={handleInputBlur}
            type="text"
            value={shippingDetails.houseNumber}
            onChange={(e) => {
              const value = e.target.value.trim();
              setShippingDetails((prev) => ({
                ...prev,
                houseNumber: e.target.value,
              }));
              if (value?.length) {
                removeErrorIfExists("houseNumber");
              }
            }}
            placeholder="Enter House number"
            name="houseNumber"
            required
            className="text-sm"
          />
          {error?.houseNumber ? (
            <p className="text-sm text-destructive">
              House/Flat No is required
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label className="gap-0">
            Street Name<span className="text-destructive">*</span>
          </Label>
          <Input
            onBlur={handleInputBlur}
            type="text"
            value={shippingDetails.street}
            onChange={(e) => {
              const value = e.target.value.trim();
              setShippingDetails((prev) => ({
                ...prev,
                street: e.target.value,
              }));
              if (value?.length) {
                removeErrorIfExists("houseNumber");
              }
            }}
            placeholder="Enter Street name"
            name="streetName"
            required
            className="text-sm"
          />
          {error?.streetName ? (
            <p className="text-sm text-destructive">Street Name is required</p>
          ) : null}
        </div>
      </div>

      <Label className="gap-0">Landmark (Optional)</Label>
      <Input
        type="text"
        value={shippingDetails.landmark}
        onChange={(e) => {
          setShippingDetails((prev) => ({
            ...prev,
            landmark: e.target.value,
          }));
        }}
        placeholder="Enter nearby landmark"
        className="text-sm"
      />

      <Label className="gap-0">
        Area / Village<span className="text-destructive">*</span>
      </Label>
      <Input
        onBlur={handleInputBlur}
        type="text"
        value={shippingDetails.area}
        onChange={(e) => {
          const value = e.target.value.trim();
          setShippingDetails((prev) => ({
            ...prev,
            area: e.target.value,
          }));
          if (value?.length) {
            removeErrorIfExists("area");
          }
        }}
        placeholder="Enter Area/Village"
        name="area"
        required
        className="text-sm"
      />
      {error?.area ? (
        <p className="text-sm text-destructive">Area is required</p>
      ) : null}

      <div className="grid grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label className="gap-0">
            City / District<span className="text-destructive">*</span>
          </Label>
          <Input
            onBlur={handleInputBlur}
            type="text"
            value={shippingDetails.city}
            onChange={(e) => {
              const value = e.target.value.trim();
              setShippingDetails((prev) => ({
                ...prev,
                city: e.target.value,
              }));

              if (Boolean(value?.length)) {
                removeErrorIfExists("city");
              }
            }}
            placeholder="Enter City"
            name="city"
            required
            className="text-sm"
          />
          {error?.city ? (
            <p className="text-sm text-destructive">City is required</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label className="gap-0">
            State<span className="text-destructive">*</span>
          </Label>
          <Input
            onBlur={handleInputBlur}
            type="text"
            value={shippingDetails.state}
            onChange={(e) => {
              const value = e.target.value.trim();

              setShippingDetails((prev) => ({
                ...prev,
                state: e.target.value,
              }));
              if (value?.length) {
                removeErrorIfExists("state");
              }
            }}
            placeholder="Enter State"
            name="state"
            required
            className="text-sm"
          />
          {error?.state ? (
            <p className="text-sm text-destructive">State is required</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="gap-0">
          Pincode<span className="text-destructive">*</span>
        </Label>
        <Input
          onBlur={handleInputBlur}
          type="text"
          value={shippingDetails.pincode}
          onChange={(e) => {
            const value = e.target.value.trim();
            setShippingDetails((prev) => ({
              ...prev,
              pincode: e.target.value,
            }));
            if (value?.length) {
              removeErrorIfExists("pincode");
            }
          }}
          placeholder="Pincode"
          name="pincode"
          required
          className="text-sm"
        />
        {error?.pincode ? (
          <p className="text-sm text-destructive">{error?.pincode}</p>
        ) : null}
      </div>

      {shippingDetails?.pincode && shippingDetails?.pincode?.length === 6 ? (
        <DeliveryOptions
          deliveryPincode={shippingDetails?.pincode}
          onSelect={(
            deliveryType: DeliveryType,
            deliveryDetails?: deliveryPartnerDetails | string
          ) => {
            handleDeliveryTypeChange(deliveryType);
            if (deliveryDetails && typeof deliveryDetails === "object")
              setDeliveryDetails(deliveryDetails);
          }}
          selectedDeliveryType={shippingDetails?.deliveryType}
          deliveryDetails={deliveryDetails}
        />
      ) : null}
    </div>
  );
}
