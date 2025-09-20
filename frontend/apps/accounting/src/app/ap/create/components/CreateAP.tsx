"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import APInvoiceHeader from './APInvoiceHeader';
import APInvoiceLineItems from './APInvoiceLineItems';

interface VendorInfo {
  code: string;
  name: string;
  creditLimit: number;
  balance: number;
  terms: string;
  contact: string;
  phone: string;
  email: string;
}

interface InvoiceLine {
  id: string;
  lineCode: string;
  accountNumber: string;
  description: string;
  quantity: number;
  rate: number;
  currencyCode: string;
  roeRate: number;
  currencyAmount: number;
  baseAmount: number;
  vatRate: number;
  vatAmount: number;
  totalAmount: number;
  comments: string;
}

interface APInvoiceForm {
  process: string;
  invoiceType: string;
  companyCode: string;
  vendor: string;
  invoiceDate: string;
  dueDate: string;
  entryDate: string;
  currencyDate: string;
  currency: string;
  invoiceNumber: string;
  invoiceAmount: number;
  vendorReference: string;
  paymentTerms: string;
  comments: string;
  attachments: any[];
}

// Sample vendors
const sampleVendors: VendorInfo[] = [
  { code: 'V001', name: 'ABC Shipping Lines', creditLimit: 50000, balance: 15000, terms: 'Net 30', contact: 'John Smith', phone: '+1-555-0123', email: 'john@abcshipping.com' },
  { code: 'V002', name: 'Port Authority Services', creditLimit: 75000, balance: 22000, terms: 'Net 45', contact: 'Sarah Wilson', phone: '+1-555-0124', email: 'sarah@portauth.com' },
  { code: 'V003', name: 'Marine Equipment Ltd', creditLimit: 30000, balance: 8500, terms: 'Net 15', contact: 'Mike Johnson', phone: '+1-555-0125', email: 'mike@marineequip.com' }
];

const defaultLineItem: InvoiceLine = {
  id: '',
  lineCode: '',
  accountNumber: '',
  description: '',
  quantity: 1,
  rate: 0,
  currencyCode: 'USD',
  roeRate: 1.0,
  currencyAmount: 0,
  baseAmount: 0,
  vatRate: 0,
  vatAmount: 0,
  totalAmount: 0,
  comments: ''
};

// Invoice service for AP
const APInvoiceService = {
  generateInvoiceNumber: () => {
    return `AP${new Date().getFullYear()}${(Date.now() % 100000).toString().padStart(5, '0')}`;
  },
  
  calculateLineTotal: (line: InvoiceLine): InvoiceLine => {
    const currencyAmount = line.quantity * line.rate;
    const baseAmount = currencyAmount * line.roeRate;
    const vatAmount = baseAmount * (line.vatRate / 100);
    const totalAmount = baseAmount + vatAmount;
    
    return {
      ...line,
      currencyAmount: Number(currencyAmount.toFixed(2)),
      baseAmount: Number(baseAmount.toFixed(2)),
      vatAmount: Number(vatAmount.toFixed(2)),
      totalAmount: Number(totalAmount.toFixed(2))
    };
  },
  
  saveInvoice: async (invoiceData: any): Promise<{success: boolean; invoiceId: string; message: string}> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          invoiceId: APInvoiceService.generateInvoiceNumber(),
          message: 'AP Invoice saved successfully'
        });
      }, 1000);
    });
  }
};

