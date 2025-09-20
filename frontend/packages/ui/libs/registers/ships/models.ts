export interface Vessel {
  /** Unique identifier for the vessel */
  id: number;

  /** Vessel name */
  name: string;

  /** Vessel code */
  code: string;

  /** Dead weight tonnage */
  dwt: number;

  /** Vessel type */
  type: number;

  /** Vessel type */
  vesselTypeName: string;

  /** Running cost */
  runningCost: number;

  /** IMO */
  imo: number;

  /** Ship JSON data */
  vesselJson: string;

  /** Grades */
  vesselGrades: VesselGrade[];

}

export interface CreateShipRequest {
  name: string;
  imo: string;
  type: string;
  flag: string;
  dwt: number;
  built: number;
  status: string;
}

export interface UpdateShipRequest extends Partial<CreateShipRequest> {
  id: number;
}

export interface ShipFilters {
  searchTerm?: string;
  type?: string;
  status?: string;
  flag?: string;
}

export interface ShipListResponse {
  ships: Vessel[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface VesselGrade {
  id: number;
  vesselId: number;
  gradeId: number;
  uomId: number;
  type: string;
  gradeName: string;
  sortOrder?: number;
} 