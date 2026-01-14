import apiClient from './apiClient';
import type {
  Invoice,
  InvoiceCreate,
  InvoiceCreateResponse,
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

export const getInvoiceById = async (
  invoiceId: number
): Promise<Response<Invoice>> => {
  const response = await apiClient.get<Response<Invoice>>(
    `/invoices/${invoiceId}`
  );
  return response.data;
};
