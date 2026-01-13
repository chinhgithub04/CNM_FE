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
  Id: number;
  InvoiceId: number;
  ProductTypeId: number;
  Quantity: number;
  Amount: number;
  CreateAt: string;
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
