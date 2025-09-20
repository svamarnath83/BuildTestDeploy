import { AccountGroupsService } from '../../../../../packages/ui/libs/registers/account-groups/services';
import { AccountGroupFormData, accountGroupSchema } from '../../../../../packages/ui/libs/registers/account-groups/schemas';
import { AccountGroup } from '../../../../../packages/ui/libs/registers/account-groups/models';

export class AccountGroupsOrchestrator {
  private accountGroupsService: AccountGroupsService;

  constructor() {
    this.accountGroupsService = AccountGroupsService.getInstance();
  }

  async validateAndCreateAccountGroup(formData: AccountGroupFormData): Promise<AccountGroup> {
    const validatedData = accountGroupSchema.parse(formData);
    // Transform undefined values to empty strings for API compatibility
    const apiData = {
      groupCode: validatedData.groupCode,
      description: validatedData.description,
      level1Name: validatedData.level1Name || '',
      level1Code: validatedData.level1Code || '',
      level2Name: validatedData.level2Name || '',
      level2Code: validatedData.level2Code || '',
      level3Name: validatedData.level3Name || '',
      level3Code: validatedData.level3Code || '',
      ifrsReference: validatedData.ifrsReference || '',
      saftCode: validatedData.saftCode || '',
    };
    return await this.accountGroupsService.createAccountGroup(apiData);
  }

  async validateAndUpdateAccountGroup(id: number, formData: AccountGroupFormData): Promise<AccountGroup> {
    const validatedData = accountGroupSchema.parse(formData);
    // Transform undefined values to empty strings for API compatibility
    const apiData = {
      groupCode: validatedData.groupCode,
      description: validatedData.description,
      level1Name: validatedData.level1Name || '',
      level1Code: validatedData.level1Code || '',
      level2Name: validatedData.level2Name || '',
      level2Code: validatedData.level2Code || '',
      level3Name: validatedData.level3Name || '',
      level3Code: validatedData.level3Code || '',
      ifrsReference: validatedData.ifrsReference || '',
      saftCode: validatedData.saftCode || '',
    };
    return await this.accountGroupsService.updateAccountGroup(id, { ...apiData, id });
  }

  async getAllAccountGroups(): Promise<AccountGroup[]> {
    console.log('AccountGroupsOrchestrator: getAllAccountGroups called');
    return await this.accountGroupsService.getAllAccountGroups();
  }

  async getAccountGroupById(id: number): Promise<AccountGroup> {
    return await this.accountGroupsService.getAccountGroupById(id);
  }

  async deleteAccountGroup(id: number): Promise<boolean> {
    return await this.accountGroupsService.deleteAccountGroup(id);
  }
}
