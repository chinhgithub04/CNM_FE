import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/category';
import type { Response } from '@/types/common';
import apiClient from './apiClient';

export const getCategories = async (): Promise<Response<Category[]>> => {
  const response = await apiClient.get<Response<Category[]>>('/categories');
  return response.data;
};

export const getCategoryById = async (id: number): Promise<Response<Category>> => {
  const response = await apiClient.get<Response<Category>>(`/categories/${id}`);
  return response.data;
};

export const createCategory = async (
  data: CreateCategoryRequest
): Promise<Response<Category>> => {
  const response = await apiClient.post<Response<Category>>('/categories', data);
  return response.data;
};

export const updateCategory = async (
  id: number,
  data: UpdateCategoryRequest
): Promise<Response<Category>> => {
  const response = await apiClient.put<Response<Category>>(`/categories/${id}`, data);
  return response.data;
};

export const deleteCategory = async (id: number): Promise<Response<null>> => {
  const response = await apiClient.delete<Response<null>>(`/categories/${id}`);
  return response.data;
};
