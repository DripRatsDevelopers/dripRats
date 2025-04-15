export enum OrderEnum {
  PENDING = "PENDING",
  PAID = "PAID",
  CONFIRMED = "CONFIRMED",
  SHIPPED = "SHIPPED",
  OUTFORDELIVERY = "OUTFORDELIVERY",
  DELIVERED = "DELIVERED",
}

export enum PaymentStatusEnum {
  INITIATED = "INITIATED",
  VERIFYING = "VERIFYING",
  PAID = "PAID",
  FAILED = "FAILED",
}

export interface addressDetails {
  id?: string;
  address?: string;
  houseNumber: string;
  street: string;
  landmark?: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
}

export interface UserShippingData {
  fullName: string;
  phone: string;
  deliveryType: DeliveryType;
}

export interface ShippingInfo extends addressDetails, UserShippingData {}

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
