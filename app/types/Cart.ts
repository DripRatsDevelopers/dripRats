import { Product } from "./Products";

export interface CartType extends Product {
  ProductId: string;
  quantity: number;
  Stock?: number;
}

export interface CartItem {
  ProductId: string;
  quantity: number;
}
