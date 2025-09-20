"use client";

import React from 'react';
import { BarChart3 } from 'lucide-react';
import ComingSoonPage from '../../components/ComingSoonPage';

export default function FinancialStatementsPage() {
  const features = [
    "Income statement generation",
    "Period comparisons",
    "Departmental P&L",
    "Consolidated statements",
    "Asset and liability reporting",
    "Equity calculations",
    "Multi-period comparisons",
    "Detailed sub-schedules",
    "Operating cash flows",
    "Investment and financing activities",
    "Cash flow projections",
    "Consolidated reporting",
    "Segment reporting",
    "Custom statement formats",
    "Export capabilities"
  ];

  return (
    <ComingSoonPage
      title="Financial Statements"
      description="P&L, Balance Sheet, and Cash Flow reports"
      icon={BarChart3}
      features={features}
    />
  );
}
