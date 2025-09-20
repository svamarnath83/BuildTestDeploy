'use client';

import type { VoyagePortCall } from '../libs/voyage-models';

interface BunkerConsumptionProps {
  portCalls: VoyagePortCall[];
}

interface PortBunkerRow {
  portName: string;
  gradeId: number;
  grade: string;
  arrivalQuantity: number;
  departureQuantity: number;
  bunkeringQuantity: number;
  consumption: number;
  price?: number;
  currency?: string;
}

function deriveMockGradeGroupedConsumption(portCalls: VoyagePortCall[]): Record<string, PortBunkerRow[]> {
  const grades = [
    { gradeId: 1, grade: 'VLSFO 0.5%', price: 600, currency: 'USD' },
    { gradeId: 2, grade: 'MGO 0.1%', price: 800, currency: 'USD' },
  ];

  const groupedByGrade: Record<string, PortBunkerRow[]> = {};

  grades.forEach(g => {
    groupedByGrade[g.grade] = [];
  });

  portCalls.forEach((pc, idx) => {
    const base = Math.max(1, Math.round((pc.distance || 500) / 1000)) + idx;
    grades.forEach(g => {
      const arrival = base * (g.gradeId === 1 ? 250 : 80);
      const departure = base * (g.gradeId === 1 ? 210 : 70);
      const bunkering = base * (g.gradeId === 1 ? 30 : 10);
      const consumption = Math.max(0, arrival - departure); // simple mock consumption
      groupedByGrade[g.grade].push({
        portName: pc.portName,
        gradeId: g.gradeId,
        grade: g.grade,
        arrivalQuantity: arrival,
        departureQuantity: departure,
        bunkeringQuantity: bunkering,
        consumption,
        price: g.price,
        currency: g.currency,
      });
    });
  });

  return groupedByGrade;
}

export default function BunkerConsumption({ portCalls }: BunkerConsumptionProps) {
  const grouped = deriveMockGradeGroupedConsumption(portCalls || []);
  const grades = Object.keys(grouped);

  if (!grades.length) {
    return <div className="p-4 text-sm text-gray-500">No bunker data available.</div>;
  }

  const format = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });

  return (
    <div className="w-full h-full overflow-auto p-3">
      <div className="bg-white p-3 shadow-sm border border-gray-200">
        <table className="min-w-full">
          <thead>
            <tr className="text-xs font-medium text-gray-600 bg-gray-50">
              <th className="text-left px-2 py-2">Grade</th>
              <th className="text-left px-2 py-2">Port</th>
              <th className="text-right px-2 py-2">Arrival Qty</th>
              <th className="text-right px-2 py-2">Departure Qty</th>
              <th className="text-right px-2 py-2">Bunkering Qty</th>
              <th className="text-right px-2 py-2">Consumption</th>
              <th className="text-right px-2 py-2">Price</th>
              <th className="text-left px-2 py-2">Currency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {grades.map((gradeName) => {
              const rows = grouped[gradeName];
              const rowSpan = rows.length;
              return rows.map((r, idx) => (
                <tr key={`${gradeName}-${r.portName}`} className="text-xs">
                  {idx === 0 && (
                    <td rowSpan={rowSpan} className="align-top px-2 py-2 text-gray-900 font-medium">
                      {gradeName}
                    </td>
                  )}
                  <td className="px-2 py-2 text-gray-700" title={r.portName}>{r.portName}</td>
                  <td className="px-2 py-2 text-right text-gray-700">{format(r.arrivalQuantity)}</td>
                  <td className="px-2 py-2 text-right text-gray-700">{format(r.departureQuantity)}</td>
                  <td className="px-2 py-2 text-right text-gray-700">{format(r.bunkeringQuantity)}</td>
                  <td className="px-2 py-2 text-right text-gray-700">{format(r.consumption)}</td>
                  <td className="px-2 py-2 text-right text-gray-700">{r.price !== undefined ? format(r.price) : '-'}</td>
                  <td className="px-2 py-2 text-gray-700">{r.currency || '-'}</td>
                </tr>
              ));
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
} 