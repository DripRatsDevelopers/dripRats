export enum OrderEnum {
  PENDING = "PENDING",
  PAID = "PAID",
  CONFIRMED = "CONFIRMED",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
}

export enum PaymentStatusEnum {
  INITIATED = "INITIATED",
  VERIFYING = "VERIFYING",
  PAID = "PAID",
  FAILED = "FAILED",
}

export interface ShippingInfo {
  fullName: string;
  houseNumber: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  deliveryType: string;
}
