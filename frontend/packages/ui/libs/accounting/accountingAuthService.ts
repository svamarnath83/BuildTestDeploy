import { createApiClient } from '../api-client';
import { getApiUrl, API_CONFIG } from '../../config/api';
import { tokenManager } from '../auth/tokenManager';
import { 
  CreateShortTokenResponse, 
  ExchangeShortTokenRequest, 
  ExchangeShortTokenResponse 
} from '../auth/tokenManager';

// Accounting API client
const accountingApi = createApiClient(getApiUrl(API_CONFIG.ENDPOINTS.AUTH));

export class AccountingAuthService {
  // Create short token for accounting operations
  static async createShortToken(): Promise<CreateShortTokenResponse> {
    try {
      // In development mode, return mock short token instead of redirecting
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: returning mock short token');
        return {
          shortToken: 'mock-short-token-' + Date.now(),
          username: 'dev-user'
        };
      }

      // Verify that we have a valid token before making the request
      const authHeader = tokenManager.getAuthHeader();
      if (!authHeader) {
        throw new Error('No authorization token available.');
      }
      
      // Get current username from token manager
      const currentUsername = tokenManager.getUsername();
      if (!currentUsername) {
        throw new Error('No username available in current session');
      }
      
      const response = await accountingApi.get<CreateShortTokenResponse>('/CreateShortToken');
      
      // If the backend doesn't return username, add it from current session
      const result = response.data;
      if (!result.username) {
        result.username = currentUsername;
      }
      
      console.log('Short token created for accounting:', result);
      return result;
    } catch (error: any) {
      console.error('Failed to create short token for accounting:', error);
      throw new Error('Failed to create short token for accounting operations');
    }
  }

  // Exchange short token for long token
  static async exchangeShortToken(shortToken: string): Promise<ExchangeShortTokenResponse> {
    try {
      console.log('Exchanging short token for accounting long token...');
      const request: ExchangeShortTokenRequest = { shortToken };
      const response = await accountingApi.post<ExchangeShortTokenResponse>('/ExchangeShortToken', request);
      console.log('Accounting long token received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to exchange short token for accounting:', error);
      throw new Error('Failed to exchange short token for accounting long token');
    }
  }

  // Register with accounting module using short token
  static async registerWithAccounting(shortToken: string): Promise<void> {
    try {
      console.log('Registering with accounting module using short token...');
      await accountingApi.post('/accounting/register', { shortToken });
      console.log('Successfully registered with accounting module');
    } catch (error) {
      console.error('Failed to register with accounting module:', error);
      throw new Error('Failed to register with accounting module');
    }
  }

  // Validate accounting access and permissions
  static async validateAccountingAccess(): Promise<boolean> {
    try {
      const authHeader = tokenManager.getAuthHeader();
      if (!authHeader) {
        // In development, allow access without token for testing
        if (process.env.NODE_ENV === 'development') {
          console.log('Development mode: allowing access without token');
          return true;
        }
        return false;
      }

      // In development, always return true for testing
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: accounting access granted');
        return true;
      }

      const response = await accountingApi.get<{ hasAccess: boolean }>('/accounting/validate-access');
      return response.data.hasAccess;
    } catch (error) {
      console.error('Failed to validate accounting access:', error);
      
      // In development, return true even if API fails
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: defaulting to access granted');
        return true;
      }
      
      return false;
    }
  }

  // Get accounting user permissions
  static async getAccountingPermissions(): Promise<string[]> {
    try {
      // In development, return mock permissions
      if (process.env.NODE_ENV === 'development') {
        const mockPermissions = [
          'invoices.view',
          'invoices.create', 
          'invoices.edit',
          'invoices.delete',
          'customers.view',
          'customers.create',
          'reports.view',
          'accounting.admin'
        ];
        console.log('Development mode: returning mock permissions', mockPermissions);
        return mockPermissions;
      }

      const response = await accountingApi.get<{ permissions: string[] }>('/accounting/permissions');
      return response.data.permissions;
    } catch (error) {
      console.error('Failed to get accounting permissions:', error);
      
      // In development, return basic permissions even if API fails
      if (process.env.NODE_ENV === 'development') {
        const fallbackPermissions = ['invoices.view', 'invoices.create', 'invoices.edit'];
        console.log('Development mode: returning fallback permissions', fallbackPermissions);
        return fallbackPermissions;
      }
      
      return [];
    }
  }

  // Initialize accounting session
  static async initializeAccountingSession(): Promise<void> {
    try {
      console.log('Initializing accounting session...');
      
      // Validate access first
      const hasAccess = await this.validateAccountingAccess();
      if (!hasAccess) {
        throw new Error('User does not have access to accounting module');
      }

      // Get permissions
      const permissions = await this.getAccountingPermissions();
      console.log('Accounting permissions:', permissions);

      // Store session info in localStorage for quick access
      if (typeof window !== 'undefined') {
        localStorage.setItem('accounting_session', JSON.stringify({
          hasAccess: true,
          permissions,
          timestamp: new Date().toISOString()
        }));
      }

      console.log('Accounting session initialized successfully');
    } catch (error) {
      console.error('Failed to initialize accounting session:', error);
      throw error;
    }
  }

  // Check if user has specific accounting permission
  static async hasPermission(permission: string): Promise<boolean> {
    try {
      // Try to get from cache first
      if (typeof window !== 'undefined') {
        const sessionData = localStorage.getItem('accounting_session');
        if (sessionData) {
          const session = JSON.parse(sessionData);
          if (session.permissions) {
            return session.permissions.includes(permission);
          }
        }
      }

      // Fetch fresh permissions if not in cache
      const permissions = await this.getAccountingPermissions();
      return permissions.includes(permission);
    } catch (error) {
      console.error('Failed to check accounting permission:', error);
      return false;
    }
  }

  // Clear accounting session
  static clearAccountingSession(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accounting_session');
    }
    console.log('Accounting session cleared');
  }
}
