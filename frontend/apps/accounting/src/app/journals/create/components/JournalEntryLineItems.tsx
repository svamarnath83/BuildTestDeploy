"use client";

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@commercialapp/ui';

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

interface JournalEntryLineItemsProps {
  lines: JournalLine[];
  onAddLine: () => void;
  onRemoveLine: (id: string) => void;
  onLineChange: (id: string, field: keyof JournalLine, value: any) => void;
  isReadOnly?: boolean;
}

export default function JournalEntryLineItems({
  lines,
  onAddLine,
  onRemoveLine,
  onLineChange,
  isReadOnly = false
}: JournalEntryLineItemsProps) {
  
  // Sample Chart of Accounts
  const chartOfAccounts = [
    { code: '1000', name: 'Cash and Cash Equivalents', type: 'Asset' },
    { code: '1100', name: 'Accounts Receivable', type: 'Asset' },
    { code: '1200', name: 'Inventory', type: 'Asset' },
    { code: '1500', name: 'Fixed Assets', type: 'Asset' },
    { code: '2000', name: 'Accounts Payable', type: 'Liability' },
    { code: '2100', name: 'Accrued Liabilities', type: 'Liability' },
    { code: '2500', name: 'Long-term Debt', type: 'Liability' },
    { code: '3000', name: 'Share Capital', type: 'Equity' },
    { code: '3500', name: 'Retained Earnings', type: 'Equity' },
    { code: '4000', name: 'Revenue', type: 'Revenue' },
    { code: '4100', name: 'Freight Revenue', type: 'Revenue' },
    { code: '5000', name: 'Operating Expenses', type: 'Expense' },
    { code: '5100', name: 'Fuel Costs', type: 'Expense' },
    { code: '5200', name: 'Port Charges', type: 'Expense' },
    { code: '6000', name: 'Interest Expense', type: 'Expense' }
  ];

  // Sample cost centers
  const costCenters = [
    { code: 'CC001', name: 'Operations' },
    { code: 'CC002', name: 'Administration' },
    { code: 'CC003', name: 'Sales & Marketing' },
    { code: 'CC004', name: 'IT Department' }
  ];

  // Calculate totals
  const totalDebits = lines.filter(line => line.amount > 0).reduce((sum, line) => sum + line.amount, 0);
  const totalCredits = lines.filter(line => line.amount < 0).reduce((sum, line) => sum + Math.abs(line.amount), 0);
  const totalBaseDebits = lines.filter(line => line.baseAmount > 0).reduce((sum, line) => sum + line.baseAmount, 0);
  const totalBaseCredits = lines.filter(line => line.baseAmount < 0).reduce((sum, line) => sum + Math.abs(line.baseAmount), 0);
  const balance = totalDebits - totalCredits;
  const baseBalance = totalBaseDebits - totalBaseCredits;

  const handleAccountSelect = (lineId: string, accountCode: string) => {
    const account = chartOfAccounts.find(acc => acc.code === accountCode);
    if (account) {
      onLineChange(lineId, 'accountCode', accountCode);
      onLineChange(lineId, 'accountName', account.name);
    }
  };

  const handleAmountChange = (lineId: string, value: string) => {
    const amount = parseFloat(value) || 0;
    onLineChange(lineId, 'amount', amount);
    // Calculate base amount (assuming 1:1 exchange rate for now)
    onLineChange(lineId, 'baseAmount', amount);
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-b py-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-200">
            Journal Entry Lines
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
          <div className="min-w-[800px]">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 dark:bg-slate-800">
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left p-2 font-medium text-slate-700 dark:text-slate-300 w-12 md:w-16">#</th>
                  <th className="text-left p-2 font-medium text-slate-700 dark:text-slate-300 w-20 md:w-24">Account</th>
                  <th className="text-left p-2 font-medium text-slate-700 dark:text-slate-300 min-w-[120px]">Account Name</th>
                  <th className="text-left p-2 font-medium text-slate-700 dark:text-slate-300 min-w-[100px]">Description</th>
                  <th className="text-left p-2 font-medium text-slate-700 dark:text-slate-300 w-24 md:w-32">Amount</th>
                  <th className="text-left p-2 font-medium text-slate-700 dark:text-slate-300 w-16 md:w-20">Currency</th>
                  <th className="text-left p-2 font-medium text-slate-700 dark:text-slate-300 w-24 md:w-32">Base Amount</th>
                  <th className="text-left p-2 font-medium text-slate-700 dark:text-slate-300 w-20 md:w-24">Cost Center</th>
                  <th className="text-left p-2 font-medium text-slate-700 dark:text-slate-300 w-16 md:w-20">Reference</th>
                  <th className="text-left p-2 font-medium text-slate-700 dark:text-slate-300 min-w-[80px]">Comments</th>
                  {!isReadOnly && <th className="text-center p-2 font-medium text-slate-700 dark:text-slate-300 w-12">Action</th>}
                </tr>
              </thead>
            <tbody>
              {lines.map((line, index) => (
                <tr key={line.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50">
                  <td className="p-1 text-center font-medium text-slate-600 dark:text-slate-400">
                    {line.lineNumber}
                  </td>
                  <td className="p-1">
                    <select
                      value={line.accountCode}
                      onChange={(e) => handleAccountSelect(line.id, e.target.value)}
                      className="w-full p-1 text-xs border border-slate-300 dark:border-slate-600 rounded bg-transparent focus:border-blue-500 focus:outline-none"
                      disabled={isReadOnly}
                    >
                      <option value="">Select</option>
                      {chartOfAccounts.map(account => (
                        <option key={account.code} value={account.code}>
                          {account.code}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-1">
                    <input
                      type="text"
                      value={line.accountName}
                      className="w-full p-1 text-xs border border-slate-300 dark:border-slate-600 rounded bg-slate-50 dark:bg-slate-800"
                      readOnly
                    />
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
                      value={line.amount || ''}
                      onChange={(e) => onLineChange(line.id, 'amount', parseFloat(e.target.value) || 0)}
                      className="w-full p-1 text-xs border border-slate-300 dark:border-slate-600 rounded bg-transparent focus:border-blue-500 focus:outline-none text-right"
                      placeholder="+ for Debit, - for Credit"
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
                      value={line.baseAmount}
                      className="w-full p-1 text-xs border border-slate-300 dark:border-slate-600 rounded bg-slate-50 dark:bg-slate-800 text-right"
                      readOnly
                    />
                  </td>
                  <td className="p-1">
                    <select
                      value={line.costCenter}
                      onChange={(e) => onLineChange(line.id, 'costCenter', e.target.value)}
                      className="w-full p-1 text-xs border border-slate-300 dark:border-slate-600 rounded bg-transparent focus:border-blue-500 focus:outline-none"
                      disabled={isReadOnly}
                    >
                      <option value="">Select</option>
                      {costCenters.map(cc => (
                        <option key={cc.code} value={cc.code}>
                          {cc.code}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-1">
                    <input
                      type="text"
                      value={line.reference}
                      onChange={(e) => onLineChange(line.id, 'reference', e.target.value)}
                      className="w-full p-1 text-xs border border-slate-300 dark:border-slate-600 rounded bg-transparent focus:border-blue-500 focus:outline-none"
                      placeholder="Ref"
                      readOnly={isReadOnly}
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
                        disabled={lines.length <= 2} // Journal entries need at least 2 lines
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-sm w-full md:w-auto">
              <div className="text-right">
                <span className="font-medium text-slate-600 dark:text-slate-400">Transaction Totals:</span>
                <div className="flex justify-between gap-4 mt-1">
                  <div>
                    <span className="text-xs text-slate-500">Debits:</span>
                    <div className="font-bold text-green-600">
                      {totalDebits.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500">Credits:</span>
                    <div className="font-bold text-blue-600">
                      {totalCredits.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="font-medium text-slate-600 dark:text-slate-400">Base Currency Totals:</span>
                <div className="flex justify-between gap-4 mt-1">
                  <div>
                    <span className="text-xs text-slate-500">Debits:</span>
                    <div className="font-bold text-green-600">
                      {totalBaseDebits.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500">Credits:</span>
                    <div className="font-bold text-blue-600">
                      {totalBaseCredits.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="font-medium text-slate-600 dark:text-slate-400">Balance:</span>
                <div className="mt-1">
                  <div className={`font-bold text-lg ${
                    Math.abs(balance) < 0.01 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className={`text-sm ${
                    Math.abs(baseBalance) < 0.01 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    Base: {baseBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                {Math.abs(balance) < 0.01 && (
                  <div className="text-xs text-green-600 mt-1">✓ Balanced</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
