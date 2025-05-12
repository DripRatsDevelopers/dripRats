import useAddressForm from "@/hooks/useAddressForm";
import { ShippingInfo } from "@/types/Order";
import { Check, Loader2, MapPin } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface IAddressForm {
  shippingDetails: ShippingInfo;
  setShippingDetails?: Dispatch<SetStateAction<ShippingInfo>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
  savedAddresses?: ShippingInfo[];
  handleStepChange?: (direction: "next" | "prev") => void;
  isCheckoutForm?: boolean;
}

const AddressForm = ({
  shippingDetails,
  setShippingDetails,
  setOpen,
  savedAddresses,
  handleStepChange,
  isCheckoutForm = true,
}: IAddressForm) => {
  const {
    disableConfirm,
    handleInputBlur,
    error,
    getCurrentLocation,
    removeErrorIfExists,
    updateAddress,
    deliveryOptions,
    setDeliveryOptions,
    fetchingDeliveryTime,
    updatedAddress,
    setUpdatedAddress,
  } = useAddressForm({ shippingDetails, setShippingDetails, isCheckoutForm });
  return (
    <>
      <div className="space-y-3 p-2 rounded-lg">
        <Button
          onClick={getCurrentLocation}
          variant="outline"
          title="Use Current Location"
        >
          <MapPin size={18} />
          Auto Detect My Location
        </Button>
        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label className="gap-0">
              Full Name<span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="Full Name"
              name="fullName"
              value={updatedAddress.fullName}
              onChange={(e) => {
                const value = e.target.value.trim();
                setUpdatedAddress((prev) => ({
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
              Phone No<span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="Phone"
              name="phone"
              value={updatedAddress.phone}
              onChange={(e) => {
                const value = e.target.value.trim();
                setUpdatedAddress((prev) => ({
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
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label className="gap-0">
              House/Flat No<span className="text-destructive">*</span>
            </Label>
            <Input
              onBlur={handleInputBlur}
              type="text"
              value={updatedAddress.houseNumber}
              onChange={(e) => {
                const value = e.target.value.trim();
                setUpdatedAddress((prev) => ({
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
              value={updatedAddress.street}
              onChange={(e) => {
                const value = e.target.value.trim();
                setUpdatedAddress((prev) => ({
                  ...prev,
                  street: e.target.value,
                }));
                if (value?.length) {
                  removeErrorIfExists("streetName");
                }
              }}
              placeholder="Enter Street name"
              name="streetName"
              required
              className="text-sm"
            />
            {error?.streetName ? (
              <p className="text-sm text-destructive">
                Street Name is required
              </p>
            ) : null}
          </div>
        </div>

        <Label className="gap-0">Landmark (Optional)</Label>
        <Input
          type="text"
          value={updatedAddress.landmark}
          onChange={(e) => {
            setUpdatedAddress((prev) => ({
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
          value={updatedAddress.area}
          onChange={(e) => {
            const value = e.target.value.trim();
            setUpdatedAddress((prev) => ({
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
              value={updatedAddress.city}
              onChange={(e) => {
                const value = e.target.value.trim();
                setUpdatedAddress((prev) => ({
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
              value={updatedAddress.state}
              onChange={(e) => {
                const value = e.target.value.trim();

                setUpdatedAddress((prev) => ({
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
          <div className="relative">
            <Input
              onBlur={handleInputBlur}
              type="text"
              value={updatedAddress.pincode}
              onChange={(e) => {
                const value = e.target.value.trim();
                setUpdatedAddress((prev) => ({
                  ...prev,
                  pincode: e.target.value,
                }));
                setDeliveryOptions(undefined);
                if (value?.length) {
                  removeErrorIfExists("pincode");
                }
              }}
              placeholder="Pincode"
              name="pincode"
              required
              className="text-sm"
            />
            {fetchingDeliveryTime ? (
              <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
            ) : null}
            {deliveryOptions?.etd ? (
              <Check className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full p-1 text-white bg-green-500" />
            ) : null}
          </div>

          {error?.pincode ? (
            <p className="text-sm text-destructive">{error?.pincode}</p>
          ) : null}
          {!error?.pincode &&
          !fetchingDeliveryTime &&
          !deliveryOptions?.etd &&
          updatedAddress.pincode?.length === 6 &&
          isCheckoutForm ? (
            <p className="text-sm text-destructive">Pincode not serviceable</p>
          ) : null}
        </div>

        <div className="flex items-center gap-4">
          <Button
            disabled={disableConfirm}
            onClick={async () => {
              setOpen(false);
              await updateAddress();
              if (isCheckoutForm && handleStepChange) handleStepChange("next");
              if (setShippingDetails)
                setShippingDetails({
                  ...updatedAddress,
                });
            }}
            className="mt-2"
          >
            {isCheckoutForm ? "Save & Deliver Here" : "Save"}
          </Button>
          {savedAddresses?.length !== 0 || !isCheckoutForm ? (
            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
              className="mt-2"
            >
              Cancel
            </Button>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default AddressForm;
