import { createApiClient } from '../api-client'
import { getApiUrl, API_CONFIG } from '../../config/api'
import { AuditLogModel, ParsedAuditLog, AuditLogChange } from './models'
import { parseISO, isValid, format } from 'date-fns'

const auditApi = createApiClient(getApiUrl(API_CONFIG.ENDPOINTS.AUDIT))

export const getAuditLogsByRecord = (moduleId: string, recordId: number) => auditApi.get<AuditLogModel[]>(`/GetAuditLogByRecord/${moduleId}/${recordId}`)
export const getAuditLogsByTable = (tableName: string, recordId?: number) => {
  const params = recordId ? `?recordId=${recordId}` : ''
  return auditApi.get<AuditLogModel[]>(`/GetByTable/${tableName}${params}`)
}
export const getAuditLogsByUser = (userName: string) => auditApi.get<AuditLogModel[]>(`/GetByUser/${userName}`)

export const AuditLogService = {
  getAuditLogsByRecord,
  getAuditLogsByTable,
  getAuditLogsByUser,
}

export default AuditLogService

// Utility function to parse audit log data
export function parseAuditLog(auditLog: AuditLogModel): ParsedAuditLog {
  let changes: AuditLogChange[] = []
  let changedAt: Date = new Date() // Initialize with current date as fallback

  
  try {
    changes = JSON.parse(auditLog.changes)
  } catch (e) {
    console.warn('Failed to parse changes:', auditLog.changes)
  }

  // Handle date parsing with date-fns for various formats
  try {
    if (auditLog.changedAt) {
      const dateStr = auditLog.changedAt.trim()
      
      // Try different date formats with date-fns
      let parsedDate: Date | null = null
      
      // Try ISO format first (most common)
      try {
        parsedDate = parseISO(dateStr)
        if (isValid(parsedDate)) {
          changedAt = parsedDate
        }
      } catch (e) {
        // Continue to next format
      }
      
      // If ISO parsing failed, try SQL datetime format
      if (!parsedDate || !isValid(parsedDate)) {
        try {
          // Convert SQL format "2024-01-16 14:45:00" to ISO "2024-01-16T14:45:00"
          const sqlToIso = dateStr.replace(' ', 'T')
          parsedDate = parseISO(sqlToIso)
          if (isValid(parsedDate)) {
            changedAt = parsedDate
          }
        } catch (e) {
          // Continue to next format
        }
      }
      
      // If still not valid, try with timezone offset
      if (!parsedDate || !isValid(parsedDate)) {
        try {
          // Add Z to make it UTC if it doesn't have timezone info
          const withZ = dateStr.includes('Z') ? dateStr : dateStr + 'Z'
          parsedDate = parseISO(withZ)
          if (isValid(parsedDate)) {
            changedAt = parsedDate
          }
        } catch (e) {
          // Continue to next format
        }
      }
      
      // If all parsing attempts failed, use current date
      if (!parsedDate || !isValid(parsedDate)) {
        console.warn('Failed to parse date with date-fns:', auditLog.changedAt)
        changedAt = new Date()
      }
    } else {
      changedAt = new Date()
    }
  } catch (e) {
    console.warn('Failed to parse changedAt:', auditLog.changedAt, e)
    changedAt = new Date()
  }

  return {
    id: auditLog.id,
    tableName: auditLog.tableName,
    action: auditLog.action,
    keyValues: auditLog.keyValues,
    changes,
    userName: auditLog.userName,
    changedAt,
    actionName: auditLog.actionName,
  }
}
