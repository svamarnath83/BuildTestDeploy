"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CreditCard, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Calendar,
  Building,
  FileText,
  Eye,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  TrendingDown,
  Calculator,
  DollarSign
} from 'lucide-react';

// Utility function for class names
function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

interface APBill {
  id: string;
  billNumber: string;
  vendor: string;
  vendorEmail: string;
  amount: number;
  dueDate: string;
  billDate: string;
  status: 'draft' | 'approved' | 'scheduled' | 'paid' | 'overdue';
  daysOverdue?: number;
  paymentTerms: string;
  category: string;
}

const sampleBills: APBill[] = [
  {
    id: '1',
    billNumber: 'BILL-2025-001',
    vendor: 'Singapore Port Authority',
    vendorEmail: 'billing@mpa.gov.sg',
    amount: 45000.00,
    dueDate: '2025-02-20',
    billDate: '2025-01-20',
    status: 'approved',
    paymentTerms: 'Net 30',
    category: 'Port Charges'
  },
  {
    id: '2',
    billNumber: 'BILL-2025-002',
    vendor: 'Marine Fuel Supply Ltd',
    vendorEmail: 'accounts@marinefuel.com',
    amount: 189500.00,
    dueDate: '2025-01-15',
    billDate: '2024-12-15',
    status: 'overdue',
    daysOverdue: 30,
    paymentTerms: 'Net 30',
    category: 'Fuel & Bunker'
  },
  {
    id: '3',
    billNumber: 'BILL-2025-003',
    vendor: 'Lloyd\'s Register',
    vendorEmail: 'invoicing@lr.org',
    amount: 25800.00,
    dueDate: '2025-03-01',
    billDate: '2025-02-01',
    status: 'scheduled',
    paymentTerms: 'Net 30',
    category: 'Classification'
  },
  {
    id: '4',
    billNumber: 'BILL-2025-004',
    vendor: 'Hamburg Port Operations',
    vendorEmail: 'billing@hhla.de',
    amount: 67200.00,
    dueDate: '2025-02-25',
    billDate: '2025-01-25',
    status: 'draft',
    paymentTerms: 'Net 30',
    category: 'Port Charges'
  },
  {
    id: '5',
    billNumber: 'BILL-2024-198',
    vendor: 'Ship Management Services',
    vendorEmail: 'finance@shipmanagement.com',
    amount: 125000.00,
    dueDate: '2025-01-10',
    billDate: '2024-12-10',
    status: 'paid',
    paymentTerms: 'Net 30',
    category: 'Crew Management'
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'paid': return <CheckCircle className="w-4 h-4 text-green-600" />;
    case 'overdue': return <AlertTriangle className="w-4 h-4 text-red-600" />;
    case 'scheduled': return <Clock className="w-4 h-4 text-blue-600" />;
    case 'approved': return <FileText className="w-4 h-4 text-purple-600" />;
    case 'draft': return <Edit className="w-4 h-4 text-gray-600" />;
    default: return <FileText className="w-4 h-4 text-gray-600" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'overdue': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'approved': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
};

export default function AccountsPayablePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const handleCreateBill = () => {
    router.push('/ap/create');
  };

  const handleEditBill = (billId: string) => {
    router.push(`/ap/create?id=${billId}`);
  };

  const handleViewBill = (billId: string) => {
    router.push(`/ap/create?id=${billId}&mode=view`);
  };

  const filteredBills = sampleBills.filter(bill => {
    const matchesSearch = bill.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || bill.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPayable = sampleBills
    .filter(bill => ['approved', 'scheduled', 'overdue'].includes(bill.status))
    .reduce((sum, bill) => sum + bill.amount, 0);

  const overdueAmount = sampleBills
    .filter(bill => bill.status === 'overdue')
    .reduce((sum, bill) => sum + bill.amount, 0);

  const scheduledAmount = sampleBills
    .filter(bill => bill.status === 'scheduled')
    .reduce((sum, bill) => sum + bill.amount, 0);

  const paidAmount = sampleBills
    .filter(bill => bill.status === 'paid')
    .reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Accounts Payable
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage vendor bills and track payments - Following Odoo, Dynamics, Oracle standards
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button 
            onClick={handleCreateBill}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Bill
          </button>
        </div>
      </div>

      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Payable</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                ${totalPayable.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
            <span className="text-red-600">-8.2%</span>
            <span className="text-slate-600 dark:text-slate-400 ml-1">vs last month</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Overdue Amount</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                ${overdueAmount.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-300" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Clock className="w-4 h-4 text-red-600 mr-1" />
            <span className="text-red-600">1 bill</span>
            <span className="text-slate-600 dark:text-slate-400 ml-1">past due</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Scheduled Payments</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                ${scheduledAmount.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-yellow-600 dark:text-yellow-300" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-green-600">Ready</span>
            <span className="text-slate-600 dark:text-slate-400 ml-1">for payment</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Paid (MTD)</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                ${paidAmount.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-300" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <BarChart3 className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-green-600">98.5%</span>
            <span className="text-slate-600 dark:text-slate-400 ml-1">on-time rate</span>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by vendor name or bill number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="approved">Approved</option>
              <option value="scheduled">Scheduled</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bills Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Vendor Bills ({filteredBills.length})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Bill Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Vendor
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
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {filteredBills.map((bill) => (
                <tr 
                  key={bill.id} 
                  className="hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                  onClick={() => router.push(`/ap/create?id=${bill.id}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {bill.billNumber}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        Date: {new Date(bill.billDate).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-slate-400 dark:text-slate-500">
                        {bill.category} • {bill.paymentTerms}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                        <Building className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {bill.vendor}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          {bill.vendorEmail}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      ${bill.amount.toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      USD
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900 dark:text-slate-100">
                      {new Date(bill.dueDate).toLocaleDateString()}
                    </div>
                    {bill.daysOverdue && (
                      <div className="text-sm text-red-600 dark:text-red-400">
                        {bill.daysOverdue} days overdue
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(bill.status)}`}>
                      {getStatusIcon(bill.status)}
                      {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleViewBill(bill.id)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="View Bill"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditBill(bill.id)}
                        className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300"
                        title="Edit Bill"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
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

      {/* Industry Standard Features Note */}
      <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <Calculator className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Industry-Standard AP Features
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
              This AP module follows best practices from Odoo ERP, Microsoft Dynamics 365, and Oracle Fusion Cloud, 
              including three-way matching, approval workflows, vendor management, and automated payment scheduling.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
