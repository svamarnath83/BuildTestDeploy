// EF Core Entity Models for Accounting Module

export interface InvoiceEntity {
  id: string;
  invoiceNumber: string;
  customerId: string;
  companyId: string;
  invoiceDate: Date;
  dueDate: Date;
  entryDate: Date;
  currencyDate: Date;
  currencyCode: string;
  invoiceAmount: number;
  customerReference?: string;
  batchName?: string;
  documentTypeId: string;
  voucherStyle?: string;
  voucherType?: string;
  voucherNo?: string;
  isEInvoice: boolean;
  invoiceComments?: string;
  referenceNumber?: string;
  taxCodeId?: string;
  taxRate: number;
  paymentMethodId?: string;
  bankAccountId?: string;
  shippingAddress?: string;
  billingAddress?: string;
  terms?: string;
  notes?: string;
  approvalStatus: string;
  createdBy: string;
  createdDate: Date;
  updatedBy?: string;
  updatedDate?: Date;
  
  // Navigation Properties
  customer?: CustomerEntity;
  company?: CompanyEntity;
  invoiceLines?: InvoiceLineEntity[];
  documentType?: DocumentTypeEntity;
  taxCode?: TaxCodeEntity;
  paymentMethod?: PaymentMethodEntity;
  bankAccount?: BankAccountEntity;
  attachments?: InvoiceAttachmentEntity[];
}

export interface InvoiceLineEntity {
  id: string;
  invoiceId: string;
  lineCode: string;
  accountId: string;
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
  createdDate: Date;
  
  // Navigation Properties
  invoice?: InvoiceEntity;
  account?: AccountEntity;
}

export interface CustomerEntity {
  id: string;
  customerCode: string;
  customerName: string;
  email?: string;
  phone?: string;
  address?: string;
  countryId?: string;
  paymentTermsId?: string;
  creditLimit: number;
  isActive: boolean;
  createdDate: Date;
  updatedDate?: Date;
  
  // Navigation Properties
  country?: CountryEntity;
  paymentTerms?: PaymentTermsEntity;
  invoices?: InvoiceEntity[];
}

export interface CompanyEntity {
  id: string;
  companyCode: string;
  companyName: string;
  address?: string;
  taxRegistrationNumber?: string;
  isActive: boolean;
  createdDate: Date;
  
  // Navigation Properties
  invoices?: InvoiceEntity[];
}

export interface AccountEntity {
  id: string;
  accountNumber: string;
  accountName: string;
  accountType: string;
  isActive: boolean;
  createdDate: Date;
  
  // Navigation Properties
  invoiceLines?: InvoiceLineEntity[];
}

export interface DocumentTypeEntity {
  id: string;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface TaxCodeEntity {
  id: string;
  code: string;
  name: string;
  rate: number;
  isActive: boolean;
}

export interface PaymentMethodEntity {
  id: string;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface BankAccountEntity {
  id: string;
  accountNumber: string;
  accountName: string;
  bankName: string;
  branchCode?: string;
  isActive: boolean;
}

export interface CountryEntity {
  id: string;
  code: string;
  name: string;
  currencyCode: string;
  isActive: boolean;
}

export interface PaymentTermsEntity {
  id: string;
  code: string;
  name: string;
  daysCount: number;
  description?: string;
  isActive: boolean;
}

export interface InvoiceAttachmentEntity {
  id: string;
  invoiceId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  filePath: string;
  uploadedBy: string;
  uploadedDate: Date;
  
  // Navigation Properties
  invoice?: InvoiceEntity;
}
