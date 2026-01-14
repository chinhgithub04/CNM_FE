import apiClient from './apiClient';
import type {
  Invoice,
  InvoiceCreate,
  InvoiceCreateResponse,
  InvoiceAdminUpdate,
} from '@/types/invoice';
import type { Response } from '@/types/common';

export const createInvoice = async (
  data: InvoiceCreate
): Promise<Response<InvoiceCreateResponse>> => {
  const response = await apiClient.post<Response<InvoiceCreateResponse>>(
    '/invoices',
    data
  );
  return response.data;
};

export const getMyInvoices = async (): Promise<Response<Invoice[]>> => {
  const response = await apiClient.get<Response<Invoice[]>>('/invoices');
  return response.data;
};

export const getAllInvoices = async (
  status?: number
): Promise<Response<Invoice[]>> => {
  const params = status !== undefined ? { status } : {};
  const response = await apiClient.get<Response<Invoice[]>>('/invoices/all', {
    params,
  });
  return response.data;
};

export const getInvoiceById = async (
  invoiceId: number
): Promise<Response<Invoice>> => {
  const response = await apiClient.get<Response<Invoice>>(
    `/invoices/${invoiceId}`
  );
  return response.data;
};

export const getInvoiceByIdAdmin = async (
  invoiceId: number
): Promise<Response<Invoice>> => {
  const response = await apiClient.get<Response<Invoice>>(
    `/invoices/${invoiceId}/admin`
  );
  return response.data;
};

export const updateInvoice = async (
  invoiceId: number,
  data: InvoiceAdminUpdate
): Promise<Response<Invoice>> => {
  const response = await apiClient.put<Response<Invoice>>(
    `/invoices/${invoiceId}`,
    data
  );
  return response.data;
};

export const deleteInvoice = async (
  invoiceId: number
): Promise<Response<null>> => {
  const response = await apiClient.delete<Response<null>>(
    `/invoices/${invoiceId}`
  );
  return response.data;
};
