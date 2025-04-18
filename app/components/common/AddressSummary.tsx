import { ShippingInfo } from "@/types/Order";
import { Button } from "../ui/button";

interface IAddressSummary {
  shippingDetails: ShippingInfo;
  onEditClick: () => void;
  showEdit?: boolean;
}

const AddressSummary = ({
  shippingDetails,
  onEditClick,
  showEdit = true,
}: IAddressSummary) => {
  return (
    <div className="relative p-2 w-full space-y-1">
      <p>
        <b>
          {shippingDetails?.fullName} - {shippingDetails?.phone}
        </b>
      </p>
      <p>
        {shippingDetails.houseNumber}, {shippingDetails.street}
      </p>
      <p>
        {shippingDetails.city}, {shippingDetails.state} -{" "}
        <b>{shippingDetails.pincode}</b>
      </p>
      {showEdit ? (
        <Button
          variant="outline"
          size="sm"
          className="absolute top-[-0.5rem] right-0"
          onClick={onEditClick}
        >
          Edit
        </Button>
      ) : null}
    </div>
  );
};

export default AddressSummary;
