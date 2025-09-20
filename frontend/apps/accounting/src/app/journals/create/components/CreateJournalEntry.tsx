"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, AlertTriangle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import JournalEntryHeader from './JournalEntryHeader';
import JournalEntryLineItems from './JournalEntryLineItems';

interface JournalLine {
  id: string;
  lineNumber: number;
  accountCode: string;
  accountName: string;
  description: string;
  amount: number; // Positive = Debit, Negative = Credit
  currencyCode: string;
  exchangeRate: number;
  baseAmount: number; // Positive = Debit, Negative = Credit
  costCenter: string;
  project: string;
  reference: string;
  comments: string;
}

interface JournalEntryForm {
  journalType: string;
  source: string;
  companyCode: string;
  journalNumber: string;
  entryDate: string;
  effectiveDate: string;
  accountingPeriod: string;
  reversalDate: string;
  currencyDate: string;
  currency: string;
  exchangeRate: number;
  totalDebits: number;
  totalCredits: number;
  description: string;
  comments: string;
  attachments: any[];
}

const defaultJournalLine: JournalLine = {
  id: '',
  lineNumber: 0,
  accountCode: '',
  accountName: '',
  description: '',
  amount: 0,
  currencyCode: 'USD',
  exchangeRate: 1,
  baseAmount: 0,
  costCenter: '',
  project: '',
  reference: '',
  comments: ''
};

export default function CreateJournalEntry() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const entryId = searchParams.get('id');
  const mode = searchParams.get('mode');
  const isReadOnly = mode === 'view';

  const [journalForm, setJournalForm] = useState<JournalEntryForm>({
    journalType: 'General',
    source: 'Manual',
    companyCode: 'MAIN',
    journalNumber: '',
    entryDate: new Date().toISOString().split('T')[0],
    effectiveDate: new Date().toISOString().split('T')[0],
    accountingPeriod: new Date().toISOString().slice(0, 7),
    reversalDate: '',
    currencyDate: new Date().toISOString().split('T')[0],
    currency: 'USD',
    exchangeRate: 1,
    totalDebits: 0,
    totalCredits: 0,
    description: '',
    comments: '',
    attachments: []
  });

  const [journalLines, setJournalLines] = useState<JournalLine[]>([
    { ...defaultJournalLine, id: '1', lineNumber: 1, amount: 0 },
    { ...defaultJournalLine, id: '2', lineNumber: 2, amount: 0 }
  ]);

  const generateLineId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const addLine = () => {
    const newLine: JournalLine = {
      ...defaultJournalLine,
      id: generateLineId(),
      lineNumber: journalLines.length + 1,
      currencyCode: journalForm.currency || 'USD',
      exchangeRate: journalForm.exchangeRate || 1
    };
    setJournalLines([...journalLines, newLine]);
  };

  const removeLine = (id: string) => {
    if (journalLines.length <= 2) return; // Minimum 2 lines for journal entry
    const updatedLines = journalLines.filter(line => line.id !== id);
    // Renumber lines
    const renumberedLines = updatedLines.map((line, index) => ({
      ...line,
      lineNumber: index + 1
    }));
    setJournalLines(renumberedLines);
  };

  const handleLineChange = (id: string, field: keyof JournalLine, value: any) => {
    setJournalLines(prev => prev.map(line => {
      if (line.id === id) {
        const updatedLine = { ...line, [field]: value };
        
        // Auto-calculate base amount when amount or exchange rate changes
        if (field === 'amount' || field === 'exchangeRate') {
          const amount = field === 'amount' ? value : updatedLine.amount;
          const exchangeRate = field === 'exchangeRate' ? value : updatedLine.exchangeRate;
          updatedLine.baseAmount = Number((amount * exchangeRate).toFixed(2));
        }
        
        return updatedLine;
      }
      return line;
    }));
  };

  // Update totals when lines change
  useEffect(() => {
    const totalDebits = journalLines.filter(line => line.amount > 0).reduce((sum, line) => sum + line.amount, 0);
    const totalCredits = journalLines.filter(line => line.amount < 0).reduce((sum, line) => sum + Math.abs(line.amount), 0);
    
    setJournalForm(prev => ({
      ...prev,
      totalDebits,
      totalCredits
    }));
  }, [journalLines]);

  // Load existing journal entry data when editing
  useEffect(() => {
    if (entryId) {
      // Mock data for demonstration
      const mockJournalLines: JournalLine[] = [
        {
          id: '1',
          lineNumber: 1,
          accountCode: '1000',
          accountName: 'Cash and Cash Equivalents',
          description: 'Cash receipt from customer',
          amount: 5000, // Positive = Debit
          currencyCode: 'USD',
          exchangeRate: 1,
          baseAmount: 5000,
          costCenter: 'CC001',
          project: 'PRJ001',
          reference: 'REF001',
          comments: 'Customer payment'
        },
        {
          id: '2',
          lineNumber: 2,
          accountCode: '1100',
          accountName: 'Accounts Receivable',
          description: 'Reduce AR balance',
          amount: -5000, // Negative = Credit
          currencyCode: 'USD',
          exchangeRate: 1,
          baseAmount: -5000,
          costCenter: 'CC001',
          project: 'PRJ001',
          reference: 'REF001',
          comments: 'AR reduction'
        }
      ];

      setJournalForm(prev => ({
        ...prev,
        journalNumber: `JE-${entryId}`,
        description: 'Customer Payment Receipt',
        comments: 'Processed customer payment for invoice INV-001'
      }));
      
      setJournalLines(mockJournalLines);
    }
  }, [entryId]);

  const handleFormChange = (field: string, value: any) => {
    setJournalForm(prev => ({
      ...prev,
      [field]: value
    }));

    // Update exchange rate for all lines when currency changes
    if (field === 'currency' || field === 'exchangeRate') {
      setJournalLines(prev => prev.map(line => ({
        ...line,
        currencyCode: field === 'currency' ? value : line.currencyCode,
        exchangeRate: field === 'exchangeRate' ? value : journalForm.exchangeRate
      })));
    }
  };

  const handleSave = () => {
    console.log('Saving journal entry:', { journalForm, journalLines });
    // Add save logic here
    alert('Journal entry saved successfully!');
  };

  const handleBack = () => {
    router.push('/journals');
  };

  const isBalanced = Math.abs(journalForm.totalDebits - journalForm.totalCredits) < 0.01;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto p-2 md:p-4 space-y-3 pb-8">
        {/* Header with Navigation and Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline font-bold">JE-Explorer</span>
              <span className="sm:hidden">Back</span>
            </button>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            {!isBalanced && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">Entry Not Balanced</span>
              </div>
            )}
            {!isReadOnly && (
              <button
                onClick={handleSave}
                disabled={!isBalanced}
                className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto"
              >
                <Save className="w-4 h-4" />
                <span>{entryId ? 'Update Entry' : 'Save Entry'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Journal Entry Header */}
        <JournalEntryHeader
          journalForm={journalForm}
          onFormChange={handleFormChange}
          isEditMode={!isReadOnly}
        />

        {/* Journal Entry Line Items */}
        <JournalEntryLineItems
          lines={journalLines}
          onAddLine={addLine}
          onRemoveLine={removeLine}
          onLineChange={handleLineChange}
          isReadOnly={isReadOnly}
        />
      </div>
    </div>
  );
}
