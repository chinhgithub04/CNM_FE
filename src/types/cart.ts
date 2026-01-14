export interface CartItem {
  CartId: number;
  ProductTypeId: number;
  Quantity: number;
  CreateAt: string;
  ProductType?: {
    Id: number;
    Name: string;
    ImageUrl: string | null;
    Price?: string;
    ProductId: number;
    Product?: {
      Id: number;
      Name: string;
    };
  };
}

export interface Cart {
  UserId: number;
  items: CartItem[];
}

export interface CartItemCreate {
  ProductTypeId: number;
  Quantity: number;
}
