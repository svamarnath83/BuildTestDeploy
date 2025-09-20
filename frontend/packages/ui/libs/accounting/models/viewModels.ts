// Frontend View Models and UI-specific interfaces

// Form Models (for UI components)
export interface InvoiceFormModel {
  id?: string;
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
  lines: InvoiceLineFormModel[];
}

export interface InvoiceLineFormModel {
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

// UI State Models
export interface InvoiceFormState {
  form: InvoiceFormModel;
  selectedCustomer: CustomerViewModel | null;
  invoiceLines: InvoiceLineFormModel[];
  isEditMode: boolean;
  isLoading: boolean;
  isSaving: boolean;
  errors: FormErrors;
  totals: InvoiceTotals;
}

export interface FormErrors {
  [fieldName: string]: string;
}

export interface InvoiceTotals {
  subtotal: number;
  totalVat: number;
  grandTotal: number;
}

// Dropdown/Lookup Models
export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface CustomerViewModel {
  code: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  paymentTerms: string;
  creditLimit: number;
  isActive: boolean;
}

export interface CompanyViewModel {
  code: string;
  name: string;
  address?: string;
  taxNumber?: string;
}

export interface AccountViewModel {
  number: string;
  name: string;
  type: string;
  description?: string;
}

export interface CurrencyViewModel {
  code: string;
  name: string;
  symbol: string;
  rate: number;
}

// Table/Grid Models
export interface InvoiceGridItem {
  id: string;
  invoiceNumber: string;
  customerName: string;
  invoiceDate: string;
  dueDate: string;
  currency: string;
  amount: number;
  status: string;
  createdBy: string;
  createdDate: string;
}

export interface InvoiceLineGridItem {
  id: string;
  lineCode: string;
  accountNumber: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  vatRate: number;
  total: number;
}

// Filter Models
export interface InvoiceFilterModel {
  customerId?: string;
  companyId?: string;
  invoiceNumber?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  currency?: string;
  amountFrom?: number;
  amountTo?: number;
}

// Configuration Models
export interface InvoiceConfiguration {
  defaultCurrency: string;
  defaultPaymentTerms: string;
  autoGenerateInvoiceNumber: boolean;
  invoiceNumberPrefix: string;
  vatCalculationMethod: 'inclusive' | 'exclusive';
  allowNegativeAmounts: boolean;
  requireCustomerReference: boolean;
  enableEInvoice: boolean;
  maxFileUploadSize: number;
  allowedFileTypes: string[];
}

// Dashboard Models
export interface InvoiceDashboardData {
  totalInvoices: number;
  totalAmount: number;
  pendingApprovals: number;
  overdueInvoices: number;
  thisMonthInvoices: number;
  thisMonthAmount: number;
  currencyBreakdown: {
    currency: string;
    count: number;
    amount: number;
  }[];
  statusBreakdown: {
    status: string;
    count: number;
    percentage: number;
  }[];
  recentInvoices: InvoiceGridItem[];
}

// Notification Models
export interface NotificationModel {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  variant?: 'primary' | 'secondary';
}

// Modal Models
export interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

// Navigation Models
export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

// Theme Models
export interface ThemeConfiguration {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  borderRadius: string;
  fontSize: {
    small: string;
    medium: string;
    large: string;
  };
  spacing: {
    small: string;
    medium: string;
    large: string;
  };
}
