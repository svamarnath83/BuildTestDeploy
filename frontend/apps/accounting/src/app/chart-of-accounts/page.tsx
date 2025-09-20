"use client";

import React, { useState } from 'react';
import { Plus, Search, Filter, Download, Upload, Edit, Trash2, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CoAAccount {
  id: string;
  groupCode: string;
  accountType: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  subType1: string;
  subType2: string;
  subType3?: string;
  dimensionCode: string;
  accountNumber: string;
  accountDescription: string;
  externalAccountNumber?: string;
  validCompanies: string;
  historicalAccounts: boolean;
  isActive: boolean;
}

export default function ChartOfAccountsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  // Mock data - replace with actual API call
  const [accounts] = useState<CoAAccount[]>([
    {
      id: '1',
      groupCode: '1100',
      accountType: 'Asset',
      subType1: 'Current Asset',
      subType2: 'Cash and Cash Equivalents',
      subType3: 'Cash',
      dimensionCode: '110',
      accountNumber: '100100',
      accountDescription: 'UNB USD Bank Account',
      externalAccountNumber: '1210',
      validCompanies: 'All/Linked List/Not in List',
      historicalAccounts: true,
      isActive: true
    },
    {
      id: '2',
      groupCode: '1200',
      accountType: 'Asset',
      subType1: 'Current Asset',
      subType2: 'Trade and Other Receivables',
      dimensionCode: '120',
      accountNumber: '120100',
      accountDescription: 'Accounts Receivable - Trade',
      externalAccountNumber: '1220',
      validCompanies: 'All Companies',
      historicalAccounts: false,
      isActive: true
    }
  ]);

  const handleCreateNew = () => {
    router.push('/chart-of-accounts/create');
  };

  const handleEdit = (id: string) => {
    router.push(`/chart-of-accounts/edit/${id}`);
  };

  const handleView = (id: string) => {
    router.push(`/chart-of-accounts/view/${id}`);
  };

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.accountDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.accountNumber.includes(searchTerm) ||
                         account.groupCode.includes(searchTerm);
    const matchesFilter = filterType === 'All' || account.accountType === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Chart of Accounts</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              grouping, classifying & mapping financial accounts
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {/* Import functionality */}}
              className="flex items-center space-x-2 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Import</span>
            </button>
            <button
              onClick={() => {/* Export functionality */}}
              className="flex items-center space-x-2 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button
              onClick={handleCreateNew}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Account</span>
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search accounts by description, number, or group code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
            <div className="flex items-center space-x-3">
              <Filter className="text-slate-400 w-4 h-4" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="All">All Types</option>
                <option value="Asset">Asset</option>
                <option value="Liability">Liability</option>
                <option value="Equity">Equity</option>
                <option value="Revenue">Revenue</option>
                <option value="Expense">Expense</option>
              </select>
            </div>
          </div>
        </div>

        {/* Accounts Table */}
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                  <th className="text-left p-4 font-medium text-slate-700 dark:text-slate-300">Group Code</th>
                  <th className="text-left p-4 font-medium text-slate-700 dark:text-slate-300">Account Type</th>
                  <th className="text-left p-4 font-medium text-slate-700 dark:text-slate-300">Account Number</th>
                  <th className="text-left p-4 font-medium text-slate-700 dark:text-slate-300">Description</th>
                  <th className="text-left p-4 font-medium text-slate-700 dark:text-slate-300">SubType1</th>
                  <th className="text-left p-4 font-medium text-slate-700 dark:text-slate-300">SubType2</th>
                  <th className="text-left p-4 font-medium text-slate-700 dark:text-slate-300">Dimension</th>
                  <th className="text-left p-4 font-medium text-slate-700 dark:text-slate-300">Status</th>
                  <th className="text-left p-4 font-medium text-slate-700 dark:text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map((account) => (
                  <tr 
                    key={account.id} 
                    className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                    onClick={() => handleEdit(account.id)}
                  >
                    <td className="p-4 font-medium text-slate-900 dark:text-slate-100">{account.groupCode}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        account.accountType === 'Asset' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        account.accountType === 'Liability' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        account.accountType === 'Equity' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        account.accountType === 'Revenue' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                        'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                      }`}>
                        {account.accountType}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-slate-700 dark:text-slate-300">{account.accountNumber}</td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">{account.accountDescription}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400 text-sm">{account.subType1}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400 text-sm">{account.subType2}</td>
                    <td className="p-4 font-mono text-slate-700 dark:text-slate-300">{account.dimensionCode}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        account.isActive 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}>
                        {account.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleView(account.id);
                          }}
                          className="p-1 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(account.id);
                          }}
                          className="p-1 text-slate-600 hover:text-green-600 dark:text-slate-400 dark:hover:text-green-400"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            /* Delete functionality */
                          }}
                          className="p-1 text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{accounts.filter(a => a.accountType === 'Asset').length}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Assets</div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{accounts.filter(a => a.accountType === 'Liability').length}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Liabilities</div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{accounts.filter(a => a.accountType === 'Equity').length}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Equity</div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{accounts.filter(a => a.accountType === 'Revenue').length}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Revenue</div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{accounts.filter(a => a.accountType === 'Expense').length}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Expenses</div>
          </div>
        </div>
      </div>
    </div>
  );
}
