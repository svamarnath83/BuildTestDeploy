export interface SpeedConsumptionItem {
  id: number;
  speed: string;
  mode: 'ballast' | 'laden' | 'port';
  consumptions: { [gradeId: number]: number };
  isDefault?: boolean;
}

export interface TransformedSpeedConsumption {
  id: number;
  speed: string;
  mode: 'ballast' | 'laden' | 'port';
  gradeId: number;
  gradeName: string;
  consumption: number;
  isDefault: boolean;
}

export interface TableValidationError {
  field: string;
  message: string;
}

export interface ShipFormData {
  shipData: any;
  gradeItems: any[];
  speedConsumptions: SpeedConsumptionItem[];
}
