import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '@/services/productService';
import type { ProductUpdate } from '@/types/product';

export const useProducts = (page: number = 1, limit: number = 100) => {
  return useQuery({
    queryKey: ['products', page, limit],
    queryFn: () => getProducts(page, limit),
    staleTime: 5 * 60 * 1000,
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Tạo sản phẩm thành công');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Không thể tạo sản phẩm');
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: FormData | ProductUpdate;
    }) => updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Cập nhật sản phẩm thành công');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Không thể cập nhật sản phẩm'
      );
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Xóa sản phẩm thành công');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Không thể xóa sản phẩm');
    },
  });
};
