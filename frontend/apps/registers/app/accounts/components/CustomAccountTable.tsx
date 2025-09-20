'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AccountGroupDto, Account } from '../../../../../packages/ui/libs/registers/accounts/models';

type AccountWithGroup = Account & { accountGroup?: AccountGroupDto };
import AccountsOrchestrator from '../libs/accountsService';

interface CustomAccountTableProps {
  accounts: AccountWithGroup[];
  accountGroups: AccountGroupDto[];
  onRefresh: () => Promise<void>;
}

const ledgerTypes = [
  { value: 'GL', label: 'General Ledger' },
  { value: 'AR', label: 'Accounts Receivable' },
  { value: 'AP', label: 'Accounts Payable' },
];

const accountTypes = [
  { value: 'Balance', label: 'Balance Sheet' },
  { value: 'P&L', label: 'Profit & Loss' },
];

const currencies = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'JPY', label: 'JPY - Japanese Yen' },
  { value: 'CAD', label: 'CAD - Canadian Dollar' },
  { value: 'AUD', label: 'AUD - Australian Dollar' },
];

export default function CustomAccountTable({ 
  accounts, 
  accountGroups,
  onRefresh
}: CustomAccountTableProps) {
  const router = useRouter();
  
  // New account state matching API model
  const [newAccount, setNewAccount] = useState<any>({
    accountNumber: '',
    accountName: '',
    externalAccountNumber: '',
    ledgerType: '',
    dimension: '',
    currency: '',
    currencyCode: '',
    status: 'Free',
    type: '',
    accountGroupId: undefined
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingAccount, setEditingAccount] = useState<AccountWithGroup | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (isCreating) return; // Prevent double submission
    
    setIsCreating(true);
    
    // Validate required fields before submitting
  if (!newAccount.accountNumber?.trim()) {
      alert('Account number is required');
      setIsCreating(false);
      return;
    }

  if (!newAccount.accountName?.trim()) {
      alert('Account name is required');
      setIsCreating(false);
      return;
    }

    try {
      // Map UI fields to API Account model with proper cleaning
      const accountData = {
        accountNumber: newAccount.accountNumber?.trim() || '',
        accountName: newAccount.accountName?.trim() || '',
        externalAccountNumber: newAccount.externalAccountNumber?.trim() || '',
        ledgerType: newAccount.ledgerType?.trim() || '',
        dimension: newAccount.dimension?.trim() || '',
        currency: newAccount.currency?.trim() || '',
        currencyCode: newAccount.currencyCode?.trim() || '',
        status: newAccount.status || 'Free',
        type: newAccount.type?.trim() || '',
        accountGroupId: newAccount.accountGroupId || null
      };

      const result = await AccountsOrchestrator.submitAccount(accountData, 'add');
      
      if (result.success) {
        // Reset form and reload data
        setNewAccount({
          accountNumber: '',
          accountName: '',
          externalAccountNumber: '',
          ledgerType: '',
          dimension: '',
          currency: '',
          currencyCode: '',
          status: 'Free',
          type: '',
          accountGroupId: undefined
        });
        await onRefresh();
        alert('Account created successfully!');
      } else {
        // Show detailed error message
        if (result.validationErrors && result.validationErrors.length > 0) {
          alert('Validation failed:\n' + result.validationErrors.join('\n'));
        } else {
          alert('Failed to create account:\n' + (result.error || 'Unknown error'));
        }
      }
    } catch (error: any) {
      alert('Failed to create account: ' + error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleEdit = (account: AccountWithGroup) => {
    if (account == null) return;
    if (account.id == null) {
      // still allow editing the object, but keep editingId null
      setEditingId(null);
      setEditingAccount({ ...account });
      return;
    }
    setEditingId(String(account.id));
    setEditingAccount({ ...account });
  };

  const handleNavigateToEdit = (account: AccountWithGroup) => {
    if (!account || account.id == null) {
      return;
    }
    router.push(`/accounts/edit?id=${encodeURIComponent(String(account.id))}`);
  };

  const handleSaveEdit = async () => {
    if (editingAccount && editingId) {
      try {
        // Map UI fields to API Account model with camelCase properties
        const accountData = {
          id: editingAccount.id,
          accountNumber: editingAccount.accountNumber?.trim() || '',
          accountName: editingAccount.accountName?.trim() || '',
          externalAccountNumber: editingAccount.externalAccountNumber?.trim() || '',
          ledgerType: editingAccount.ledgerType?.trim() || '',
          dimension: editingAccount.dimension?.trim() || '',
          currency: editingAccount.currency?.trim() || '',
          currencyCode: editingAccount.currencyCode?.trim() || '',
          status: editingAccount.status || 'Free',
          type: editingAccount.type?.trim() || '',
          accountGroupId: editingAccount.accountGroupId || null
        };

        const result = await AccountsOrchestrator.submitAccount(accountData, 'edit');
        
        if (result.success) {
          setEditingId(null);
          setEditingAccount(null);
          await onRefresh();
          alert('Account updated successfully!');
        } else {
          if (result.validationErrors && result.validationErrors.length > 0) {
            alert('Validation failed:\n' + result.validationErrors.join('\n'));
          } else {
            alert('Failed to update account:\n' + (result.error || 'Unknown error'));
          }
        }
      } catch (error: any) {
        alert('Failed to update account: ' + error.message);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingAccount(null);
  };

  const handleDelete = async (account: AccountWithGroup) => {
    if (window.confirm(`Are you sure you want to delete account "${account.accountName}"?`)) {
      try {
        const { deleteAccount } = await import('../../../../../packages/ui/libs/registers/accounts/services');
        await deleteAccount(account.id);
        await onRefresh();
        alert('Account deleted successfully!');
      } catch (error: any) {
        alert('Failed to delete account: ' + error.message);
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Account Number
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Account Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Group
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ledger Type
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              External Account
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Dimension
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Currency Type
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Currency
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {/* Create new account row */}
          <tr className="hover:bg-gray-50">
            <td className="px-4 py-3">
              <input
                type="text"
                value={newAccount.accountNumber || ''}
                onChange={(e) => setNewAccount({ ...newAccount, accountNumber: e.target.value })}
                placeholder="Enter account number"
                className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none py-1.5"
                onClick={(e) => e.stopPropagation()}
                maxLength={20}
              />
            </td>
            <td className="px-4 py-3">
              <input
                type="text"
                value={newAccount.accountName || ''}
                onChange={(e) => setNewAccount({ ...newAccount, accountName: e.target.value })}
                placeholder="Enter account name"
                className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none py-1.5"
                onClick={(e) => e.stopPropagation()}
                maxLength={100}
              />
            </td>
            <td className="px-4 py-3">
              <select
                value={newAccount.accountGroupId || ''}
                onChange={(e) => setNewAccount({ ...newAccount, accountGroupId: e.target.value ? parseInt(e.target.value) : undefined })}
                className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none py-1.5"
                onClick={(e) => e.stopPropagation()}
              >
                <option value="">Select group</option>
                {accountGroups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.code}
                  </option>
                ))}
              </select>
            </td>
            <td className="px-4 py-3">
              <select
                value={newAccount.ledgerType || ''}
                onChange={(e) => setNewAccount({ ...newAccount, ledgerType: e.target.value })}
                className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none py-1.5"
                onClick={(e) => e.stopPropagation()}
              >
                <option value="">Select type</option>
                {ledgerTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </td>
            <td className="px-4 py-3">
              <input
                type="text"
                value={newAccount.externalAccountNumber || ''}
                onChange={(e) => setNewAccount({ ...newAccount, externalAccountNumber: e.target.value })}
                placeholder="External account"
                className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none py-1.5"
                onClick={(e) => e.stopPropagation()}
                maxLength={50}
              />
            </td>
            <td className="px-4 py-3">
              <input
                type="text"
                value={newAccount.dimension || ''}
                onChange={(e) => setNewAccount({ ...newAccount, dimension: e.target.value })}
                placeholder="Dimension"
                className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none py-1.5"
                onClick={(e) => e.stopPropagation()}
                maxLength={50}
              />
            </td>
            <td className="px-4 py-3">
              <select
                value={newAccount.status || 'Free'}
                onChange={(e) => setNewAccount({ ...newAccount, status: e.target.value, currencyCode: e.target.value === 'Free' ? '' : newAccount.currencyCode })}
                className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none py-1.5"
                onClick={(e) => e.stopPropagation()}
              >
                <option value="Free">Free</option>
                <option value="Locked">Locked</option>
              </select>
            </td>
            <td className="px-4 py-3">
              <select
                value={newAccount.currencyCode || ''}
                onChange={(e) => setNewAccount({ ...newAccount, currencyCode: e.target.value })}
                disabled={newAccount.status === 'Free'}
                className={`w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none py-1.5 ${
                  newAccount.status === 'Free' ? 'text-gray-400' : ''
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <option value="">Select currency</option>
                {currencies.map((currency) => (
                  <option key={currency.value} value={currency.value}>
                    {currency.label}
                  </option>
                ))}
              </select>
            </td>
            <td className="px-4 py-3 text-center">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            </td>
            <td className="px-4 py-3 text-center">
              <button
                onClick={handleCreate}
                disabled={isCreating}
                className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isCreating 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isCreating ? 'Creating...' : 'Create'}
              </button>
            </td>
          </tr>

          {/* Existing accounts */}
          {accounts.map((account) => {
            const isEditing = editingId === String(account.id);
            const displayAccount = isEditing ? editingAccount : account;
            
            if (!displayAccount) return null;
            
            return (
              <tr 
                key={account.id} 
                className={`hover:bg-gray-50 cursor-pointer ${isEditing ? 'bg-yellow-50' : ''}`}
                onClick={() => {
                  if (!isEditing) {
                    handleEdit(account);
                  }
                }}
              >
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {isEditing ? (
                    <input
                      type="text"
                      value={displayAccount.accountNumber || ''}
                      onChange={(e) => setEditingAccount(prev => prev ? { ...prev, accountNumber: e.target.value } : null)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none py-1.5"
                      maxLength={20}
                    />
                  ) : (
                    account.accountNumber
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {isEditing ? (
                    <input
                      type="text"
                      value={displayAccount.accountName || ''}
                      onChange={(e) => setEditingAccount(prev => prev ? { ...prev, accountName: e.target.value } : null)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none py-1.5"
                      maxLength={100}
                    />
                  ) : (
                    account.accountName
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {isEditing ? (
                    <select
                      value={displayAccount.accountGroupId || ''}
                      onChange={(e) => setEditingAccount(prev => prev ? { ...prev, accountGroupId: e.target.value ? parseInt(e.target.value) : undefined } : null)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none py-1.5"
                    >
                      <option value="">Select group</option>
                      {accountGroups.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.code}
                        </option>
                      ))}
                    </select>
                  ) : (
                    account.accountGroup?.code || '-'
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {isEditing ? (
                    <select
                      value={displayAccount.ledgerType || ''}
                      onChange={(e) => setEditingAccount(prev => prev ? { ...prev, ledgerType: e.target.value } : null)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none py-1.5"
                    >
                      <option value="">Select type</option>
                      {ledgerTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    account.ledgerType || '-'
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {isEditing ? (
                    <input
                      type="text"
                      value={displayAccount.externalAccountNumber || ''}
                      onChange={(e) => setEditingAccount(prev => prev ? { ...prev, externalAccountNumber: e.target.value } : null)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none py-1.5"
                      maxLength={50}
                    />
                  ) : (
                    account.externalAccountNumber || '-'
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {isEditing ? (
                    <input
                      type="text"
                      value={displayAccount.dimension || ''}
                      onChange={(e) => setEditingAccount(prev => prev ? { ...prev, dimension: e.target.value } : null)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none py-1.5"
                      maxLength={50}
                    />
                  ) : (
                    account.dimension || '-'
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {isEditing ? (
                    <select
                      value={displayAccount.status || 'Free'}
                      onChange={(e) => setEditingAccount(prev => prev ? {
                        ...prev, 
                        status: e.target.value,
                        currencyCode: e.target.value === 'Free' ? '' : prev.currencyCode
                      } : null)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none py-1.5"
                    >
                      <option value="Free">Free</option>
                      <option value="Locked">Locked</option>
                    </select>
                  ) : (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      account.status === 'Locked' 
                        ? 'bg-orange-100 text-orange-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {account.status || 'Free'}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {isEditing ? (
                    <select
                      value={displayAccount.currencyCode || ''}
                      onChange={(e) => setEditingAccount(prev => prev ? { ...prev, currencyCode: e.target.value } : null)}
                      disabled={displayAccount.status === 'Free'}
                      onClick={(e) => e.stopPropagation()}
                      className={`w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none py-1.5 ${
                        displayAccount.status === 'Free' ? 'text-gray-400' : ''
                      }`}
                    >
                      <option value="">Select currency</option>
                      {currencies.map((currency) => (
                        <option key={currency.value} value={currency.value}>
                          {currency.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    account.status === 'Locked' ? (account.currencyCode || '-') : '-'
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    account.status !== 'Locked' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {account.status !== 'Locked' ? 'Active' : 'Locked'}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <div 
                    className="flex items-center justify-center space-x-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleSaveEdit}
                          className="text-green-600 hover:text-green-900 text-sm font-medium"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleNavigateToEdit(account)}
                          className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(account)}
                          className="text-red-600 hover:text-red-900 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
