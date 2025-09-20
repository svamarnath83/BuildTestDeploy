// Main Models Index - Exports all model types

// Entity Models (EF Core)
export * from './entities';

// DTOs (Web API Data Transfer Objects)
export * from './dtos';

// Request/Response Models (API Communication)
export * from './requests';

// View Models (Frontend UI)
export * from './viewModels';

// API Client Models (HTTP Client & Configuration)
export * from './apiClient';

// Legacy Models (backward compatibility) - explicit exports to avoid conflicts
export type { 
  InvoiceLine,
  CustomerInfo,
  InvoiceForm,
  CurrencyOption,
  CustomerOption
} from '../models';

// Type Guards and Utilities
export const isInvoiceDto = (obj: any): obj is import('./dtos').InvoiceDto => {
  return obj && typeof obj.id === 'string' && typeof obj.invoiceNumber === 'string';
};

export const isInvoiceEntity = (obj: any): obj is import('./entities').InvoiceEntity => {
  return obj && typeof obj.id === 'string' && obj.invoiceDate instanceof Date;
};

export const isCreateInvoiceRequest = (obj: any): obj is import('./requests').CreateInvoiceRequest => {
  return obj && typeof obj.customerId === 'string' && Array.isArray(obj.lines);
};

export const isInvoiceFormModel = (obj: any): obj is import('./viewModels').InvoiceFormModel => {
  return obj && typeof obj.invoiceNumber === 'string' && Array.isArray(obj.lines);
};

// Model Mapping Utilities
export interface ModelMapper {
  // Entity to DTO mappings
  entityToDto<TEntity, TDto>(entity: TEntity): TDto;
  dtoToEntity<TDto, TEntity>(dto: TDto): TEntity;
  
  // DTO to ViewModel mappings
  dtoToViewModel<TDto, TViewModel>(dto: TDto): TViewModel;
  viewModelToDto<TViewModel, TDto>(viewModel: TViewModel): TDto;
  
  // Request to DTO mappings
  requestToDto<TRequest, TDto>(request: TRequest): TDto;
  dtoToResponse<TDto, TResponse>(dto: TDto): TResponse;
}

// Common Model Types
export type EntityId = string;
export type UserId = string;
export type TimestampString = string;
export type CurrencyCode = string;
export type CountryCode = string;

// Model Validation Types
export interface ModelValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  severity: 'error' | 'warning' | 'info';
}

// Model State Types
export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed';
export type EntityState = 'clean' | 'dirty' | 'saving' | 'saved' | 'error';

// Common Enums
export enum InvoiceStatus {
  Draft = 'Draft',
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
  Posted = 'Posted',
  Cancelled = 'Cancelled'
}

export enum DocumentType {
  Invoice = 'INV',
  CreditNote = 'CN',
  DebitNote = 'DN',
  ProformaInvoice = 'PI'
}

export enum PaymentMethod {
  Cash = 'CASH',
  BankTransfer = 'WIRE',
  CreditCard = 'CC',
  Check = 'CHK',
  OnlinePayment = 'ONLINE'
}

export enum ApprovalAction {
  Approve = 'approve',
  Reject = 'reject',
  Return = 'return'
}

export enum SortDirection {
  Ascending = 'asc',
  Descending = 'desc'
}

// Constants
export const DEFAULT_PAGE_SIZE = 25;
export const MAX_PAGE_SIZE = 100;
export const DEFAULT_CURRENCY = 'USD';
export const DEFAULT_VAT_RATE = 0;
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx', '.xls', '.xlsx'];

// Model Factory Types
export interface ModelFactory {
  createEmptyInvoice(): import('./viewModels').InvoiceFormModel;
  createEmptyInvoiceLine(): import('./viewModels').InvoiceLineFormModel;
  createDefaultConfiguration(): import('./viewModels').InvoiceConfiguration;
}

// Event Types for Model Changes
export interface ModelChangeEvent<T = any> {
  type: 'created' | 'updated' | 'deleted';
  model: string;
  data: T;
  timestamp: number;
  userId: string;
}

export interface ModelSubscription {
  id: string;
  modelType: string;
  callback: (event: ModelChangeEvent) => void;
  filters?: Record<string, any>;
}
