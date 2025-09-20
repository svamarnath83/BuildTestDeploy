"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Eye, MoreHorizontal, Upload, Paperclip, FileText, Info, CheckCircle, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { 
  currencies,
  companies,
  sampleCustomers
} from '@/../../packages/ui/libs/accounting';

// Account Group specific data
const accountTypes = [
  { value: "ASSETS", label: "Assets" },
  { value: "LIABILITIES", label: "Liabilities" },
  { value: "EQUITY", label: "Equity" },
  { value: "REVENUE", label: "Revenue" },
  { value: "EXPENSES", label: "Expenses" }
];

const subTypes1 = [
  { value: "CURRENT", label: "Current" },
  { value: "NON_CURRENT", label: "Non-Current" },
  { value: "OPERATING", label: "Operating" },
  { value: "NON_OPERATING", label: "Non-Operating" }
];

const subTypes2 = [
  { value: "CASH", label: "Cash & Equivalents" },
  { value: "RECEIVABLES", label: "Receivables" },
  { value: "INVENTORY", label: "Inventory" },
  { value: "PAYABLES", label: "Payables" },
  { value: "ACCRUALS", label: "Accruals" }
];

// Existing dimension codes
const existingDimensionCodes = [
  { value: "DIM001", label: "DIM001 - Customer Dimension" },
  { value: "DIM002", label: "DIM002 - Product Dimension" },
  { value: "DIM003", label: "DIM003 - Location Dimension" },
  { value: "DIM004", label: "DIM004 - Department Dimension" },
  { value: "DIM005", label: "DIM005 - Project Dimension" }
];

// Report classifications
const reportClassifications = [
  { value: "ASSETS", label: "Assets" },
  { value: "LIABILITIES", label: "Liabilities" },
  { value: "EQUITY", label: "Equity" },
  { value: "REVENUE", label: "Revenue" },
  { value: "EXPENSES", label: "Expenses" }
];

const reportClassifications1 = [
  { value: "CURRENT", label: "Current" },
  { value: "NON_CURRENT", label: "Non-Current" },
  { value: "OPERATING", label: "Operating" },
  { value: "NON_OPERATING", label: "Non-Operating" }
];

// Predefined dimension configurations
const dimensionConfigurations: Record<string, DimensionData> = {
  "DIM001": {
    code: 'DIM001',
    invoiceNo: 'REQUIRED',
    invoiceDate: 'REQUIRED',
    dueDate: 'OPTIONAL',
    currencyDate: 'OPTIONAL',
    purchaseDate: 'NONE',
    ship: 'REQUIRED',
    voyage: 'REQUIRED',
    cargoNo: 'OPTIONAL',
    port: 'OPTIONAL',
    project: 'NONE',
    poNo: 'OPTIONAL',
    quantity: 'NONE',
    vat: 'REQUIRED'
  },
  "DIM002": {
    code: 'DIM002',
    invoiceNo: 'OPTIONAL',
    invoiceDate: 'OPTIONAL',
    dueDate: 'NONE',
    currencyDate: 'REQUIRED',
    purchaseDate: 'REQUIRED',
    ship: 'NONE',
    voyage: 'NONE',
    cargoNo: 'NONE',
    port: 'NONE',
    project: 'REQUIRED',
    poNo: 'REQUIRED',
    quantity: 'REQUIRED',
    vat: 'OPTIONAL'
  },
  "DIM003": {
    code: 'DIM003',
    invoiceNo: 'REQUIRED',
    invoiceDate: 'REQUIRED',
    dueDate: 'REQUIRED',
    currencyDate: 'NONE',
    purchaseDate: 'NONE',
    ship: 'OPTIONAL',
    voyage: 'OPTIONAL',
    cargoNo: 'REQUIRED',
    port: 'REQUIRED',
    project: 'OPTIONAL',
    poNo: 'NONE',
    quantity: 'OPTIONAL',
    vat: 'REQUIRED'
  },
  "DIM004": {
    code: 'DIM004',
    invoiceNo: 'OPTIONAL',
    invoiceDate: 'OPTIONAL',
    dueDate: 'OPTIONAL',
    currencyDate: 'OPTIONAL',
    purchaseDate: 'OPTIONAL',
    ship: 'REQUIRED',
    voyage: 'REQUIRED',
    cargoNo: 'REQUIRED',
    port: 'REQUIRED',
    project: 'REQUIRED',
    poNo: 'OPTIONAL',
    quantity: 'REQUIRED',
    vat: 'OPTIONAL'
  },
  "DIM005": {
    code: 'DIM005',
    invoiceNo: 'NONE',
    invoiceDate: 'NONE',
    dueDate: 'NONE',
    currencyDate: 'REQUIRED',
    purchaseDate: 'REQUIRED',
    ship: 'NONE',
    voyage: 'NONE',
    cargoNo: 'NONE',
    port: 'NONE',
    project: 'REQUIRED',
    poNo: 'REQUIRED',
    quantity: 'REQUIRED',
    vat: 'NONE'
  }
};

