export interface Position {
  ID: number;
  EstimateId: number;
  PortId: number;
  PortTypeId: number;
  PortCost: number;
  CargoCost: number;
  Distance: number;
  SecaDistance: number;
  Speed: number;
  PortDays: number;
  SteamDays: number;
  PortDaysSec: number;
  SteamDaysSec: number;
  PortDaysAdditionalType: string;
  PortDaysAdditional: number;
  SteamDaysAdditionalType: string;
  SteamDaysAdditional: number;
  ArrivalDate: string;
  DepatureDate: string;
  CreatedBy: string;
  CreatedDate: string;
  UpdatedBy: string;
  UpdatedDate: string;
}

export interface Cargo {
  ID: number;
  EstimateId: number;
  SeqNo: number;
  ChartererId: number;
  CommodityId: number;
  Charterer: string;
  Commodity: string;
  Quantity: number;
  Rate: number;
  QuantityTypeId: number;
  RateTypeId: number;
  DemurrageRate: number;
  DespatchRate: number;
  OtherIncome: number;
  BunkerCompensation: number;
  RateCommissionPct: number;
  DemurrageCommissionPct: number;
  OtherIncomeCommissionPct: number;
  BunkerCompCommissionPct: number;
  Co2Income: number;
  ToleranceId: number;
  LoadPorts: string;
  LoadDays: number;
  LoadPortCost: number;
  LoadTerm: string;
  LoadTermTypeId: number;
  LoadExcludePeriodId: number;
  DischargePorts: string;
  DischargeDays: number;
  DischargePortCost: number;
  DischargeTerm: string;
  DischargeTermTypeId: number;
  DischargeExcludePeriodId: number;
  BookingId: number;
  FixtureId: number;
  CoaId: number;
  CreatedBy: string;
  CreatedDate: string;
  UpdatedBy: string;
  UpdatedDate: string;
}

export interface FinanceSummary {
  ID: number;
  EstimateId: number;
  SeqNo: number;
  SummaryTypeId: number;
  Amount: number;
}

export interface Bunker {
  ID: number;
  EstimateId: number;
  GradeId: number;
  Price: number;
  PortCons: number;
  BallastCons: number;
  LaddenCons: number;
  ROB: number;
  Co2Emission: number;
  TotalCons: number;
  TotalCost: number;
}

export interface Estimate {
  ID: number;
  EstimationNo: string;
  VesselId: number;
  CurrencyId: number;
  CalculationType: string;
  Description: string;
  SpeedBallast: number;
  SpeedLadden: number;
  RunningCost: number;
  Status: string;
  VoyageNo: string;
  CreatedBy: string;
  CreatedDate: string;
  UpdatedBy: string;
  UpdatedDate: string;
  Positions: Position[];
  Cargoes: Cargo[];
  FinanceSummary: FinanceSummary[];
  Bunkers: Bunker[];
}

export interface CreateEstimateRequest {
  EstimateNo: string;
  EstimateType: string;
  ShipCode: string;
  Commodity: string;
  Charterer: string;
  LoadPorts: string;
  DischargePorts: string;
  Status: string;
  CreatedDate: string; // ISO date string
}

export interface UpdateEstimateRequest extends Partial<CreateEstimateRequest> {
  Id: number;
}

export interface EstimateFilters {
  searchTerm?: string;
  EstimateType?: string;
  Status?: string;
}

export interface EstimateListResponse {
  estimates: Estimate[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface EstimateExplorerModel {
  ID: number;
  EstimationNo: string;
  Status: string;
  CreatedDate: string;
  Description: string;
  VoyageNo: string;
} 