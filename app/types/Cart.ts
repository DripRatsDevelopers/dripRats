import { Product } from "./Products";

export interface CartType extends Product {
  ProductId: string;
  name: string;
  price: number;
  images: string[];
  quantity: number;
  Stock?: number;
}
