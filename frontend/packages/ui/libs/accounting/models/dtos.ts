// Data Transfer Objects for Web API Communication

// Invoice DTOs
export interface InvoiceDto {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerCode: string;
  customerName: string;
  companyId: string;
  companyCode: string;
  companyName: string;
  invoiceDate: string; // ISO date string
  dueDate: string;
  entryDate: string;
  currencyDate: string;
  currencyCode: string;
  invoiceAmount: number;
  customerReference?: string;
  batchName?: string;
  documentType: string;
  voucherStyle?: string;
  voucherType?: string;
  voucherNo?: string;
  isEInvoice: boolean;
  invoiceComments?: string;
  referenceNumber?: string;
  taxCode?: string;
  taxRate: number;
  paymentMethod?: string;
  bankAccount?: string;
  shippingAddress?: string;
  billingAddress?: string;
  terms?: string;
  notes?: string;
  approvalStatus: string;
  createdBy: string;
  createdDate: string;
  updatedBy?: string;
  updatedDate?: string;
  lines: InvoiceLineDto[];
  attachments?: InvoiceAttachmentDto[];
}

export interface InvoiceLineDto {
  id: string;
  invoiceId: string;
  lineCode: string;
  accountNumber: string;
  accountName: string;
  description: string;
  quantity: number;
  unitRate: number;
  currencyCode: string;
  exchangeRate: number;
  currencyAmount: number;
  baseAmount: number;
  vatRate: number;
  vatAmount: number;
  totalAmount: number;
  comments?: string;
}

export interface InvoiceAttachmentDto {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedBy: string;
  uploadedDate: string;
}

// Customer DTOs
export interface CustomerDto {
  id: string;
  customerCode: string;
  customerName: string;
  email?: string;
  phone?: string;
  address?: string;
  countryCode?: string;
  countryName?: string;
  paymentTerms?: string;
  creditLimit: number;
  isActive: boolean;
}

export interface CustomerLookupDto {
  id: string;
  code: string;
  name: string;
  email?: string;
  paymentTerms?: string;
  creditLimit: number;
}

// Company DTOs
export interface CompanyDto {
  id: string;
  companyCode: string;
  companyName: string;
  address?: string;
  taxRegistrationNumber?: string;
  isActive: boolean;
}

// Lookup DTOs
export interface AccountDto {
  id: string;
  accountNumber: string;
  accountName: string;
  accountType: string;
  isActive: boolean;
}

export interface DocumentTypeDto {
  id: string;
  code: string;
  name: string;
  description?: string;
}

export interface TaxCodeDto {
  id: string;
  code: string;
  name: string;
  rate: number;
}

export interface PaymentMethodDto {
  id: string;
  code: string;
  name: string;
  description?: string;
}

export interface BankAccountDto {
  id: string;
  accountNumber: string;
  accountName: string;
  bankName: string;
  branchCode?: string;
}

export interface CurrencyDto {
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number;
  isActive: boolean;
}

export interface CountryDto {
  id: string;
  code: string;
  name: string;
  currencyCode: string;
}

export interface PaymentTermsDto {
  id: string;
  code: string;
  name: string;
  daysCount: number;
  description?: string;
}
