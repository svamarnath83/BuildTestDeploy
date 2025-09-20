"use client";

import React, { useState } from 'react';
import { Info, Paperclip, FileText, Upload, Calendar, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@commercialapp/ui';

interface JournalEntryHeaderProps {
  journalForm: any;
  isEditMode: boolean;
  onFormChange: (field: string, value: any) => void;
}

export default function JournalEntryHeader({
  journalForm,
  isEditMode,
  onFormChange
}: JournalEntryHeaderProps) {
  const [comments, setComments] = useState(journalForm.comments || '');
  const [attachments, setAttachments] = useState(journalForm.attachments || []);

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

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-b py-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-200">
            {isEditMode 
              ? `Journal Entry ${journalForm.journalNumber ? `#${journalForm.journalNumber}` : ''}` 
              : 'New Journal Entry'
            }
          </CardTitle>
          {isEditMode && journalForm.journalType && (
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                {journalForm.journalType}
              </span>
              {journalForm.companyCode && (
                <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full font-medium">
                  {journalForm.companyCode}
                </span>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Column 1: Basic Information */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 border-b pb-1">Basic Information</h3>
            
            {/* Journal Type and Source in same row */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Journal Type</label>
                <select 
                  value={journalForm.journalType || 'GENERAL'}
                  onChange={(e) => onFormChange('journalType', e.target.value)}
                  className="w-full px-1 py-1 text-xs border-b border-slate-300 dark:border-slate-600 bg-transparent focus:border-blue-500 focus:outline-none"
                >
                  <option value="GENERAL">General</option>
                  <option value="ADJUSTING">Adjusting</option>
                  <option value="CLOSING">Closing</option>
                  <option value="REVERSING">Reversing</option>
                  <option value="RECURRING">Recurring</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Source Type</label>
                <select 
                  value={journalForm.source || 'MANUAL'}
                  onChange={(e) => onFormChange('source', e.target.value)}
                  className="w-full px-1 py-1 text-xs border-b border-slate-300 dark:border-slate-600 bg-transparent focus:border-blue-500 focus:outline-none"
                >
                  <option value="MANUAL">Manual</option>
                  <option value="IMPORT">Import</option>
                  <option value="SYSTEM">System</option>
                  <option value="RECURRING">Recurring</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Company Code</label>
              <input 
                type="text"
                value={journalForm.companyCode || 'SHL001'}
                onChange={(e) => onFormChange('companyCode', e.target.value)}
                className="w-full px-2 py-1 text-sm border-b border-slate-300 dark:border-slate-600 bg-transparent focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Journal Number</label>
              <input 
                type="text"
                value={journalForm.journalNumber || ''}
                onChange={(e) => onFormChange('journalNumber', e.target.value)}
                className="w-full px-2 py-1 text-sm border-b border-slate-300 dark:border-slate-600 bg-transparent focus:border-blue-500 focus:outline-none"
                placeholder="Auto-generated"
              />
            </div>
          </div>

          {/* Column 2: Dates & Period */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 border-b pb-1">Dates & Period</h3>
            
            {/* Entry Date and Reversal Date in same row */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Entry Date</label>
                <input 
                  type="date"
                  value={journalForm.entryDate || '2025-09-01'}
                  onChange={(e) => onFormChange('entryDate', e.target.value)}
                  className="w-full px-1 py-1 text-xs border-b border-slate-300 dark:border-slate-600 bg-transparent focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Reversal Date</label>
                <input 
                  type="date"
                  value={journalForm.reversalDate || ''}
                  onChange={(e) => onFormChange('reversalDate', e.target.value)}
                  className="w-full px-1 py-1 text-xs border-b border-slate-300 dark:border-slate-600 bg-transparent focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Effective Date and Currency Date in same row */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Effective Date</label>
                <input 
                  type="date"
                  value={journalForm.effectiveDate || '2025-09-01'}
                  onChange={(e) => onFormChange('effectiveDate', e.target.value)}
                  className="w-full px-1 py-1 text-xs border-b border-slate-300 dark:border-slate-600 bg-transparent focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Currency Date</label>
                <input 
                  type="date"
                  value={journalForm.currencyDate || '2025-09-01'}
                  onChange={(e) => onFormChange('currencyDate', e.target.value)}
                  className="w-full px-1 py-1 text-xs border-b border-slate-300 dark:border-slate-600 bg-transparent focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Accounting Period</label>
              <select 
                value={journalForm.accountingPeriod || '2025-09'}
                onChange={(e) => onFormChange('accountingPeriod', e.target.value)}
                className="w-full px-2 py-1 text-sm border-b border-slate-300 dark:border-slate-600 bg-transparent focus:border-blue-500 focus:outline-none"
              >
                <option value="2025-09">September 2025</option>
                <option value="2025-08">August 2025</option>
                <option value="2025-07">July 2025</option>
                <option value="2025-06">June 2025</option>
              </select>
            </div>
          </div>

          {/* Column 3: Financial Information */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 border-b pb-1">Financial Information</h3>
            
            {/* Currency and Exchange Rate in same row */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Currency</label>
                <select 
                  value={journalForm.currency || 'USD'}
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
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Exchange Rate</label>
                <input 
                  type="number"
                  step="0.000001"
                  value={journalForm.exchangeRate || 1.0}
                  onChange={(e) => onFormChange('exchangeRate', parseFloat(e.target.value))}
                  className="w-full px-1 py-1 text-xs border-b border-slate-300 dark:border-slate-600 bg-transparent focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Total Debits and Credits in same row */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Total Debits</label>
                <input 
                  type="number"
                  step="0.01"
                  value={journalForm.totalDebits || 0}
                  className="w-full px-1 py-1 text-xs border-b border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Total Credits</label>
                <input 
                  type="number"
                  step="0.01"
                  value={journalForm.totalCredits || 0}
                  className="w-full px-1 py-1 text-xs border-b border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800"
                  readOnly
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Balance</label>
              <input 
                type="number"
                step="0.01"
                value={(journalForm.totalDebits || 0) - (journalForm.totalCredits || 0)}
                className={`w-full px-2 py-1 text-sm border-b border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 ${
                  Math.abs((journalForm.totalDebits || 0) - (journalForm.totalCredits || 0)) > 0.01 
                    ? 'text-red-600 font-medium' 
                    : 'text-green-600'
                }`}
                readOnly
              />
            </div>
          </div>

          {/* Column 4: Comments & Attachments */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 border-b pb-1">Comments & Attachments</h3>
            
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Comments</label>
              <textarea
                value={comments}
                onChange={(e) => {
                  setComments(e.target.value);
                  onFormChange('comments', e.target.value);
                }}
                rows={4}
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
