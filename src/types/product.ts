// Request types
export interface ProductTypeInput {
  Name: string;
  Quantity: number;
  ImageUrl?: string;
  Price: number;
  Number: number;
}

export interface ProductImageInput {
  Url: string;
  Description: string;
}

export interface CreateProductRequest {
  Name: string;
  Description: string;
  CreateAt: string;  // ISO date string - Required by backend
  CategoryId: number;
  Status?: number;
  Images?: ProductImageInput[];
  ProductTypes: ProductTypeInput[];  // Required by backend (min 1)
}

export interface UpdateProductRequest {
  Name?: string;
  Description?: string;
  CategoryId?: number;
  Status?: number;
}

// Response types
export interface ProductImage {
  Id: number;
  ImageUrl: string;
  ProductId: number;
}

export interface ProductType {
  Id: number;
  Name: string;
  Price: number;
  Stock: number;
  ProductId: number;
}

export interface Product {
  Id: number;
  Name: string;
  Description: string | null;
  CreateAt: string;
  CategoryId: number;
  Status: number;
  Images: ProductImage[];
  ProductTypes: ProductType[];
}
