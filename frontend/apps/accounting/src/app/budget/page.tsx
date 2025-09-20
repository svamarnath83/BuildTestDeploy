"use client";

import React from 'react';
import { TrendingUp } from 'lucide-react';
import ComingSoonPage from '../../components/ComingSoonPage';

export default function BudgetPage() {
  const features = [
    "Annual budget creation",
    "Departmental budgets",
    "Rolling forecasts",
    "Budget templates",
    "Actual vs budget comparison",
    "Budget utilization monitoring",
    "Variance tracking",
    "Real-time updates",
    "Revenue forecasting",
    "Expense projections",
    "Cash flow forecasting",
    "Scenario planning",
    "Budget performance reports",
    "Variance analysis",
    "Budget revision tracking",
    "Executive dashboards"
  ];

  return (
    <ComingSoonPage
      title="Budget"
      description="Budget planning, tracking, and variance analysis"
      icon={TrendingUp}
      features={features}
    />
  );
}
