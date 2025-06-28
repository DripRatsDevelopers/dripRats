import { OrderItem } from "./Order";

export interface OrderConfirmation {
  OrderId: string;
  Items: OrderItem[];
  TotalAmount: number;
  ShippingAddress: string;
  FirstItemImage?: string;
  Email: string;
  ShippingCharge: number;
}
