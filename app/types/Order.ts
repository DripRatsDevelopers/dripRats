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

export interface OrderItem {
  ProductId: string;
  Quantity: number;
  Price: number;
  Name: string;
  DiscountPerItem: number;
}

export interface OrderDetails {
  OrderId: string;
  Status: OrderEnum;
  Items: Array<{
    Price: number;
    ProductId: string;
    Quantity: number;
    DiscountPerItem?: number;
  }>;
  FirstItemImage: string;
  FirstItemName: string;
  ShippingAddress: string;
  TotalAmount: number;
  CreatedAt: string;
  ShiprocketOrderId: string;
  ShiprocketShipmentId: string;
  ShiprocketAwb: string;
  CourierName: string;
}

export type ShiprocketOrderInput = {
  OrderId: string;
  CreatedAt: string;
  fullName: string;
  ShippingAddress: string;
  TotalAmount: number;
  Items: OrderItem[];
  Email: string;
  ShippingCharge: number;
};

export type ShipmentTrackingData = {
  awb_code: string;
  courier_name: string;
  tracking_data?: {
    shipment_track_activities: {
      date?: string;
      activity?: string;
      location?: string;
    }[];
  };
};

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
