"use client";

import React, { useState } from 'react';
import { 
  DollarSign, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Calendar,
  User,
  FileText,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  TrendingUp,
  Calculator
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// Utility function for class names
function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

interface ARInvoice {
  id: string;
  invoiceNumber: string;
  customer: string;
  customerEmail: string;
  amount: number;
  dueDate: string;
  invoiceDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  daysOverdue?: number;
  currency: string;
  reference: string;
}

const sampleInvoices: ARInvoice[] = [
  {
    id: '1',
    invoiceNumber: 'FREE2510193',
    customer: 'Scorpio Ship Management Ltd',
    customerEmail: 'billing@scorpio.com',
    amount: 6875.00,
    dueDate: '2025-02-20',
    invoiceDate: '2025-01-20',
    status: 'draft',
    currency: 'SGD',
    reference: 'GEORGEC0007'
  },
  {
    id: '2',
    invoiceNumber: 'INV-2025-002',
    customer: 'Maersk Line Ltd',
    customerEmail: 'accounts@maersk.com',
    amount: 89200.00,
    dueDate: '2025-01-15',
    invoiceDate: '2024-12-15',
    status: 'overdue',
    daysOverdue: 30,
    currency: 'USD',
    reference: 'REF-MAERSK-12345'
  },
  {
    id: '3',
    invoiceNumber: 'INV-2025-003',
    customer: 'COSCO Shipping Lines',
    customerEmail: 'finance@cosco.com',
    amount: 67800.00,
    dueDate: '2025-03-01',
    invoiceDate: '2025-02-01',
    status: 'sent',
    currency: 'EUR',
    reference: 'COSCO-Q1-2025'
  },
  {
    id: '4',
    invoiceNumber: 'INV-2025-004',
    customer: 'CMA CGM Group',
    customerEmail: 'billing@cma-cgm.com',
    amount: 156200.00,
    dueDate: '2025-03-10',
    invoiceDate: '2025-02-10',
    status: 'paid',
    currency: 'USD',
    reference: 'CMA-WINTER-2025'
  },
  {
    id: '5',
    invoiceNumber: 'INV-2024-198',
    customer: 'Hapag-Lloyd AG',
    customerEmail: 'finance@hapag-lloyd.com',
    amount: 234500.00,
    dueDate: '2025-01-05',
    invoiceDate: '2024-12-05',
    status: 'paid',
    currency: 'EUR',
    reference: 'HAPAG-DEC-2024'
  }
];

export default function AccountsReceivablePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredInvoices = sampleInvoices.filter(invoice => {
    const matchesSearch = invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || invoice.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'sent': return <FileText className="w-4 h-4 text-blue-600" />;
      case 'overdue': return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'draft': return <Edit className="w-4 h-4 text-gray-600" />;
      case 'cancelled': return <Trash2 className="w-4 h-4 text-red-600" />;
      default: return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'sent': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'overdue': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const totalReceivable = sampleInvoices
    .filter(invoice => ['sent', 'overdue'].includes(invoice.status))
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  const overdueAmount = sampleInvoices
    .filter(invoice => invoice.status === 'overdue')
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  const paidAmount = sampleInvoices
    .filter(invoice => invoice.status === 'paid')
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  const draftAmount = sampleInvoices
    .filter(invoice => invoice.status === 'draft')
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  const handleCreateInvoice = () => {
    router.push('/ar/create');
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 dark:bg-slate-900 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Accounts Receivable
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage customer invoices and payments
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleCreateInvoice}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Create Invoice
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Outstanding</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                ${totalReceivable.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600">+12% from last month</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Overdue Amount</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                ${overdueAmount.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {sampleInvoices.filter(inv => inv.status === 'overdue').length} overdue invoices
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Paid This Month</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                ${paidAmount.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {sampleInvoices.filter(inv => inv.status === 'paid').length} payments received
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Draft Invoices</p>
              <p className="text-2xl font-bold text-slate-600 dark:text-slate-400">
                ${draftAmount.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
              <Edit className="w-6 h-6 text-slate-600 dark:text-slate-400" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {sampleInvoices.filter(inv => inv.status === 'draft').length} pending finalization
            </span>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search invoices, customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            <button className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Recent Invoices</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {filteredInvoices.map((invoice) => (
                <tr 
                  key={invoice.id} 
                  className="hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                  onClick={() => router.push(`/ar/create?id=${invoice.id}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-8 h-8">
                        {getStatusIcon(invoice.status)}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {invoice.invoiceNumber}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          {invoice.invoiceDate}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {invoice.customer}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {invoice.customerEmail}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {invoice.currency} ${invoice.amount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900 dark:text-slate-100">
                      {invoice.dueDate}
                    </div>
                    {invoice.daysOverdue && (
                      <div className="text-sm text-red-600 dark:text-red-400">
                        {invoice.daysOverdue} days overdue
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      getStatusColor(invoice.status)
                    )}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center gap-2 justify-end">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Add view functionality
                        }}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/ar/create?id=${invoice.id}`);
                        }}
                        className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Add delete functionality
                        }}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
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
    </div>
  );
}
