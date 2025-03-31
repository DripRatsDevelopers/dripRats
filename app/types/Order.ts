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
  deliveryType: DeliveryType;
}

export enum DeliveryType {
  STANDARD = "STANDARD",
  EXPRESS = "EXPRESS",
}

export interface deliveryPartnerDetails {
  name: string;
  price: number;
  estimatedDays: number;
  rating: number;
  id: string;
  etd: string;
}
export interface deliveryDetails {
  expressDelivery: deliveryPartnerDetails | string;
  standardDelivery: deliveryPartnerDetails | string;
}
