export interface Response<T> {
  data: T | null;
  isSuccess: boolean;
  message: string;
  statusCode: number;
  errors: string[] | null;
}

export interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  pageSize: number;
  pageNumber: number;
  totalPages: number;
}

export interface PaginationQuery {
  pageNumber?: number;
  pageSize?: number;
}
