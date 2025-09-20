"use client";

import React from 'react';
import { Banknote } from 'lucide-react';
import ComingSoonPage from '../../components/ComingSoonPage';

export default function ReconciliationPage() {
  const features = [
    "Import bank statements",
    "Automatic transaction matching",
    "Manual reconciliation tools",
    "Outstanding items tracking",
    "Cash position tracking",
    "Cash flow forecasting",
    "Multi-bank support",
    "Currency reconciliation",
    "Reconciliation summaries",
    "Outstanding items reports",
    "Bank statement analysis",
    "Auto-matching rules",
    "Recurring transactions",
    "Exception handling and workflows"
  ];

  return (
    <ComingSoonPage
      title="Cash & Bank Reconciliation"
      description="Reconcile bank statements and cash accounts"
      icon={Banknote}
      features={features}
    />
  );
}
