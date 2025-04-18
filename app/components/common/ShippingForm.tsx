"use client";

import { Button } from "@/components/ui/button";
import {
  MAX_SAVED_ADDRESS,
  NEW_ADRESS_ID,
} from "@/constants/DeliveryConstants";
import useShippingForm from "@/hooks/useShippingForm";
import { Plus } from "lucide-react";
import SavedAddress from "./SavedAddressDialog";

export const SELECTED_ADDRESS = "SELECTED_ADDRESS";

export default function ShippingForm({
  addressData,
  handleStepChange,
}: {
  addressData: ReturnType<typeof useShippingForm>;
  handleStepChange: (direction: "next" | "prev") => Promise<void>;
}) {
  const {
    shippingDetails,
    setShippingDetails,
    savedAddresses,
    setDeliveryOptions,
    open,
    setOpen,
  } = addressData;

  return (
    <div className="flex flex-col justify-center space-y-3 w-full">
      <SavedAddress
        setShippingDetails={setShippingDetails}
        shippingDetails={shippingDetails}
        savedAddresses={savedAddresses}
        open={open}
        setOpen={setOpen}
        handleStepChange={handleStepChange}
      />

      {(!savedAddresses || savedAddresses?.length < MAX_SAVED_ADDRESS) &&
      !open ? (
        <Button
          variant="outline"
          onClick={() => {
            setShippingDetails({
              fullName: "",
              phone: "",
              id: NEW_ADRESS_ID,
              houseNumber: "",
              street: "",
              area: "",
              city: "",
              state: "",
              pincode: "",
            });
            setDeliveryOptions(undefined);
            setOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" /> Add New Address
        </Button>
      ) : null}
    </div>
  );
}
