'use client';

import { formatCurrency } from '../libs';

interface EstFinancialSummaryProps {
  revenue: number;
  voyageCosts: number;
  totalOpEx: number;
  finalProfit: number;
  tce: number;
  totalVoyageDuration: number;
}

export default function EstFinancialSummary({
  revenue,
  voyageCosts,
  totalOpEx,
  finalProfit,
  tce,
  totalVoyageDuration
}: EstFinancialSummaryProps) {
  return (
    <div>
      <h4 className="text-sm font-medium mb-3">Financial Summary</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Gross Revenue:</span>
            <span className="font-medium text-green-600">{formatCurrency(revenue)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Voyage Costs (Bunkers + Additional):</span>
            <span className="font-medium text-red-600">-{formatCurrency(voyageCosts)}</span>
          </div>
          <hr className="border-gray-200" />
          <div className="flex justify-between font-bold">
            <span className="text-gray-900">Gross Profit (pre-OpEx):</span>
            <span className="text-gray-900">{formatCurrency(Number(revenue) - Number(voyageCosts))}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Operating Costs (OpEx):</span>
            <span className="font-medium text-red-600">-{formatCurrency(totalOpEx)}</span>
          </div>
          <hr className="border-gray-200" />
          <div className="flex justify-between font-bold text-base">
            <span className="text-gray-900">Net Profit:</span>
            <span className="text-green-700">{formatCurrency(finalProfit)}</span>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center">
          <div className="text-center">
            <div className="text-gray-600">TCE (Time Charter Equivalent)</div>
            <div className="text-2xl font-bold text-blue-700">{formatCurrency(tce)}<span className="text-base font-medium text-gray-600">/day</span></div>
          </div>
          <div className="text-center mt-2">
            <div className="text-xs text-gray-500">Total Voyage Duration</div>
            <div className="text-sm font-medium text-gray-800">{Number(totalVoyageDuration).toFixed(2)} days</div>
          </div>
        </div>
      </div>
    </div>
  );
} 