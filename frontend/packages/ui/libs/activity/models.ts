// Activity models and types

// Module ID enum for standardized module identification
export const MODULE_ID = {
  ESTIMATE: 1,
  PORT: 2
} as const

export type ModuleId = typeof MODULE_ID[keyof typeof MODULE_ID]

export interface ActivityModel {
  id?: number
  moduleId: number
  recordId: number
  activityName: string
  parentId?: number
  assignedTo?: number
  status?: string
  dueDate?: string | null
  additionalData?: string // JSON serialized data
  notes?: string
  summary?: string
  createdDate?: string
}

export interface ActivityAdditionalData {
  moduleId: number
  recordId: number
  activityName: string
  assignedTo?: number
  status?: string
  dueDate?: string | null
  notes?: string
  summary?: string
  assignedName?: string
  createdName?: string
  prevId?: number
}

// Create/Update use ActivityModel shape at the API boundary

export interface ActivityResponse {
  id: number
  moduleId: number
  recordId: number
  activityName: string
  parentId?: number
  assignedTo?: number
  status?: string
  dueDate?: string | null
  additionalData?: string
  notes?: string
  summary?: string
}

export interface ActivityListResponse {
  data: ActivityResponse[]
  total: number
  page: number
  limit: number
}

// Activity status options
export const ACTIVITY_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const

export type ActivityStatus = typeof ACTIVITY_STATUS[keyof typeof ACTIVITY_STATUS]

// Activity priority removed - no longer needed

// User assignment option
export interface AssigneeOption {
  id: number
  name: string
  email?: string
}
