import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getMyCart,
  addToCart,
  updateCartItem,
  removeCartItem,
} from '@/services/cartService';
import type { CartItemCreate } from '@/types/cart';

export const useCart = () => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: getMyCart,
    staleTime: 1 * 60 * 1000,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (item: CartItemCreate) => addToCart(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Không thể thêm vào giỏ hàng'
      );
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productTypeId,
      quantity,
    }: {
      productTypeId: number;
      quantity: number;
    }) => updateCartItem(productTypeId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Đã cập nhật giỏ hàng');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Không thể cập nhật giỏ hàng'
      );
    },
  });
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productTypeId: number) => removeCartItem(productTypeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Đã xóa khỏi giỏ hàng');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Không thể xóa khỏi giỏ hàng'
      );
    },
  });
};
