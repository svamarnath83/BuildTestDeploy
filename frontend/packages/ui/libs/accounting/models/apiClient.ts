// API Client Configuration and Service Models

// API Configuration
export interface ApiClientConfiguration {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
  enableLogging: boolean;
  enableCache: boolean;
  cacheTimeout: number;
  headers: Record<string, string>;
  authConfig: AuthConfiguration;
}

export interface AuthConfiguration {
  type: 'bearer' | 'basic' | 'apikey';
  tokenKey: string;
  refreshTokenKey?: string;
  loginEndpoint: string;
  refreshEndpoint?: string;
  logoutEndpoint?: string;
}

// HTTP Client Models
export interface HttpRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
}

export interface HttpResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: HttpRequest;
}

export interface HttpError {
  message: string;
  status?: number;
  statusText?: string;
  data?: any;
  isTimeout?: boolean;
  isNetworkError?: boolean;
}

// API Endpoints Configuration
export interface ApiEndpoints {
  invoices: {
    getAll: string;
    getById: string;
    create: string;
    update: string;
    delete: string;
    approve: string;
    reject: string;
    search: string;
    calculate: string;
    validate: string;
    export: string;
    print: string;
  };
  customers: {
    getAll: string;
    getById: string;
    search: string;
    lookup: string;
  };
  companies: {
    getAll: string;
    getById: string;
    lookup: string;
  };
  accounts: {
    getAll: string;
    getById: string;
    lookup: string;
  };
  lookups: {
    documentTypes: string;
    taxCodes: string;
    paymentMethods: string;
    bankAccounts: string;
    currencies: string;
    countries: string;
    paymentTerms: string;
  };
  files: {
    upload: string;
    download: string;
    delete: string;
  };
  reports: {
    invoiceSummary: string;
    customerStatements: string;
    agingReport: string;
    taxReport: string;
  };
}

// Cache Models
export interface CacheItem<T> {
  key: string;
  data: T;
  timestamp: number;
  expiresAt: number;
}

export interface CacheConfiguration {
  enabled: boolean;
  defaultTtl: number;
  maxSize: number;
  keyPrefix: string;
  storage: 'memory' | 'localStorage' | 'sessionStorage';
}

// Request Interceptor Models
export interface RequestInterceptor {
  onRequest?: (config: HttpRequest) => HttpRequest | Promise<HttpRequest>;
  onRequestError?: (error: any) => any;
}

export interface ResponseInterceptor {
  onResponse?: (response: HttpResponse) => HttpResponse | Promise<HttpResponse>;
  onResponseError?: (error: HttpError) => any;
}

// Service Interface Models
export interface IInvoiceService {
  getInvoices(request: any): Promise<HttpResponse>;
  getInvoiceById(id: string): Promise<HttpResponse>;
  createInvoice(request: any): Promise<HttpResponse>;
  updateInvoice(request: any): Promise<HttpResponse>;
  deleteInvoice(id: string): Promise<HttpResponse>;
  approveInvoice(request: any): Promise<HttpResponse>;
  rejectInvoice(request: any): Promise<HttpResponse>;
  calculateInvoice(request: any): Promise<HttpResponse>;
  validateInvoice(request: any): Promise<HttpResponse>;
}

export interface ICustomerService {
  getCustomers(request: any): Promise<HttpResponse>;
  getCustomerById(id: string): Promise<HttpResponse>;
  searchCustomers(searchTerm: string): Promise<HttpResponse>;
  getCustomerLookup(): Promise<HttpResponse>;
}

export interface ILookupService {
  getDocumentTypes(): Promise<HttpResponse>;
  getTaxCodes(): Promise<HttpResponse>;
  getPaymentMethods(): Promise<HttpResponse>;
  getBankAccounts(): Promise<HttpResponse>;
  getCurrencies(): Promise<HttpResponse>;
  getCountries(): Promise<HttpResponse>;
  getPaymentTerms(): Promise<HttpResponse>;
}

export interface IFileService {
  uploadFiles(request: any): Promise<HttpResponse>;
  downloadFile(fileId: string): Promise<HttpResponse>;
  deleteFile(fileId: string): Promise<HttpResponse>;
}

// WebSocket Models (for real-time updates)
export interface WebSocketConfiguration {
  url: string;
  reconnectAttempts: number;
  reconnectDelay: number;
  heartbeatInterval: number;
  enableHeartbeat: boolean;
}

export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: number;
  messageId: string;
}

export interface WebSocketEventHandlers {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
  onMessage?: (message: WebSocketMessage) => void;
  onReconnect?: () => void;
}

// Background Sync Models
export interface SyncConfiguration {
  enabled: boolean;
  syncInterval: number;
  batchSize: number;
  retryAttempts: number;
  conflictResolution: 'server' | 'client' | 'manual';
}

export interface SyncOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: string;
  data: any;
  timestamp: number;
  status: 'pending' | 'syncing' | 'success' | 'failed';
  retries: number;
  error?: string;
}

// Performance Monitoring
export interface PerformanceMetrics {
  requestDuration: number;
  responseSize: number;
  cacheHitRate: number;
  errorRate: number;
  throughput: number;
  timestamp: number;
}

export interface PerformanceMonitorConfiguration {
  enabled: boolean;
  sampleRate: number;
  thresholds: {
    slowRequest: number;
    largeResponse: number;
    highErrorRate: number;
  };
  onMetricsCollected?: (metrics: PerformanceMetrics) => void;
}
