export interface CurrentPerformance {
  currentSpeed: number; // knots
  fuelConsumption: number; // MT/day
  eta: string; // ISO datetime
  distanceRemaining: number; // nautical miles
  averageSpeed: number; // knots
  fuelEfficiency: number; // MT/nm
  engineLoad: number; // percentage
  rpm: number; // revolutions per minute
  powerOutput: number; // kW
  fuelType: string;
  lastUpdate: string; // ISO datetime
}

export interface PerformanceMetrics {
  voyageId: string;
  vesselId: string;
  date: string;
  distanceCovered: number; // nautical miles
  fuelUsed: number; // MT
  averageSpeed: number; // knots
  weatherDelay: number; // hours
  portDelay: number; // hours
  totalDelay: number; // hours
  efficiency: number; // percentage
}
