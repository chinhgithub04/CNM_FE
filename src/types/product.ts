// Product types based on backend product_router.py

export interface PriceItem {
  Id: number;
  Number: number;
  Price: number;
  ProductTypeId: number;
}

export interface ProductType {
  Id: number;
  Name: string;
  Quantity: number;
  ImageUrl: string | null;
  ProductId: number;
  Status: number;
  Price?: string;
  Number?: number;
  price_item?: PriceItem | null;
}

export interface ProductImage {
  Id: number;
  Url: string;
  Description: string | null;
  ProductId: number;
}

export interface Product {
  Id: number;
  Name: string;
  Description: string | null;
  CreateAt: string;
  CategoryId: number;
  Status: number;
  ProductTypes: ProductType[];
  Images: ProductImage[];
}

export interface ProductCreate {
  Name: string;
  Description?: string;
  CategoryId: number;
  Status?: number;
  Images?: {
    Url: string;
    Description?: string;
  }[];
  ProductTypes?: {
    Name: string;
    Quantity: number;
    ImageUrl?: string;
    Price?: number;
    Number?: number;
  }[];
}

export interface ProductUpdate {
  Name?: string;
  Description?: string;
  CategoryId?: number;
  Status?: number;
}
