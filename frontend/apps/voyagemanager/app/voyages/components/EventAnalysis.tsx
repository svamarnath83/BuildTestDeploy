'use client';

import type { ActivityData } from '../libs/voyage-models';

interface EventAnalysisProps {
  activities: ActivityData[];
}

export default function EventAnalysis({ activities }: EventAnalysisProps) {
  if (!activities || activities.length === 0) {
    return <div className="p-4 text-sm text-gray-500">No activity data.</div>;
  }

  const fmt0 = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 0 });

  // Parse dates in formats like "MM/DD/YY" or "MM/DD/YY HH:mm" or ISO strings
  const parseDateLoose = (s: string) => {
    if (!s) return new Date(NaN);
    // If ISO-like
    if (/\d{4}-\d{2}-\d{2}T/.test(s)) {
      const d = new Date(s);
      return d;
    }
    // MM/DD/YY or MM/DD/YY HH:mm
    const parts = s.split(' ');
    const [mdy, time] = [parts[0], parts[1]];
    const [mmStr, ddStr, yyStr] = (mdy || '').split('/');
    const mm = Number(mmStr);
    const dd = Number(ddStr);
    const yy = Number(yyStr);
    const fullYear = (yy >= 0 && yy < 100) ? 2000 + yy : yy;
    const [hhStr, minStr] = (time || '00:00').split(':');
    const hh = Number(hhStr || '0');
    const min = Number(minStr || '0');
    return new Date(fullYear, (mm || 1) - 1, dd || 1, hh, min);
  };

  const diffDays = (a: string, b: string) => {
    const d1 = parseDateLoose(a).getTime();
    const d0 = parseDateLoose(b).getTime();
    return Math.round((d1 - d0) / (1000 * 60 * 60 * 24));
  };

  const formatDateTime = (s: string) => {
    const d = parseDateLoose(s);
    if (isNaN(d.getTime())) return s;
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yy = String(d.getFullYear()).slice(-2);
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${mm}/${dd}/${yy} ${hh}:${min}`;
  };

  const Delta = ({ value, unit }: { value: number; unit: string }) => {
    if (value === 0) {
      return <div className="text-[11px] text-gray-500">– +0{unit}</div>;
    }
    const positive = value > 0;
    return (
      <div className={`text-[11px] ${positive ? 'text-green-600' : 'text-rose-600'}`}>
        {positive ? '↗' : '↘'} {positive ? '+' : ''}{fmt0(Math.abs(value))}{unit}
      </div>
    );
  };

  const InlineDelta = ({ value, unit }: { value: number; unit: string }) => {
    if (value === 0) {
      return <span className="text-[11px] text-gray-500 ml-2">– +0{unit}</span>;
    }
    const positive = value > 0;
    return (
      <span className={`text-[11px] ml-2 ${positive ? 'text-green-600' : 'text-rose-600'}`}>
        {positive ? '↗' : '↘'} {positive ? '+' : ''}{fmt0(Math.abs(value))}{unit}
      </span>
    );
  };

  // Overall variance between first and last
  const first = activities[0];
  const last = activities[activities.length - 1];
  const overallLabel = `Overall Variance`;
  const overallDeltas = {
    startDateDays: diffDays(last.startDate, first.startDate),
    endDateDays: diffDays(last.endDate, first.endDate),
    totalDays: last.totalDays - first.totalDays,
    bunkerCons: last.bunkerCons - first.bunkerCons,
    carbonCreditExpense: last.carbonCreditExpense - first.carbonCreditExpense,
    bunkerCost: last.bunkerCost - first.bunkerCost,
    netDaily: last.netDaily - first.netDaily,
  };

  return (
    <div className="w-full h-full overflow-auto p-3">
      <div className="bg-white p-3 shadow-sm border border-gray-200">
        <table className="min-w-full">
          <thead>
            <tr className="text-xs font-medium text-gray-600 bg-gray-50">
              <th className="text-left px-3 py-2">Event</th>
              <th className="text-left px-3 py-2">Start Date</th>
              <th className="text-left px-3 py-2">End Date</th>
              <th className="text-left px-3 py-2">Total Days</th>
              <th className="text-left px-3 py-2">Bunker Cons</th>
              <th className="text-left px-3 py-2">Carbon Credit Expense</th>
              <th className="text-left px-3 py-2">Bunker Cost</th>
              <th className="text-left px-3 py-2">Net Daily</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {activities.map((a, idx) => {
              const prev = idx > 0 ? activities[idx - 1] : undefined;
              const deltas = prev
                ? {
                    startDateDays: diffDays(a.startDate, prev.startDate),
                    endDateDays: diffDays(a.endDate, prev.endDate),
                    totalDays: a.totalDays - prev.totalDays,
                    bunkerCons: a.bunkerCons - prev.bunkerCons,
                    carbonCreditExpense: a.carbonCreditExpense - prev.carbonCreditExpense,
                    bunkerCost: a.bunkerCost - prev.bunkerCost,
                    netDaily: a.netDaily - prev.netDaily,
                  }
                : undefined;
              return (
                <tr key={a.id} className="align-top">
                  <td className="px-3 py-3">
                    <div className="text-sm text-gray-900 font-medium">{a.event}</div>
                    <div className="mt-0.5 text-gray-800">
                      <span className="text-[11px] text-gray-600">{formatDateTime(a.startDate)}</span>
                      {deltas ? (
                        <InlineDelta value={deltas.startDateDays} unit="d" />
                      ) : (
                        <span className="text-[11px] text-gray-500 ml-2">– +0d</span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="text-sm text-gray-800">{formatDateTime(a.startDate)}</div>
                    {deltas ? <Delta value={deltas.startDateDays} unit="d" /> : <div className="text-[11px] text-gray-500">– +0d</div>}
                  </td>
                  <td className="px-3 py-3">
                    <div className="text-sm text-gray-800">{formatDateTime(a.endDate)}</div>
                    {deltas ? <Delta value={deltas.endDateDays} unit="d" /> : <div className="text-[11px] text-gray-500">– +0d</div>}
                  </td>
                  <td className="px-3 py-3">
                    <div className="text-sm text-gray-800">{fmt0(a.totalDays)}</div>
                    {deltas ? <Delta value={deltas.totalDays} unit="" /> : <div className="text-[11px] text-gray-500">– +0</div>}
                  </td>
                  <td className="px-3 py-3">
                    <div className="text-sm text-gray-800">{fmt0(a.bunkerCons)}</div>
                    {deltas ? <Delta value={deltas.bunkerCons} unit="" /> : <div className="text-[11px] text-gray-500">– +0</div>}
                  </td>
                  <td className="px-3 py-3">
                    <div className="text-sm text-gray-800">{fmt0(a.carbonCreditExpense)}</div>
                    {deltas ? <Delta value={deltas.carbonCreditExpense} unit="" /> : <div className="text-[11px] text-gray-500">– +0</div>}
                  </td>
                  <td className="px-3 py-3">
                    <div className="text-sm text-gray-800">{a.bunkerCost.toLocaleString()}</div>
                    {deltas ? <Delta value={deltas.bunkerCost} unit="" /> : <div className="text-[11px] text-gray-500">– +0</div>}
                  </td>
                  <td className="px-3 py-3">
                    <div className="text-sm text-gray-800">{a.netDaily.toLocaleString()}</div>
                    {deltas ? <Delta value={deltas.netDaily} unit="" /> : <div className="text-[11px] text-gray-500">– +0</div>}
                  </td>
                </tr>
              );
            })}
            {/* Overall variance row */}
            <tr key="overall-variance" className="align-top bg-indigo-50/60">
              <td className="px-3 py-3">
                <div className="text-sm text-indigo-900 font-semibold">{overallLabel}</div>
              </td>
              <td className="px-3 py-3">
                <div className="text-sm text-indigo-900">{last.startDate}</div>
                <Delta value={overallDeltas.startDateDays} unit="d" />
              </td>
              <td className="px-3 py-3">
                <div className="text-sm text-indigo-900">{last.endDate}</div>
                <Delta value={overallDeltas.endDateDays} unit="d" />
              </td>
              <td className="px-3 py-3">
                <div className="text-sm text-indigo-900">{fmt0(last.totalDays)}</div>
                <Delta value={overallDeltas.totalDays} unit="" />
              </td>
              <td className="px-3 py-3">
                <div className="text-sm text-indigo-900">{fmt0(last.bunkerCons)}</div>
                <Delta value={overallDeltas.bunkerCons} unit="" />
              </td>
              <td className="px-3 py-3">
                <div className="text-sm text-indigo-900">{fmt0(last.carbonCreditExpense)}</div>
                <Delta value={overallDeltas.carbonCreditExpense} unit="" />
              </td>
              <td className="px-3 py-3">
                <div className="text-sm text-indigo-900">{last.bunkerCost.toLocaleString()}</div>
                <Delta value={overallDeltas.bunkerCost} unit="" />
              </td>
              <td className="px-3 py-3">
                <div className="text-sm text-indigo-900">{last.netDaily.toLocaleString()}</div>
                <Delta value={overallDeltas.netDaily} unit="" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
} 