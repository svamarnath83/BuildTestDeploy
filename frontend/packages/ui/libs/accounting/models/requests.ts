// API Request and Response Models

import { InvoiceDto, InvoiceLineDto } from './dtos';

// Base API Response
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  timestamp: string;
}

// Pagination Models
export interface PaginationRequest {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Invoice Requests
export interface CreateInvoiceRequest {
  customerId: string;
  companyId: string;
  invoiceDate: string;
  dueDate: string;
  entryDate: string;
  currencyDate: string;
  currencyCode: string;
  customerReference?: string;
  batchName?: string;
  documentType: string;
  voucherStyle?: string;
  voucherType?: string;
  isEInvoice: boolean;
  invoiceComments?: string;
  referenceNumber?: string;
  taxCode?: string;
  paymentMethod?: string;
  bankAccount?: string;
  shippingAddress?: string;
  billingAddress?: string;
  terms?: string;
  notes?: string;
  lines: CreateInvoiceLineRequest[];
}

export interface CreateInvoiceLineRequest {
  lineCode: string;
  accountId: string;
  description: string;
  quantity: number;
  unitRate: number;
  currencyCode: string;
  exchangeRate: number;
  vatRate: number;
  comments?: string;
}

export interface UpdateInvoiceRequest extends CreateInvoiceRequest {
  id: string;
  updatedBy: string;
}

export interface UpdateInvoiceLineRequest extends CreateInvoiceLineRequest {
  id: string;
}

// Invoice Responses
export interface CreateInvoiceResponse {
  invoiceId: string;
  invoiceNumber: string;
  message: string;
}

export interface GetInvoiceResponse {
  invoice: InvoiceDto;
}

export interface GetInvoicesResponse {
  invoices: PaginatedResponse<InvoiceDto>;
}

// Invoice Search and Filter
export interface InvoiceSearchRequest extends PaginationRequest {
  customerId?: string;
  companyId?: string;
  invoiceNumber?: string;
  dateFrom?: string;
  dateTo?: string;
  approvalStatus?: string;
  currencyCode?: string;
  amountFrom?: number;
  amountTo?: number;
}

// Approval Requests
export interface ApprovalRequest {
  invoiceId: string;
  action: 'approve' | 'reject';
  comments?: string;
  approvedBy: string;
}

export interface ApprovalResponse {
  success: boolean;
  newStatus: string;
  message: string;
}

// File Upload Requests
export interface FileUploadRequest {
  invoiceId: string;
  files: File[];
}

export interface FileUploadResponse {
  uploadedFiles: {
    fileName: string;
    fileId: string;
    fileSize: number;
  }[];
  message: string;
}

// Lookup Requests
export interface GetCustomersRequest extends PaginationRequest {
  searchTerm?: string;
  isActive?: boolean;
}

export interface GetAccountsRequest extends PaginationRequest {
  searchTerm?: string;
  accountType?: string;
  isActive?: boolean;
}

// Validation Models
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface InvoiceValidationRequest {
  invoice: CreateInvoiceRequest;
}

export interface InvoiceValidationResponse {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

// Calculation Requests
export interface CalculateInvoiceRequest {
  lines: CreateInvoiceLineRequest[];
  currencyCode: string;
  taxCode?: string;
}

export interface CalculationResult {
  subtotal: number;
  totalVat: number;
  grandTotal: number;
  lineCalculations: {
    lineId: string;
    currencyAmount: number;
    baseAmount: number;
    vatAmount: number;
    totalAmount: number;
  }[];
}

// Batch Operations
export interface BatchInvoiceRequest {
  operation: 'approve' | 'reject' | 'delete';
  invoiceIds: string[];
  comments?: string;
  userId: string;
}

export interface BatchInvoiceResponse {
  successCount: number;
  failureCount: number;
  results: {
    invoiceId: string;
    success: boolean;
    message?: string;
  }[];
}
