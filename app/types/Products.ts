export interface Product {
  ProductId: string;
  Name: string;
  Price: number;
  ImageUrls: string[];
  Category?: string;
  Description: string;
  DiscountedPrice?: number;
}

export interface SearchIndex {
  ProductId: string;
  Name: string;
  Category: string;
  Tags: string[];
  Price: number;
  DiscountedPrice: number;
}

export interface InventoryItem {
  ProductId: string;
  Stock: number;
}
