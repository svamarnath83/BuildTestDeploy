export interface Grade {
  /** Unique identifier for the grade */
  id: number;

  /** Name of the grade */
  name: string;

  /** Price of the grade */
  price: number;

  /** Indicates if the grade is currently in use */
  inUse: boolean;
}

export interface CreateGradeRequest {
  name: string;
  price: number;
  inUse: boolean;
}

export interface UpdateGradeRequest extends Partial<CreateGradeRequest> {
  id: number;
}

export interface GradeFilters {
  searchTerm?: string;
  inUse?: boolean;
}

export interface GradeListResponse {
  grades: Grade[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
} 