interface AccountGroupFormData {
  // Basic Information
  code: string;
  accountType: string;
  subType1: string;
  subType2: string;
  ledgerAccount: boolean;
  numberRangeStart: string;
  numberRangeEnd: string;
  dimensionCode: string;
  reportClassifications: string[]; // Changed to array to allow multiple
  
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
  quantity: string;
  vat: string;
}

// Dimension field options
const dimensionOptions = [
  { value: "NONE", label: "None" },
  { value: "REQUIRED", label: "Required" },
  { value: "OPTIONAL", label: "Optional" }
];

interface CreateAccountGroupPageProps {
  isEditMode?: boolean;
  initialData?: AccountGroupFormData;
}

function CreateAccountGroupPage({ isEditMode = false, initialData }: CreateAccountGroupPageProps) {
  const router = useRouter();
  const [status, setStatus] = useState('Draft');
  
  const [formData, setFormData] = useState<AccountGroupFormData>({
    code: '',
    accountType: '',
    subType1: '',
    subType2: '',
    ledgerAccount: false,
    numberRangeStart: '',
    numberRangeEnd: '',
    dimensionCode: '',
    reportClassifications: [], // Changed to empty array
    createdBy: 'Current User',
    createdDate: new Date().toISOString().split('T')[0],
    updatedBy: 'Current User',
    updatedDate: new Date().toISOString().split('T')[0],
    status: 'Draft'
  });

  const [dimensionData, setDimensionData] = useState<DimensionData>({
    code: '',
    invoiceNo: 'NONE',
    invoiceDate: 'NONE',
    dueDate: 'NONE',
    currencyDate: 'NONE',
    purchaseDate: 'NONE',
    ship: 'NONE',
    voyage: 'NONE',
    cargoNo: 'NONE',
    port: 'NONE',
    project: 'NONE',
    poNo: 'NONE',
    quantity: 'NONE',
    vat: 'NONE'
  });

  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData(initialData);
      setStatus(initialData.status);
    }
  }, [isEditMode, initialData]);

  const handleInputChange = (field: keyof AccountGroupFormData, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // When dimension code is selected, load the corresponding dimension configuration
    if (field === 'dimensionCode' && typeof value === 'string' && value) {
      const dimensionConfig = dimensionConfigurations[value];
      if (dimensionConfig) {
        setDimensionData(dimensionConfig);
      }
    }
  };

  // Functions to handle report classifications array
  const addReportClassification = (classification: string) => {
    if (classification && !formData.reportClassifications.includes(classification)) {
      handleInputChange('reportClassifications', [...formData.reportClassifications, classification]);
    }
  };

  const removeReportClassification = (index: number) => {
    const newClassifications = formData.reportClassifications.filter((_, i) => i !== index);
    handleInputChange('reportClassifications', newClassifications);
  };

  const handleDimensionChange = (field: keyof DimensionData, value: string) => {
    setDimensionData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving Account Group:', formData);
    console.log('Dimension Data:', dimensionData);
    // Add save logic here
    router.push('/chart-of-accounts/account-groups');
  };

  const handleCancel = () => {
    router.push('/chart-of-accounts/account-groups');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleCancel}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditMode ? 'Edit Account Group' : 'Create New Account Group'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {isEditMode ? 'Modify account group details' : 'Define a new account group with classification and settings'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className={`h-2 w-2 rounded-full ${
                status === 'Draft' ? 'bg-yellow-400' : 
                status === 'Review' ? 'bg-blue-400' : 
                'bg-green-400'
              }`}></div>
              <span className="text-sm font-medium text-gray-600">Status: {status}</span>
            </div>
            
            <button
              onClick={handleSave}
              disabled={status === 'Posted'}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{isEditMode ? 'Update' : 'Save'} Account Group</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
          {/* Account Group Information Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-fit">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Account Group Information</h2>
                    <p className="text-sm text-gray-600">Basic details and classification</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-gray-800 border-b border-blue-200 pb-2">Account Group Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 block">Code *</label>
                    <input
                      type="text"
                      className="w-full px-2 py-1.5 bg-white border-0 border-b-2 border-blue-300 focus:border-blue-500 focus:outline-none text-sm"
                      value={formData.code}
                      disabled={status === 'Posted'}
                      onChange={(e) => handleInputChange('code', e.target.value)}
                      placeholder="Enter code"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 block">Account Type *</label>
                    <select
                      className="w-full px-2 py-1.5 bg-white border-0 border-b-2 border-blue-300 focus:border-blue-500 focus:outline-none text-sm"
                      value={formData.accountType}
                      disabled={status === 'Posted'}
                      onChange={(e) => handleInputChange('accountType', e.target.value)}
                    >
                      <option value="">Select type</option>
                      {accountTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 block">SubType1</label>
                    <select
                      className="w-full px-2 py-1.5 bg-white border-0 border-b-2 border-blue-300 focus:border-blue-500 focus:outline-none text-sm"
                      value={formData.subType1}
                      disabled={status === 'Posted'}
                      onChange={(e) => handleInputChange('subType1', e.target.value)}
                    >
                      <option value="">Select sub type</option>
                      {subTypes1.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 block">SubType2</label>
                    <select
                      className="w-full px-2 py-1.5 bg-white border-0 border-b-2 border-blue-300 focus:border-blue-500 focus:outline-none text-sm"
                      value={formData.subType2}
                      disabled={status === 'Posted'}
                      onChange={(e) => handleInputChange('subType2', e.target.value)}
                    >
                      <option value="">Select sub type</option>
                      {subTypes2.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 block">Acc.Number Start</label>
                    <input
                      type="text"
                      className="w-full px-2 py-1.5 bg-white border-0 border-b-2 border-blue-300 focus:border-blue-500 focus:outline-none text-sm"
                      value={formData.numberRangeStart}
                      disabled={status === 'Posted'}
                      onChange={(e) => handleInputChange('numberRangeStart', e.target.value)}
                      placeholder="e.g., 1000"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 block">Acc.Number End</label>
                    <input
                      type="text"
                      className="w-full px-2 py-1.5 bg-white border-0 border-b-2 border-blue-300 focus:border-blue-500 focus:outline-none text-sm"
                      value={formData.numberRangeEnd}
                      disabled={status === 'Posted'}
                      onChange={(e) => handleInputChange('numberRangeEnd', e.target.value)}
                      placeholder="e.g., 1999"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 block">Dimension Code</label>
                    <div className="flex space-x-2">
                      <select
                        className="flex-1 px-2 py-1.5 bg-white border-0 border-b-2 border-blue-300 focus:border-blue-500 focus:outline-none text-sm"
                        value={formData.dimensionCode}
                        disabled={status === 'Posted'}
                        onChange={(e) => handleInputChange('dimensionCode', e.target.value)}
                      >
                        <option value="">Select dimension</option>
                        {existingDimensionCodes.map(dim => (
                          <option key={dim.value} value={dim.value}>
                            {dim.label}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => {
                          const newDimCode = prompt('Enter new dimension code:');
                          if (newDimCode) {
                            handleInputChange('dimensionCode', newDimCode);
                            // Create a default dimension configuration for new codes
                            const defaultConfig: DimensionData = {
                              code: newDimCode,
                              invoiceNo: 'NONE',
                              invoiceDate: 'NONE',
                              dueDate: 'NONE',
                              currencyDate: 'NONE',
                              purchaseDate: 'NONE',
                              ship: 'NONE',
                              voyage: 'NONE',
                              cargoNo: 'NONE',
                              port: 'NONE',
                              project: 'NONE',
                              poNo: 'NONE',
                              quantity: 'NONE',
                              vat: 'NONE'
                            };
                            setDimensionData(defaultConfig);
                          }
                        }}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                        disabled={status === 'Posted'}
                      >
                        + New
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Settings Section */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-gray-800 border-b border-blue-200 pb-2">Settings</h3>
                <div className="flex items-center space-x-6">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={formData.ledgerAccount}
                      disabled={status === 'Posted'}
                      onChange={(e) => handleInputChange('ledgerAccount', e.target.checked)}
                    />
                    <span className="text-sm text-gray-700">Ledger Account</span>
                  </label>
                </div>
              </div>

              {/* Report Classification Section */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-gray-800 border-b border-blue-200 pb-2">Report Classification</h3>
                <div className="space-y-4">
                  {/* Current Classifications */}
                  {formData.reportClassifications.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-600 block">Current Classifications:</label>
                      <div className="flex flex-wrap gap-2">
                        {formData.reportClassifications.map((classification, index) => {
                          const classificationObj = [...reportClassifications, ...reportClassifications1]
                            .find(rc => rc.value === classification);
                          return (
                            <div key={index} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                              <span>{classificationObj?.label || classification}</span>
                              <button
                                type="button"
                                onClick={() => removeReportClassification(index)}
                                className="ml-2 text-blue-600 hover:text-blue-800 font-bold"
                                disabled={status === 'Posted'}
                              >
                                ×
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Add New Classification */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-600 block">Add Report Classification</label>
                      <div className="flex space-x-2">
                        <select
                          className="flex-1 px-2 py-1.5 bg-white border-0 border-b-2 border-blue-300 focus:border-blue-500 focus:outline-none text-sm"
                          onChange={(e) => {
                            if (e.target.value) {
                              addReportClassification(e.target.value);
                              e.target.value = ''; // Reset selection
                            }
                          }}
                          disabled={status === 'Posted'}
                        >
                          <option value="">Select classification</option>
                          {reportClassifications.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-600 block">Add Report Classification1</label>
                      <div className="flex space-x-2">
                        <select
                          className="flex-1 px-2 py-1.5 bg-white border-0 border-b-2 border-blue-300 focus:border-blue-500 focus:outline-none text-sm"
                          onChange={(e) => {
                            if (e.target.value) {
                              addReportClassification(e.target.value);
                              e.target.value = ''; // Reset selection
                            }
                          }}
                          disabled={status === 'Posted'}
                        >
                          <option value="">Select classification</option>
                          {reportClassifications1.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dimensions Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-fit">
            <div className="bg-gradient-to-r from-green-50 to-teal-50 border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Info className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Dimensions
                      {formData.dimensionCode && (
                        <span className="ml-2 text-sm font-normal text-green-600">
                          [{formData.dimensionCode}]
                        </span>
                      )}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {formData.dimensionCode 
                        ? `Configuration for ${formData.dimensionCode}` 
                        : "Select a dimension code to load configuration"
                      }
                    </p>
                  </div>
                </div>
                {formData.dimensionCode && (
                  <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                    Active
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* All Dimension Fields in a vertical grid layout with bottom borders */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 block">Dimension Code</label>
                    <input
                      type="text"
                      className="w-full px-2 py-2 bg-white border-0 border-b border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                      value={dimensionData.code}
                      disabled={status === 'Posted'}
                      onChange={(e) => handleDimensionChange('code', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 block">Invoice No</label>
                    <select
                      className="w-full px-2 py-2 bg-white border-0 border-b border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                      value={dimensionData.invoiceNo}
                      disabled={status === 'Posted'}
                      onChange={(e) => handleDimensionChange('invoiceNo', e.target.value)}
                    >
                      {dimensionOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 block">Invoice Date</label>
                    <select
                      className="w-full px-2 py-2 bg-white border-0 border-b border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                      value={dimensionData.invoiceDate}
                      disabled={status === 'Posted'}
                      onChange={(e) => handleDimensionChange('invoiceDate', e.target.value)}
                    >
                      {dimensionOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 block">Due Date</label>
                    <select
                      className="w-full px-2 py-2 bg-white border-0 border-b border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                      value={dimensionData.dueDate}
                      disabled={status === 'Posted'}
                      onChange={(e) => handleDimensionChange('dueDate', e.target.value)}
                    >
                      {dimensionOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 block">Currency Date</label>
                    <select
                      className="w-full px-2 py-2 bg-white border-0 border-b border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                      value={dimensionData.currencyDate}
                      disabled={status === 'Posted'}
                      onChange={(e) => handleDimensionChange('currencyDate', e.target.value)}
                    >
                      {dimensionOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 block">Purchase Date</label>
                    <select
                      className="w-full px-2 py-2 bg-white border-0 border-b border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                      value={dimensionData.purchaseDate}
                      disabled={status === 'Posted'}
                      onChange={(e) => handleDimensionChange('purchaseDate', e.target.value)}
                    >
                      {dimensionOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 block">Ship</label>
                    <select
                      className="w-full px-2 py-2 bg-white border-0 border-b border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                      value={dimensionData.ship}
                      disabled={status === 'Posted'}
                      onChange={(e) => handleDimensionChange('ship', e.target.value)}
                    >
                      {dimensionOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 block">Voyage</label>
                    <select
                      className="w-full px-2 py-2 bg-white border-0 border-b border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                      value={dimensionData.voyage}
                      disabled={status === 'Posted'}
                      onChange={(e) => handleDimensionChange('voyage', e.target.value)}
                    >
                      {dimensionOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 block">Cargo No</label>
                    <select
                      className="w-full px-2 py-2 bg-white border-0 border-b border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                      value={dimensionData.cargoNo}
                      disabled={status === 'Posted'}
                      onChange={(e) => handleDimensionChange('cargoNo', e.target.value)}
                    >
                      {dimensionOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 block">Port</label>
                    <select
                      className="w-full px-2 py-2 bg-white border-0 border-b border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                      value={dimensionData.port}
                      disabled={status === 'Posted'}
                      onChange={(e) => handleDimensionChange('port', e.target.value)}
                    >
                      {dimensionOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 block">Project</label>
                    <select
                      className="w-full px-2 py-2 bg-white border-0 border-b border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                      value={dimensionData.project}
                      disabled={status === 'Posted'}
                      onChange={(e) => handleDimensionChange('project', e.target.value)}
                    >
                      {dimensionOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 block">PO Number</label>
                    <select
                      className="w-full px-2 py-2 bg-white border-0 border-b border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                      value={dimensionData.poNo}
                      disabled={status === 'Posted'}
                      onChange={(e) => handleDimensionChange('poNo', e.target.value)}
                    >
                      {dimensionOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 block">Quantity</label>
                    <select
                      className="w-full px-2 py-2 bg-white border-0 border-b border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                      value={dimensionData.quantity}
                      disabled={status === 'Posted'}
                      onChange={(e) => handleDimensionChange('quantity', e.target.value)}
                    >
                      {dimensionOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 block">VAT (%)</label>
                    <select
                      className="w-full px-2 py-2 bg-white border-0 border-b border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                      value={dimensionData.vat}
                      disabled={status === 'Posted'}
                      onChange={(e) => handleDimensionChange('vat', e.target.value)}
                    >
                      {dimensionOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
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

// Default export for Next.js page routing
export default CreateAccountGroupPage;
