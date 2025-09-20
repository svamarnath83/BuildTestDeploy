"use client"

import React from 'react'
import { format } from 'date-fns'
import { 
  RefreshCcw, 
  Plus, 
  Database, 
  User, 
  Calendar,
  FileText,
  Eye,
  EyeOff
} from 'lucide-react'
import { cn } from "@commercialapp/ui"
import { ScrollArea } from "../ui/scroll-area"
import { AuditLogModel, AuditLogService, parseAuditLog, ParsedAuditLog } from "../../../libs/audit"
import { showErrorNotification } from "../ui/react-hot-toast-notifications"

export interface AuditLogListProps {
  moduleId?: string
  recordId?: number
  tableName?: string
  userName?: string
  className?: string
  onRefresh?: () => void
}

export function AuditLogList({ 
  moduleId, 
  recordId, 
  tableName, 
  userName, 
  className,
  onRefresh
}: AuditLogListProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [auditLogs, setAuditLogs] = React.useState<AuditLogModel[]>([])
  const [showDetails, setShowDetails] = React.useState<Record<number, boolean>>({})

  const load = React.useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      let response
      
      if (moduleId && recordId) {
        response = await AuditLogService.getAuditLogsByRecord(moduleId, recordId)
      } else if (tableName) {
        response = await AuditLogService.getAuditLogsByTable(tableName, recordId)
      } else if (userName) {
        response = await AuditLogService.getAuditLogsByUser(userName)
      } else {
        throw new Error('No valid parameters provided')
      }
      
      console.log('AuditLogList - API Response:', response)
      console.log('AuditLogList - Response data:', response.data)
      console.log('AuditLogList - Response status:', response.status)
      
      setAuditLogs(response.data || [])
    } catch (e: any) {
      console.error('AuditLogList - Error:', e)
      console.error('AuditLogList - Error response:', e?.response)
      const message = e?.response?.data?.message || e?.message || "Failed to load audit logs"
      setError(message)
      showErrorNotification({ title: "Load failed", description: message })
    } finally {
      setIsLoading(false)
    }
  }, [moduleId, recordId, tableName, userName])

  React.useEffect(() => {
    load()
  }, [load])

  const sortedAuditLogs = React.useMemo(() => {
    if (!auditLogs.length) return []

    return auditLogs
      .map(log => {
        try {
          const parsed = parseAuditLog(log)
          return { log, parsed }
        } catch (error) {
          console.warn('Failed to process audit log:', log, error)
          return null
        }
      })
      .filter(Boolean)
      .sort((a, b) => {
        if (!a || !b) return 0
        return b.parsed.changedAt.getTime() - a.parsed.changedAt.getTime()
      })
  }, [auditLogs])

  const getActionVisuals = (action: string) => {
    switch (action) {
      case 'INSERT':
        return {
          icon: Plus,
          iconClass: 'text-green-600',
          accentClass: 'border-l-4 border-l-green-500',
          bgClass: 'bg-green-50',
          textClass: 'text-green-800'
        }
      case 'UPDATE':
        return {
          icon: RefreshCcw,
          iconClass: 'text-blue-600',
          accentClass: 'border-l-4 border-l-blue-500',
          bgClass: 'bg-blue-50',
          textClass: 'text-blue-800'
        }
      case 'DELETE':
        return {
          icon: FileText,
          iconClass: 'text-red-600',
          accentClass: 'border-l-4 border-l-red-500',
          bgClass: 'bg-red-50',
          textClass: 'text-red-800'
        }
      default:
        return {
          icon: FileText,
          iconClass: 'text-gray-600',
          accentClass: 'border-l-4 border-l-gray-500',
          bgClass: 'bg-gray-50',
          textClass: 'text-gray-800'
        }
    }
  }

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return 'null'
    if (typeof value === 'object') return JSON.stringify(value)
    return String(value)
  }

  const formatDate = (date: Date): string => {
    try {
      return format(date, 'MMM d, yyyy HH:mm')
    } catch (error) {
      console.warn('Failed to format date:', date, error)
      return 'Invalid Date'
    }
  }

  const toggleDetails = (logId: number) => {
    setShowDetails(prev => ({ ...prev, [logId]: !prev[logId] }))
  }

  return (
    <div className={cn("flex-1 flex flex-col min-h-0", className)}>
     
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-3 space-y-2">
          {isLoading ? (
            <div className="text-sm text-gray-500 px-2 py-8 text-center">Loading audit logs...</div>
          ) : error ? (
            <div className="text-sm text-red-500 px-2 py-8 text-center">{error}</div>
          ) : (!auditLogs || auditLogs.length === 0) ? (
            <div className="text-sm text-gray-500 px-2 py-8 text-center">No audit logs found</div>
          ) : (
            sortedAuditLogs.map((item) => {
              if (!item) return null
              const { log, parsed } = item
              const visuals = getActionVisuals(log.actionName)
              const Icon = visuals.icon
              const isDetailsOpen = showDetails[log.id]
              
              return (
                <div key={log.id} className={cn("bg-white p-3 rounded-[10px] border shadow-sm hover:shadow-md transition-shadow", visuals.accentClass)}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                        <span className="grid h-6 w-6 place-items-center rounded-full ring-1 ring-slate-200 bg-slate-50">
                          <Icon className={cn("w-3.5 h-3.5", visuals.iconClass)} />
                        </span>
                        <span className="uppercase">{log.actionName}</span>
                      </div>
                      
                      <div className="mt-2 flex items-center gap-4 text-xs text-slate-600">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{parsed.userName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(parsed.changedAt)}</span>
                        </div>
                      </div>

                      {isDetailsOpen && parsed.changes.length > 0 && (
                        <div className="mt-3 p-2 bg-slate-50 rounded-[8px] border border-slate-200">
                          <div className="text-xs font-medium text-slate-700 mb-2">Changes:</div>
                          <div className="space-y-1">
                                                         {parsed.changes.map((change: any, idx: number) => (
                              <div key={`change-${log.id}-${idx}`} className="text-xs text-slate-600">
                                <span className="font-medium">{change.FieldName}:</span>
                                <span className="text-red-600 line-through ml-1">{formatValue(change.OldValue)}</span>
                                <span className="text-green-600 ml-1">→</span>
                                <span className="text-green-600 ml-1">{formatValue(change.NewValue)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => toggleDetails(log.id)}
                      className="h-6 w-6 grid place-items-center rounded-[6px] text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                      title={isDetailsOpen ? "Hide details" : "Show details"}
                    >
                      {isDetailsOpen ? (
                        <EyeOff className="w-3 h-3" />
                      ) : (
                        <Eye className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
