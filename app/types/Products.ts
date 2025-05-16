export interface Product {
  ProductId: string;
  Name: string;
  Price: number;
  ImageUrls: string[];
  Category?: string;
  Description: string;
  DiscountedPrice?: number;
  InStock?: boolean;
  DetailedDescription?: Record<string, string>;
}

export interface SearchIndex {
  ProductId: string;
  Name: string;
  Category: string;
  Tags: string[];
  Price: number;
  DiscountedPrice: number;
  ImageUrls: string[];
}

export interface InventoryItem {
  ProductId: string;
  Stock: number;
}
