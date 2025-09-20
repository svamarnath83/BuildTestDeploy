import { accountsService } from '../../../../../packages/ui/libs/registers/accounts/services';

class AccountsOrchestrator {
  validateAccountForm(form: any, mode: string) {
    const errors: string[] = [];
    const fieldErrors: any = {};

    // Required field validation - check for both null/undefined and empty string
    const accountNumberValue = form.accountNumber?.toString().trim();
    const accountNameValue = form.accountName?.toString().trim();
    
    if (!accountNumberValue) {
      const error = 'Account number is required';
      errors.push(error);
      fieldErrors.accountNumber = error;
    }

    if (!accountNameValue) {
      const error = 'Account name is required';
      errors.push(error);
      fieldErrors.accountName = error;
    }

    // Length validation based on API model constraints
    if (form.accountNumber && form.accountNumber.toString().length > 20) {
      const error = 'Account number must be 20 characters or less';
      errors.push(error);
      fieldErrors.accountNumber = error;
    }

    if (form.accountName && form.accountName.toString().length > 100) {
      const error = 'Account name must be 100 characters or less';
      errors.push(error);
      fieldErrors.accountName = error;
    }

    if (form.externalAccountNumber && form.externalAccountNumber.toString().length > 50) {
      const error = 'External account number must be 50 characters or less';
      errors.push(error);
      fieldErrors.externalAccountNumber = error;
    }

    return {
      isValid: errors.length === 0,
      errors,
      fieldErrors
    };
  }

  async submitAccount(form: any, mode: string) {
    try {
      // Validate the form data
      const originalValidation = this.validateAccountForm(form, mode);
      
      // Clean and prepare the account data for API
      const accountData: any = {
        id: mode === 'add' ? 0 : (form.id || 0), // Add id field for Account interface
        accountNumber: form.accountNumber?.toString().trim() || '',
        accountName: form.accountName?.toString().trim() || '',
        externalAccountNumber: form.externalAccountNumber?.toString().trim() || null,
        ledgerType: form.ledgerType?.toString().trim() || null,
        dimension: form.dimension?.toString().trim() || null,
        currency: form.currency?.toString().trim() || null,
        currencyCode: form.currencyCode?.toString().trim() || null,
        status: form.status?.toString().trim() || 'Free',
        type: form.type?.toString().trim() || null,
        accountGroupId: form.accountGroupId ? parseInt(form.accountGroupId.toString()) : null
      };

      // Remove null/empty values except for required fields
      Object.keys(accountData).forEach(key => {
        if ((accountData as any)[key] === null || (accountData as any)[key] === '' || (accountData as any)[key] === undefined) {
          if (key !== 'accountNumber' && key !== 'accountName' && key !== 'id') {
            delete (accountData as any)[key];
          }
        }
      });

      // Validate the cleaned data
      const validation = this.validateAccountForm(accountData, mode);
      if (!validation.isValid) {
        return {
          success: false,
          error: 'Validation failed: ' + validation.errors.join(', '),
          fieldErrors: validation.fieldErrors,
          validationErrors: validation.errors
        };
      }

      let result;
      if (mode === 'add') {
        result = await accountsService.createAccount(accountData);
      } else if (mode === 'edit') {
        if (!accountData.id) {
          throw new Error('Account ID is required for update');
        }
        result = await accountsService.updateAccount(accountData.id, accountData);
      } else {
        throw new Error('Invalid mode: ' + mode);
      }

      // Check if result indicates success
      if (result) {
        return {
          success: true,
          data: result
        };
      } else {
        return {
          success: false,
          error: 'API returned empty result'
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to save account',
        details: error
      };
    }
  }
}

export default new AccountsOrchestrator();
