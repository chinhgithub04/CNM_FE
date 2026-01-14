import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createInvoice,
  getMyInvoices,
  getInvoiceById,
} from '@/services/invoiceService';
import type { InvoiceCreate } from '@/types/invoice';

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InvoiceCreate) => createInvoice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Không thể tạo đơn hàng');
    },
  });
};

export const useInvoices = () => {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: getMyInvoices,
    staleTime: 5 * 60 * 1000,
  });
};

export const useInvoice = (invoiceId: number) => {
  return useQuery({
    queryKey: ['invoice', invoiceId],
    queryFn: () => getInvoiceById(invoiceId),
    enabled: invoiceId > 0,
    staleTime: 5 * 60 * 1000,
  });
};
