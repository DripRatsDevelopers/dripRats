// components/EditAddressDialog.tsx
"use client";

import AddressForm from "@/components/common/AddressForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { NEW_ADRESS_ID } from "@/constants/DeliveryConstants";
import { useMediaQuery } from "@/lib/mediaUtils";
import { ShippingInfo } from "@/types/Order";
import { Pencil, Plus } from "lucide-react";
import { useState } from "react";

interface EditAddressDialogProps {
  address?: ShippingInfo;
}

export function EditAddressDialog({ address }: EditAddressDialogProps) {
  const [open, setOpen] = useState(false);
  const updatedAddress = address || {
    id: NEW_ADRESS_ID,
    address: "",
    houseNumber: "",
    street: "",
    landmark: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
    fullName: "",
    phone: "",
  };
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {address ? (
          !isMobile ? (
            <Button size="icon" variant="ghost">
              <Pencil className="w-4 h-4" />
            </Button>
          ) : (
            <Button variant="outline">
              <Pencil className="w-4 h-4" />
              Edit Address
            </Button>
          )
        ) : (
          <Button variant="outline" className="w-full">
            <Plus /> Add a new address
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {address ? <>Edit Address</> : <>Add Address</>}
          </DialogTitle>
        </DialogHeader>
        <AddressForm
          shippingDetails={updatedAddress}
          setOpen={setOpen}
          isCheckoutForm={false}
        />
      </DialogContent>
    </Dialog>
  );
}
