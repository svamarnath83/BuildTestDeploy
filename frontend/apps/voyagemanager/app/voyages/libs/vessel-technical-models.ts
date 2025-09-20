export interface VesselTechnicalDetails {
  imo: string;
  mmsi: string;
  callSign: string;
  flag: string;
  builder: string;
  yearBuilt: number;
  dwt: number; // Deadweight tonnage
  grt: number; // Gross register tonnage
  length: number; // meters
  beam: number; // meters
  draft: number; // meters
  enginePower: number; // kW
  maxSpeed: number; // knots
  fuelConsumption: number; // MT/day
  lastMaintenance: string; // ISO date
  nextMaintenance: string; // ISO date
  classification?: string;
  insuranceExpiry?: string;
}

export interface VesselSpecifications {
  hullMaterial: string;
  engineType: string;
  propellerType: string;
  navigationEquipment: string[];
  communicationEquipment: string[];
  safetyEquipment: string[];
  cargoCapacity: number; // cubic meters
  containerCapacity?: number; // TEU
  tankCapacity?: number; // cubic meters
}
