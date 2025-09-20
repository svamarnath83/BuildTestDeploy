import { createApiClient } from '../../api-client';
import { getApiUrl, API_CONFIG } from '../../../config/api';
import { Account, AccountGroupDto } from './models';
import { tokenManager } from '../../auth/tokenManager';

// Helper function to check authentication and redirect if needed
const checkAuthAndRedirect = (): boolean => {
  const isAuthenticated = tokenManager.isAuthenticated();
  
  if (!isAuthenticated) {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      // Redirect to auth app following the same pattern as ProtectedRoute
      const authUrl = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:3002';
      window.location.href = `${authUrl}/login`;
    }
    
    return false;
  }
  
  return true;
};

// Follow the exact same pattern as vessel - use a single API client
const api = createApiClient(getApiUrl('/api'));

// Account Groups
export const getAccountGroups = () => api.get('/account-groups');
export const getAccountGroup = (id: number) => api.get(`/account-groups/${id}`);
export const createAccountGroup = (data: AccountGroupDto) => api.post('/account-groups', data);
export const updateAccountGroup = (id: number, data: AccountGroupDto) => api.put(`/account-groups/${id}`, data);
export const deleteAccountGroup = (id: number) => api.delete(`/account-groups/${id}`);

// Accounts  
export const getAccounts = () => api.get('/accounts');
export const getAccount = (id: number) => api.get(`/accounts/${id}`);
export const getAccountById = (id: number) => api.get(`/accounts/${id}`); // Alias for compatibility
export const getAccountsByGroup = (accountGroupId: number) => api.get(`/account-groups/${accountGroupId}/accounts`);
export const createAccount = (data: Account) => api.post('/accounts', data);
export const updateAccount = (id: number, data: Account) => api.put(`/accounts/${id}`, data);
export const deleteAccount = (id: number) => api.delete(`/accounts/${id}`);

// Helper function for add or update pattern
export const addOrUpdateAccount = (data: Account) => {
  if (data.id) {
    return updateAccount(data.id, data);
  } else {
    return createAccount(data);
  }
};

export const addOrUpdateAccountGroup = (data: AccountGroupDto) => {
  if (data.id) {
    return updateAccountGroup(data.id, data);
  } else {
    return createAccountGroup(data);
  }
};

// Helper function to extract data from ApiResponse<T> wrapper
const extractApiResponseData = (response: any): any[] => {
  // Your backend returns: { data: { Success: true, Data: [...], Message: "..." } }
  const responseData = response.data;
  
  if (responseData && responseData.Success && responseData.Data) {
    return Array.isArray(responseData.Data) ? responseData.Data : [responseData.Data];
  }
  
  // Fallback to direct array check
  if (Array.isArray(responseData)) {
    return responseData;
  }
  
  // Check if response itself is an array (for some API designs)
  if (Array.isArray(response)) {
    return response;
  }
  
  // Return empty array if nothing found
  return [];
};

