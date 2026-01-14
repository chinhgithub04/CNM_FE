import apiClient from './apiClient';
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@/types/category';
import type { Response } from '@/types/common';

export const getCategories = async (): Promise<Response<Category[]>> => {
  const response = await apiClient.get<Response<Category[]>>('/categories');
  return response.data;
};

export const createCategory = async (
  data: CreateCategoryRequest
): Promise<Response<Category>> => {
  const formData = new FormData();
  formData.append('Name', data.Name);
  formData.append('Description', data.Description);
  formData.append('Status', (data.Status ?? 1).toString());
  formData.append('Image', data.Image);

  const response = await apiClient.post<Response<Category>>(
    '/categories',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

export const updateCategory = async (
  id: number,
  data: UpdateCategoryRequest
): Promise<Response<Category>> => {
  const formData = new FormData();

  if (data.Name !== undefined) {
    formData.append('Name', data.Name);
  }
  if (data.Description !== undefined) {
    formData.append('Description', data.Description);
  }
  if (data.Status !== undefined) {
    formData.append('Status', data.Status.toString());
  }
  if (data.Image) {
    formData.append('Image', data.Image);
  }

  const response = await apiClient.put<Response<Category>>(
    `/categories/${id}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

export const deleteCategory = async (id: number): Promise<Response<null>> => {
  const response = await apiClient.delete<Response<null>>(`/categories/${id}`);
  return response.data;
};
