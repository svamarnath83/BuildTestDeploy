'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../../../packages/ui/src/components/ui/card';
import { Button } from '../../../../../packages/ui/src/components/ui/button';
import { Input } from '../../../../../packages/ui/src/components/ui/input';
import { ChartOfAccountDto, AccountGroupDto, Account } from '../../../../../packages/ui/libs/registers/accounts/models';

type AccountWithGroup = Account & { accountGroup?: AccountGroupDto };
import AccountForm from './AccountForm';
import { Search } from 'lucide-react';
import CustomAccountTable from './CustomAccountTable';
import { accountsService, deleteAccount } from '../../../../../packages/ui/libs/registers/accounts/services';
import AccountsOrchestrator from '../libs/accountsService';

export default function AccountsExplorer() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<ChartOfAccountDto | null>(null);
  const [accounts, setAccounts] = useState<AccountWithGroup[]>([]);
  const [accountGroups, setAccountGroups] = useState<AccountGroupDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  // Load from API services
  const loadLists = useCallback(async () => {
    setIsLoading(true);
    try {
      const [apiAccounts, apiGroups] = await Promise.all([
        accountsService.getAccounts(),
        accountsService.getAccountGroups(),
      ]);
      
      // Ensure we have arrays (accountsService already handles this)
      const validAccounts = Array.isArray(apiAccounts) ? apiAccounts : [];
      const validGroups = Array.isArray(apiGroups) ? apiGroups : [];
      
      // Map API Account model to camelCase Account interface
      const transformedAccounts: Account[] = validAccounts.map((account: any) => {
        // Handle all possible property name variations from backend
        return {
          id: account.Id || account.id || 0,
          accountNumber: account.AccountNumber || account.accountNumber || account.account_number || '',
          accountName: account.AccountName || account.accountName || account.account_name || '',
          externalAccountNumber: account.ExternalAccountNumber || account.externalAccountNumber || account.external_account_number || null,
          ledgerType: account.LedgerType || account.ledgerType || account.ledger_type || null,
          dimension: account.Dimension || account.dimension || null,
          currency: account.Currency || account.currency || null,
          currencyCode: account.CurrencyCode || account.currencyCode || account.currency_code || null,
          status: account.Status || account.status || 'Free',
          type: account.Type || account.type || null,
          accountGroupId: account.AccountGroupId || account.accountGroupId || account.account_group_id || null,
        };
      });
      
      // Map API AccountGroup model to AccountGroupDto  
      const transformedGroups: AccountGroupDto[] = validGroups.map((group: any) => ({
        id: group.Id || group.id,
        code: group.GroupCode || group.group_code || group.code || '',
        accountType: group.AccountType || group.account_type || '',
        subType1: group.SubType1 || group.sub_type1 || '',
        subType2: group.SubType2 || group.sub_type2 || '',
        ledgerAccount: group.LedgerAccount || group.ledger_account || '',
        numberRangeStart: group.NumberRangeStart ?? group.number_range_start ?? null,
        numberRangeEnd: group.NumberRangeEnd ?? group.number_range_end ?? null,
        dimensionCode: group.DimensionCode || group.dimension_code || '',
        isActive: group.IsActive ?? group.is_active ?? true
      }));
      
      // Add accountGroup reference to accounts
      const accountsWithGroups: AccountWithGroup[] = transformedAccounts.map(account => ({
        ...account,
        accountGroup: transformedGroups.find(group => group.id === account.accountGroupId)
      }));
      
      setAccounts(accountsWithGroups);
      setAccountGroups(transformedGroups);
    } catch (error) {
      // Set empty arrays instead of showing alert
      setAccounts([]);
      setAccountGroups([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLists();
  }, [loadLists]);

  // Filter accounts based on search query and selected group
  const filteredAccounts = useMemo(() => {
    let filtered = accounts;
    // Filter by selected group (number range) first
    if (selectedGroup) {
      filtered = filtered.filter((account) => 
        account.accountNumber?.startsWith(selectedGroup)
      );
    }
    // Then filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((account) => 
        (account.accountNumber && account.accountNumber.toLowerCase().includes(query)) ||
        (account.accountName && account.accountName.toLowerCase().includes(query)) ||
  (account.accountGroup && account.accountGroup.code && account.accountGroup.code.toLowerCase().includes(query)) ||
        (account.ledgerType && account.ledgerType.toLowerCase().includes(query))
      );
    }
    return filtered;
  }, [accounts, searchQuery, selectedGroup]);

  const handleEdit = (account: ChartOfAccountDto) => {
    setEditingAccount(account);
    setIsFormOpen(true);
  };

  const handleShowForm = () => {
    setEditingAccount(null);
    setIsFormOpen(true);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading accounts...</div>;
  }

  if (isFormOpen) {
    return (
      <AccountForm
        id={editingAccount?.id}
      />
    );
  }

  return (
    <div className="h-screen bg-gray-50 p-4">
      {/* Paper-like Container with Groups Inside */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-300 flex flex-col h-full">
        {/* Header with Groups, Search and Actions */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                {selectedGroup ? `${selectedGroup}xxx Accounts` : 'Accounts'}
              </h1>
              <Button onClick={handleShowForm} className="bg-green-600 hover:bg-green-700">
                + New
              </Button>
            </div>
            
            {/* Search Box */}
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search accounts..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          {/* Account Groups as Horizontal Tabs - Inside Border */}
          <div className="flex space-x-1 overflow-x-auto">
            <button
              onClick={() => setSelectedGroup(null)}
              className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                !selectedGroup 
                  ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              All ({accounts.length})
            </button>
            {[
              { range: '1', name: 'Assets', accounts: accounts.filter(a => a.accountNumber?.startsWith('1')) },
              { range: '2', name: 'Liabilities', accounts: accounts.filter(a => a.accountNumber?.startsWith('2')) },
              { range: '3', name: 'Equity', accounts: accounts.filter(a => a.accountNumber?.startsWith('3')) },
              { range: '4', name: 'Income', accounts: accounts.filter(a => a.accountNumber?.startsWith('4')) },
              { range: '5', name: 'Cost of Sales', accounts: accounts.filter(a => a.accountNumber?.startsWith('5')) },
              { range: '6', name: 'Expenses', accounts: accounts.filter(a => a.accountNumber?.startsWith('6')) },
              { range: '7', name: 'Other Income', accounts: accounts.filter(a => a.accountNumber?.startsWith('7')) },
              { range: '8', name: 'Other Expenses', accounts: accounts.filter(a => a.accountNumber?.startsWith('8')) },
              { range: '9', name: 'Summary', accounts: accounts.filter(a => a.accountNumber?.startsWith('9')) },
            ].map((group) => (
              <button
                key={group.range}
                onClick={() => setSelectedGroup(selectedGroup === group.range ? null : group.range)}
                className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedGroup === group.range 
                    ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <span className="font-bold">{group.range}</span> {group.name} ({group.accounts.length})
              </button>
            ))}
          </div>
        </div>

        {/* Account Table - Fixed to use correct props */}
        <div className="flex-1 overflow-hidden p-4">
          <CustomAccountTable
            accounts={filteredAccounts}
            accountGroups={accountGroups}
            onRefresh={loadLists}
          />
        </div>
      </div>
    </div>
  );
}
