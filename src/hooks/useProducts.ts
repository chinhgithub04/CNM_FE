import { useQuery } from '@tanstack/react-query';
import { getProducts, getProductById } from '@/services/productService';

export const useProducts = (page: number = 1, limit: number = 10) => {
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
