"use client";

import React from 'react';
import { Calculator } from 'lucide-react';
import ComingSoonPage from '../../components/ComingSoonPage';

export default function ReportsPage() {
  const features = [
    "Adjusted trial balance",
    "Unadjusted trial balance",
    "Period comparisons",
    "Account details drill-down",
    "Account ledger details",
    "Transaction history",
    "Period filters",
    "Multi-company ledgers",
    "VAT returns and calculations",
    "GST compliance reporting",
    "Tax reconciliations",
    "Budget vs actual analysis",
    "Period-over-period analysis",
    "Variance explanations",
    "Performance metrics"
  ];

  return (
    <ComingSoonPage
      title="Control & Tax Reports"
      description="Trial Balance, General Ledger, VAT/GST, Variance reports"
      icon={Calculator}
      features={features}
    />
  );
}
