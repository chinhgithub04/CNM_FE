// Request types
export interface CreateCategoryRequest {
  Name: string;
  Description: string;  // Required by backend
  ImageUrl: string;     // Required by backend
}

export interface UpdateCategoryRequest {
  Name?: string;
  Description?: string;
  ImageUrl?: string;
  Status?: number;
}

// Response types
export interface Category {
  Id: number;
  Name: string;
  Description: string | null;
  ImageUrl: string | null;
  CreateAt: string;
  Status: number;
}
