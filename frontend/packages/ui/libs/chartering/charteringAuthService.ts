import { createApiClient } from '../api-client';
import { getApiUrl, API_CONFIG } from '../../config/api';
import { tokenManager } from '../auth/tokenManager';
import { 
  CreateShortTokenResponse, 
  ExchangeShortTokenRequest, 
  ExchangeShortTokenResponse 
} from '../auth/tokenManager';

// Chartering API client
const charteringApi = createApiClient(getApiUrl(API_CONFIG.ENDPOINTS.AUTH));

export class CharteringAuthService {
  // Create short token for chartering registration
  static async createShortToken(): Promise<CreateShortTokenResponse> {
    try {
      // Verify that we have a valid token before making the request
      const authHeader = tokenManager.getAuthHeader();
      if (!authHeader) {
        // Redirect to chartering login page if no token available
        if (typeof window !== 'undefined') {
          const charteringUrl = process.env.NEXT_PUBLIC_CHARTERING_URL;
          window.location.href = `${charteringUrl}/login`;
        }
        throw new Error('No authorization token available. Redirecting to chartering login.');
      }
      
      // Get current username from token manager
      const currentUsername = tokenManager.getUsername();
      if (!currentUsername) {
        throw new Error('No username available in current session');
      }
      
      const response = await charteringApi.get<CreateShortTokenResponse>('/CreateShortToken');
      
      // Always use the current username from token manager, not from response
      const result = {
        ...response.data,
        username: currentUsername
      };
      
      return result;
    } catch (error: any) {
      console.error('Failed to create short token:', error);
      throw new Error('Failed to create short token for chartering');
    }
  }

  // Exchange short token for long token
  static async exchangeShortToken(shortToken: string): Promise<ExchangeShortTokenResponse> {
    try {
      console.log('Exchanging short token for long token...');
      const request: ExchangeShortTokenRequest = { shortToken };
      const response = await charteringApi.post<ExchangeShortTokenResponse>('/ExchangeShortToken', request);
      console.log('Long token received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to exchange short token:', error);
      throw new Error('Failed to exchange short token for long token');
    }
  }

  // Register with chartering using short token
  static async registerWithChartering(shortToken: string): Promise<void> {
    try {
      console.log('Registering with chartering using short token...');
      await charteringApi.post('/register', { shortToken });
      console.log('Successfully registered with chartering');
    } catch (error) {
      console.error('Failed to register with chartering:', error);
      throw new Error('Failed to register with chartering');
    }
  }
}
