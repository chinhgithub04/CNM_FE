export interface Response<T> {
  data: T | null;
  code: string;
  message: string;
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
