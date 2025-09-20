export interface Voyage {
  id: number;
  voyageNo: string;
  vesselId: number;
  vesselName?: string;
  estimateId?: number;
  status: string;
  voyageJson?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  portCalls: VoyagePortCall[];
  cargoList: VoyageCargo[];
  financials?: VoyageFinanceElement[];
  activities?: ActivityData[];
  otherExpenses?: OtherExpense[];
  voyageroute: string;
}

export interface VoyagePortCall {
  id: number;
  voyageId: number;
  portId: number;
  portName: string;
  sequenceOrder: number;
  activity: string;

  arrival: string | Date;
  departure: string | Date; 

  berthDate?: string | Date;
  portDays?: number;
  speed?: number;
  chartererAgent?: string;
  ownerAgent?: string;
  operator?: string;
  timeOfBerth?: string; // HH:mm

  distance: number;
  portCost: number;
  cargoCost: number;

  notes?: string;
  steamDays?: number;
}


export interface VoyagePortCallBunkerConsumption {
  gradeId: number;
  grade: string;
  portConsumption: number;
  steamConsumption: number;
  arrivalQuantity: number;
  departureQuantity: number;
  bunkeringQuantity: number;
}


export interface VoyageCargo {
  id: number;
  commodityId: number;
  commodity: string;
  charterer?: string;
  quantity: number;
  quantityType: string;
  quantityUnitId: number;
  loadPorts: string;
  dischargePorts: string;
  fixtureNo?: string;
  rate: number;
  currencyId: number;
  currency: string;
  rateType: string;
  rateUnitId: number;
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

export interface VoyageFinanceElement {
  element: string;
  group: string;
  amount: number;
}

export interface VoyageActivityEvent {
  id: string;
  event: string;
  startDate: string; // ISO date
  endDate: string;   // ISO date
  totalDays: number;
  bunkerCons: number;
  carbonCreditExpense: number;
  bunkerCost: number;
  netDaily: number;
  // deltas to show trend arrows (optional)
  deltas?: {
    startDateDays?: number;   // e.g., +1d
    endDateDays?: number;     // e.g., -4d
    totalDays?: number;       // e.g., +2
    bunkerCons?: number;      // e.g., +20
    carbonCreditExpense?: number; // e.g., +20
    bunkerCost?: number;      // e.g., +4000
    netDaily?: number;        // e.g., -200
  };
}

export interface ActivityData {
  id: string;
  event: string;
  startDate: string; // MM/DD/YY format
  endDate: string;   // MM/DD/YY format
  totalDays: number;
  bunkerCons: number;
  carbonCreditExpense: number;
  bunkerCost: number;
  netDaily: number;
  vesselId?: string;
  portCode?: string;
  fuelType?: string;
  weatherConditions?: string;
  crew?: number;
}

export interface CreateVoyageRequest {
  vesselId: number;
  estimateId?: number;
  notes?: string;
  estimatedDeparture?: string;
  estimatedArrival?: string;
  portCalls?: Omit<VoyagePortCall, 'id' | 'voyageId'>[];
}

export interface UpdateVoyageStatusRequest {
  status: 'Planning' | 'Active' | 'Completed' | 'Cancelled';
  notes?: string;
}

export interface UpdatePortCallActualsRequest {
  actualArrival?: string;
  actualDeparture?: string;
  cargoQuantity?: number;
  notes?: string;
}

export interface SubExpense {
  id: string;
  name: string;
  amount: number;
}

export interface OtherExpense {
  id: string;
  itemName: string;
  isPerDayCost: boolean;
  rate?: number;
  amount: number;
  notes?: string;
  subExpenses?: SubExpense[];
}