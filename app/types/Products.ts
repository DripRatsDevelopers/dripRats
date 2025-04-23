export interface Product {
  id: string;
  Name: string;
  Price: number;
  ImageUrls: string[];
  Category?: string;
  Description: string;
  DiscountPrice?: number;
}

export interface InventoryItem {
  ProductId: string;
  Stock: number;
}
