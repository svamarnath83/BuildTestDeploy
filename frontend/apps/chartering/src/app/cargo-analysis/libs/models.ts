// Cargo Analysis Models and Interfaces

export interface CargoInput {
  commodity: string;
  quantity: number;
  quantityType: string;
  loadPorts: string[];
  dischargePorts: string[];
  selectedShips?: number[]; // Array of selected ship IDs for analysis
  rate: number;
  currency: string;
  rateType: string;
  laycanFrom: string;
  laycanTo: string;
  
  // Load Terms
  loadTerms?: number;
  loadLayTermTypes?: string;
  loadExcludedPeriod?: string;
  
  // Discharge Terms
  dischargeTerms?: number;
  dischargeLayTermTypes?: string;
  dischargeExcludedPeriod?: string;
  
  // Commission and Rates
  commissionPercentage?: number;
  demurrageRate?: number;
  despatchRate?: number;
  bunkerCompensation?: number;
  otherIncome?: number;
  co2Income?: number;
  
  // Commission Flags
  includeCommissionOnDemurrage?: boolean;
  includeCommissionOnDespatch?: boolean;
  includeCommissionOnBunkerCompensation?: boolean;
  
  // Readonly Calculated Fields
  totalCommission?: number;
  totalDemurrage?: number;
  totalDespatch?: number;
  totalGrossFreight?: number;
}

export interface SpeedConsumption {
  id: number;
  speed: number;
  mode: 'port' | 'ballast' | 'laden';
  gradeId: number;
  consumption: number;
  isDefault: boolean;
}

export interface VesselGrade {
  id: number;
  Grade: string;
  mode: string;
  gradeId: number;
  consumption: number;
}

export interface VesselGradeDetail {
  id: number;
  vesselId: number;
  gradeId: number;
  uomId: number;
  type: string;
  gradeName: string;
}

export interface Vessel {
  id: number;
  name: string;
  code: string;
  imo: string;
  dwt: number;
  type: number;
  vesselTypeName: string;
  runningCost: number;
  vesselJson: string;
  vesselGrades: VesselGradeDetail[];
  // Legacy properties for backward compatibility
  vesselName?: string;
  ballastPort?: string;
  ballastDate?: string;
  ballastSpeed?: number; 
  ladenSpeed?: number;
  // Parsed speed consumptions
  speedConsumptions?: SpeedConsumption[];
}

export interface PortCall {
  id: number;
  portName: string;
  portId?: number;
  activity: 'Ballast' | 'Load' | 'Discharge' | 'Bunker' | 'Owners Affairs' | 'Transit' | 'Canal';
  portDays: number;
  secPortDays?: number; // Secondary port days for SECA calculations
  additionalCosts: number;
  eta: string;
  etd: string;
  isFixed: boolean;
  isDeletable: boolean;
  hfoDays: number;
  lsfoDays: number;
  mgoDays: number;
  distance: number; // Nautical miles to next port
  secDistance?: number; // SECA distance to next port
  secSteamDays?: number; // Secondary steaming days for SECA calculations
  speedSetting: 'Ballast' | 'Laden'; // Changed from 'Eco' | 'Performance' to 'Ballast' | 'Laden'
  isRoutingPoint?: boolean; // Flag to identify routing points like canals
  availableRoutingPoints?: RoutingPoint[]; // Available routing points for this port pair (even if none are added)
  DistanceResult?: DistanceResult; // Distance information for this port pair
  currentRoutingPoint: RoutingPoint[]; // Currently selected routing points for this port pair
  iconTooltip?: string; // Tooltip for route selection icons
  bunkerConsumption?: BunkerConsumption[];
  europe?: boolean; // Region flag for EU-specific logic
}

export interface BunkerConsumption {
  grade: string;
  portConsumption: number;
  steamConsumption: number;
}

export interface RoutingPoint {
  Name: string;
  PortCallId : number;
  AddToRotation: boolean;
  AlternateRPs?: RoutingPoint[];
}

export interface RoutingPath {
  Name: string;
  Latitude: number;
  Longitude: number;
}


export interface RouteSegment {
  FromPort: string;
  ToPort: string;
  Distance: number;
  SecaDistance: number;
}

export interface DistanceResult {
  FromPort: string;
  ToPort: string;
  Distance: number;
  SecaDistance: number;
  RouteSegments: RouteSegment[];
  RoutingPoints: RoutingPoint[];
  RoutingPath: RoutingPath[];
}

export interface BunkerRate {
  grade: string;
  price: number;
  isPrimary: boolean;
  ballastPerDayConsumption: number;
  ladenPerDayConsumption: number;
  portConsumption: number;
}

export interface FinanceMetrics {
  revenue: number;
  voyageCosts: number;
  totalOpEx: number;
  finalProfit: number;
  tce: number;
  totalVoyageDuration: number;
  totalBunkerCost: number;
  totalAdditionalCosts: number;
  totalPortDays: number;
  totalSeaDays: number;
  eta: string;
  fuelCost: number;
  operatingCost: number;
  totalCost: number;
  duration: number;
  profit: number;
  margin: number;
}

export interface shipAnalysis {
  vessel: Vessel;
  cargoes: CargoInput[];
  portCalls: PortCall[];
  bunkerRates: BunkerRate[];
  financeMetrics: FinanceMetrics;
  suitable: boolean;
}

export interface EstimateCalculationParams {
  shipAnalysis: shipAnalysis;
  cargoInput: CargoInput;
}

// Legacy alias for compatibility
export type FinancialMetrics = FinanceMetrics; 