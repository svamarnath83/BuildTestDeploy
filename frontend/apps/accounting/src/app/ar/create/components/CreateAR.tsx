"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Eye, MoreHorizontal, Calendar, User, Upload, Paperclip, FileText, Info, Plus, ExternalLink } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  sampleCustomers,
  sampleProducts,
  sampleProductDetails,
  currencies,
  processes,
  invoiceTypes,
  companies,
  documentTypes,
  paymentMethods,
  taxCodes,
  accountNumbers
} from '@/../../packages/ui/libs/accounting';

interface InvoiceFormData {
  // Basic Information
  process: string;
  invoiceType: string;
  companyCode: string;
  customer: string;
  invoiceDate: string;
  dueDate: string;
  entryDate: string;
  currencyDate: string;
  currency: string;
  invoiceNumber: string;
  invoiceAmount: number;
  customerReference: string;
  
  // Document Information
  batchName: string;
  documentType: string;
  voucherStyle: string;
  voucherType: string;
  voucherNo: string;
  isEInvoice: boolean;
  
  // Details
  invoiceComments: string;
  referenceNumber: string;
  taxCode: string;
  taxRate: number;
  paymentMethod: string;
  bankAccount: string;
  shippingAddress: string;
  billingAddress: string;
  terms: string;
  notes: string;
  attachments: string[];
  
  // System Fields
  approvalStatus: string;
  createdBy: string;
  createdDate: string;
  updatedBy: string;
  updatedDate: string;
  status: 'Draft' | 'Posted' | 'Cancelled';
  lines: InvoiceLine[];
}

interface InvoiceLine {
  id: string;
  product: string;
  account: string;
  quantity: number;
  price: number;
  taxes: string;
  amount: number;
}

