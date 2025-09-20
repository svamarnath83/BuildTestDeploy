// Backend DTOs matching the SQL schema
export interface AccountGroupDto {
  id: number;
  code: string;
  accountType: string;
  subType1: string;
  subType2: string;
  ledgerAccount: string;
  numberRangeStart?: number | null;
  numberRangeEnd?: number | null;
  dimensionCode: string;
  isActive: boolean;
}

export interface ChartOfAccountDto {
  id: number;
  accountGroupCode?: string | null;
  subType?: string | null;
  accountNumber?: string | null;
  description?: string | null;
  externalAcctNumber?: string | null;
  dimension?: string | null;
  validCompanies?: string | null;
  historical: boolean;
  isActive: boolean;
  accountGroup?: AccountGroupDto | null;
}

export interface Account {
  id: number;
  accountNumber: string;
  accountName: string;
  externalAccountNumber?: string | null;
  ledgerType?: string | null;
  dimension?: string | null;
  currency?: string | null;
  currencyCode?: string | null;
  status?: 'Free' | 'Locked' | string;
  type?: string | null;
  accountGroupId?: number | null;
}

// Create/Update request DTOs
export interface CreateAccountGroupRequest {
  code: string;
  accountType: string;
  subType1?: string;
  subType2?: string;
  ledgerAccount?: string;
  numberRangeStart?: number;
  numberRangeEnd?: number;
  dimensionCode?: string;
  isActive?: boolean;
}

export interface UpdateAccountGroupRequest extends Partial<CreateAccountGroupRequest> {
  id: number;
}

export interface CreateChartOfAccountRequest {
  accountGroupCode: string;
  subType?: string;
  accountNumber: string;
  description: string;
  externalAcctNumber?: string;
  dimension?: string;
  validCompanies?: string;
  historical?: boolean;
  isActive?: boolean;
}

export interface UpdateChartOfAccountRequest extends Partial<CreateChartOfAccountRequest> {
  id: number;
}

export interface CreateAccountRequest {
  accountNumber: string;
  accountName: string;
  externalAccountNumber?: string;
  ledgerType?: string;
  dimension?: string;
  currency?: string;
  currencyCode?: string;
  status?: string;
  type?: string;
  accountGroupId?: number;
}

export interface UpdateAccountRequest extends Partial<CreateAccountRequest> {
  id: number;
}
