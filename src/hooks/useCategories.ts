import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/services/categoryService';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000,
  });
};
