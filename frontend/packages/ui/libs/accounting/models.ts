// Accounting Models - Simplified Structure (similar to Operations)

// Core Invoice Models
export interface InvoiceForm {
  process: string;
  invoiceType: string;
  companyCode: string;
  customer: string;
  invoiceDate: string;
  dueDate: string;
  entryDate: string;
  currencyDate: string;
  currency: string;
  invoiceNumber: string;
  invoiceAmount: number;
  customerReference: string;
  batchName: string;
  documentType: string;
  voucherStyle: string;
  voucherType: string;
  voucherNo: string;
  isEInvoice: boolean;
  invoiceComments: string;
  referenceNumber: string;
  taxCode: string;
  taxRate: number;
  paymentMethod: string;
  bankAccount: string;
  shippingAddress: string;
  billingAddress: string;
  terms: string;
  notes: string;
  attachments: string[];
  approvalStatus: string;
  createdBy: string;
  createdDate: string;
  updatedBy: string;
  updatedDate: string;
  lines: InvoiceLine[];
}

export interface InvoiceLine {
  id: string;
  lineCode: string;
  accountNumber: string;
  description: string;
  quantity: number;
  rate: number;
  currencyCode: string;
  roeRate: number;
  currencyAmount: number;
  baseAmount: number;
  vatRate: number;
  vatAmount: number;
  totalAmount: number;
  comments?: string;
}

export interface CustomerInfo {
  code: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  paymentTerms: string;
  creditLimit: number;
}

export interface ProductInfo {
  code: string;
  name: string;
  description: string;
  unitPrice: number;
  currency: string;
  accountCode: string;
  category: string;
  isActive: boolean;
}

// Explorer Models
export interface InvoiceExplorerModel {
  ID: number;
  InvoiceNo: string;
  Status: string;
  CreatedDate: string;
  Description: string;
  CustomerName: string;
  Amount: number;
  Currency: string;
}

export interface InvoiceDetail {
  ID: number;
  InvoiceNo: string;
  CustomerId: number;
  CompanyId: number;
  CurrencyId: number;
  Status: string;
  Description: string;
  InvoiceDate: string;
  DueDate: string;
  TotalAmount: number;
  CustomerName: string;
  Currency: string;
  CreatedBy: string;
  CreatedDate: string;
  UpdatedBy: string;
  UpdatedDate: string;
  Lines: InvoiceLineDetail[];
}

export interface InvoiceLineDetail {
  ID: number;
  InvoiceId: number;
  LineCode: string;
  AccountNumber: string;
  Description: string;
  Quantity: number;
  Rate: number;
  Amount: number;
  VatRate: number;
  VatAmount: number;
  TotalAmount: number;
}

// Dropdown option interfaces
export interface DropdownOption {
  value: string;
  label: string;
}

export interface CurrencyOption extends DropdownOption {
  symbol: string;
  rate: number;
}

export interface CustomerOption extends DropdownOption {
  info: CustomerInfo;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
