import apiClient from './apiClient';
import type { Product, ProductCreate, ProductUpdate } from '@/types/product';
import type { Response } from '@/types/common';

export const getProducts = async (
  page: number = 1,
  limit: number = 10
): Promise<Response<Product[]>> => {
  const response = await apiClient.get<Response<Product[]>>('/products', {
    params: { page, limit },
  });
  return response.data;
};

export const getProductById = async (
  id: number
): Promise<Response<Product>> => {
  const response = await apiClient.get<Response<Product>>(`/products/${id}`);
  return response.data;
};

export const createProduct = async (
  data: FormData
): Promise<Response<Product>> => {
  const response = await apiClient.post<Response<Product>>('/products', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateProduct = async (
  id: number,
  data: ProductUpdate
): Promise<Response<Product>> => {
  const response = await apiClient.put<Response<Product>>(
    `/products/${id}`,
    data
  );
  return response.data;
};

export const deleteProduct = async (id: number): Promise<Response<null>> => {
  const response = await apiClient.delete<Response<null>>(`/products/${id}`);
  return response.data;
};
