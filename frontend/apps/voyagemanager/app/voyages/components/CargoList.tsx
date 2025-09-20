'use client';

import type { VoyageCargo } from '../libs/voyage-models';

interface CargoListProps {
  cargoes: VoyageCargo[];
}

export default function CargoList({ cargoes }: CargoListProps) {
  if (!cargoes || cargoes.length === 0) {
    return (
      <div className="p-4 text-sm text-gray-500">No cargoes available.</div>
    );
  }

  const formatNumber = (n?: number, digits: number = 2) =>
    typeof n === 'number' ? n.toLocaleString(undefined, { minimumFractionDigits: digits, maximumFractionDigits: digits }) : '-';

  return (
    <div className="w-full h-full overflow-auto p-3">
      <div className="overflow-x-auto">
        <div className="bg-white p-3 shadow-sm">
          <table className="min-w-[1400px] w-full border border-gray-200">
            <thead>
              <tr className="text-xs font-medium text-gray-600 bg-gray-50">
                <th className="text-left px-2 py-2">Commodity</th>
                <th className="text-left px-2 py-2">Charterer</th>
                <th className="text-right px-2 py-2">Quantity</th>
                <th className="text-left px-2 py-2">Quantity Type</th>
                <th className="text-left px-2 py-2">Load Ports</th>
                <th className="text-left px-2 py-2">Discharge Ports</th>
                <th className="text-left px-2 py-2 whitespace-nowrap">Laycan From</th>
                <th className="text-left px-2 py-2 whitespace-nowrap">Laycan To</th>
                <th className="text-left px-2 py-2 whitespace-nowrap">Fixture No</th>
                <th className="text-right px-2 py-2 whitespace-nowrap">Rate (Currency)</th>
                <th className="text-right px-2 py-2 whitespace-nowrap">Total Commission</th>
                <th className="text-right px-2 py-2 whitespace-nowrap">Gross Freight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {cargoes.map((c) => (
                <tr key={c.id} className="align-middle">
                  <td className="px-2 py-2 text-gray-900 font-medium truncate">{c.commodity}</td>
                  <td className="px-2 py-2 text-gray-700 truncate">{c.charterer ?? '-'}</td>
                  <td className="px-2 py-2 text-gray-700 text-right whitespace-nowrap">{formatNumber(c.quantity, 0)}</td>
                  <td className="px-2 py-2 text-gray-700 truncate">{c.quantityType}</td>
                  <td className="px-2 py-2 text-gray-700 truncate" title={c.loadPorts}>{c.loadPorts}</td>
                  <td className="px-2 py-2 text-gray-700 truncate" title={c.dischargePorts}>{c.dischargePorts}</td>
                  <td className="px-2 py-2 text-gray-700 whitespace-nowrap">{c.laycanFrom ? new Date(c.laycanFrom).toLocaleDateString() : '-'}</td>
                  <td className="px-2 py-2 text-gray-700 whitespace-nowrap">{c.laycanTo ? new Date(c.laycanTo).toLocaleDateString() : '-'}</td>
                  <td className="px-2 py-2 text-gray-700 whitespace-nowrap">{c.fixtureNo ?? '-'}</td>
                  <td className="px-2 py-2 text-gray-700 text-right whitespace-nowrap">{formatNumber(c.rate)} {c.currency}</td>
                  <td className="px-2 py-2 text-gray-700 text-right whitespace-nowrap">{formatNumber(c.totalCommission)}</td>
                  <td className="px-2 py-2 text-gray-700 text-right whitespace-nowrap">{formatNumber(c.totalGrossFreight)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 