"use client";

import React from 'react';
import { Download } from 'lucide-react';
import ComingSoonPage from '../../components/ComingSoonPage';

export default function IntegrationPage() {
  const features = [
    "CSV/Excel imports",
    "Bank statement imports",
    "Chart of accounts import",
    "Transaction imports",
    "Financial statement exports",
    "Report exports",
    "Data backups",
    "Compliance exports",
    "ERP system integration",
    "Banking system connectivity",
    "CRM integration",
    "API endpoints",
    "Scheduled imports/exports",
    "Data validation rules",
    "Error handling",
    "Integration monitoring"
  ];

  return (
    <ComingSoonPage
      title="Integration"
      description="Import/Export data and system integrations"
      icon={Download}
      features={features}
    />
  );
}
