export interface AuditLogModel {
  id: number
  tableName: string
  action: number
  changes: string // JSON array of {FieldName, OldValue, NewValue}
  userName: string
  changedAt: string // ISO date string
  actionName: string
  keyValues: number
} 

export interface AuditLogChange {
  FieldName: string
  OldValue: any
  NewValue: any
}

export interface ParsedAuditLog {
  id: number
  tableName: string
  action: number
  keyValues: number
  changes: AuditLogChange[]
  userName: string
  changedAt: Date
  actionName: string
}
