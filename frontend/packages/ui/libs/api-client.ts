import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { tokenManager } from './auth/tokenManager';

export function createApiClient(baseURL: string): AxiosInstance {
  const instance = axios.create({
    baseURL,
    timeout: 50000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add request interceptor to include JWT token
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const authHeader = tokenManager.getAuthHeader();
      if (authHeader && config.headers) {
        config.headers.Authorization = authHeader.Authorization;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor to handle token expiration
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        // Token expired or invalid, clear tokens
        console.log('API returned 401, clearing authentication');
        tokenManager.clearTokens();
        
        // Don't redirect here - let ProtectedRoute handle it
        // This prevents conflicts between API client and ProtectedRoute
      }
      return Promise.reject(error);
    }
  );

  return instance;
}
