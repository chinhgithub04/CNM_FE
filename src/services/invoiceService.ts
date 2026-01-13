import apiClient from './apiClient';
import type {
    Invoice,
    CreateInvoiceRequest,
    UpdateInvoiceRequest,
    InvoiceStats,
} from '@/types/invoice';
import type { Response } from '@/types/common';

/**
 * Get all invoices (for admin)
 */
export const getInvoices = async (): Promise<Response<Invoice[]>> => {
    const response = await apiClient.get<Response<Invoice[]>>('/invoices/all');
    return response.data;
};

/**
 * Get invoice by ID
 */
export const getInvoiceById = async (id: number): Promise<Response<Invoice>> => {
    const response = await apiClient.get<Response<Invoice>>(`/invoices/${id}`);
    return response.data;
};

/**
 * Create new invoice
 */
export const createInvoice = async (
    data: CreateInvoiceRequest
): Promise<Response<Invoice>> => {
    const response = await apiClient.post<Response<Invoice>>('/invoices', data);
    return response.data;
};

/**
 * Update invoice
 */
export const updateInvoice = async (
    id: number,
    data: UpdateInvoiceRequest
): Promise<Response<Invoice>> => {
    const response = await apiClient.put<Response<Invoice>>(
        `/invoices/${id}`,
        data
    );
    return response.data;
};

/**
 * Delete invoice
 */
export const deleteInvoice = async (id: number): Promise<Response<void>> => {
    const response = await apiClient.delete<Response<void>>(`/invoices/${id}`);
    return response.data;
};

/**
 * Update invoice status
 */
export const updateInvoiceStatus = async (
    id: number,
    status: string
): Promise<Response<Invoice>> => {
    const response = await apiClient.put<Response<Invoice>>(
        `/invoices/${id}/status`,
        { Status: status }
    );
    return response.data;
};

/**
 * Get invoice statistics
 */
export const getInvoiceStats = async (): Promise<Response<InvoiceStats>> => {
    const response = await apiClient.get<Response<InvoiceStats>>(
        '/invoices/stats'
    );
    return response.data;
};
