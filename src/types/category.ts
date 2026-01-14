// Category types based on backend category_router.py

export interface Category {
  Id: number;
  Name: string;
  Description: string | null;
  ImageUrl: string | null;
  CreateAt: string;
  Status: number;
}

// For creating category - backend expects FormData with file upload
export interface CreateCategoryRequest {
  Name: string;
  Description: string;
  Status?: number;
  Image: File;
}

// For updating category - backend expects FormData with optional file upload
export interface UpdateCategoryRequest {
  Name?: string;
  Description?: string;
  Status?: number;
  Image?: File;
}
