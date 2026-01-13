import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '@/services/productService';
import type { UpdateProductRequest } from '@/types/product';

// Query hooks
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProductById = (id: number) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
};

// Mutation hooks
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Tạo sản phẩm thành công!', {
        description: response.message || 'Sản phẩm đã được thêm.',
      });
    },
    onError: (error: Error) => {
      toast.error('Tạo sản phẩm thất bại', {
        description: error.message || 'Đã xảy ra lỗi khi tạo sản phẩm.',
      });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProductRequest }) =>
      updateProduct(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', variables.id] });
      toast.success('Cập nhật sản phẩm thành công!', {
        description: response.message || 'Sản phẩm đã được cập nhật.',
      });
    },
    onError: (error: Error) => {
      toast.error('Cập nhật sản phẩm thất bại', {
        description: error.message || 'Đã xảy ra lỗi khi cập nhật sản phẩm.',
      });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Xóa sản phẩm thành công!', {
        description: response.message || 'Sản phẩm đã được xóa.',
      });
    },
    onError: (error: Error) => {
      toast.error('Xóa sản phẩm thất bại', {
        description: error.message || 'Đã xảy ra lỗi khi xóa sản phẩm.',
      });
    },
  });
};
