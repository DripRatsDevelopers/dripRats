import { Product } from "./Products";

export interface CartType extends Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  quantity: number;
}
