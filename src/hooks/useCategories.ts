import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/services/categoryService';
import type { UpdateCategoryRequest } from '@/types/category';

// Query hooks
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCategoryById = (id: number) => {
  return useQuery({
    queryKey: ['categories', id],
    queryFn: () => getCategoryById(id),
    enabled: !!id,
  });
};

// Mutation hooks
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Tạo danh mục thành công!', {
        description: response.message || 'Danh mục đã được thêm.',
      });
    },
    onError: (error: Error) => {
      toast.error('Tạo danh mục thất bại', {
        description: error.message || 'Đã xảy ra lỗi khi tạo danh mục.',
      });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCategoryRequest }) =>
      updateCategory(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories', variables.id] });
      toast.success('Cập nhật danh mục thành công!', {
        description: response.message || 'Danh mục đã được cập nhật.',
      });
    },
    onError: (error: Error) => {
      toast.error('Cập nhật danh mục thất bại', {
        description: error.message || 'Đã xảy ra lỗi khi cập nhật danh mục.',
      });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Xóa danh mục thành công!', {
        description: response.message || 'Danh mục đã được xóa.',
      });
    },
    onError: (error: Error) => {
      toast.error('Xóa danh mục thất bại', {
        description: error.message || 'Đã xảy ra lỗi khi xóa danh mục.',
      });
    },
  });
};