export default function CreateAP() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get('id');
  const mode = searchParams.get('mode') || 'edit';
  const isEditMode = !!invoiceId;
  const isViewMode = mode === 'view';
  const isReadOnly = isViewMode;
  const [selectedVendor, setSelectedVendor] = useState<VendorInfo | null>(null);
  
  const [invoiceForm, setInvoiceForm] = useState<APInvoiceForm>({
    process: 'MANUAL',
    invoiceType: 'STANDARD',
    companyCode: 'SHL001',
    vendor: '',
    invoiceDate: '2025-09-01',
    dueDate: '2025-10-01',
    entryDate: '2025-09-01',
    currencyDate: '2025-09-01',
    currency: 'USD',
    invoiceNumber: APInvoiceService.generateInvoiceNumber(),
    invoiceAmount: 0.00,
    vendorReference: '',
    paymentTerms: 'NET30',
    comments: '',
    attachments: []
  });

  const [invoiceLines, setInvoiceLines] = useState<InvoiceLine[]>([
    { ...defaultLineItem, id: '1', currencyCode: invoiceForm.currency }
  ]);

  useEffect(() => {
    if (isEditMode && invoiceId) {
      loadInvoiceData(invoiceId);
    }
  }, [isEditMode, invoiceId]);

  const loadInvoiceData = async (id: string) => {
    try {
      // Mock data for demonstration
      const mockInvoiceData: APInvoiceForm = {
        process: 'MANUAL',
        invoiceType: 'STANDARD',
        companyCode: 'SHL001',
        vendor: 'V001',
        invoiceDate: '2025-09-01',
        dueDate: '2025-10-01',
        entryDate: '2025-09-01',
        currencyDate: '2025-09-01',
        currency: 'USD',
        invoiceNumber: `AP${id}`,
        invoiceAmount: 1575.00,
        vendorReference: 'PO-12345',
        paymentTerms: 'NET30',
        comments: 'Freight charges for September shipment',
        attachments: []
      };

      const mockLineItems = [
        {
          id: '1',
          lineCode: 'LINE001',
          accountNumber: '5000',
          description: 'Ocean Freight Charges',
          quantity: 1,
          rate: 1200,
          currencyCode: 'USD',
          roeRate: 1.0,
          currencyAmount: 1200,
          baseAmount: 1200,
          vatRate: 10,
          vatAmount: 120,
          totalAmount: 1320,
          comments: 'Main freight charge'
        },
        {
          id: '2',
          lineCode: 'LINE002',
          accountNumber: '5100',
          description: 'Port Handling Fees',
          quantity: 1,
          rate: 250,
          currencyCode: 'USD',
          roeRate: 1.0,
          currencyAmount: 250,
          baseAmount: 250,
          vatRate: 2,
          vatAmount: 5,
          totalAmount: 255,
          comments: 'Port charges'
        }
      ];

      setInvoiceForm(mockInvoiceData);
      setInvoiceLines(mockLineItems);
      
      // Set selected vendor
      const vendor = sampleVendors.find(v => v.code === mockInvoiceData.vendor);
      if (vendor) {
        setSelectedVendor(vendor);
      }
      
    } catch (error) {
      console.error('Error loading AP invoice data:', error);
    }
  };

  const handleFormChange = (field: string, value: any) => {
    setInvoiceForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleVendorSelect = (vendorCode: string) => {
    const vendor = sampleVendors.find(v => v.code === vendorCode);
    setSelectedVendor(vendor || null);
    handleFormChange('vendor', vendorCode);
  };

  const addInvoiceLine = () => {
    const newLine: InvoiceLine = {
      ...defaultLineItem,
      id: Date.now().toString(),
      currencyCode: invoiceForm.currency || 'USD'
    };
    setInvoiceLines([...invoiceLines, newLine]);
  };

  const removeInvoiceLine = (id: string) => {
    if (invoiceLines.length > 1) {
      setInvoiceLines(invoiceLines.filter(line => line.id !== id));
    }
  };

  const updateInvoiceLine = (id: string, field: keyof InvoiceLine, value: any) => {
    setInvoiceLines(invoiceLines.map(line => {
      if (line.id === id) {
        const updatedLine = APInvoiceService.calculateLineTotal({ ...line, [field]: value });
        return updatedLine;
      }
      return line;
    }));
  };

  const handleSave = async () => {
    try {
      console.log('Saving AP invoice...');
      const invoiceData = { ...invoiceForm, lines: invoiceLines };
      const result = await APInvoiceService.saveInvoice(invoiceData);
      
      if (result.success) {
        console.log('AP Invoice saved successfully:', result.invoiceId);
        console.log(`${isEditMode ? 'Updated' : 'Created'} AP invoice successfully`);
        // Handle success - maybe show a toast notification
      } else {
        console.error('Save failed:', result.message);
        // Handle error - maybe show error notification
      }
    } catch (error) {
      console.error('Error saving AP invoice:', error);
      alert('An error occurred while saving the AP invoice. Please try again.');
    }
  };

  const handleBack = () => {
    router.push('/ap');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Simple Top Navigation */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleBack}
              className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">AP-Explorer</span>
            </button>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <button 
              onClick={handleSave}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-600 text-white text-sm rounded-md hover:bg-slate-700 transition-colors shadow-sm"
            >
              <Save className="w-4 h-4" />
              {isEditMode ? 'Update' : 'Save Draft'}
            </button>
            <button className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors shadow-sm">
              {isEditMode ? 'Save & Post' : 'Submit'} for Approval
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-2 sm:p-4 max-w-full mx-auto space-y-4">
        
        {/* AP Invoice Header */}
        <APInvoiceHeader 
          invoiceForm={invoiceForm}
          selectedVendor={selectedVendor}
          isEditMode={isEditMode}
          onFormChange={handleFormChange}
          onVendorSelect={handleVendorSelect}
        />

        {/* AP Invoice Line Items */}
        <APInvoiceLineItems 
          lines={invoiceLines}
          onAddLine={addInvoiceLine}
          onRemoveLine={removeInvoiceLine}
          onLineChange={updateInvoiceLine}
          isReadOnly={isReadOnly}
        />

      </div>
    </div>
  );
}
