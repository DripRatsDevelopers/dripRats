"use client";

import { Label } from "@/components/ui/label";
import { NEW_ADRESS_ID } from "@/constants/DeliveryConstants";
import { ShippingInfo } from "@/types/Order";
import { NotepadText } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import AddressForm from "./AddressForm";
import AddressSummary from "./AddressSummary";

export const SELECTED_ADDRESS = "SELECTED_ADDRESS";

export default function SavedAddress({
  setShippingDetails,
  shippingDetails,
  savedAddresses,
  setOpen,
  open,
  handleStepChange,
}: {
  setShippingDetails: Dispatch<SetStateAction<ShippingInfo>>;
  shippingDetails: ShippingInfo;
  savedAddresses?: ShippingInfo[];
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
  handleStepChange: (direction: "next" | "prev") => void;
}) {
  return shippingDetails ? (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground text-center flex items-center gap-1 justify-center">
        <NotepadText size={18} /> You can save upto five addresses
      </p>
      <RadioGroup
        onValueChange={(value) => {
          const address = savedAddresses?.length
            ? savedAddresses?.find((addr) => addr.id === value)
            : [];
          setShippingDetails({ ...shippingDetails, ...address });
          setOpen(false);
        }}
        value={shippingDetails?.id}
      >
        <div className="overflow-y-auto flex flex-col  w-full  gap-4">
          {savedAddresses?.length
            ? savedAddresses.map((addr) => {
                const showAddressForm =
                  open && shippingDetails?.id === addr?.id;
                return (
                  <>
                    <Label className="font-normal" key={addr.id}>
                      <Card
                        key={addr.id}
                        className={`py-2 px-2 block border w-full  ${
                          shippingDetails?.id === addr.id
                            ? "border-primary bg-gray-50"
                            : "border-muted"
                        }`}
                      >
                        <div className="flex items-center gap-2" key={addr.id}>
                          <RadioGroupItem
                            value={addr.id || ""}
                            id={addr.id || ""}
                            checked={addr.id === shippingDetails?.id}
                            key={addr.id}
                          />
                          {showAddressForm ? (
                            <p className="text-md font-semibold">
                              Edit Address
                            </p>
                          ) : null}
                        </div>

                        <CardContent className="px-2 py-1 w-full">
                          {!showAddressForm ? (
                            <>
                              <AddressSummary
                                shippingDetails={addr}
                                showEdit={addr.id === shippingDetails?.id}
                                onEditClick={() => setOpen(true)}
                              />
                              {addr.id === shippingDetails?.id ? (
                                <Button
                                  onClick={async () => {
                                    handleStepChange("next");
                                  }}
                                  className="mt-2"
                                >
                                  Deliver Here
                                </Button>
                              ) : null}
                            </>
                          ) : null}
                          {showAddressForm ? (
                            <AddressForm
                              shippingDetails={shippingDetails}
                              setShippingDetails={setShippingDetails}
                              setOpen={setOpen}
                              handleStepChange={handleStepChange}
                            />
                          ) : null}
                        </CardContent>
                      </Card>
                    </Label>
                  </>
                );
              })
            : null}
          {open && shippingDetails?.id === NEW_ADRESS_ID ? (
            <Label className="font-normal" key={NEW_ADRESS_ID}>
              <Card
                key={NEW_ADRESS_ID}
                className={`py-2 px-2 block border w-full  ${
                  shippingDetails?.id === NEW_ADRESS_ID
                    ? "border-primary bg-gray-50"
                    : "border-muted"
                }`}
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem
                    value={NEW_ADRESS_ID}
                    id={NEW_ADRESS_ID}
                    checked={NEW_ADRESS_ID === shippingDetails?.id}
                    key={NEW_ADRESS_ID}
                  />
                  <p className="text-md font-semibold">Add new address</p>
                </div>
                <CardContent className="px-2 py-1 w-full">
                  <AddressForm
                    shippingDetails={shippingDetails}
                    setShippingDetails={setShippingDetails}
                    setOpen={setOpen}
                    savedAddresses={savedAddresses}
                    handleStepChange={handleStepChange}
                  />
                </CardContent>
              </Card>
            </Label>
          ) : null}
        </div>
      </RadioGroup>
    </div>
  ) : null;
}
