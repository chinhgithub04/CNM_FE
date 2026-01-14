import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getInvoices,
    getInvoiceById,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    updateInvoiceStatus,
    getInvoiceStats,
} from '@/services/invoiceService';
import type {
    CreateInvoiceRequest,
    UpdateInvoiceRequest,
} from '@/types/invoice';

/**
 * Hook to fetch all invoices
 */
export const useInvoices = () => {
    return useQuery({
        queryKey: ['invoices'],
        queryFn: getInvoices,
    });
};

/**
 * Hook to fetch single invoice by ID
 */
export const useInvoice = (id: number) => {
    return useQuery({
        queryKey: ['invoices', id],
        queryFn: () => getInvoiceById(id),
        enabled: !!id,
    });
};

/**
 * Hook to fetch invoice statistics
 */
export const useInvoiceStats = () => {
    return useQuery({
        queryKey: ['invoices', 'stats'],
        queryFn: getInvoiceStats,
    });
};

/**
 * Hook to create new invoice
 */
export const useCreateInvoice = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateInvoiceRequest) => createInvoice(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
        },
    });
};

/**
 * Hook to update invoice
 */
export const useUpdateInvoice = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateInvoiceRequest }) =>
            updateInvoice(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
        },
    });
};

/**
 * Hook to delete invoice
 */
export const useDeleteInvoice = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteInvoice(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
        },
    });
};

/**
 * Hook to update invoice status
 */
export const useUpdateInvoiceStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: number; status: string }) =>
            updateInvoiceStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
        },
    });
};
