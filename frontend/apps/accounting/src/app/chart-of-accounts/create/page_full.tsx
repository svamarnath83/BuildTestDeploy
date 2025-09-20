"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CoAFormData {
  // Group Account Section
  groupCode: string;
  accountType: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense' | '';
  subType1: string;
  subType2: string;
  subType3: string;
  ledgerAccount: boolean;
  numberRangeStart: string;
  numberRangeEnd: string;
  dimensionCode: string;

  // General Ledger Account Section
  accountNumber: string;
  accountDescription: string;
  externalAccountNumber: string;
  dimension: string;
  validCompanies: string;
  historicalAccounts: boolean;

  // Report Classification
  reportClassification1: string;
  reportClassification2: string;
  ifrs: string;
  safT: string;

  // Other Settings
  isActive: boolean;
}

interface CreateCoAPageProps {
  editId?: string;
}

export default function CreateCoAPage({ editId }: CreateCoAPageProps) {
  console.log('CreateCoAPage rendering, editId:', editId);
  const router = useRouter();
  const isEditMode = !!editId;
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<CoAFormData>({
    groupCode: '',
    accountType: '',
    subType1: '',
    subType2: '',
    subType3: '',
    ledgerAccount: false,
    numberRangeStart: '',
    numberRangeEnd: '',
    dimensionCode: '',
    accountNumber: '',
    accountDescription: '',
    externalAccountNumber: '',
    dimension: '',
    validCompanies: 'All/Linked List/Not in List',
    historicalAccounts: false,
    reportClassification1: '',
    reportClassification2: '',
    ifrs: '',
    safT: '',
    isActive: true
  });

  const accountTypeOptions = [
    { value: 'Asset', label: 'Asset' },
    { value: 'Liability', label: 'Liability' },
    { value: 'Equity', label: 'Equity' },
    { value: 'Revenue', label: 'Revenue' },
    { value: 'Expense', label: 'Expense' }
  ];

  const assetSubTypes = ['Current Asset', 'Non-Current Asset'];
  const currentAssetSubTypes2 = ['Cash and Cash Equivalents', 'Trade Receivables', 'Inventory', 'Prepaid Expenses'];

  const handleInputChange = (field: keyof CoAFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required field validations
    if (!formData.groupCode) newErrors.groupCode = 'Group code is required';
    if (!formData.accountType) newErrors.accountType = 'Account type is required';
    if (!formData.subType1) newErrors.subType1 = 'SubType1 is required';
    if (!formData.subType2) newErrors.subType2 = 'SubType2 is required';
    if (!formData.accountNumber) newErrors.accountNumber = 'Account number is required';
    if (!formData.accountDescription) newErrors.accountDescription = 'Account description is required';
    if (!formData.dimensionCode) newErrors.dimensionCode = 'Dimension code is required';

    // Format validations
    if (formData.groupCode && !/^\d{4}$/.test(formData.groupCode)) {
      newErrors.groupCode = 'Group code must be 4 digits';
    }

    if (formData.accountNumber && !/^\d{6}$/.test(formData.accountNumber)) {
      newErrors.accountNumber = 'Account number must be 6 digits';
    }

    if (formData.dimensionCode && !/^\d{3}$/.test(formData.dimensionCode)) {
      newErrors.dimensionCode = 'Dimension code must be 3 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      console.log('Saving CoA account:', formData);
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

  const handleBack = () => {
    router.push('/chart-of-accounts');
  };

  // Load data for edit mode
  useEffect(() => {
    if (editId) {
      setFormData(prev => ({
        ...prev,
        groupCode: '1100',
        accountType: 'Asset',
        subType1: 'Current Asset',
        subType2: 'Cash and Cash Equivalents',
        subType3: 'Cash',
        accountNumber: '100100',
        accountDescription: 'UNB USD Bank Account',
        externalAccountNumber: '1210',
        dimensionCode: '110',
        validCompanies: 'All/Linked List/Not in List',
        historicalAccounts: true,
        isActive: true,
        reportClassification1: 'Asset Classification',
        reportClassification2: 'Current Asset Sub',
        ifrs: 'Trade and other receivables',
        safT: '1600 - Receivables'
      }));
    }
  }, [editId]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline font-bold">CoA-Explorer</span>
              <span className="sm:hidden">Back</span>
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{isLoading ? 'Saving...' : isEditMode ? 'Update Account' : 'Save Account'}</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Group Account Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              Group Account
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 block">
                  Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.groupCode}
                  onChange={(e) => handleInputChange('groupCode', e.target.value)}
                  placeholder="1100"
                  maxLength={4}
                  className={`w-full px-2 py-1.5 bg-transparent border-0 border-b-2 focus:outline-none text-sm ${
                    errors.groupCode ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                />
                {errors.groupCode && <p className="text-red-500 text-xs mt-1">{errors.groupCode}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 block">
                  Account Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.accountType}
                  onChange={(e) => handleInputChange('accountType', e.target.value)}
                  className={`w-full px-2 py-1.5 bg-transparent border-0 border-b-2 focus:outline-none text-sm ${
                    errors.accountType ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                >
                  <option value="">Select Type</option>
                  {accountTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                {errors.accountType && <p className="text-red-500 text-xs mt-1">{errors.accountType}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 block">
                  SubType1 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.subType1}
                  onChange={(e) => handleInputChange('subType1', e.target.value)}
                  className={`w-full px-2 py-1.5 bg-transparent border-0 border-b-2 focus:outline-none text-sm ${
                    errors.subType1 ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                >
                  <option value="">Select SubType1</option>
                  {formData.accountType === 'Asset' && assetSubTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.subType1 && <p className="text-red-500 text-xs mt-1">{errors.subType1}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 block">
                  SubType2 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.subType2}
                  onChange={(e) => handleInputChange('subType2', e.target.value)}
                  className={`w-full px-2 py-1.5 bg-transparent border-0 border-b-2 focus:outline-none text-sm ${
                    errors.subType2 ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                >
                  <option value="">Select SubType2</option>
                  {formData.subType1 === 'Current Asset' && currentAssetSubTypes2.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.subType2 && <p className="text-red-500 text-xs mt-1">{errors.subType2}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 block">
                  SubType3
                </label>
                <input
                  type="text"
                  value={formData.subType3}
                  onChange={(e) => handleInputChange('subType3', e.target.value)}
                  placeholder="Cash"
                  className="w-full px-2 py-1.5 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="ledgerAccount"
                    checked={formData.ledgerAccount}
                    onChange={(e) => handleInputChange('ledgerAccount', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="ledgerAccount" className="text-xs font-medium text-gray-600">
                    Ledger Account
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600 block">
                    Range Start
                  </label>
                  <input
                    type="text"
                    value={formData.numberRangeStart}
                    onChange={(e) => handleInputChange('numberRangeStart', e.target.value)}
                    placeholder="110000"
                    className="w-full px-2 py-1.5 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600 block">
                    Range End
                  </label>
                  <input
                    type="text"
                    value={formData.numberRangeEnd}
                    onChange={(e) => handleInputChange('numberRangeEnd', e.target.value)}
                    placeholder="119999"
                    className="w-full px-2 py-1.5 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 block">
                  Dimension Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.dimensionCode}
                  onChange={(e) => handleInputChange('dimensionCode', e.target.value)}
                  placeholder="110"
                  maxLength={3}
                  className={`w-full px-2 py-1.5 bg-transparent border-0 border-b-2 focus:outline-none text-sm ${
                    errors.dimensionCode ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                />
                {errors.dimensionCode && <p className="text-red-500 text-xs mt-1">{errors.dimensionCode}</p>}
              </div>
            </div>
          </div>

          {/* General Ledger Account Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              General Ledger Account
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 block">
                  Group Account
                </label>
                <input
                  type="text"
                  value={formData.groupCode}
                  className="w-full px-2 py-1.5 bg-gray-100 border-0 border-b-2 border-gray-300 text-gray-600 text-sm"
                  disabled
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 block">
                  Sub Type 2
                </label>
                <input
                  type="text"
                  value={formData.subType2}
                  className="w-full px-2 py-1.5 bg-gray-100 border-0 border-b-2 border-gray-300 text-gray-600 text-sm"
                  disabled
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 block">
                  Account Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                  placeholder="100100"
                  maxLength={6}
                  className={`w-full px-2 py-1.5 bg-transparent border-0 border-b-2 focus:outline-none text-sm ${
                    errors.accountNumber ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                />
                {errors.accountNumber && <p className="text-red-500 text-xs mt-1">{errors.accountNumber}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 block">
                  Account Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.accountDescription}
                  onChange={(e) => handleInputChange('accountDescription', e.target.value)}
                  placeholder="UNB USD Bank Account"
                  className={`w-full px-2 py-1.5 bg-transparent border-0 border-b-2 focus:outline-none text-sm ${
                    errors.accountDescription ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                />
                {errors.accountDescription && <p className="text-red-500 text-xs mt-1">{errors.accountDescription}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 block">
                  External Account Number
                </label>
                <input
                  type="text"
                  value={formData.externalAccountNumber}
                  onChange={(e) => handleInputChange('externalAccountNumber', e.target.value)}
                  placeholder="1210"
                  className="w-full px-2 py-1.5 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 block">
                  Dimension
                </label>
                <input
                  type="text"
                  value={formData.dimension}
                  onChange={(e) => handleInputChange('dimension', e.target.value)}
                  placeholder="110"
                  className="w-full px-2 py-1.5 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 block">
                  Valid Companies
                </label>
                <select
                  value={formData.validCompanies}
                  onChange={(e) => handleInputChange('validCompanies', e.target.value)}
                  className="w-full px-2 py-1.5 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                >
                  <option value="All/Linked List/Not in List">All/Linked List/Not in List</option>
                  <option value="All Companies">All Companies</option>
                  <option value="Linked List Only">Linked List Only</option>
                  <option value="Not in List">Not in List</option>
                </select>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Other Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="historicalAccounts"
                      checked={formData.historicalAccounts}
                      onChange={(e) => handleInputChange('historicalAccounts', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="historicalAccounts" className="text-xs font-medium text-gray-600">
                      Historical Accounts
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => handleInputChange('isActive', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="isActive" className="text-xs font-medium text-gray-600">
                      Active Account
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Report Classification Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              Report Classification
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 block">
                  Report Classification 1
                </label>
                <input
                  type="text"
                  value={formData.reportClassification1}
                  onChange={(e) => handleInputChange('reportClassification1', e.target.value)}
                  placeholder="Report Classification 1"
                  className="w-full px-2 py-1.5 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 block">
                  Report Classification 2
                </label>
                <input
                  type="text"
                  value={formData.reportClassification2}
                  onChange={(e) => handleInputChange('reportClassification2', e.target.value)}
                  placeholder="Report Classification 2"
                  className="w-full px-2 py-1.5 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 block">
                  IFRS
                </label>
                <input
                  type="text"
                  value={formData.ifrs}
                  onChange={(e) => handleInputChange('ifrs', e.target.value)}
                  placeholder="Trade and other receivables"
                  className="w-full px-2 py-1.5 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 block">
                  SAF-T
                </label>
                <input
                  type="text"
                  value={formData.safT}
                  onChange={(e) => handleInputChange('safT', e.target.value)}
                  placeholder="1600 - Receivables"
                  className="w-full px-2 py-1.5 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Validation Summary */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-red-600 mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-medium">Please fix the following errors:</span>
            </div>
            <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
              {Object.values(errors).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
