"use client";

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@commercialapp/ui';

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

interface APInvoiceLineItemsProps {
  lines: InvoiceLine[];
  onAddLine: () => void;
  onRemoveLine: (id: string) => void;
  onLineChange: (id: string, field: keyof InvoiceLine, value: any) => void;
  isReadOnly?: boolean;
}

export default function APInvoiceLineItems({
  lines,
  onAddLine,
  onRemoveLine,
  onLineChange,
  isReadOnly = false
}: APInvoiceLineItemsProps) {
  
  // Sample account numbers for AP (expense accounts)
  const accountNumbers = [
    { code: '5000', name: 'Freight Expenses' },
    { code: '5100', name: 'Port Charges' },
    { code: '5200', name: 'Fuel Costs' },
    { code: '5300', name: 'Equipment Rental' },
    { code: '5400', name: 'Insurance Expenses' },
    { code: '5500', name: 'Professional Services' },
    { code: '5600', name: 'Office Supplies' },
    { code: '5700', name: 'Utilities' },
    { code: '5800', name: 'Maintenance & Repairs' },
    { code: '5900', name: 'Other Expenses' }
  ];

  // Calculate totals
  const totalCurrencyAmount = lines.reduce((sum, line) => sum + line.currencyAmount, 0);
  const totalBaseAmount = lines.reduce((sum, line) => sum + line.baseAmount, 0);
  const totalVatAmount = lines.reduce((sum, line) => sum + line.vatAmount, 0);
  const grandTotal = lines.reduce((sum, line) => sum + line.totalAmount, 0);

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-b pb-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-200">
            AP Invoice Line Items
          </CardTitle>
          {!isReadOnly && (
            <button
              onClick={onAddLine}
              className="flex items-center justify-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              Add Line
            </button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <div className="max-h-80 overflow-y-auto">
            <table className="w-full text-sm min-w-[800px]">
            <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0 z-10">
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left p-2 font-medium text-slate-700 dark:text-slate-300 w-20">Line</th>
                <th className="text-left p-2 font-medium text-slate-700 dark:text-slate-300 w-24">Account</th>
                <th className="text-left p-2 font-medium text-slate-700 dark:text-slate-300">Description</th>
                <th className="text-left p-2 font-medium text-slate-700 dark:text-slate-300 w-20">Qty</th>
                <th className="text-left p-2 font-medium text-slate-700 dark:text-slate-300 w-24">Rate</th>
                <th className="text-left p-2 font-medium text-slate-700 dark:text-slate-300 w-20">Currency</th>
                <th className="text-left p-2 font-medium text-slate-700 dark:text-slate-300 w-24">Curr. Amt</th>
                <th className="text-left p-2 font-medium text-slate-700 dark:text-slate-300 w-24">Base Amt</th>
                <th className="text-left p-2 font-medium text-slate-700 dark:text-slate-300 w-20">VAT %</th>
                <th className="text-left p-2 font-medium text-slate-700 dark:text-slate-300 w-24">VAT Amt</th>
                <th className="text-left p-2 font-medium text-slate-700 dark:text-slate-300 w-24">Total</th>
                <th className="text-left p-2 font-medium text-slate-700 dark:text-slate-300">Comments</th>
                {!isReadOnly && <th className="text-center p-2 font-medium text-slate-700 dark:text-slate-300 w-12">Action</th>}
              </tr>
            </thead>
            <tbody>
              {lines.map((line, index) => (
                <tr key={line.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50">
                  <td className="p-1">
                    <input
                      type="text"
                      value={line.lineCode}
                      onChange={(e) => onLineChange(line.id, 'lineCode', e.target.value)}
                      className="w-full p-1 text-xs border border-slate-300 dark:border-slate-600 rounded bg-transparent focus:border-blue-500 focus:outline-none"
                      placeholder={`L${(index + 1).toString().padStart(3, '0')}`}
                      readOnly={isReadOnly}
                    />
                  </td>
                  <td className="p-1">
                    <select
                      value={line.accountNumber}
                      onChange={(e) => onLineChange(line.id, 'accountNumber', e.target.value)}
                      className="w-full p-1 text-xs border border-slate-300 dark:border-slate-600 rounded bg-transparent focus:border-blue-500 focus:outline-none"
                      disabled={isReadOnly}
                    >
                      <option value="">Select</option>
                      {accountNumbers.map(account => (
                        <option key={account.code} value={account.code}>
                          {account.code} - {account.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-1">
                    <input
                      type="text"
                      value={line.description}
                      onChange={(e) => onLineChange(line.id, 'description', e.target.value)}
                      className="w-full p-1 text-xs border border-slate-300 dark:border-slate-600 rounded bg-transparent focus:border-blue-500 focus:outline-none"
                      placeholder="Description"
                      readOnly={isReadOnly}
                    />
                  </td>
                  <td className="p-1">
                    <input
                      type="number"
                      step="0.01"
                      value={line.quantity}
                      onChange={(e) => onLineChange(line.id, 'quantity', parseFloat(e.target.value) || 0)}
                      className="w-full p-1 text-xs border border-slate-300 dark:border-slate-600 rounded bg-transparent focus:border-blue-500 focus:outline-none text-right"
                      readOnly={isReadOnly}
                    />
                  </td>
                  <td className="p-1">
                    <input
                      type="number"
                      step="0.01"
                      value={line.rate}
                      onChange={(e) => onLineChange(line.id, 'rate', parseFloat(e.target.value) || 0)}
                      className="w-full p-1 text-xs border border-slate-300 dark:border-slate-600 rounded bg-transparent focus:border-blue-500 focus:outline-none text-right"
                      readOnly={isReadOnly}
                    />
                  </td>
                  <td className="p-1">
                    <select
                      value={line.currencyCode}
                      onChange={(e) => onLineChange(line.id, 'currencyCode', e.target.value)}
                      className="w-full p-1 text-xs border border-slate-300 dark:border-slate-600 rounded bg-transparent focus:border-blue-500 focus:outline-none"
                      disabled={isReadOnly}
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="JPY">JPY</option>
                    </select>
                  </td>
                  <td className="p-1">
                    <input
                      type="number"
                      step="0.01"
                      value={line.currencyAmount}
                      className="w-full p-1 text-xs border border-slate-300 dark:border-slate-600 rounded bg-slate-50 dark:bg-slate-800 text-right"
                      readOnly
                    />
                  </td>
                  <td className="p-1">
                    <input
                      type="number"
                      step="0.01"
                      value={line.baseAmount}
                      className="w-full p-1 text-xs border border-slate-300 dark:border-slate-600 rounded bg-slate-50 dark:bg-slate-800 text-right"
                      readOnly
                    />
                  </td>
                  <td className="p-1">
                    <input
                      type="number"
                      step="0.01"
                      value={line.vatRate}
                      onChange={(e) => onLineChange(line.id, 'vatRate', parseFloat(e.target.value) || 0)}
                      className="w-full p-1 text-xs border border-slate-300 dark:border-slate-600 rounded bg-transparent focus:border-blue-500 focus:outline-none text-right"
                      readOnly={isReadOnly}
                    />
                  </td>
                  <td className="p-1">
                    <input
                      type="number"
                      step="0.01"
                      value={line.vatAmount}
                      className="w-full p-1 text-xs border border-slate-300 dark:border-slate-600 rounded bg-slate-50 dark:bg-slate-800 text-right"
                      readOnly
                    />
                  </td>
                  <td className="p-1">
                    <input
                      type="number"
                      step="0.01"
                      value={line.totalAmount}
                      className="w-full p-1 text-xs border border-slate-300 dark:border-slate-600 rounded bg-slate-50 dark:bg-slate-800 text-right font-medium"
                      readOnly
                    />
                  </td>
                  <td className="p-1">
                    <input
                      type="text"
                      value={line.comments}
                      onChange={(e) => onLineChange(line.id, 'comments', e.target.value)}
                      className="w-full p-1 text-xs border border-slate-300 dark:border-slate-600 rounded bg-transparent focus:border-blue-500 focus:outline-none"
                      placeholder="Notes"
                      readOnly={isReadOnly}
                    />
                  </td>
                  {!isReadOnly && (
                    <td className="p-1 text-center">
                      <button
                        onClick={() => onRemoveLine(line.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        disabled={lines.length <= 1}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>

        {/* Totals Section */}
        <div className="border-t bg-slate-50 dark:bg-slate-900 p-3">
          <div className="flex justify-end">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div className="text-right">
                <span className="font-medium text-slate-600 dark:text-slate-400">Currency Total:</span>
                <div className="font-bold text-slate-900 dark:text-slate-100">
                  {totalCurrencyAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <div className="text-right">
                <span className="font-medium text-slate-600 dark:text-slate-400">Base Total:</span>
                <div className="font-bold text-slate-900 dark:text-slate-100">
                  {totalBaseAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <div className="text-right">
                <span className="font-medium text-slate-600 dark:text-slate-400">VAT Total:</span>
                <div className="font-bold text-slate-900 dark:text-slate-100">
                  {totalVatAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <div className="text-right">
                <span className="font-medium text-slate-600 dark:text-slate-400">Grand Total:</span>
                <div className="font-bold text-lg text-blue-600 dark:text-blue-400">
                  {grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
