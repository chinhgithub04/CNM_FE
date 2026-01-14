import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createInvoice,
  getMyInvoices,
  getAllInvoices,
  getInvoiceById,
  getInvoiceByIdAdmin,
  updateInvoice,
  deleteInvoice,
} from '@/services/invoiceService';
import type { InvoiceCreate, InvoiceAdminUpdate } from '@/types/invoice';

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InvoiceCreate) => createInvoice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Tạo đơn hàng thành công');
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

export const useAllInvoices = (status?: number) => {
  return useQuery({
    queryKey: ['invoices', 'all', status],
    queryFn: () => getAllInvoices(status),
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

export const useInvoiceAdmin = (invoiceId: number) => {
  return useQuery({
    queryKey: ['invoice', 'admin', invoiceId],
    queryFn: () => getInvoiceByIdAdmin(invoiceId),
    enabled: invoiceId > 0,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: InvoiceAdminUpdate }) =>
      updateInvoice(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({
        queryKey: ['invoice', 'admin', variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['invoice', variables.id],
      });
      toast.success('Cập nhật đơn hàng thành công');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Không thể cập nhật đơn hàng'
      );
    },
  });
};

export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invoiceId: number) => deleteInvoice(invoiceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Xóa đơn hàng thành công');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Không thể xóa đơn hàng');
    },
  });
};
