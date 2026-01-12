import apiClient from './apiClient';
import type { Category } from '@/types/category';
import type { Response } from '@/types/common';

export const getCategories = async (): Promise<Response<Category[]>> => {
  const response = await apiClient.get<Response<Category[]>>('/categories');
  return response.data;
};