export default function CreateAR() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('Invoice Lines');
  const [status, setStatus] = useState<'Draft' | 'Posted'>('Draft');

  const [formData, setFormData] = useState<InvoiceFormData>({
    // Basic Information
    process: processes[0]?.value || 'MANUAL',
    invoiceType: invoiceTypes[0]?.value || 'STANDARD',
    companyCode: companies[0]?.value || 'SHL001',
    customer: sampleCustomers[0]?.code || '',
    invoiceDate: '2025-09-04',
    dueDate: '2025-09-04',
    entryDate: '2025-09-04',
    currencyDate: '2025-09-04',
    currency: currencies[0]?.value || 'USD',
    invoiceNumber: 'INV/25-26/0001',
    invoiceAmount: 500.00,
    customerReference: '',
    
    // Document Information
    batchName: 'Daily Batch',
    documentType: documentTypes[0]?.value || 'INV',
    voucherStyle: 'Standard',
    voucherType: 'SI',
    voucherNo: 'SI001',
    isEInvoice: false,
    
    // Details
    invoiceComments: '',
    referenceNumber: '',
    taxCode: taxCodes[0]?.value || 'VAT0',
    taxRate: 18,
    paymentMethod: paymentMethods[0]?.value || 'WIRE',
    bankAccount: '',
    shippingAddress: '',
    billingAddress: '',
    terms: 'Net 30',
    notes: '',
    attachments: [],
    
    // System Fields
    approvalStatus: 'Pending',
    createdBy: 'Current User',
    createdDate: '04/09/2025',
    updatedBy: '',
    updatedDate: '',
    status: 'Draft',
    lines: [
      {
        id: '1',
        product: sampleProducts[1]?.value || 'PORT', // Port Charges
        account: accountNumbers[3]?.value || '4400', // Port Charges account
        quantity: 1.00,
        price: 500.00,
        taxes: '',
        amount: 500.00
      }
    ]
  });

  const handleLineChange = (id: string, field: keyof InvoiceLine, value: any) => {
    setFormData(prev => ({
      ...prev,
      lines: prev.lines.map(line => 
        line.id === id ? { ...line, [field]: value } : line
      )
    }));
  };

  const handleFieldChange = (field: keyof InvoiceFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addLine = () => {
    const newLine: InvoiceLine = {
      id: Date.now().toString(),
      product: '',
      account: accountNumbers[0]?.value || '4000',
      quantity: 1,
      price: 0,
      taxes: '',
      amount: 0
    };
    setFormData(prev => ({
      ...prev,
      lines: [...prev.lines, newLine]
    }));
  };

  const removeLine = (lineId: string) => {
    setFormData(prev => ({
      ...prev,
      lines: prev.lines.filter(line => line.id !== lineId)
    }));
  };

  const handleBack = () => {
    router.push('/ar');
  };

  const handleSave = () => {
    console.log('Saving invoice:', formData);
    alert('Invoice saved as Draft');
  };

  const handleConfirm = () => {
    // Update status to Posted
    setFormData(prev => ({
      ...prev,
      status: 'Posted',
      approvalStatus: 'Approved',
      updatedBy: 'Current User',
      updatedDate: new Date().toISOString().split('T')[0]
    }));
    setStatus('Posted');
    console.log('Invoice confirmed and posted:', formData);
    alert('Invoice has been confirmed and posted successfully!');
  };

  const handleResetToDraft = () => {
    setFormData(prev => ({
      ...prev,
      status: 'Draft',
      approvalStatus: 'Pending',
      updatedBy: 'Current User',
      updatedDate: new Date().toISOString().split('T')[0]
    }));
    setStatus('Draft');
    console.log('Invoice reset to draft:', formData);
    alert('Invoice has been reset to Draft status');
  };

  const handleCancel = () => {
    handleBack();
  };

  const subtotal = formData.lines.reduce((sum, line) => sum + line.amount, 0);
  const taxAmount = 0; // Tax calculation can be added later
  const totalAmount = subtotal + taxAmount;

  const tabs = ['Invoice Lines', 'Journal Items', 'Other Info'];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Paper-like container */}
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg border border-gray-300">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white rounded-t-lg">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Left section */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-blue-600">
                  <span className="text-lg font-medium">Accounting</span>
                </div>
                <span className="text-gray-400">/</span>
                <span className="text-gray-600">Dashboard</span>
                <span className="text-gray-400">/</span>
                <span className="text-gray-600">
                  {formData.status === 'Posted' ? 'Posted Invoice' : 'Draft Invoice'}
                </span>
                <Eye className="w-4 h-4 text-gray-400" />
              </div>
              <button className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                New
              </button>
            </div>

            {/* Right section - Status dependent buttons */}
            <div className="flex items-center space-x-2">
              {formData.status === 'Draft' ? (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
                  >
                    <span>Confirm</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleResetToDraft}
                    className="flex items-center space-x-2 bg-orange-100 hover:bg-orange-200 text-orange-700 px-3 py-2 rounded text-sm"
                  >
                    <span>Reset to Draft</span>
                  </button>
                  <button className="flex items-center space-x-2 bg-green-100 text-green-700 px-3 py-2 rounded text-sm">
                    <span>Print</span>
                  </button>
                  <button className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm">
                    <span>Email</span>
                  </button>
                </>
              )}
              <button className="p-2 hover:bg-gray-100 rounded">
                <MoreHorizontal className="w-4 h-4 text-gray-500" />
              </button>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                formData.status === 'Posted' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {formData.status}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* Header Fields - Original Implementation Style */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="pb-4">
              <h2 className="text-lg font-bold text-gray-900">
                {status === 'Posted' ? 'View Invoice' : 'Create New Invoice'}
              </h2>
            </div>
            
            <div className="space-y-4">
              {/* Responsive Layout - Mobile to Desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Column 1: Basic Info */}
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 block">Process</label>
                    <select
                      className="w-full px-2 py-1.5 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                      value={formData.process}
                      disabled={status === 'Posted'}
                      onChange={(e) => handleFieldChange('process', e.target.value)}
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
                      value={formData.invoiceType}
                      disabled={status === 'Posted'}
                      onChange={(e) => handleFieldChange('invoiceType', e.target.value)}
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
                      value={formData.invoiceNumber}
                      disabled={status === 'Posted'}
                      onChange={(e) => handleFieldChange('invoiceNumber', e.target.value)}
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
                        value={formData.customer}
                        disabled={status === 'Posted'}
                        onChange={(e) => handleFieldChange('customer', e.target.value)}
                      >
                        <option value="">Select Customer</option>
                        {sampleCustomers.map(customer => (
                          <option key={customer.code} value={customer.code}>
                            {customer.name}
                          </option>
                        ))}
                      </select>
                      {formData.customer && (
                        <div className="relative">
                          <button
                            type="button"
                            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                          >
                            <Info className="w-4 h-4" />
                          </button>
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
                        value={formData.invoiceDate}
                        disabled={status === 'Posted'}
                        onChange={(e) => handleFieldChange('invoiceDate', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-600 block">Due Date</label>
                      <input
                        type="date"
                        className="w-full px-1 py-1.5 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-xs"
                        value={formData.dueDate}
                        disabled={status === 'Posted'}
                        onChange={(e) => handleFieldChange('dueDate', e.target.value)}
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
                    
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-600 block">Currency</label>
                      <select
                        className="w-full px-1 py-1.5 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-xs"
                        value={formData.currency}
                        disabled={status === 'Posted'}
                        onChange={(e) => handleFieldChange('currency', e.target.value)}
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
                      value={formData.invoiceAmount}
                      disabled={status === 'Posted'}
                      onChange={(e) => handleFieldChange('invoiceAmount', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                {/* Column 4: Comments + Attachments */}
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 block">Comments</label>
                    <textarea
                      className="w-full px-2 py-1.5 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-sm resize-none"
                      rows={3}
                      value={formData.invoiceComments || ''}
                      disabled={status === 'Posted'}
                      placeholder="Add comments..."
                      onChange={(e) => handleFieldChange('invoiceComments', e.target.value)}
                    />
                  </div>

                  {/* Attachments */}
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-gray-600 flex items-center gap-1">
                      <Paperclip className="w-3 h-3" />
                      Files
                    </div>
                    
                    {status !== 'Posted' && (
                      <div className="border border-dashed border-gray-200 rounded p-1.5 text-center hover:border-blue-300 transition-colors bg-gray-50">
                        <Upload className="w-3 h-3 text-gray-400 mx-auto" />
                        <button
                          type="button"
                          className="mt-0.5 px-1.5 py-0.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                          onClick={() => {
                            // File upload logic would go here
                            alert('File upload functionality would be implemented here');
                          }}
                        >
                          Add
                        </button>
                      </div>
                    )}
                    
                    {/* File List */}
                    <div className="space-y-0.5">
                      {formData.attachments?.length > 0 ? (
                        formData.attachments.map((file, index) => (
                          <div key={index} className="flex items-center gap-1 px-1 py-0.5 bg-gray-50 rounded text-xs">
                            <FileText className="w-2.5 h-2.5 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-600 flex-1 truncate text-xs">{file}</span>
                            <span className="text-gray-400 text-xs">2.4M</span>
                          </div>
                        ))
                      ) : (
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
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'Invoice Lines' && (
            <div className="bg-white rounded-lg border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Product</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Account</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Quantity</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Price</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Taxes</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Amount</th>
                    <th className="w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {formData.lines.map((line, index) => (
                    <tr key={line.id} className="border-t border-gray-200">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={line.product}
                            onChange={(e) => {
                              const productCode = e.target.value;
                              handleLineChange(line.id, 'product', productCode);
                              
                              // Auto-fill price and account when product is selected
                              if (productCode) {
                                const productDetail = sampleProductDetails.find(p => p.code === productCode);
                                if (productDetail) {
                                  handleLineChange(line.id, 'price', productDetail.unitPrice);
                                  handleLineChange(line.id, 'account', productDetail.accountCode);
                                  // Update amount
                                  const newAmount = line.quantity * productDetail.unitPrice;
                                  handleLineChange(line.id, 'amount', newAmount);
                                }
                              }
                            }}
                            className="flex-1 border-0 focus:outline-none text-sm bg-transparent"
                            disabled={formData.status === 'Posted'}
                          >
                            <option value="">Select Product/Item</option>
                            {sampleProducts.map(product => (
                              <option key={product.value} value={product.value}>
                                {product.label}
                              </option>
                            ))}
                          </select>
                          
                          {/* Action Icons */}
                          <div className="flex items-center gap-1">
                            {line.product ? (
                              <button
                                type="button"
                                className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                                title="View Product Details"
                                onClick={() => {
                                  const productDetail = sampleProductDetails.find(p => p.code === line.product);
                                  if (productDetail) {
                                    alert(`Product: ${productDetail.name}\nDescription: ${productDetail.description}\nUnit Price: ${productDetail.unitPrice} ${productDetail.currency}\nAccount: ${productDetail.accountCode}`);
                                  }
                                }}
                              >
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                                title="Create New Product"
                                onClick={() => {
                                  alert('Navigate to Create New Product page');
                                }}
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={line.account}
                            onChange={(e) => handleLineChange(line.id, 'account', e.target.value)}
                            className="flex-1 border-0 focus:outline-none text-sm bg-transparent"
                            disabled={formData.status === 'Posted'}
                          >
                            <option value="">Select Account</option>
                            {accountNumbers.map(account => (
                              <option key={account.value} value={account.value}>
                                {account.label}
                              </option>
                            ))}
                          </select>
                          
                          {/* Action Icons */}
                          <div className="flex items-center gap-1">
                            {line.account ? (
                              <button
                                type="button"
                                className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                                title="View Account Details"
                                onClick={() => {
                                  const accountDetail = accountNumbers.find(acc => acc.value === line.account);
                                  if (accountDetail) {
                                    alert(`Account: ${accountDetail.label}\nCode: ${accountDetail.value}\nType: Revenue Account`);
                                  }
                                }}
                              >
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                                title="Create New Account"
                                onClick={() => {
                                  alert('Navigate to Chart of Accounts to create new account');
                                }}
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <input
                          type="number"
                          value={line.quantity}
                          onChange={(e) => {
                            const newQuantity = parseFloat(e.target.value) || 0;
                            handleLineChange(line.id, 'quantity', newQuantity);
                            // Update amount when quantity changes
                            const newAmount = newQuantity * line.price;
                            handleLineChange(line.id, 'amount', newAmount);
                          }}
                          className="w-full border-0 focus:outline-none text-sm text-right"
                          placeholder="1"
                          step="0.01"
                          disabled={formData.status === 'Posted'}
                        />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <input
                          type="number"
                          value={line.price}
                          onChange={(e) => {
                            const newPrice = parseFloat(e.target.value) || 0;
                            handleLineChange(line.id, 'price', newPrice);
                            // Update amount when price changes
                            const newAmount = line.quantity * newPrice;
                            handleLineChange(line.id, 'amount', newAmount);
                          }}
                          className="w-full border-0 focus:outline-none text-sm text-right"
                          placeholder="0.00"
                          step="0.01"
                          disabled={formData.status === 'Posted'}
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={line.taxes}
                          onChange={(e) => handleLineChange(line.id, 'taxes', e.target.value)}
                          className="w-full border-0 focus:outline-none text-sm"
                          placeholder="Tax codes"
                          disabled={formData.status === 'Posted'}
                        />
                      </td>
                      <td className="py-3 px-4 text-right font-medium">
                        ₹ {line.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4">
                        {formData.status === 'Draft' && (
                          <button
                            onClick={() => removeLine(line.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Delete line"
                          >
                            ✕
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {formData.status === 'Draft' && (
                    <tr className="border-t border-gray-200">
                      <td colSpan={7} className="py-3 px-4">
                        <button
                          onClick={addLine}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Add a line
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              
              {/* Totals Section */}
              <div className="bg-gray-50 border-t border-gray-200 p-4">
                <div className="flex justify-end">
                  <div className="w-80 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Untaxed Amount:</span>
                      <span className="font-medium">₹ {subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax Amount:</span>
                      <span className="font-medium">₹ {taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="border-t border-gray-300 pt-2">
                      <div className="flex justify-between text-base font-semibold">
                        <span className="text-gray-900">Total:</span>
                        <span className="text-gray-900">₹ {totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-base font-semibold text-blue-600">
                      <span>Amount Due:</span>
                      <span>₹ {totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Journal Items Tab */}
          {activeTab === 'Journal Items' && (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Journal Entry Details</h3>
                <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Document Type:</span> {formData.documentType}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Reference:</span> {formData.invoiceNumber}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Date:</span> {formData.invoiceDate}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Status:</span> 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      formData.status === 'Posted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {formData.status}
                    </span>
                  </div>
                </div>
              </div>

              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Account Code</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Account Name</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Description</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Debit</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Credit</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Debit Entry - Accounts Receivable (Debtors) */}
                  <tr className="border-t border-gray-200 bg-blue-50">
                    <td className="py-3 px-4 text-sm font-mono font-medium">
                      1200
                    </td>
                    <td className="py-3 px-4 text-sm font-medium">
                      Accounts Receivable - {formData.customer}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      Customer Invoice - {formData.invoiceNumber}
                    </td>
                    <td className="py-3 px-4 text-right text-sm font-medium text-blue-700">
                      ₹ {totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-right text-sm">
                      -
                    </td>
                  </tr>
                  
                  {/* Credit Entries - Revenue Accounts */}
                  {formData.lines.map((line, index) => {
                    const productDetail = sampleProductDetails.find(p => p.code === line.product);
                    const accountDetail = accountNumbers.find(acc => acc.value === line.account);
                    
                    return (
                      <tr key={line.id} className="border-t border-gray-200">
                        <td className="py-3 px-4 text-sm font-mono">
                          <div className="flex items-center gap-2">
                            <span>{line.account.split(' ')[0] || line.account}</span>
                            {line.account && (
                              <button
                                type="button"
                                className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                                title="View Account Details"
                                onClick={() => {
                                  if (accountDetail) {
                                    alert(`Account: ${accountDetail.label}\nCode: ${accountDetail.value}\nType: Revenue Account`);
                                  }
                                }}
                              >
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {accountDetail ? accountDetail.label.split(' - ')[1] || accountDetail.label : 'General Account'}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <div className="flex items-center gap-2">
                            <span>{productDetail ? productDetail.name : (line.product || 'Product/Service')}</span>
                            {line.product && (
                              <button
                                type="button"
                                className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                                title="View Product Details"
                                onClick={() => {
                                  if (productDetail) {
                                    alert(`Product: ${productDetail.name}\nDescription: ${productDetail.description}\nUnit Price: ${productDetail.unitPrice} ${productDetail.currency}\nAccount: ${productDetail.accountCode}`);
                                  }
                                }}
                              >
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right text-sm">
                          -
                        </td>
                        <td className="py-3 px-4 text-right text-sm font-medium text-green-700">
                          ₹ {line.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-gray-50 border-t border-gray-200">
                  <tr>
                    <td colSpan={3} className="py-3 px-4 text-sm font-medium text-gray-700">
                      Total
                    </td>
                    <td className="py-3 px-4 text-right text-sm font-bold text-gray-900">
                      ₹ {totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-right text-sm font-bold text-gray-900">
                      ₹ {totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                  <tr className="bg-green-50">
                    <td colSpan={3} className="py-2 px-4 text-sm font-medium text-green-800">
                      Balance Check: 
                      <span className="ml-2 text-green-600">✓ Balanced</span>
                    </td>
                    <td colSpan={2} className="py-2 px-4 text-right text-sm font-medium text-green-800">
                      Debit = Credit: ₹ {totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tfoot>
              </table>
              
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="text-sm text-gray-600">
                  <p><strong>Journal Entry Summary:</strong></p>
                  <p>This journal entry records the customer invoice for <strong>{formData.customer}</strong>. 
                     The entry follows standard double-entry bookkeeping principles:</p>
                  <ul className="mt-2 ml-4 space-y-1">
                    <li><strong>Debit:</strong> Accounts Receivable (1200) - ₹ {totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} - Increases customer debt</li>
                    <li><strong>Credit:</strong> Revenue Accounts - ₹ {totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} - Records sales income</li>
                  </ul>
                  <p className="mt-2">
                    <span className="text-green-600 font-medium">✓ Entry is balanced:</span> Total Debits = Total Credits
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Other Info' && (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-500">Additional information will be displayed here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}