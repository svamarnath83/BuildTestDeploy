export interface MaintenanceRecord {
  id: string;
  type: 'scheduled' | 'unscheduled' | 'emergency' | 'inspection';
  description: string;
  performedDate: string; // ISO date
  nextDueDate?: string; // ISO date
  status: 'completed' | 'pending' | 'overdue' | 'cancelled';
  cost?: number;
  contractor?: string;
  location?: string;
  notes?: string;
}

export interface ComplianceStatus {
  certificateName: string;
  certificateNumber: string;
  issuedDate: string; // ISO date
  expiryDate: string; // ISO date
  status: 'valid' | 'expiring' | 'expired' | 'pending_renewal';
  issuingAuthority: string;
  renewalRequired: boolean;
  daysUntilExpiry: number;
}

export interface MaintenanceSchedule {
  vesselId: string;
  lastDryDock: string; // ISO date
  nextDryDock: string; // ISO date
  lastService: string; // ISO date
  nextService: string; // ISO date
  maintenanceRecords: MaintenanceRecord[];
  complianceStatus: ComplianceStatus[];
  totalMaintenanceCost: number;
  budgetRemaining: number;
}
