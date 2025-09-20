"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Calendar,
  FileText,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  Calculator,
  TrendingUp,
  DollarSign,
  Building
} from 'lucide-react';

// Utility function for class names
function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

interface JournalEntry {
  id: string;
  journalNumber: string;
  description: string;
  reference: string;
  entryDate: string;
  postingDate: string;
  totalDebit: number;
  totalCredit: number;
  status: 'draft' | 'posted' | 'reversed' | 'approved';
  createdBy: string;
  journal: string;
  lineItems: number;
}

interface JournalLine {
  id: string;
  account: string;
  accountName: string;
  description: string;
  debit: number;
  credit: number;
  reference: string;
}

const sampleJournalEntries: JournalEntry[] = [
  {
    id: '1',
    journalNumber: 'JE-2025-001',
    description: 'Fuel Purchase - MV Atlantic Carrier',
    reference: 'FUEL-2025-001',
    entryDate: '2025-01-15',
    postingDate: '2025-01-15',
    totalDebit: 189500.00,
    totalCredit: 189500.00,
    status: 'posted',
    createdBy: 'John Smith',
    journal: 'General Journal',
    lineItems: 2
  },
  {
    id: '2',
    journalNumber: 'JE-2025-002',
    description: 'Port Charges - Singapore Port Authority',
    reference: 'PORT-SG-2025-001',
    entryDate: '2025-01-20',
    postingDate: '2025-01-20',
    totalDebit: 45000.00,
    totalCredit: 45000.00,
    status: 'posted',
    createdBy: 'Sarah Johnson',
    journal: 'General Journal',
    lineItems: 3
  },
  {
    id: '3',
    journalNumber: 'JE-2025-003',
    description: 'Currency Revaluation - EUR/USD',
    reference: 'FX-REV-2025-001',
    entryDate: '2025-01-31',
    postingDate: '2025-01-31',
    totalDebit: 12500.00,
    totalCredit: 12500.00,
    status: 'approved',
    createdBy: 'Michael Chen',
    journal: 'Currency Journal',
    lineItems: 4
  },
  {
    id: '4',
    journalNumber: 'JE-2025-004',
    description: 'Crew Salary Accrual - January 2025',
    reference: 'CREW-ACR-2025-01',
    entryDate: '2025-01-31',
    postingDate: '2025-02-01',
    totalDebit: 85000.00,
    totalCredit: 85000.00,
    status: 'draft',
    createdBy: 'Lisa Wong',
    journal: 'Payroll Journal',
    lineItems: 6
  },
  {
    id: '5',
    journalNumber: 'JE-2025-005',
    description: 'Depreciation - Vessel Equipment Q1',
    reference: 'DEP-VESSEL-2025-Q1',
    entryDate: '2025-01-31',
    postingDate: '2025-01-31',
    totalDebit: 125000.00,
    totalCredit: 125000.00,
    status: 'reversed',
    createdBy: 'David Kim',
    journal: 'Depreciation Journal',
    lineItems: 8
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'posted': return <CheckCircle className="w-4 h-4 text-green-600" />;
    case 'approved': return <FileText className="w-4 h-4 text-purple-600" />;
    case 'draft': return <Edit className="w-4 h-4 text-gray-600" />;
    case 'reversed': return <AlertCircle className="w-4 h-4 text-red-600" />;
    default: return <FileText className="w-4 h-4 text-gray-600" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'posted': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'approved': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    case 'reversed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
};

export default function JournalEntryPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedJournal, setSelectedJournal] = useState('all');

  const handleCreateEntry = () => {
    router.push('/journals/create');
  };

  const handleEditEntry = (entryId: string) => {
    router.push(`/journals/create?id=${entryId}`);
  };

  const handleViewEntry = (entryId: string) => {
    router.push(`/journals/create?id=${entryId}&mode=view`);
  };

  const filteredEntries = sampleJournalEntries.filter(entry => {
    const matchesSearch = entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.journalNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || entry.status === selectedStatus;
    const matchesJournal = selectedJournal === 'all' || entry.journal === selectedJournal;
    return matchesSearch && matchesStatus && matchesJournal;
  });

  const totalPosted = sampleJournalEntries
    .filter(entry => entry.status === 'posted')
    .reduce((sum, entry) => sum + entry.totalDebit, 0);

  const draftEntries = sampleJournalEntries.filter(entry => entry.status === 'draft').length;
  const approvedEntries = sampleJournalEntries.filter(entry => entry.status === 'approved').length;
  const reversedEntries = sampleJournalEntries.filter(entry => entry.status === 'reversed').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Journal Entry (JE)
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Record and manage journal entries - Following Odoo, Dynamics, Oracle standards
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button 
            onClick={handleCreateEntry}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Journal Entry
          </button>
        </div>
      </div>

      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Posted (MTD)</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                ${totalPosted.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-300" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-green-600">+12.5%</span>
            <span className="text-slate-600 dark:text-slate-400 ml-1">vs last month</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Draft Entries</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {draftEntries}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
              <Edit className="w-6 h-6 text-orange-600 dark:text-orange-300" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Clock className="w-4 h-4 text-orange-600 mr-1" />
            <span className="text-orange-600">Pending</span>
            <span className="text-slate-600 dark:text-slate-400 ml-1">review</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Approved Entries</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {approvedEntries}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-600 dark:text-purple-300" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <CheckCircle className="w-4 h-4 text-purple-600 mr-1" />
            <span className="text-purple-600">Ready</span>
            <span className="text-slate-600 dark:text-slate-400 ml-1">to post</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Accuracy Rate</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                98.7%
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Calculator className="w-4 h-4 text-blue-600 mr-1" />
            <span className="text-blue-600">{reversedEntries} reversed</span>
            <span className="text-slate-600 dark:text-slate-400 ml-1">this month</span>
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
              placeholder="Search by description, journal number, or reference..."
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
              <option value="posted">Posted</option>
              <option value="reversed">Reversed</option>
            </select>
            <select
              value={selectedJournal}
              onChange={(e) => setSelectedJournal(e.target.value)}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
            >
              <option value="all">All Journals</option>
              <option value="General Journal">General Journal</option>
              <option value="Currency Journal">Currency Journal</option>
              <option value="Payroll Journal">Payroll Journal</option>
              <option value="Depreciation Journal">Depreciation Journal</option>
            </select>
          </div>
        </div>
      </div>

      {/* Journal Entries Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Journal Entries ({filteredEntries.length})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Entry Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Dates
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
              {filteredEntries.map((entry) => (
                <tr 
                  key={entry.id} 
                  className="hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                  onClick={() => router.push(`/journals/create?id=${entry.id}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {entry.journalNumber}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        Ref: {entry.reference}
                      </div>
                      <div className="text-xs text-slate-400 dark:text-slate-500">
                        {entry.journal} • {entry.lineItems} lines
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-900 dark:text-slate-100 max-w-xs">
                      {entry.description}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      By: {entry.createdBy}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      ${entry.totalDebit.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Dr = Cr
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900 dark:text-slate-100">
                      Entry: {new Date(entry.entryDate).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      Post: {new Date(entry.postingDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(entry.status)}`}>
                      {getStatusIcon(entry.status)}
                      {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleViewEntry(entry.id)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="View Entry"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditEntry(entry.id)}
                        className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300"
                        title="Edit Entry"
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
          <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Industry-Standard Journal Entry Features
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
              This Journal Entry module follows best practices from Odoo ERP, Microsoft Dynamics 365, and Oracle Fusion Cloud, 
              including multi-currency support, recurring entries, approval workflows, reversing entries, and automated posting rules.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
