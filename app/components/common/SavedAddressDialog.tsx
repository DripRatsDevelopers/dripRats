"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { addressDetails, ShippingInfo } from "@/types/Order";
import { Separator } from "@radix-ui/react-select";
import { Dispatch, SetStateAction, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

export const SELECTED_ADDRESS = "SELECTED_ADDRESS";

export default function SavedAddress({
  setShippingDetails,
  shippingDetails,
  open,
  setOpen,
  savedAddresses,
}: {
  setShippingDetails: Dispatch<SetStateAction<ShippingInfo>>;
  shippingDetails: ShippingInfo;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  savedAddresses: addressDetails[];
}) {
  const [address, setAddress] = useState<addressDetails | undefined>({
    id: shippingDetails?.id,
    address: shippingDetails?.address,
    houseNumber: shippingDetails?.houseNumber,
    street: shippingDetails?.street,
    landmark: shippingDetails?.landmark,
    area: shippingDetails?.area,
    city: shippingDetails?.city,
    state: shippingDetails?.state,
    pincode: shippingDetails?.pincode,
  });

  return (
    <div className="flex flex-col justify-center w-full space-y-3 mt-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild></DialogTrigger>

        <DialogContent className="max-w-md p-6">
          <DialogTitle className="mb-3">Saved Addresses</DialogTitle>

          <div className="space-y-3">
            <RadioGroup
              onValueChange={(value) => {
                const address = savedAddresses.find(
                  (addr) => addr.id === value
                );
                setAddress(address);
              }}
            >
              <div className="overflow-y-auto flex flex-col w-full items-center gap-4">
                {savedAddresses.map((addr) => (
                  <Label className="font-normal" key={addr.id}>
                    <Card
                      key={addr.id}
                      className={`py-3 px-2 min-w-[200px] max-w-[250px] flex items-start flex-row border  ${
                        address?.id === addr.id
                          ? "border-primary bg-gray-50"
                          : "border-muted"
                      }`}
                    >
                      <RadioGroupItem
                        value={addr.id || ""}
                        id={addr.id || ""}
                        checked={addr.id === address?.id}
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
            </RadioGroup>

            <Button
              onClick={() => {
                if (address)
                  setShippingDetails({
                    fullName: shippingDetails.fullName,
                    phone: shippingDetails.phone,
                    deliveryType: shippingDetails?.deliveryType,
                    ...address,
                  });
                setOpen(false);
              }}
              className="w-full mt-2"
              disabled={!address?.pincode}
            >
              Confirm Address
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <div className="relative flex items-center my-1">
        <Separator className="flex-grow border" />
        <span className="mx-3 text-xs text-muted-foreground uppercase font-medium">
          OR
        </span>
        <Separator className="flex-grow border" />
      </div>
    </div>
  );
}
