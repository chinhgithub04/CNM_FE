import apiClient from './apiClient';
import type { Product } from '@/types/product';
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
