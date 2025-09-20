"use client";

import React from 'react';
import { Shield } from 'lucide-react';
import ComingSoonPage from '../../components/ComingSoonPage';

export default function CompliancePage() {
  const features = [
    "Transaction audit trails",
    "User activity logging",
    "Change history tracking",
    "Compliance reporting",
    "User role definitions",
    "Permission management",
    "Access controls",
    "Segregation of duties",
    "Regulatory reports",
    "Internal audit reports",
    "Control testing",
    "Risk assessments",
    "Data encryption",
    "Secure access protocols",
    "Backup and recovery",
    "Compliance monitoring"
  ];

  return (
    <ComingSoonPage
      title="Compliance"
      description="Audit Logs, Role Management, and Compliance reporting"
      icon={Shield}
      features={features}
    />
  );
}
