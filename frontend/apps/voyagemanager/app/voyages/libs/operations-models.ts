export interface Alert {
  id: string;
  vesselId: string;
  vesselName: string;
  type: 'warning' | 'info' | 'critical' | 'maintenance' | 'weather' | 'port';
  message: string;
  timestamp: string; // ISO datetime
  location?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

export interface ActivityEvent {
  id: string;
  vesselId: string;
  vesselName: string;
  type: 'position_update' | 'departure' | 'arrival' | 'loading' | 'unloading' | 'weather_delay' | 'maintenance' | 'fuel_update';
  title: string;
  description: string;
  timestamp: string; // ISO datetime
  location?: string;
  status: 'completed' | 'in_progress' | 'pending' | 'cancelled';
  color: 'blue' | 'green' | 'orange' | 'red' | 'purple' | 'yellow';
  metadata?: {
    speed?: number;
    course?: number;
    cargoQuantity?: number;
    fuelLevel?: number;
    weatherCondition?: string;
    portName?: string;
    eta?: string;
  };
}

export interface OperationsSummary {
  totalVessels: number;
  activeVoyages: number;
  alertsCount: number;
  criticalAlerts: number;
  recentActivities: number;
  averageSpeed: number;
  totalCargo: number;
  fuelConsumption: number;
}
