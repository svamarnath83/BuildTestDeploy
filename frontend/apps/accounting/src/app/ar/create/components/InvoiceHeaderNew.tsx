"use client";

import React, { useState } from 'react';
import { Upload, Paperclip, FileText, Info } from 'lucide-react';
import { 
  InvoiceForm, 
  CustomerInfo,
  sampleCustomers,
  currencies,
  processes,
  invoiceTypes,
  companies,
  documentTypes
} from '@/../../packages/ui/libs/accounting';
import { Card, CardHeader, CardTitle, CardContent } from '@commercialapp/ui';

interface InvoiceHeaderProps {
  invoiceForm: InvoiceForm;
  selectedCustomer: CustomerInfo | null;
  isEditMode: boolean;
  isReadOnly?: boolean;
  onFormChange: (field: keyof InvoiceForm, value: any) => void;
  onCustomerSelect: (customerCode: string) => void;
}

export default function InvoiceHeader({
  invoiceForm,
  selectedCustomer,
  isEditMode,
  isReadOnly = false,
  onFormChange,
  onCustomerSelect
}: InvoiceHeaderProps) {

  const [showCustomerInfo, setShowCustomerInfo] = useState(false);

  const handleCustomerChange = (customerCode: string) => {
    onCustomerSelect(customerCode);
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold text-gray-900">
          {isEditMode ? 'Edit Invoice' : 'Create New Invoice'}
        </CardTitle>
      </CardHeader>
        <CardContent className="space-y-4">
          {/* Responsive Layout - Mobile to Desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Column 1: Basic Info */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 block">Process</label>
                <select
                  className="w-full px-2 py-1.5 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                  value={invoiceForm.process}
                  disabled={isReadOnly}
                  onChange={(e) => onFormChange('process', e.target.value)}
                >
                  {processes.map(process => (
                    <option key={process.value} value={process.value}>
                      {process.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 block">Invoice Type</label>
                <select
                  className="w-full px-2 py-1.5 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                  value={invoiceForm.invoiceType}
                  disabled={isReadOnly}
                  onChange={(e) => onFormChange('invoiceType', e.target.value)}
                >
                  {invoiceTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 block">Invoice Number</label>
                <input
                  type="text"
                  className="w-full px-2 py-1.5 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                  value={invoiceForm.invoiceNumber}
                  disabled={isReadOnly}
                  onChange={(e) => onFormChange('invoiceNumber', e.target.value)}
                />
              </div>
            </div>

            {/* Column 2: Customer & Dates */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 block">Customer</label>
                <div className="flex items-center gap-2">
                  <select
                    className="flex-1 px-2 py-1.5 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                    value={invoiceForm.customer}
                    disabled={isReadOnly}
                    onChange={(e) => handleCustomerChange(e.target.value)}
                  >
                    <option value="">Select Customer</option>
                    {sampleCustomers.map(customer => (
                      <option key={customer.code} value={customer.code}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                  {selectedCustomer && (
                    <div className="relative">
                      <button
                        type="button"
                        className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                        onMouseEnter={() => setShowCustomerInfo(true)}
                        onMouseLeave={() => setShowCustomerInfo(false)}
                        onClick={() => setShowCustomerInfo(!showCustomerInfo)}
                      >
                        <Info className="w-4 h-4" />
                      </button>
                      {showCustomerInfo && (
                        <div className="absolute top-6 right-0 z-10 bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-48">
                          <div className="text-xs font-medium text-gray-800 mb-2">Customer Details</div>
                          <div className="space-y-1 text-xs text-gray-600">
                            <div><span className="font-medium">Code:</span> {selectedCustomer.code}</div>
                            <div><span className="font-medium">Name:</span> {selectedCustomer.name}</div>
                            <div><span className="font-medium">Phone:</span> {selectedCustomer.phone}</div>
                            <div><span className="font-medium">Email:</span> {selectedCustomer.email}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Invoice Date and Due Date in same row */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600 block">Invoice Date</label>
                  <input
                    type="date"
                    className="w-full px-1 py-1.5 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-xs"
                    value={invoiceForm.invoiceDate}
                    disabled={isReadOnly}
                    onChange={(e) => onFormChange('invoiceDate', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600 block">Due Date</label>
                  <input
                    type="date"
                    className="w-full px-1 py-1.5 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-xs"
                    value={invoiceForm.dueDate}
                    disabled={isReadOnly}
                    onChange={(e) => onFormChange('dueDate', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Column 3: Financial & Details */}
            <div className="space-y-3">
              {/* Company and Currency in same row */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600 block">Company</label>
                  <select
                    className="w-full px-1 py-1.5 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-xs"
                    value={invoiceForm.companyCode}
                    disabled={isReadOnly}
                    onChange={(e) => onFormChange('companyCode', e.target.value)}
                  >
                    {companies.map(company => (
                      <option key={company.value} value={company.value}>
                        {company.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600 block">Currency</label>
                  <select
                    className="w-full px-1 py-1.5 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-xs"
                    value={invoiceForm.currency}
                    disabled={isReadOnly}
                    onChange={(e) => onFormChange('currency', e.target.value)}
                  >
                    {currencies.map(currency => (
                      <option key={currency.value} value={currency.value}>
                        {currency.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 block">Invoice Amount</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full px-2 py-1.5 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                  value={invoiceForm.invoiceAmount}
                  disabled={isReadOnly}
                  onChange={(e) => onFormChange('invoiceAmount', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            {/* Column 4: Comments + Attachments */}
            <div className="space-y-3">
              {/* Comments in Column 4 */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 block">Comments</label>
                <textarea
                  className="w-full px-2 py-1.5 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-sm resize-none"
                  rows={3}
                  value={invoiceForm.invoiceComments || ''}
                  disabled={isReadOnly}
                  placeholder="Add comments..."
                  onChange={(e) => onFormChange('invoiceComments', e.target.value)}
                />
              </div>

              {/* Attachments in Column 4 - Ultra Compact */}
              <div className="space-y-1">
                <div className="text-xs font-medium text-gray-600 flex items-center gap-1">
                  <Paperclip className="w-3 h-3" />
                  Files
                </div>
                
                {!isReadOnly && (
                  <div className="border border-dashed border-gray-200 rounded p-1.5 text-center hover:border-blue-300 transition-colors bg-gray-50">
                    <Upload className="w-3 h-3 text-gray-400 mx-auto" />
                    <button
                      type="button"
                      className="mt-0.5 px-1.5 py-0.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                )}
                
                {/* File List - Minimal */}
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1 px-1 py-0.5 bg-gray-50 rounded text-xs">
                    <FileText className="w-2.5 h-2.5 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-600 flex-1 truncate text-xs">docs.pdf</span>
                    <span className="text-gray-400 text-xs">2.4M</span>
                  </div>
                  <div className="flex items-center gap-1 px-1 py-0.5 bg-gray-50 rounded text-xs">
                    <FileText className="w-2.5 h-2.5 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-600 flex-1 truncate text-xs">po.pdf</span>
                    <span className="text-gray-400 text-xs">1.8M</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
    </Card>
  );
}
