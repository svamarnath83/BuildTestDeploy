import { API_CONFIG } from '../../config/api';
import { createApiClient } from '../api-client';
import { getApiUrl } from '../../config/api';
import { LoginRequest, LoginResponse, UserInfo } from './models';

// Use the AUTH API endpoint
const authApi = createApiClient(getApiUrl(API_CONFIG.ENDPOINTS.AUTH));

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await authApi.post<LoginResponse>('/login', credentials);
    console.log('Login response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};
export const getUsers = async () => await authApi.get<UserInfo[]>('/GetUsers');

export const authService = { login, getUsers };
