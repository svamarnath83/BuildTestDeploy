export interface Port {
  /** Unique identifier for the port */
  Id: number;

  /** Port code (e.g., USNYC for New York) */
  PortCode: string;

  /** Full name of the port */
  Name: string;

  /** UNCTAD code */
  unctadCode?: string | null;

  /** UTC timezone information */
  utc?: string | null;

  /** Latitude coordinate of the port */
  Latitude?: string | null;

  /** Longitude coordinate of the port */
  Longitude?: string | null;

  /** NETPAS code */
  netpasCode?: string | null;

  /** ECA Type - replaces individual ECA checkboxes */
  ecaType?: 'china' | 'med' | 'seca' | 'none';

  /** ETS indicator */
  ets?: string;

  /** Europe indicator */
  IsEurope?: boolean;

  /** Historical indicator */
  historical?: boolean;

  /** Indicates if the port is currently active */
  IsActive: boolean;
  
  /** Additional data */
  additionalData:string;

  /** Country ID */
  country: number;
}
export interface CreatePortRequest {
  name: string;
  code: string;
  country: string;
  latitude: number;
  longitude: number;
  timeZone: string;
  status: string;
}

export interface UpdatePortRequest extends Partial<CreatePortRequest> {
  id: number;
}

export interface PortFilters {
  searchTerm?: string;
  country?: string;
  status?: string;
}

export interface PortListResponse {
  ports: Port[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
} 
