export interface AccountGroup {
  id: number;
  actType: string;  // Add this (matches backend ActType)
  groupCode: string;
  description: string;
  level1Name: string;
  level1Code: string;
  level2Name: string;
  level2Code: string;
  level3Name: string;
  level3Code: string;
  ifrsReference: string;
  saftCode: string;
}

export interface CreateAccountGroupRequest {
  actType: string;  // Add this
  groupCode: string;
  description: string;
  level1Name: string;
  level1Code: string;
  level2Name: string;
  level2Code: string;
  level3Name: string;
  level3Code: string;
  ifrsReference: string;
  saftCode: string;
}

export interface UpdateAccountGroupRequest extends CreateAccountGroupRequest {
  id: number;
  // actType is already included via extension
}

// AccountGroupsResponse and AccountGroupResponse don't need changes
export interface AccountGroupsResponse {
  Success: boolean;
  Data: AccountGroup[];
  Message: string;
}

export interface AccountGroupResponse {
  Success: boolean;
  Data: AccountGroup;
  Message: string;
}
