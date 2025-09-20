// Accounting Module Exports

// Core accounting operations (similar to operations module)
export * from './models';
export * from './services';
export * from './accountingAuthService';

// Legacy data (for backward compatibility)
export * from './data';

// Advanced models (use specific imports to avoid conflicts)
export { 
  // Entity models
  type InvoiceEntity,
  type InvoiceLineEntity,
  type CustomerEntity,
  type CompanyEntity,
  
  // DTOs
  type InvoiceDto,
  type InvoiceLineDto,
  type CustomerDto,
  type CompanyDto,
  
  // API Request/Response models
  type CreateInvoiceRequest,
  type CreateInvoiceResponse,
  
  // View Models
  type InvoiceFormModel,
  type InvoiceFormState,
  type CustomerViewModel,
  type InvoiceTotals,
  
  // API Client models
  type ApiClientConfiguration,
  type HttpRequest,
  type HttpResponse,
  
  // Enums and constants
  InvoiceStatus,
  DocumentType,
  PaymentMethod,
  DEFAULT_PAGE_SIZE,
  DEFAULT_CURRENCY
} from './models/index';
