export interface VesselType {
  /** Unique identifier for the vessel type */
  id: number;

  /** Name of the vessel type */
  name: string;

  /** Category of the vessel type */
  category: number;

  /** Calculation type for the vessel type */
  calcType: string;
  categoryName: string;
}

export interface VesselCategory {
  /** Unique identifier for the category */
  id: number;

  /** Name of the category */
  name: string;
}

export interface CreateVesselTypeRequest {
  name: string;
  category: string;
  calcType: string;
}

export interface UpdateVesselTypeRequest extends Partial<CreateVesselTypeRequest> {
  id: number;
}

export interface VesselTypeFilters {
  searchTerm?: string;
  category?: string;
  calcType?: string;
}

export interface VesselTypeListResponse {
  vesselTypes: VesselType[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
