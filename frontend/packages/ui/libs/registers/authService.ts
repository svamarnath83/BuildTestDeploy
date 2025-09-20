import { createApiClient } from '../api-client';
import { getApiUrl, API_CONFIG } from '../../config/api';

export interface ExchangeShortTokenRequest {
  shortToken: string;
}

export interface ExchangeShortTokenResponse {
  longToken: string;
  username: string;
}

const registersAuthApi = createApiClient(getApiUrl(API_CONFIG.ENDPOINTS.AUTH));

export class RegistersAuthService {
  static async exchangeShortToken(shortToken: string): Promise<ExchangeShortTokenResponse> {
    try {
      const payload: ExchangeShortTokenRequest = { shortToken };
      const response = await registersAuthApi.post<ExchangeShortTokenResponse>('/ExchangeShortToken', payload);
      return response.data;
    } catch (error: any) {
      console.error('Failed to exchange short token:', error);
      throw error;
    }
  }
}