// Legacy wrapper - handling ApiResponse<T> structure
export const accountsService = {
  getAccountGroups: async () => {
    if (!checkAuthAndRedirect()) {
      throw new Error('Authentication required');
    }
    
    try {
      const response = await getAccountGroups();
      const result = extractApiResponseData(response);
      return result;
    } catch (error: any) {
      // Provide more specific error messages
      if (error.response?.status === 404) {
        throw new Error(`API endpoint not found. Check if backend is running on ${API_CONFIG.BASE_URL} and account-groups endpoint exists.`);
      } else if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please log in and try again.');
      } else if (error.code === 'ECONNREFUSED' || error.code === 'NETWORK_ERROR') {
        throw new Error(`Cannot connect to backend server at ${API_CONFIG.BASE_URL}. Please check if the backend is running.`);
      } else {
        throw new Error(`Failed to load account groups: ${error.message || 'Unknown error'}`);
      }
    }
  },
  
  getAccounts: async (params?: any) => {
    if (!checkAuthAndRedirect()) {
      throw new Error('Authentication required');
    }
    
    try {
      const response = await getAccounts();
      const result = extractApiResponseData(response);
      return result;
    } catch (error: any) {
      // Provide more specific error messages
      if (error.response?.status === 404) {
        throw new Error(`API endpoint not found. Check if backend is running on ${API_CONFIG.BASE_URL} and accounts endpoint exists.`);
      } else if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please log in and try again.');
      } else if (error.code === 'ECONNREFUSED' || error.code === 'NETWORK_ERROR') {
        throw new Error(`Cannot connect to backend server at ${API_CONFIG.BASE_URL}. Please check if the backend is running.`);
      } else {
        throw new Error(`Failed to load accounts: ${error.message || 'Unknown error'}`);
      }
    }
  },
  
  createAccount: async (data: Account) => {
    if (!checkAuthAndRedirect()) {
      throw new Error('Authentication required');
    }
    
    try {
      const response = await addOrUpdateAccount(data);
      // For create/update, return the Data property from ApiResponse
      return response.data?.Data || response.data;
    } catch (error: any) {
      // Provide more specific error messages
      if (error.response?.status === 404) {
        throw new Error(`Account creation endpoint not found. Check if backend is running on ${API_CONFIG.BASE_URL}.`);
      } else if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please log in and try again.');
      } else if (error.response?.status === 409) {
        throw new Error('Account with this account number already exists.');
      } else if (error.response?.status === 400) {
        throw new Error(`Invalid account data: ${error.response?.data?.Message || 'Please check your input'}`);
      } else if (error.code === 'ECONNREFUSED' || error.code === 'NETWORK_ERROR') {
        throw new Error(`Cannot connect to backend server at ${API_CONFIG.BASE_URL}. Please check if the backend is running.`);
      } else {
        throw new Error(`Failed to create account: ${error.response?.data?.Message || error.message || 'Unknown error'}`);
      }
    }
  },
  
  updateAccount: async (id: number, data: Account) => {
    if (!checkAuthAndRedirect()) {
      throw new Error('Authentication required');
    }
    
    try {
      const response = await updateAccount(id, data);
      // For create/update, return the Data property from ApiResponse
      return response.data?.Data || response.data;
    } catch (error: any) {
      // Provide more specific error messages
      if (error.response?.status === 404) {
        throw new Error(`Account not found or update endpoint not available. Check if backend is running on ${API_CONFIG.BASE_URL}.`);
      } else if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please log in and try again.');
      } else if (error.response?.status === 409) {
        throw new Error('Account with this account number already exists.');
      } else if (error.response?.status === 400) {
        throw new Error(`Invalid account data: ${error.response?.data?.Message || 'Please check your input'}`);
      } else if (error.code === 'ECONNREFUSED' || error.code === 'NETWORK_ERROR') {
        throw new Error(`Cannot connect to backend server at ${API_CONFIG.BASE_URL}. Please check if the backend is running.`);
      } else {
        throw new Error(`Failed to update account: ${error.response?.data?.Message || error.message || 'Unknown error'}`);
      }
    }
  },
  
  createAccountGroup: async (data: AccountGroupDto) => {
    if (!checkAuthAndRedirect()) {
      throw new Error('Authentication required');
    }
    
    try {
      const response = await addOrUpdateAccountGroup(data);
      // For create/update, return the Data property from ApiResponse
      return response.data?.Data || response.data;
    } catch (error: any) {
      // Provide more specific error messages
      if (error.response?.status === 404) {
        throw new Error(`Account group creation endpoint not found. Check if backend is running on ${API_CONFIG.BASE_URL}.`);
      } else if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please log in and try again.');
      } else if (error.response?.status === 409) {
        throw new Error('Account group with this name already exists.');
      } else if (error.response?.status === 400) {
        throw new Error(`Invalid account group data: ${error.response?.data?.Message || 'Please check your input'}`);
      } else if (error.code === 'ECONNREFUSED' || error.code === 'NETWORK_ERROR') {
        throw new Error(`Cannot connect to backend server at ${API_CONFIG.BASE_URL}. Please check if the backend is running.`);
      } else {
        throw new Error(`Failed to create account group: ${error.response?.data?.Message || error.message || 'Unknown error'}`);
      }
    }
  }
};
