'use client';

import { useState, Fragment } from 'react';
import { Plus, PlusCircle, Trash2 } from 'lucide-react';
import type { OtherExpense, SubExpense } from '../libs/voyage-models';

interface OtherExpensesProps {
  initialExpenses?: OtherExpense[];
}

export default function OtherExpenses({ initialExpenses = [] }: OtherExpensesProps) {
  const [expenses, setExpenses] = useState<OtherExpense[]>(initialExpenses);

  const addExpense = () => {
    const newExpense: OtherExpense = {
      id: crypto.randomUUID(),
      itemName: '',
      isPerDayCost: false,
      rate: 0,
      amount: 0,
      subExpenses: []
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const updateExpense = (id: string, patch: Partial<OtherExpense>) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...patch } : e));
  };

  const removeExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const addSubExpense = (expenseId: string) => {
    const newSub: SubExpense = { id: crypto.randomUUID(), name: '', amount: 0 };
    setExpenses(prev => prev.map(e => e.id === expenseId ? { ...e, subExpenses: [...(e.subExpenses || []), newSub] } : e));
  };

  const updateSubExpense = (expenseId: string, subId: string, patch: Partial<SubExpense>) => {
    setExpenses(prev => prev.map(e => e.id === expenseId ? { ...e, subExpenses: (e.subExpenses || []).map(s => s.id === subId ? { ...s, ...patch } : s) } : e));
  };

  const removeSubExpense = (expenseId: string, subId: string) => {
    setExpenses(prev => prev.map(e => e.id === expenseId ? { ...e, subExpenses: (e.subExpenses || []).filter(s => s.id !== subId) } : e));
  };

  const totalFor = (e: OtherExpense) => {
    const subs = (e.subExpenses || []).reduce((sum, s) => sum + (s.amount || 0), 0);
    return (e.amount || 0) + subs;
  };

  return (
    <div className="w-full h-full overflow-auto p-3">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold text-gray-800">Other Expenses</div>
        <button
          className="p-2 border border-blue-700 text-blue-700 hover:bg-blue-50"
          onClick={addExpense}
          aria-label="Add expense"
          title="Add expense"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-white p-3 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full border border-gray-200">
            <thead>
              <tr className="text-xs font-medium text-gray-600 bg-gray-50">
                <th className="text-left px-1 py-1 w-52">Item</th>
                <th className="text-center px-1 py-1 whitespace-nowrap w-12">Per-day?</th>
                <th className="text-right px-1 py-1 w-16">Rate</th>
                <th className="text-right px-1 py-1 w-16">Amount</th>
                <th className="text-right px-1 py-1 w-24">Total</th>
                <th className="text-left px-1 py-1 w-40">Notes</th>
                <th className="px-1 py-1 w-14"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {expenses.map((e) => (
                <Fragment key={e.id}>
                  <tr key={e.id} className="align-middle">
                    <td className="px-1 py-1">
                      <input className="w-full border border-gray-300 px-1 py-1 text-xs rounded-none" value={e.itemName} onChange={(ev) => updateExpense(e.id, { itemName: ev.target.value })} placeholder="Item name" />
                    </td>
                    <td className="px-1 py-1 text-center w-8">
                      <input type="checkbox" checked={e.isPerDayCost} onChange={(ev) => updateExpense(e.id, { isPerDayCost: ev.target.checked })} />
                    </td>
                    <td className="px-1 py-1 text-right">
                      <input type="number" step="0.01" className="w-full border border-gray-300 px-1 py-1 text-right text-xs rounded-none" value={e.rate ?? 0} onChange={(ev) => updateExpense(e.id, { rate: parseFloat(ev.target.value) || 0 })} />
                    </td>
                    <td className="px-1 py-1 text-right">
                      <input type="number" step="0.01" className="w-full border border-gray-300 px-1 py-1 text-right text-xs rounded-none" value={e.amount ?? 0} onChange={(ev) => updateExpense(e.id, { amount: parseFloat(ev.target.value) || 0 })} />
                    </td>
                    <td className="px-1 py-1 text-right whitespace-nowrap w-24">{totalFor(e).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="px-1 py-1 w-40">
                      <input className="w-full border border-gray-300 px-1 py-1 text-xs rounded-none" value={e.notes || ''} onChange={(ev) => updateExpense(e.id, { notes: ev.target.value })} placeholder="Notes" />
                    </td>
                    <td className="px-1 py-1 text-right w-12">
                      <div className="flex items-center justify-end gap-0.5">
                        <button
                          className="p-1 border border-gray-400 hover:bg-gray-50"
                          onClick={() => addSubExpense(e.id)}
                          aria-label="Add sub expense"
                          title="Add sub expense"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                        </button>
                        <button
                          className="p-1 border border-rose-600 text-rose-600 hover:bg-rose-50"
                          onClick={() => removeExpense(e.id)}
                          aria-label="Remove expense"
                          title="Remove expense"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {e.subExpenses && e.subExpenses.length > 0 && (
                    <tr>
                      <td colSpan={7} className="px-1 pb-1">
                        <div className="ml-3 border border-dashed border-gray-300 p-1.5">
                          <div className="text-[11px] text-gray-500 mb-1">Sub Expenses</div>
                          <div className="space-y-1">
                            {e.subExpenses.map((s) => (
                              <div key={s.id} className="grid grid-cols-12 gap-0.5 items-center">
                                <input className="col-span-7 w-full border border-gray-300 px-1 py-1 text-xs rounded-none" value={s.name} onChange={(ev) => updateSubExpense(e.id, s.id, { name: ev.target.value })} placeholder="Sub expense name" />
                                <input type="number" step="0.01" className="col-span-2 w-full border border-gray-300 px-1 py-1 text-right text-xs rounded-none" value={s.amount} onChange={(ev) => updateSubExpense(e.id, s.id, { amount: parseFloat(ev.target.value) || 0 })} />
                                <div className="col-span-3 text-right">
                                  <button
                                    className="p-1 border border-rose-600 text-rose-600 hover:bg-rose-50"
                                    onClick={() => removeSubExpense(e.id, s.id)}
                                    aria-label="Remove sub expense"
                                    title="Remove sub expense"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 