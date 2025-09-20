import { 
  AccountGroup, 
  CreateAccountGroupRequest, 
  UpdateAccountGroupRequest,
  AccountGroupsResponse,
  AccountGroupResponse
} from './models';
import { createApiClient } from '../../api-client';  // Add this import
import { getApiUrl, API_CONFIG } from '../../../config/api';  // Adjust path if needed

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:7071';
const accountGroupApi = createApiClient(getApiUrl(API_CONFIG.ENDPOINTS.ACCOUNT_GROUPS));  // Add this, assuming ENDPOINTS has ACCOUNT_GROUPS

export class AccountGroupsService {
  private static instance: AccountGroupsService;

  public static getInstance(): AccountGroupsService {
    if (!AccountGroupsService.instance) {
      AccountGroupsService.instance = new AccountGroupsService();
    }
    return AccountGroupsService.instance;
  }

  async getAllAccountGroups(): Promise<AccountGroup[]> {
    try {
      console.log('AccountGroupsService: Making API call to:', `${API_BASE_URL}/api/account-groups`);
      const response = await accountGroupApi.get('/');

      console.log('AccountGroupsService: Response status:', response.status);
      if (response.status < 200 || response.status >= 300) {  // Updated check
        console.error('AccountGroupsService: Response not ok:', response.status, response.statusText);
        // For axios, error might be in response.data
        const errorResult = response.data || {};
        throw new Error(errorResult.Message || `Failed to fetch account groups: ${response.statusText || 'Unknown error'}`);
      }

      const result: AccountGroupsResponse = response.data;  // Use response.data (no await)
      console.log('AccountGroupsService: Response data:', result);
      
      if (!result.Success) {
        console.error('AccountGroupsService: API returned Success=false:', result.Message);
        throw new Error(result.Message || 'Failed to fetch account groups');
      }

      console.log('AccountGroupsService: Returning data:', result.Data);
      return result.Data;
    } catch (error) {
      console.error('AccountGroupsService: Error in getAllAccountGroups:', error);
      throw error;
    }
  }

  async getAccountGroupById(id: number): Promise<AccountGroup> {
    try {
      const response = await accountGroupApi.get(`/${id}`);

      if (response.status < 200 || response.status >= 300) {  // Updated
        const errorResult = response.data || {};
        throw new Error(errorResult.Message || `Failed to fetch account group: ${response.statusText}`);
      }

      const result: AccountGroupResponse = response.data;  // Updated
      
      if (!result.Success) {
        throw new Error(result.Message || 'Failed to fetch account group');
      }

      return result.Data;
    } catch (error) {
      throw error;
    }
  }

  async createAccountGroup(accountGroup: CreateAccountGroupRequest): Promise<AccountGroup> {
    try {
      const response = await accountGroupApi.post('/', accountGroup);

      if (response.status < 200 || response.status >= 300) {  // Updated
        const errorResult = response.data || {};
        throw new Error(errorResult.Message || `Failed to create account group: ${response.statusText}`);
      }

      const result: AccountGroupResponse = response.data;  // Updated
      
      if (!result.Success) {
        throw new Error(result.Message || 'Failed to create account group');
      }

      return result.Data;
    } catch (error) {
      throw error;
    }
  }

  async updateAccountGroup(id: number, accountGroup: UpdateAccountGroupRequest): Promise<AccountGroup> {
    try {
      const response = await accountGroupApi.put(`/${id}`, accountGroup);

      if (response.status < 200 || response.status >= 300) {  // Updated
        const errorResult = response.data || {};
        throw new Error(errorResult.Message || `Failed to update account group: ${response.statusText}`);
      }

      const result: AccountGroupResponse = response.data;  // Updated
      
      if (!result.Success) {
        throw new Error(result.Message || 'Failed to update account group');
      }

      return result.Data;
    } catch (error) {
      throw error;
    }
  }

  async deleteAccountGroup(id: number): Promise<boolean> {
    try {
      const response = await accountGroupApi.delete(`/${id}`);

      if (response.status < 200 || response.status >= 300) {  // Updated
        const errorResult = response.data || {};
        throw new Error(errorResult.Message || `Failed to delete account group: ${response.statusText}`);
      }

      const result = response.data;  // Updated
      return result.Success;  // Assuming it's Success, not success
    } catch (error) {
      throw error;
    }
  }
}

// Fix the legacy class (getAllAccountGroups is not exported)
class AccountGroupsServiceLegacy {
  async getAllAccountGroups() {
    const service = AccountGroupsService.getInstance();
    return await service.getAllAccountGroups();
  }
  // Add other methods...
}
export const accountGroupsService = new AccountGroupsServiceLegacy();
