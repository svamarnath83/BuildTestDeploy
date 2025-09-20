"use client";

import React, { useState } from 'react';
import { Plus, Search, Filter, Download, Upload, Edit, Trash2, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AccountGroup {
  id: string;
  groupCode: string;
  groupName: string;
  accountType: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  parentGroup?: string;
  description: string;
  isActive: boolean;
  totalAccounts: number;
  createdDate: string;
  lastModified: string;
}

export default function AccountGroupsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  // Mock data - replace with actual API call
  const [accountGroups] = useState<AccountGroup[]>([
    {
      id: '1',
      groupCode: 'AG001',
      groupName: 'Current Assets',
      accountType: 'Asset',
      parentGroup: 'Assets',
      description: 'Short-term assets expected to be converted to cash within one year',
      isActive: true,
      totalAccounts: 15,
      createdDate: '2025-01-01',
      lastModified: '2025-09-04'
    },
    {
      id: '2',
      groupCode: 'AG002',
      groupName: 'Fixed Assets',
      accountType: 'Asset',
      parentGroup: 'Assets',
      description: 'Long-term assets used in business operations',
      isActive: true,
      totalAccounts: 8,
      createdDate: '2025-01-01',
      lastModified: '2025-08-15'
    },
    {
      id: '3',
      groupCode: 'AG003',
      groupName: 'Operating Revenue',
      accountType: 'Revenue',
      description: 'Revenue from primary business operations',
      isActive: true,
      totalAccounts: 12,
      createdDate: '2025-01-01',
      lastModified: '2025-09-01'
    },
    {
      id: '4',
      groupCode: 'AG004',
      groupName: 'Operating Expenses',
      accountType: 'Expense',
      description: 'Day-to-day expenses for business operations',
      isActive: true,
      totalAccounts: 25,
      createdDate: '2025-01-01',
      lastModified: '2025-08-30'
    },
    {
      id: '5',
      groupCode: 'AG005',
      groupName: 'Current Liabilities',
      accountType: 'Liability',
      parentGroup: 'Liabilities',
      description: 'Short-term obligations due within one year',
      isActive: true,
      totalAccounts: 10,
      createdDate: '2025-01-01',
      lastModified: '2025-08-25'
    }
  ]);

  const filteredGroups = accountGroups.filter(group => {
    const matchesSearch = group.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.groupCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'All' || group.accountType === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleCreateNew = () => {
    router.push('/chart-of-accounts/account-groups/create');
  };

  const handleEdit = (id: string) => {
    router.push(`/chart-of-accounts/account-groups/edit/${id}`);
  };

  const handleView = (id: string) => {
    router.push(`/chart-of-accounts/account-groups/view/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Account Groups</h1>
            <p className="text-gray-600 mt-1">
              Manage account group classifications and hierarchies
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {/* Import functionality */}}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Import</span>
            </button>
            <button
              onClick={() => {/* Export functionality */}}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button
              onClick={handleCreateNew}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Group</span>
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search account groups by name, code, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-3">
              <Filter className="text-gray-400 w-4 h-4" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

        {/* Account Groups Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left p-4 font-medium text-gray-700">Group Code</th>
                  <th className="text-left p-4 font-medium text-gray-700">Group Name</th>
                  <th className="text-left p-4 font-medium text-gray-700">Account Type</th>
                  <th className="text-left p-4 font-medium text-gray-700">Parent Group</th>
                  <th className="text-left p-4 font-medium text-gray-700">Description</th>
                  <th className="text-left p-4 font-medium text-gray-700">Total Accounts</th>
                  <th className="text-left p-4 font-medium text-gray-700">Status</th>
                  <th className="text-left p-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGroups.map((group) => (
                  <tr 
                    key={group.id} 
                    className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleEdit(group.id)}
                  >
                    <td className="p-4 font-medium text-gray-900">{group.groupCode}</td>
                    <td className="p-4 font-semibold text-gray-900">{group.groupName}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        group.accountType === 'Asset' ? 'bg-green-100 text-green-800' :
                        group.accountType === 'Liability' ? 'bg-red-100 text-red-800' :
                        group.accountType === 'Equity' ? 'bg-blue-100 text-blue-800' :
                        group.accountType === 'Revenue' ? 'bg-purple-100 text-purple-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {group.accountType}
                      </span>
                    </td>
                    <td className="p-4 text-gray-700">{group.parentGroup || '-'}</td>
                    <td className="p-4 text-gray-600 max-w-xs truncate">{group.description}</td>
                    <td className="p-4 text-center">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                        {group.totalAccounts}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        group.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {group.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleView(group.id);
                          }}
                          className="p-1 text-gray-600 hover:text-blue-600"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(group.id);
                          }}
                          className="p-1 text-gray-600 hover:text-green-600"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            /* Delete functionality */
                          }}
                          className="p-1 text-gray-600 hover:text-red-600"
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
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-green-600">{accountGroups.filter(g => g.accountType === 'Asset').length}</div>
            <div className="text-sm text-gray-600">Asset Groups</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-red-600">{accountGroups.filter(g => g.accountType === 'Liability').length}</div>
            <div className="text-sm text-gray-600">Liability Groups</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">{accountGroups.filter(g => g.accountType === 'Equity').length}</div>
            <div className="text-sm text-gray-600">Equity Groups</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-purple-600">{accountGroups.filter(g => g.accountType === 'Revenue').length}</div>
            <div className="text-sm text-gray-600">Revenue Groups</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-orange-600">{accountGroups.filter(g => g.accountType === 'Expense').length}</div>
            <div className="text-sm text-gray-600">Expense Groups</div>
          </div>
        </div>
      </div>
    </div>
  );
}
