import type { Product, CreateProductRequest, UpdateProductRequest } from '@/types/product';
import type { Response } from '@/types/common';
import apiClient from './apiClient';

export const getProducts = async (): Promise<Response<Product[]>> => {
  const response = await apiClient.get<Response<Product[]>>('/products');
  return response.data;
};

export const getProductById = async (id: number): Promise<Response<Product>> => {
  const response = await apiClient.get<Response<Product>>(`/products/${id}`);
  return response.data;
};

export const createProduct = async (
  data: CreateProductRequest
): Promise<Response<Product>> => {
  const response = await apiClient.post<Response<Product>>('/products', data);
  return response.data;
};

export const updateProduct = async (
  id: number,
  data: UpdateProductRequest
): Promise<Response<Product>> => {
  const response = await apiClient.put<Response<Product>>(`/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id: number): Promise<Response<null>> => {
  const response = await apiClient.delete<Response<null>>(`/products/${id}`);
  return response.data;
};

export const uploadProductImages = async (
  productId: number,
  files: File[]
): Promise<Response<null>> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });
  const response = await apiClient.post<Response<null>>(
    `/products/${productId}/images`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

export const deleteProductImage = async (imageId: number): Promise<Response<null>> => {
  const response = await apiClient.delete<Response<null>>(`/products/images/${imageId}`);
  return response.data;
};
