"use client";

import React, { useState } from 'react';
import { Info, Paperclip, FileText, Upload, Calendar, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@commercialapp/ui';

interface CustomerInfo {
  code: string;
  name: string;
  creditLimit: number;
  balance: number;
  terms: string;
  contact: string;
  phone: string;
  email: string;
}

interface InvoiceHeaderProps {
  invoiceForm: any;
  selectedVendor: CustomerInfo | null;
  isEditMode: boolean;
  onFormChange: (field: string, value: any) => void;
  onVendorSelect: (vendorCode: string) => void;
}

export default function APInvoiceHeader({
  invoiceForm,
  selectedVendor,
  isEditMode,
  onFormChange,
  onVendorSelect
}: InvoiceHeaderProps) {
  const [showVendorInfo, setShowVendorInfo] = useState(false);
  const [comments, setComments] = useState(invoiceForm.comments || '');
  const [attachments, setAttachments] = useState(invoiceForm.attachments || []);

  const handleAttachmentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newAttachments = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type
    }));
    setAttachments([...attachments, ...newAttachments]);
    onFormChange('attachments', [...attachments, ...newAttachments]);
  };

  const removeAttachment = (id: number) => {
    const updatedAttachments = attachments.filter((att: any) => att.id !== id);
    setAttachments(updatedAttachments);
    onFormChange('attachments', updatedAttachments);
  };

  // Sample vendors for AP
  const sampleVendors = [
    { code: 'V001', name: 'ABC Shipping Lines', creditLimit: 50000, balance: 15000, terms: 'Net 30', contact: 'John Smith', phone: '+1-555-0123', email: 'john@abcshipping.com' },
    { code: 'V002', name: 'Port Authority Services', creditLimit: 75000, balance: 22000, terms: 'Net 45', contact: 'Sarah Wilson', phone: '+1-555-0124', email: 'sarah@portauth.com' },
    { code: 'V003', name: 'Marine Equipment Ltd', creditLimit: 30000, balance: 8500, terms: 'Net 15', contact: 'Mike Johnson', phone: '+1-555-0125', email: 'mike@marineequip.com' }
  ];

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-b">
        <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-200">
          {isEditMode ? 'Update AP Invoice' : 'Create AP Invoice'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Column 1: Basic Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 border-b pb-1">Basic Information</h3>
            
            {/* Process and Invoice Type in same row */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Process</label>
                <select 
                  value={invoiceForm.process || 'MANUAL'}
                  onChange={(e) => onFormChange('process', e.target.value)}
                  className="w-full px-1 py-1 text-xs border-b border-slate-300 dark:border-slate-600 bg-transparent focus:border-blue-500 focus:outline-none"
                >
                  <option value="MANUAL">Manual</option>
                  <option value="AUTO">Automatic</option>
                  <option value="BATCH">Batch</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Invoice Type</label>
                <select 
                  value={invoiceForm.invoiceType || 'STANDARD'}
                  onChange={(e) => onFormChange('invoiceType', e.target.value)}
                  className="w-full px-1 py-1 text-xs border-b border-slate-300 dark:border-slate-600 bg-transparent focus:border-blue-500 focus:outline-none"
                >
                  <option value="STANDARD">Standard</option>
                  <option value="CREDIT">Credit</option>
                  <option value="DEBIT">Debit</option>
                  <option value="PREPAID">Prepaid</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Company Code</label>
              <input 
                type="text"
                value={invoiceForm.companyCode || 'SHL001'}
                onChange={(e) => onFormChange('companyCode', e.target.value)}
                className="w-full px-2 py-1 text-sm border-b border-slate-300 dark:border-slate-600 bg-transparent focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Invoice Number</label>
              <input 
                type="text"
                value={invoiceForm.invoiceNumber || ''}
                onChange={(e) => onFormChange('invoiceNumber', e.target.value)}
                className="w-full px-2 py-1 text-sm border-b border-slate-300 dark:border-slate-600 bg-transparent focus:border-blue-500 focus:outline-none"
                placeholder="Auto-generated"
              />
            </div>
          </div>

          {/* Column 2: Vendor & Dates */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 border-b pb-1">Vendor & Dates</h3>
            
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Vendor 
                {selectedVendor && (
                  <button
                    type="button"
                    onClick={() => setShowVendorInfo(!showVendorInfo)}
                    className="ml-1 text-blue-500 hover:text-blue-700"
                    title="Vendor Information"
                  >
                    <Info className="w-3 h-3 inline" />
                  </button>
                )}
              </label>
              <select 
                value={invoiceForm.vendor || ''}
                onChange={(e) => onVendorSelect(e.target.value)}
                className="w-full px-2 py-1 text-sm border-b border-slate-300 dark:border-slate-600 bg-transparent focus:border-blue-500 focus:outline-none"
              >
                <option value="">Select Vendor</option>
                {sampleVendors.map(vendor => (
                  <option key={vendor.code} value={vendor.code}>{vendor.name}</option>
                ))}
              </select>
              
              {/* Vendor Info Tooltip */}
              {showVendorInfo && selectedVendor && (
                <div className="absolute z-10 mt-1 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg text-xs max-w-72">
                  <div className="space-y-1">
                    <div><strong>Contact:</strong> {selectedVendor.contact}</div>
                    <div><strong>Phone:</strong> {selectedVendor.phone}</div>
                    <div><strong>Email:</strong> {selectedVendor.email}</div>
                    <div><strong>Terms:</strong> {selectedVendor.terms}</div>
                    <div><strong>Balance:</strong> ${selectedVendor.balance.toLocaleString()}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Invoice Date and Due Date in same row */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Invoice Date</label>
                <input 
                  type="date"
                  value={invoiceForm.invoiceDate || '2025-09-01'}
                  onChange={(e) => onFormChange('invoiceDate', e.target.value)}
                  className="w-full px-1 py-1 text-xs border-b border-slate-300 dark:border-slate-600 bg-transparent focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Due Date</label>
                <input 
                  type="date"
                  value={invoiceForm.dueDate || '2025-10-01'}
                  onChange={(e) => onFormChange('dueDate', e.target.value)}
                  className="w-full px-1 py-1 text-xs border-b border-slate-300 dark:border-slate-600 bg-transparent focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Entry Date</label>
              <input 
                type="date"
                value={invoiceForm.entryDate || '2025-09-01'}
                onChange={(e) => onFormChange('entryDate', e.target.value)}
                className="w-full px-2 py-1 text-sm border-b border-slate-300 dark:border-slate-600 bg-transparent focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Column 3: Financial Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 border-b pb-1">Financial Information</h3>
            
            {/* Currency and Currency Date in same row */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Currency</label>
                <select 
                  value={invoiceForm.currency || 'USD'}
                  onChange={(e) => onFormChange('currency', e.target.value)}
                  className="w-full px-1 py-1 text-xs border-b border-slate-300 dark:border-slate-600 bg-transparent focus:border-blue-500 focus:outline-none"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="JPY">JPY</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Currency Date</label>
                <input 
                  type="date"
                  value={invoiceForm.currencyDate || '2025-09-01'}
                  onChange={(e) => onFormChange('currencyDate', e.target.value)}
                  className="w-full px-1 py-1 text-xs border-b border-slate-300 dark:border-slate-600 bg-transparent focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Invoice Amount</label>
              <input 
                type="number"
                step="0.01"
                value={invoiceForm.invoiceAmount || 0}
                onChange={(e) => onFormChange('invoiceAmount', parseFloat(e.target.value))}
                className="w-full px-2 py-1 text-sm border-b border-slate-300 dark:border-slate-600 bg-transparent focus:border-blue-500 focus:outline-none"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Vendor Reference</label>
              <input 
                type="text"
                value={invoiceForm.vendorReference || ''}
                onChange={(e) => onFormChange('vendorReference', e.target.value)}
                className="w-full px-2 py-1 text-sm border-b border-slate-300 dark:border-slate-600 bg-transparent focus:border-blue-500 focus:outline-none"
                placeholder="Vendor PO/Reference"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Payment Terms</label>
              <select 
                value={invoiceForm.paymentTerms || 'NET30'}
                onChange={(e) => onFormChange('paymentTerms', e.target.value)}
                className="w-full px-2 py-1 text-sm border-b border-slate-300 dark:border-slate-600 bg-transparent focus:border-blue-500 focus:outline-none"
              >
                <option value="NET15">Net 15</option>
                <option value="NET30">Net 30</option>
                <option value="NET45">Net 45</option>
                <option value="NET60">Net 60</option>
                <option value="COD">Cash on Delivery</option>
              </select>
            </div>
          </div>

          {/* Column 4: Comments & Attachments */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 border-b pb-1">Comments & Attachments</h3>
            
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Comments</label>
              <textarea
                value={comments}
                onChange={(e) => {
                  setComments(e.target.value);
                  onFormChange('comments', e.target.value);
                }}
                rows={3}
                className="w-full px-2 py-1 text-xs border border-slate-300 dark:border-slate-600 rounded bg-transparent focus:border-blue-500 focus:outline-none resize-none"
                placeholder="Add notes or comments..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">Attachments</label>
              
              {/* Upload Area */}
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-2 mb-2">
                <label className="cursor-pointer flex flex-col items-center text-xs text-slate-500 hover:text-slate-700">
                  <Upload className="w-4 h-4 mb-1" />
                  <span>Click to upload</span>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleAttachmentUpload}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                  />
                </label>
              </div>

              {/* Attachments List */}
              {attachments.length > 0 && (
                <div className="space-y-1 max-h-20 overflow-y-auto">
                  {attachments.map((attachment: any) => (
                    <div key={attachment.id} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-1 rounded text-xs">
                      <div className="flex items-center gap-1 truncate">
                        <FileText className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <span className="truncate" title={attachment.name}>{attachment.name}</span>
                      </div>
                      <button
                        onClick={() => removeAttachment(attachment.id)}
                        className="text-red-500 hover:text-red-700 flex-shrink-0 ml-1"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
