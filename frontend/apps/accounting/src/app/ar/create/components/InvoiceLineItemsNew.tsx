"use client";

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { InvoiceLine, accountNumbers } from '@/../../packages/ui/libs/accounting';
import { Card, CardHeader, CardTitle, CardContent } from '@commercialapp/ui';

interface InvoiceLineItemsProps {
  lines: InvoiceLine[];
  isReadOnly?: boolean;
  onLineChange: (id: string, field: keyof InvoiceLine, value: any) => void;
  onAddLine: () => void;
  onRemoveLine: (id: string) => void;
}

interface TotalsType {
  subtotal: number;
  totalVat: number;
  grandTotal: number;
}

export default function InvoiceLineItems({
  lines,
  isReadOnly = false,
  onLineChange,
  onAddLine,
  onRemoveLine
}: InvoiceLineItemsProps) {

  const handleLineChange = (id: string, field: keyof InvoiceLine, value: any) => {
    onLineChange(id, field, value);
  };

  // Calculate totals
  const totals: TotalsType = React.useMemo(() => {
    const subtotal = lines.reduce((sum, line) => sum + line.baseAmount, 0);
    const totalVat = lines.reduce((sum, line) => sum + line.vatAmount, 0);
    const grandTotal = lines.reduce((sum, line) => sum + line.totalAmount, 0);
    
    return { subtotal, totalVat, grandTotal };
  }, [lines]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <CardTitle className="text-lg font-bold text-gray-900">
            Invoice Line Items
          </CardTitle>
          {!isReadOnly && (
            <button
              onClick={onAddLine}
              className="flex items-center justify-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors w-full sm:w-auto"
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
            <table className="w-full text-xs min-w-[800px]">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="px-2 py-2 text-center text-gray-700 font-medium w-12">#</th>
                <th className="px-2 py-2 text-left text-gray-700 font-medium w-32">Account</th>
                <th className="px-2 py-2 text-left text-gray-700 font-medium">Description</th>
                <th className="px-2 py-2 text-center text-gray-700 font-medium w-20">Qty</th>
                <th className="px-2 py-2 text-center text-gray-700 font-medium w-20">Rate</th>
                <th className="px-2 py-2 text-center text-gray-700 font-medium w-24">
                  <div className="text-xs">Currency</div>
                  <div className="text-xs text-gray-500">ROE</div>
                </th>
                <th className="px-2 py-2 text-center text-gray-700 font-medium w-24">
                  <div className="text-xs">Amount</div>
                  <div className="text-xs text-gray-500">Base</div>
                </th>
                <th className="px-2 py-2 text-center text-gray-700 font-medium w-20">
                  <div className="text-xs">VAT %</div>
                  <div className="text-xs text-gray-500">Amount</div>
                </th>
                <th className="px-2 py-2 text-center text-gray-700 font-medium w-24">Total</th>
                {!isReadOnly && (
                  <th className="px-2 py-2 text-center text-gray-700 font-medium w-12">Action</th>
                )}
              </tr>
            </thead>
            
            
            <tbody className="divide-y divide-gray-100">
              {lines.map((line, index) => (
                <tr 
                  key={line.id} 
                  className={`hover:bg-blue-50/50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                  }`}
                >
                  {/* Line Number */}
                  <td className="px-2 py-2 text-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">
                      {index + 1}
                    </span>
                  </td>
                  
                  {/* Account */}
                  <td className="px-2 py-2">
                    <select
                      className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      value={line.accountNumber}
                      disabled={isReadOnly}
                      onChange={(e) => handleLineChange(line.id, 'accountNumber', e.target.value)}
                    >
                      <option value="">Select</option>
                      {accountNumbers.map(account => (
                        <option key={account.value} value={account.value}>
                          {account.value}
                        </option>
                      ))}
                    </select>
                  </td>
                  
                  {/* Description */}
                  <td className="px-2 py-2">
                    <input 
                      type="text"
                      className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      value={line.description}
                      disabled={isReadOnly}
                      placeholder="Description"
                      onChange={(e) => handleLineChange(line.id, 'description', e.target.value)}
                    />
                  </td>
                  
                  {/* Quantity */}
                  <td className="px-2 py-2">
                    <input
                      type="number"
                      step="0.01"
                      className="w-full px-1 py-1 text-xs text-center border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      value={line.quantity || ''}
                      disabled={isReadOnly}
                      placeholder="0"
                      onChange={(e) => handleLineChange(line.id, 'quantity', parseFloat(e.target.value) || 0)}
                    />
                  </td>
                  
                  {/* Rate */}
                  <td className="px-2 py-2">
                    <input
                      type="number"
                      step="0.01"
                      className="w-full px-1 py-1 text-xs text-center border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      value={line.rate || ''}
                      disabled={isReadOnly}
                      placeholder="0.00"
                      onChange={(e) => handleLineChange(line.id, 'rate', parseFloat(e.target.value) || 0)}
                    />
                  </td>
                  
                  {/* Currency */}
                  <td className="px-2 py-2">
                    <div className="space-y-1">
                      <select
                        className="w-full px-1 py-0.5 text-xs text-center border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        value={line.currencyCode}
                        disabled={isReadOnly}
                        onChange={(e) => handleLineChange(line.id, 'currencyCode', e.target.value)}
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                      <input
                        type="number"
                        step="0.0001"
                        className="w-full px-1 py-0.5 text-xs text-center border border-gray-100 rounded focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                        value={line.roeRate || ''}
                        disabled={isReadOnly}
                        placeholder="1.0"
                        onChange={(e) => handleLineChange(line.id, 'roeRate', parseFloat(e.target.value) || 1)}
                      />
                    </div>
                  </td>
                  
                  {/* Amount */}
                  <td className="px-2 py-2">
                    <div className="space-y-1">
                      <div className="w-full px-1 py-0.5 text-xs text-center bg-blue-50 border border-blue-200 rounded font-medium text-blue-800">
                        {line.currencyAmount.toFixed(2)}
                      </div>
                      <div className="w-full px-1 py-0.5 text-xs text-center bg-gray-50 border border-gray-200 rounded text-gray-600">
                        {line.baseAmount.toFixed(2)}
                      </div>
                    </div>
                  </td>
                  
                  {/* VAT */}
                  <td className="px-2 py-2">
                    <div className="space-y-1">
                      <input
                        type="number"
                        step="0.01"
                        className="w-full px-1 py-0.5 text-xs text-center border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        value={line.vatRate || ''}
                        disabled={isReadOnly}
                        placeholder="0"
                        onChange={(e) => handleLineChange(line.id, 'vatRate', parseFloat(e.target.value) || 0)}
                      />
                      <div className="w-full px-1 py-0.5 text-xs text-center bg-amber-50 border border-amber-200 rounded text-amber-800">
                        {line.vatAmount.toFixed(2)}
                      </div>
                    </div>
                  </td>
                  
                  {/* Total */}
                  <td className="px-2 py-2">
                    <div className="w-full px-2 py-1 text-xs text-center bg-green-50 border border-green-200 rounded font-bold text-green-800">
                      ${line.totalAmount.toFixed(2)}
                    </div>
                  </td>
                  
                  {/* Actions */}
                  {!isReadOnly && (
                    <td className="px-2 py-2 text-center">
                      <button
                        onClick={() => onRemoveLine(line.id)}
                        disabled={lines.length <= 1}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Remove line"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
            
            {/* Totals Footer */}
            <tfoot className="bg-gradient-to-r from-gray-50 to-blue-50 border-t-2 border-blue-200 sticky bottom-0">
              <tr>
                <td colSpan={6} className="px-3 py-2 text-right text-sm font-bold text-gray-700">
                  Invoice Totals:
                </td>
                <td className="px-2 py-2 text-center border-r border-gray-200">
                  <div className="text-xs font-bold text-gray-900">
                    ${totals.subtotal.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-600">Subtotal</div>
                </td>
                <td className="px-2 py-2 text-center border-r border-gray-200">
                  <div className="text-xs font-bold text-amber-700">
                    ${totals.totalVat.toFixed(2)}
                  </div>
                  <div className="text-xs text-amber-600">Total VAT</div>
                </td>
                <td className="px-2 py-2 text-center border-r border-gray-200">
                  <div className="text-sm font-bold text-green-800 bg-green-100 px-2 py-1 rounded border border-green-300">
                    ${totals.grandTotal.toFixed(2)}
                  </div>
                  <div className="text-xs text-green-700 font-medium">Grand Total</div>
                </td>
                {!isReadOnly && (
                  <td className="px-2 py-2"></td>
                )}
              </tr>
            </tfoot>
          </table>
        </div>
        </div>
      </CardContent>
    </Card>
  );
}
