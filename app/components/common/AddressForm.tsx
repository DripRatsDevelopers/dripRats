"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addressDetails } from "@/types/Order";
import { Compass, Edit, MapPin, X } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { RadioGroupItem } from "../ui/radio-group";
import useAddressForm from "./useAddressForm";

export const SELECTED_ADDRESS = "SELECTED_ADDRESS";

export default function AddressForm({
  onSelectAddress,
  selectedAddress,
  selectedAddressId,
}: {
  onSelectAddress: (data: addressDetails) => void;
  selectedAddress?: addressDetails;
  selectedAddressId?: string;
}) {
  const {
    deliveryDetails,
    setDeliveryDetails,
    showSuggestions,
    suggestions,
    setShowSuggestions,
    disableConfirm,
    handleSelect,
    handleInputBlur,
    handleClear,
    error,
    open,
    setOpen,
    getCurrentLocation,
    setValue,
    removeErrorIfExists,
  } = useAddressForm();

  return (
    <div className="flex justify-center w-full">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {!selectedAddress?.pincode ? (
            <Button variant="outline" className="flex items-center gap-2">
              <MapPin size={18} />
              Select New Address
            </Button>
          ) : (
            <div>
              <p className="font-semibold mb-2 text-sm">Selected Address</p>
              <Label className="font-normal">
                <Card
                  className={`py-2 px-2 min-w-[200px] max-w-[250px] text-sm flex flex-row items-start ${
                    selectedAddressId === SELECTED_ADDRESS
                      ? "border-primary"
                      : "border-muted"
                  }`}
                >
                  <RadioGroupItem
                    value={SELECTED_ADDRESS}
                    id={SELECTED_ADDRESS}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    checked={selectedAddressId === SELECTED_ADDRESS}
                  />
                  <CardContent className="px-0 py-0">
                    <p>
                      {selectedAddress.houseNumber}, {selectedAddress.street}
                    </p>
                    <p>
                      {selectedAddress.area},
                      {selectedAddress?.landmark ? (
                        <>{selectedAddress?.landmark},</>
                      ) : (
                        ""
                      )}
                    </p>
                    <p>
                      {selectedAddress.city}, {selectedAddress.state} -{" "}
                      {selectedAddress.pincode}
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Edit size={18} /> Edit Address
                    </Button>
                  </CardContent>
                </Card>
              </Label>
            </div>
          )}
        </DialogTrigger>
        <DialogContent className="max-w-md p-6">
          <DialogTitle className="mb-3">Enter Delivery Address</DialogTitle>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Search Address</Label>
              <div className="relative">
                <Input
                  type="text"
                  value={deliveryDetails?.address}
                  onChange={(e) => {
                    setValue(e.target.value);
                    setDeliveryDetails((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }));
                  }}
                  placeholder="Search Address...."
                  className="w-full"
                  onBlur={() => {
                    setShowSuggestions(false);
                  }}
                  onFocus={() => {
                    setShowSuggestions(true);
                  }}
                  autoFocus
                />
                {deliveryDetails?.address && (
                  <Button
                    variant="link"
                    size="icon"
                    onClick={handleClear}
                    className="absolute cursor-pointer bg-white dark:bg-black right-0 top-1/2 -translate-y-1/2 p-0"
                  >
                    <X className="w-2 h-2" />
                  </Button>
                )}
              </div>

              {suggestions.status === "OK" && showSuggestions && (
                <ul
                  className="bg-white dark:bg-black border rounded shadow-md mt-1 max-h-40 overflow-y-auto absolute w-[90%] shadow-sm suggestions-list"
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
                Can&#39;t find your address? You can still enter it manually
                below.
              </p>
            </div>

            <Label className="gap-0">
              House/Flat Number<span className="text-destructive">*</span>
            </Label>
            <Input
              onBlur={handleInputBlur}
              type="text"
              value={deliveryDetails.houseNumber}
              onChange={(e) => {
                const value = e.target.value.trim();
                setDeliveryDetails((prev) => ({
                  ...prev,
                  houseNumber: value,
                }));
                if (value?.length) {
                  removeErrorIfExists("houseNumber");
                }
              }}
              placeholder="Enter House number"
              name="houseNumber"
            />
            {error?.houseNumber ? (
              <p className="text-sm text-destructive">
                House/Flat Number is required
              </p>
            ) : null}
            <Label className="gap-0">
              Street Name<span className="text-destructive">*</span>
            </Label>
            <Input
              onBlur={handleInputBlur}
              type="text"
              value={deliveryDetails.street}
              onChange={(e) =>
                setDeliveryDetails((prev) => ({
                  ...prev,
                  street: e.target.value.trim(),
                }))
              }
              placeholder="Enter Street name"
              name="streetName"
            />
            {error?.streetName ? (
              <p className="text-sm text-destructive">
                Street Name is required
              </p>
            ) : null}
            <Label className="gap-0">Landmark (Optional)</Label>
            <Input
              onBlur={handleInputBlur}
              type="text"
              value={deliveryDetails.landmark}
              onChange={(e) => {
                const value = e.target.value.trim();
                setDeliveryDetails((prev) => ({
                  ...prev,
                  landmark: value,
                }));
              }}
              placeholder="Enter nearby landmark"
            />

            <Label className="gap-0">
              Area / Village<span className="text-destructive">*</span>
            </Label>
            <Input
              onBlur={handleInputBlur}
              type="text"
              value={deliveryDetails.area}
              onChange={(e) => {
                const value = e.target.value.trim();
                setDeliveryDetails((prev) => ({
                  ...prev,
                  area: value,
                }));
                if (value?.length) {
                  removeErrorIfExists("area");
                }
              }}
              placeholder="Enter Area/Village"
              name="area"
            />
            {error?.area ? (
              <p className="text-sm text-destructive">Area is required</p>
            ) : null}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="gap-0">
                  City / District<span className="text-destructive">*</span>
                </Label>
                <Input
                  onBlur={handleInputBlur}
                  type="text"
                  value={deliveryDetails.city}
                  onChange={(e) => {
                    const value = e.target.value.trim();

                    setDeliveryDetails((prev) => ({
                      ...prev,
                      city: value,
                    }));

                    if (value?.length) {
                      removeErrorIfExists("city");
                    }
                  }}
                  placeholder="Enter City"
                  name="city"
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
                  value={deliveryDetails.state}
                  onChange={(e) => {
                    const value = e.target.value.trim();

                    setDeliveryDetails((prev) => ({
                      ...prev,
                      state: e.target.value.trim(),
                    }));
                    if (value?.length) {
                      removeErrorIfExists("state");
                    }
                  }}
                  placeholder="Enter State"
                  name="state"
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
                value={deliveryDetails.pincode}
                onChange={(e) => {
                  const value = e.target.value.trim();
                  setDeliveryDetails((prev) => ({
                    ...prev,
                    pincode: e.target.value.trim(),
                  }));
                  if (value?.length) {
                    removeErrorIfExists("pincode");
                  }
                }}
                placeholder="Pincode"
                name="pincode"
              />
              {error?.pincode ? (
                <p className="text-sm text-destructive">{error?.pincode}</p>
              ) : null}
            </div>

            <Button
              onClick={getCurrentLocation}
              variant="outline"
              className="w-full mt-2 flex items-center gap-2"
            >
              <Compass size={18} /> Use Current Location
            </Button>

            <Button
              onClick={() => {
                onSelectAddress({ ...deliveryDetails, id: SELECTED_ADDRESS });
                setOpen(false);
              }}
              className="w-full mt-2"
              disabled={disableConfirm}
            >
              Confirm Address
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
