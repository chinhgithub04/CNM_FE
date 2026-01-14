// Category types based on backend category_router.py

export interface Category {
  Id: number;
  Name: string;
  Description: string | null;
  ImageUrl: string | null;
  CreateAt: string;
  Status: number;
}

export interface CategoryCreate {
  Name: string;
  Description?: string;
  ImageUrl?: string;
  Status?: number;
}

export interface CategoryUpdate {
  Name?: string;
  Description?: string;
  ImageUrl?: string;
  Status?: number;
}
