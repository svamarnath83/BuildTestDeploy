"use client";
import React, { useEffect, useState } from 'react';
import { getAccountById } from '../../../../../packages/ui/libs/registers/accounts/services';
import AccountsOrchestrator from '../libs/accountsService';
import { Account } from '../../../../../packages/ui/libs/registers/accounts/models';

interface Props {
  id?: number;
}

export default function AccountForm({ id }: Props) {
  const [form, setForm] = useState<Account>({
    id: 0,
    accountNumber: '',
    accountName: '',
    externalAccountNumber: '',
    ledgerType: '',
    dimension: '',
    currency: '',
    currencyCode: '',
    status: 'Free',
    type: '',
    accountGroupId: undefined,
  });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getAccountById(id)
      .then((r: any) => {
        const data = r.data || r;
        
        // Transform API response to match our camelCase form structure
        const transformedData: Account = {
          id: data.id || 0,
          accountNumber: data.accountNumber || '',
          accountName: data.accountName || '',
          externalAccountNumber: data.externalAccountNumber || '',
          ledgerType: data.ledgerType || '',
          dimension: data.dimension || '',
          currency: data.currency || '',
          currencyCode: data.currencyCode || '',
          status: data.status || 'Free',
          type: data.type || '',
          accountGroupId: data.accountGroupId || undefined,
        };
        
        setForm(transformedData);
      })
      .catch((e: any) => {
        alert('Failed to load account: ' + e.message);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (name: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [name]: value }));
    setErrors((prev: any) => {
      const { [name]: _removed, ...rest } = prev;
      return rest;
    });
  };

  const handleSave = async () => {
    if (saving) return;
    
    setSaving(true);
    setErrors({});

    try {
      const mode = id ? 'edit' : 'add';
      
      // Add ID to form if editing
      const formWithId = id ? { ...form, id } : form;
      
      const validation = AccountsOrchestrator.validateAccountForm(formWithId, mode);
      
      if (!validation.isValid) {
        setErrors(validation.fieldErrors || {});
        alert('Validation failed:\n' + validation.errors.join('\n'));
        return;
      }

      const res = await AccountsOrchestrator.submitAccount(formWithId, mode);
      
      if (res.success) {
        alert('Account saved successfully!');
        if (!id) {
          // Reset form after successful creation
          setForm({
            id: 0,
            accountNumber: '',
            accountName: '',
            externalAccountNumber: '',
            ledgerType: '',
            dimension: '',
            currency: '',
            currencyCode: '',
            status: 'Free',
            type: '',
            accountGroupId: undefined,
          });
        }
      } else {
        alert('Failed to save account: ' + (res.error || 'Unknown error'));
      }
    } catch (error: any) {
      alert('Failed to save account: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="p-4">
      <div className="text-center">Loading account...</div>
    </div>
  );

  return (
    <div className="p-4 max-w-3xl bg-white rounded-lg shadow-lg border border-gray-300">
      
      <h3 className="text-lg font-medium mb-4">
        {id ? 'Edit Account' : 'Create New Account'}
      </h3>
      
      <div className="grid grid-cols-1 gap-4">
        {/* Account Number - Required */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account Number *
          </label>
          <input 
            value={form.accountNumber || ''} 
            onChange={e => handleChange('accountNumber', e.target.value.substring(0, 20))}
            className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none py-2" 
            maxLength={20}
            placeholder="Enter account number"
          />
          {errors.accountNumber && (
            <div className="text-red-600 text-sm mt-1">{errors.accountNumber}</div>
          )}
        </div>

        {/* Account Name - Required */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account Name *
          </label>
          <input 
            value={form.accountName || ''} 
            onChange={e => handleChange('accountName', e.target.value.substring(0, 100))}
            className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none py-2" 
            maxLength={100}
            placeholder="Enter account name"
          />
          {errors.accountName && (
            <div className="text-red-600 text-sm mt-1">{errors.accountName}</div>
          )}
        </div>

        {/* Ledger Type and Type */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ledger Type
            </label>
            <select 
              value={form.ledgerType || ''} 
              onChange={e => handleChange('ledgerType', e.target.value)}
              className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none py-2"
            >
              <option value="">Select ledger type</option>
              <option value="GL">General Ledger</option>
              <option value="AR">Accounts Receivable</option>
              <option value="AP">Accounts Payable</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select 
              value={form.type || ''} 
              onChange={e => handleChange('type', e.target.value)}
              className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none py-2"
            >
              <option value="">Select type</option>
              <option value="Balance">Balance Sheet</option>
              <option value="P&L">Profit & Loss</option>
            </select>
          </div>
        </div>

        {/* External Account Number and Dimension */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              External Account Number
            </label>
            <input 
              value={form.externalAccountNumber || ''} 
              onChange={e => handleChange('externalAccountNumber', e.target.value.substring(0, 50))}
              className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none py-2" 
              maxLength={50}
              placeholder="Enter external account number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dimension
            </label>
            <input 
              value={form.dimension || ''} 
              onChange={e => handleChange('dimension', e.target.value.substring(0, 50))}
              className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none py-2" 
              maxLength={50}
              placeholder="Enter dimension"
            />
          </div>
        </div>

        {/* Currency and Currency Code */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currency
            </label>
            <input 
              value={form.currency || ''} 
              onChange={e => handleChange('currency', e.target.value)}
              className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none py-2" 
              placeholder="Enter currency"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currency Code
            </label>
            <select 
              value={form.currencyCode || ''} 
              onChange={e => handleChange('currencyCode', e.target.value)}
              className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none py-2"
            >
              <option value="">Select currency</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="JPY">JPY - Japanese Yen</option>
              <option value="CAD">CAD - Canadian Dollar</option>
              <option value="AUD">AUD - Australian Dollar</option>
            </select>
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select 
            value={form.status || 'Free'} 
            onChange={e => handleChange('status', e.target.value)}
            className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none py-2"
          >
            <option value="Free">Free</option>
            <option value="Locked">Locked</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button 
            onClick={handleSave} 
            disabled={saving}
            className={`px-4 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              saving 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {saving ? 'Saving...' : (id ? 'Update' : 'Create')} Account
          </button>
          <button 
            onClick={() => window.history.back()} 
            disabled={saving}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
