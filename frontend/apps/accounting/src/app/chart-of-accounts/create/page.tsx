"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Eye, MoreHorizontal, Upload, Paperclip, FileText, Info, CheckCircle, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { 
  currencies,
  companies,
  sampleCustomers
} from '@/../../packages/ui/libs/accounting';

interface CoAFormData {
  // Basic Information
  accountNumber: string;
  accountDescription: string;
  accountType: string;
  groupCode: string;
  companyCode: string;
  
  // Classification
  subType1: string;
  subType2: string;
  subType3: string;
  reportClassification1: string;
  reportClassification2: string;
  
  // Settings
  ledgerAccount: boolean;
  isActive: boolean;
  externalAccountNumber: string;
  
  // Document Information
  createdBy: string;
  createdDate: string;
  updatedBy: string;
  updatedDate: string;
  status: string;
}

interface DimensionData {
  code: string;
  invoiceNo: string;
  invoiceDate: string;
  dueDate: string;
  currencyDate: string;
  purchaseDate: string;
  ship: string;
  voyage: string;
  cargoNo: string;
  port: string;
  project: string;
  poNo: string;
  quantity: number;
  vat: number;
}

interface CreateCoAPageProps {
  editId?: string;
}

export default function CreateCoAPage({ editId }: CreateCoAPageProps) {
  const router = useRouter();
  const isEditMode = !!editId;
  const [status, setStatus] = useState<'Draft' | 'Posted'>('Draft');
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<CoAFormData>({
    // Basic Information
    accountNumber: '410001',
    accountDescription: 'Freight Revenue - Ocean',
    accountType: 'Revenue',
    groupCode: 'AG001',
    companyCode: companies[0]?.value || 'SHL001',
    
    // Classification
    subType1: 'Operating Revenue',
    subType2: 'Service Revenue',
    subType3: 'Freight Revenue',
    reportClassification1: 'P&L - Revenue',
    reportClassification2: 'Operating Income',
    
    // Settings
    ledgerAccount: true,
    isActive: true,
    externalAccountNumber: '4100',
    
    // Document Information
    createdBy: 'Current User',
    createdDate: '04/09/2025',
    updatedBy: '',
    updatedDate: '',
    status: 'Draft'
  });

  const [dimensionData, setDimensionData] = useState<DimensionData>({
    code: 'DIM001',
    invoiceNo: 'INV/25-26/0001',
    invoiceDate: '2025-09-04',
    dueDate: '2025-10-04',
    currencyDate: '2025-09-04',
    purchaseDate: '2025-09-04',
    ship: 'MV Ocean Star',
    voyage: 'V001',
    cargoNo: 'CG001',
    port: 'Singapore',
    project: 'Project Alpha',
    poNo: 'PO/2025/001',
    quantity: 1000,
    vat: 18
  });

  const handleFieldChange = (field: keyof CoAFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDimensionChange = (field: keyof DimensionData, value: any) => {
    setDimensionData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBack = () => {
    router.push('/chart-of-accounts');
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      console.log('Saving CoA account:', formData);
      console.log('Saving dimensions:', dimensionData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Chart of Account saved successfully!');
      router.push('/chart-of-accounts');
    } catch (error) {
      console.error('Error saving CoA account:', error);
      alert('Error saving account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWorkflowApproval = () => {
    if (status === 'Draft') {
      setStatus('Posted');
      setFormData(prev => ({
        ...prev,
        status: 'Posted',
        updatedBy: 'Current User',
        updatedDate: '04/09/2025'
      }));
    }
  };

  const accountTypes = [
    { value: 'Asset', label: 'Asset' },
    { value: 'Liability', label: 'Liability' },
    { value: 'Equity', label: 'Equity' },
    { value: 'Revenue', label: 'Revenue' },
    { value: 'Expense', label: 'Expense' }
  ];

  const subTypes1 = [
    { value: 'Current Asset', label: 'Current Asset' },
    { value: 'Fixed Asset', label: 'Fixed Asset' },
    { value: 'Operating Revenue', label: 'Operating Revenue' },
    { value: 'Other Revenue', label: 'Other Revenue' },
    { value: 'Operating Expense', label: 'Operating Expense' },
    { value: 'Administrative Expense', label: 'Administrative Expense' }
  ];

  const subTypes2 = [
    { value: 'Service Revenue', label: 'Service Revenue' },
    { value: 'Product Revenue', label: 'Product Revenue' },
    { value: 'Freight Revenue', label: 'Freight Revenue' },
    { value: 'Charter Revenue', label: 'Charter Revenue' }
  ];

  const ships = [
    { value: 'MV Ocean Star', label: 'MV Ocean Star' },
    { value: 'MV Sea Princess', label: 'MV Sea Princess' },
    { value: 'MV Pacific Glory', label: 'MV Pacific Glory' },
    { value: 'MV Atlantic Hope', label: 'MV Atlantic Hope' }
  ];

  const ports = [
    { value: 'Singapore', label: 'Singapore' },
    { value: 'Shanghai', label: 'Shanghai' },
    { value: 'Rotterdam', label: 'Rotterdam' },
    { value: 'Hamburg', label: 'Hamburg' },
    { value: 'Jebel Ali', label: 'Jebel Ali' }
  ];

  const reportClassifications1 = [
    { value: 'P&L - Revenue', label: 'P&L - Revenue' },
    { value: 'P&L - Expense', label: 'P&L - Expense' },
    { value: 'Balance Sheet - Asset', label: 'Balance Sheet - Asset' },
    { value: 'Balance Sheet - Liability', label: 'Balance Sheet - Liability' },
    { value: 'Balance Sheet - Equity', label: 'Balance Sheet - Equity' }
  ];

  const reportClassifications2 = [
    { value: 'Operating Income', label: 'Operating Income' },
    { value: 'Other Income', label: 'Other Income' },
    { value: 'Operating Expense', label: 'Operating Expense' },
    { value: 'Finance Cost', label: 'Finance Cost' }
  ];

  // Load data for edit mode
  useEffect(() => {
    if (editId) {
      // Simulate loading edit data
      console.log('Loading account for edit:', editId);
    }
  }, [editId]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditMode ? 'Edit Account' : 'Create Chart of Account'}
              </h1>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-sm text-gray-500">COA/{formData.accountNumber}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  status === 'Posted' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {status === 'Posted' ? (
                    <><CheckCircle className="w-3 h-3 inline mr-1" />Posted</>
                  ) : (
                    <><Clock className="w-3 h-3 inline mr-1" />Draft</>
                  )}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleSave}
              disabled={status === 'Posted' || isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{isLoading ? 'Saving...' : 'Save'}</span>
            </button>
            
            {status === 'Draft' && (
              <button
                onClick={handleWorkflowApproval}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Approve & Post</span>
              </button>
            )}
            
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Paper-like container */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[800px]">
          {/* Account Header Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Account Information</h2>
                  <p className="text-sm text-gray-500">Configure chart of account settings</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Account Number</div>
                <div className="text-lg font-semibold text-gray-900">{formData.accountNumber}</div>
              </div>
            </div>

            {/* Header Fields - Vertical Layout */}
            <div className="space-y-6">
              {/* Row 1: Basic Information */}
              <div className="space-y-4">
                <h3 className="text-md font-semibold text-gray-800 border-b border-gray-200 pb-2">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 block">Account Number</label>
                    <input
                      type="text"
                      className="w-full px-2 py-1.5 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                      value={formData.accountNumber}
                      disabled={status === 'Posted'}
                      onChange={(e) => handleFieldChange('accountNumber', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 block">Account Description</label>
                    <input
                      type="text"
                      className="w-full px-2 py-1.5 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                      value={formData.accountDescription}
                      disabled={status === 'Posted'}
                      onChange={(e) => handleFieldChange('accountDescription', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 block">Account Type</label>
                    <select
                      className="w-full px-2 py-1.5 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                      value={formData.accountType}
                      disabled={status === 'Posted'}
                      onChange={(e) => handleFieldChange('accountType', e.target.value)}
                    >
                      {accountTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Row 2: Classification */}
              <div className="space-y-4">
                <h3 className="text-md font-semibold text-gray-800 border-b border-gray-200 pb-2">Classification</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 block">Group Code</label>
                    <input
                      type="text"
                      className="w-full px-2 py-1.5 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                      value={formData.groupCode}
                      disabled={status === 'Posted'}
                      onChange={(e) => handleFieldChange('groupCode', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 block">Sub Type 1</label>
                    <select
                      className="w-full px-2 py-1.5 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                      value={formData.subType1}
                      disabled={status === 'Posted'}
                      onChange={(e) => handleFieldChange('subType1', e.target.value)}
                    >
                      {subTypes1.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 block">Sub Type 2</label>
                    <select
                      className="w-full px-2 py-1.5 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                      value={formData.subType2}
                      disabled={status === 'Posted'}
                      onChange={(e) => handleFieldChange('subType2', e.target.value)}
                    >
                      {subTypes2.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Row 3: Reporting and Settings */}
              <div className="space-y-4">
                <h3 className="text-md font-semibold text-gray-800 border-b border-gray-200 pb-2">Reporting & Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 block">Sub Type 3</label>
                    <input
                      type="text"
                      className="w-full px-2 py-1.5 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                      value={formData.subType3}
                      disabled={status === 'Posted'}
                      onChange={(e) => handleFieldChange('subType3', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 block">Report Class 1</label>
                    <select
                      className="w-full px-2 py-1.5 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                      value={formData.reportClassification1}
                      disabled={status === 'Posted'}
                      onChange={(e) => handleFieldChange('reportClassification1', e.target.value)}
                    >
                      {reportClassifications1.map(cls => (
                        <option key={cls.value} value={cls.value}>
                          {cls.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 block">Report Class 2</label>
                    <select
                      className="w-full px-2 py-1.5 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                      value={formData.reportClassification2}
                      disabled={status === 'Posted'}
                      onChange={(e) => handleFieldChange('reportClassification2', e.target.value)}
                    >
                      {reportClassifications2.map(cls => (
                        <option key={cls.value} value={cls.value}>
                          {cls.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 block">Company</label>
                    <select
                      className="w-full px-2 py-1.5 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                      value={formData.companyCode}
                      disabled={status === 'Posted'}
                      onChange={(e) => handleFieldChange('companyCode', e.target.value)}
                    >
                      {companies.map(company => (
                        <option key={company.value} value={company.value}>
                          {company.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Row 4: External Settings and Status */}
              <div className="space-y-4">
                <h3 className="text-md font-semibold text-gray-800 border-b border-gray-200 pb-2">External Settings & Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 block">External Account</label>
                    <input
                      type="text"
                      className="w-full px-2 py-1.5 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                      value={formData.externalAccountNumber}
                      disabled={status === 'Posted'}
                      onChange={(e) => handleFieldChange('externalAccountNumber', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-blue-600"
                        checked={formData.ledgerAccount}
                        disabled={status === 'Posted'}
                        onChange={(e) => handleFieldChange('ledgerAccount', e.target.checked)}
                      />
                      <span className="text-xs font-medium text-gray-600">Ledger Account</span>
                    </label>
                    
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-blue-600"
                        checked={formData.isActive}
                        disabled={status === 'Posted'}
                        onChange={(e) => handleFieldChange('isActive', e.target.checked)}
                      />
                      <span className="text-xs font-medium text-gray-600">Active</span>
                    </label>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 block">Created By</label>
                    <div className="px-2 py-1.5 text-sm text-gray-600 border-b-2 border-gray-300">
                      {formData.createdBy}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 block">Created Date</label>
                    <div className="px-2 py-1.5 text-sm text-gray-600 border-b-2 border-gray-300">
                      {formData.createdDate}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dimensions Card */}
          <div className="p-6">
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Dimension Information</h3>
                  <p className="text-sm text-gray-600">Configure dimension fields for this account</p>
                </div>
              </div>

              {/* Dimensions - Vertical Layout */}
              <div className="space-y-6">
                {/* Row 1: Codes and References */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-700 border-b border-blue-200 pb-2">Codes & References</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-600 block">Code</label>
                      <input
                        type="text"
                        className="w-full px-2 py-1.5 bg-white border-0 border-b-2 border-blue-300 focus:border-blue-500 focus:outline-none text-sm"
                        value={dimensionData.code}
                        disabled={status === 'Posted'}
                        onChange={(e) => handleDimensionChange('code', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-600 block">Invoice No</label>
                      <input
                        type="text"
                        className="w-full px-2 py-1.5 bg-white border-0 border-b-2 border-blue-300 focus:border-blue-500 focus:outline-none text-sm"
                        value={dimensionData.invoiceNo}
                        disabled={status === 'Posted'}
                        onChange={(e) => handleDimensionChange('invoiceNo', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-600 block">PO No</label>
                      <input
                        type="text"
                        className="w-full px-2 py-1.5 bg-white border-0 border-b-2 border-blue-300 focus:border-blue-500 focus:outline-none text-sm"
                        value={dimensionData.poNo}
                        disabled={status === 'Posted'}
                        onChange={(e) => handleDimensionChange('poNo', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-600 block">Project</label>
                      <input
                        type="text"
                        className="w-full px-2 py-1.5 bg-white border-0 border-b-2 border-blue-300 focus:border-blue-500 focus:outline-none text-sm"
                        value={dimensionData.project}
                        disabled={status === 'Posted'}
                        onChange={(e) => handleDimensionChange('project', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2: Dates */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-700 border-b border-blue-200 pb-2">Dates</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-600 block">Invoice Date</label>
                      <input
                        type="date"
                        className="w-full px-2 py-1.5 bg-white border-0 border-b-2 border-blue-300 focus:border-blue-500 focus:outline-none text-sm"
                        value={dimensionData.invoiceDate}
                        disabled={status === 'Posted'}
                        onChange={(e) => handleDimensionChange('invoiceDate', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-600 block">Due Date</label>
                      <input
                        type="date"
                        className="w-full px-2 py-1.5 bg-white border-0 border-b-2 border-blue-300 focus:border-blue-500 focus:outline-none text-sm"
                        value={dimensionData.dueDate}
                        disabled={status === 'Posted'}
                        onChange={(e) => handleDimensionChange('dueDate', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-600 block">Currency Date</label>
                      <input
                        type="date"
                        className="w-full px-2 py-1.5 bg-white border-0 border-b-2 border-blue-300 focus:border-blue-500 focus:outline-none text-sm"
                        value={dimensionData.currencyDate}
                        disabled={status === 'Posted'}
                        onChange={(e) => handleDimensionChange('currencyDate', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-600 block">Purchase Date</label>
                      <input
                        type="date"
                        className="w-full px-2 py-1.5 bg-white border-0 border-b-2 border-blue-300 focus:border-blue-500 focus:outline-none text-sm"
                        value={dimensionData.purchaseDate}
                        disabled={status === 'Posted'}
                        onChange={(e) => handleDimensionChange('purchaseDate', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Row 3: Shipping & Logistics */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-700 border-b border-blue-200 pb-2">Shipping & Logistics</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-600 block">Ship</label>
                      <select
                        className="w-full px-2 py-1.5 bg-white border-0 border-b-2 border-blue-300 focus:border-blue-500 focus:outline-none text-sm"
                        value={dimensionData.ship}
                        disabled={status === 'Posted'}
                        onChange={(e) => handleDimensionChange('ship', e.target.value)}
                      >
                        {ships.map(ship => (
                          <option key={ship.value} value={ship.value}>
                            {ship.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-600 block">Voyage</label>
                      <input
                        type="text"
                        className="w-full px-2 py-1.5 bg-white border-0 border-b-2 border-blue-300 focus:border-blue-500 focus:outline-none text-sm"
                        value={dimensionData.voyage}
                        disabled={status === 'Posted'}
                        onChange={(e) => handleDimensionChange('voyage', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-600 block">Cargo No</label>
                      <input
                        type="text"
                        className="w-full px-2 py-1.5 bg-white border-0 border-b-2 border-blue-300 focus:border-blue-500 focus:outline-none text-sm"
                        value={dimensionData.cargoNo}
                        disabled={status === 'Posted'}
                        onChange={(e) => handleDimensionChange('cargoNo', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-600 block">Port</label>
                      <select
                        className="w-full px-2 py-1.5 bg-white border-0 border-b-2 border-blue-300 focus:border-blue-500 focus:outline-none text-sm"
                        value={dimensionData.port}
                        disabled={status === 'Posted'}
                        onChange={(e) => handleDimensionChange('port', e.target.value)}
                      >
                        {ports.map(port => (
                          <option key={port.value} value={port.value}>
                            {port.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Row 4: Quantities & Tax */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-700 border-b border-blue-200 pb-2">Quantities & Tax</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-600 block">Quantity</label>
                      <input
                        type="number"
                        className="w-full px-2 py-1.5 bg-white border-0 border-b-2 border-blue-300 focus:border-blue-500 focus:outline-none text-sm"
                        value={dimensionData.quantity}
                        disabled={status === 'Posted'}
                        onChange={(e) => handleDimensionChange('quantity', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-600 block">VAT (%)</label>
                      <input
                        type="number"
                        className="w-full px-2 py-1.5 bg-white border-0 border-b-2 border-blue-300 focus:border-blue-500 focus:outline-none text-sm"
                        value={dimensionData.vat}
                        disabled={status === 'Posted'}
                        onChange={(e) => handleDimensionChange('vat', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
