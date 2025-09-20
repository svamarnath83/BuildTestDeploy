'use client';

import type { VoyageFinanceElement } from '../libs/voyage-models';
import { CheckCircle, Ship, Coins, Hash } from 'lucide-react';

interface FinanceComponentProps {
  financials: VoyageFinanceElement[];
}

export default function FinanceComponent({ financials }: FinanceComponentProps) {
 

  const groups = financials.reduce<Record<string, number>>((acc, f) => {
    acc[f.group] = (acc[f.group] || 0) + f.amount;
    return acc;
  }, {});

  const formatAmount = (n: number) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Build grouped items list for sectioned rendering
  const groupedItems = Object.keys(groups).map(groupName => ({
    name: groupName,
    total: groups[groupName],
    items: financials
      .filter(f => f.group === groupName)
      .slice()
      .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
  }));

  return (
    <div className="w-full h-full overflow-auto p-4">
      {/* Details Card */}
      <div className="mb-4 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm">
        <div className="flex items-center justify-between px-4 py-2 border-b border-blue-100">
          <div className="text-xs font-semibold tracking-wide text-blue-800">Voyage Overview</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div className="px-4 py-3 border-b lg:border-b-0 lg:border-r border-blue-100">
            <div className="text-[10px] uppercase tracking-wide text-blue-700/70">Status</div>
            <div className="mt-1 flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span className="px-2 py-0.5 text-[11px] font-medium rounded-full border border-emerald-300 text-emerald-700 bg-emerald-50">Operational</span>
            </div>
          </div>
          <div className="px-4 py-3 border-b lg:border-b-0 lg:border-r border-blue-100">
            <div className="text-[10px] uppercase tracking-wide text-blue-700/70">Voyage Type</div>
            <div className="mt-1 flex items-center gap-2">
              <Ship className="w-3.5 h-3.5 text-amber-600" />
              <span className="px-2 py-0.5 text-[11px] font-medium rounded-full border border-amber-300 text-amber-700 bg-amber-50">Dry</span>
            </div>
          </div>
          <div className="px-4 py-3 border-b lg:border-b-0 lg:border-r border-blue-100">
            <div className="text-[10px] uppercase tracking-wide text-blue-700/70">Currency</div>
            <div className="mt-1 flex items-center gap-2">
              <Coins className="w-3.5 h-3.5 text-indigo-600" />
              <span className="px-2 py-0.5 text-[11px] font-medium rounded-full border border-indigo-300 text-indigo-700 bg-indigo-50">EUR</span>
            </div>
          </div>
          <div className="px-4 py-3">
            <div className="text-[10px] uppercase tracking-wide text-blue-700/70">Estimate #</div>
            <div className="mt-1 flex items-center gap-2">
              <Hash className="w-3.5 h-3.5 text-blue-700" />
              <span className="px-2 py-0.5 text-[11px] font-semibold rounded border border-blue-300 text-blue-800 bg-white">4849</span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {Object.entries(groups).map(([group, total]) => (
            <div key={group} className="bg-white border border-gray-200 p-4 shadow-sm">
              <div className="text-xs uppercase text-gray-500">{group}</div>
              <div className={`text-lg font-semibold ${total >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{formatAmount(total)}</div>
            </div>
          ))}
      </div>

      {/* Grouped sections by name (removed Group column) */}
      <div className="space-y-4">
        {groupedItems.map(group => (
          <div key={group.name} className="bg-white border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <div className="text-sm font-semibold text-gray-800">{group.name}</div>
              <div className={`text-sm font-semibold ${group.total >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{formatAmount(group.total)}</div>
            </div>

            <ul className="divide-y divide-gray-100">
              {group.items.map((f, idx) => (
                <li key={`${f.element}-${idx}`} className="flex items-center justify-between px-4 py-2 hover:bg-gray-50">
                  <div className="text-sm text-gray-900">{f.element}</div>
                  <div className={`text-sm font-medium ${f.amount >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>{formatAmount(f.amount)}</div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
} 