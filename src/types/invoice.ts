export interface InvoiceItemCreate {
  ProductTypeId: number;
  Quantity: number;
  Amount: number;
}

export interface InvoiceCreate {
  Address: string;
  Items: InvoiceItemCreate[];
  VoucherId?: number;
  Notes?: string;
}

export interface InvoiceItem {
  InvoiceId: number;
  ProductTypeId: number;
  Quantity: number;
  Amount: number;
  ProductName?: string;
  ProductTypeName?: string;
  ProductTypeImageUrl?: string;
}

export interface Invoice {
  Id: number;
  UserId: string;
  Address: string;
  Status: number;
  CreateAt: string;
  Total: number;
  VoucherId?: number;
  PaymentIntentId: string;
  Notes?: string;
  Items: InvoiceItem[];
}

export interface InvoiceCreateResponse extends Invoice {
  ClientSecret: string;
}

export interface InvoiceAdminUpdate {
  Status?: number;
  Address?: string;
  Notes?: string;
}

// Status constants
export const InvoiceStatus = {
  PENDING: 1,
  CONFIRMED: 2,
  SHIPPING: 3,
  DELIVERED: 4,
  CANCELLED: 5,
} as const;

export const InvoiceStatusLabels: Record<number, string> = {
  1: 'Chờ xử lý',
  2: 'Đã xác nhận',
  3: 'Đang giao',
  4: 'Đã giao',
  5: 'Đã hủy',
};

export const InvoiceStatusColors: Record<
  number,
  'yellow' | 'blue' | 'green' | 'purple' | 'cyan' | 'red'
> = {
  1: 'yellow',
  2: 'blue',
  3: 'purple',
  4: 'green',
  5: 'red',
};
