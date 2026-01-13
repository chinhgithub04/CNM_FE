// Invoice management types

export type InvoiceStatus = 'pending' | 'processing' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

// Request types
export interface CreateInvoiceRequest {
    CustomerId: string;
    Items: InvoiceItemInput[];
    Notes?: string;
    Status?: InvoiceStatus;
}

export interface UpdateInvoiceRequest {
    CustomerId?: string;
    Items?: InvoiceItemInput[];
    Notes?: string;
    Status?: InvoiceStatus;
}

export interface InvoiceItemInput {
    ProductId: number;
    ProductTypeId?: number;
    Quantity: number;
    Price: number;
}

// Response types
export interface Invoice {
    Id: number;
    OrderNumber: string;
    CustomerId: string;
    CustomerName: string;
    CustomerEmail?: string;
    TotalAmount: number;
    Status: InvoiceStatus;
    Notes?: string;
    Items: InvoiceItem[];
    CreatedAt: string;
    UpdatedAt: string;
}

export interface InvoiceItem {
    Id: number;
    InvoiceId: number;
    ProductId: number;
    ProductName: string;
    ProductTypeId?: number;
    ProductTypeName?: string;
    Quantity: number;
    Price: number;
    SubTotal: number;
}

// Helper types for UI
export interface InvoiceListItem extends Omit<Invoice, 'Items'> {
    itemCount: number;
    displayStatus: string;
    statusColor: 'yellow' | 'blue' | 'green' | 'purple' | 'cyan' | 'red';
}

export interface InvoiceStats {
    totalRevenue: number;
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
}

// Status translations
export const InvoiceStatusLabels: Record<InvoiceStatus, string> = {
    pending: 'Chờ xử lý',
    processing: 'Đang xử lý',
    paid: 'Đã thanh toán',
    shipped: 'Đã giao hàng',
    delivered: 'Đã nhận hàng',
    cancelled: 'Đã hủy',
};

export const InvoiceStatusColors: Record<InvoiceStatus, 'yellow' | 'blue' | 'green' | 'purple' | 'cyan' | 'red'> = {
    pending: 'yellow',
    processing: 'blue',
    paid: 'green',
    shipped: 'purple',
    delivered: 'cyan',
    cancelled: 'red',
};
