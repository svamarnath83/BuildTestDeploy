"use client"

import * as React from "react"
import { CalendarPlus, RefreshCcw, CheckSquare, CheckCircle, Check, X, Trash, Pencil, EllipsisVertical, ChevronDown } from "lucide-react"
import { differenceInCalendarDays, parseISO, format } from "date-fns"
import { cn } from "@commercialapp/ui"
import { ScrollArea } from "../ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@commercialapp/ui"
import { ActivityService, ActivityResponse, ACTIVITY_STATUS } from "../../../libs/activity"
import { ScheduleActivity, useScheduleActivity } from "./scheduleactivity"
import { useActivityStore } from "../../../libs/activity/store"
import { showErrorNotification, showSuccessNotification } from "../ui/react-hot-toast-notifications"
import { tokenManager } from "@commercialapp/ui"
import { AuditLogList } from '../audit'

export interface ActivityListProps {
  moduleId: number
  recordId: number
  className?: string
  onAdd?: () => void
}

export function ActivityList({ moduleId, recordId, className, onAdd }: ActivityListProps) {
  const [activeTab, setActiveTab] = React.useState<'general' | 'logs' | 'maritime'>('general')
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [actionLoadingId, setActionLoadingId] = React.useState<number | null>(null)
  const cached = useActivityStore((s) => s.getItems({ moduleId, recordId }))
  const setItems = useActivityStore((s) => s.setItems)
  const { open: editOpen, openDialog: openEdit, closeDialog: closeEdit, dialogProps } = useScheduleActivity()
  const [editing, setEditing] = React.useState<ActivityResponse | null>(null)
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>({})

  const load = React.useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await ActivityService.getActivitiesByRecord(moduleId, recordId)
      setItems({ moduleId, recordId }, res.data || [])
    } catch (e: any) {
      const message = e?.response?.data?.message || e?.message || "Failed to load activities"
      setError(message)
      showErrorNotification({ title: "Load failed", description: message })
    } finally {
      setIsLoading(false)
    }
  }, [moduleId, recordId, setItems])

  React.useEffect(() => {
    load()
  }, [load])

  const isTodoActionAllowed = (item: ActivityResponse): boolean => {
    if (!item) return false
    if ((item.activityName || '').toLowerCase() !== 'todo') return false
    return !(item.status === ACTIVITY_STATUS.COMPLETED || item.status === ACTIVITY_STATUS.CANCELLED)
  }

  const handleMarkTodoDone = async (item: ActivityResponse) => {
    try {
      setActionLoadingId(item.id)
      const add = parseAdditional(item.additionalData)
      const additionalData = JSON.stringify({ ...add, prevId: item.id, action: 'marked_done' })
      await ActivityService.addOrUpdateActivity({
        moduleId,
        recordId,
        activityName: item.activityName,
        parentId: item.id,
        assignedTo: item.assignedTo,
        status: ACTIVITY_STATUS.COMPLETED,
        dueDate: item.dueDate || null,
        notes: item.notes,
        summary: item.summary,
        additionalData,
      })
      // Also update parent status to Completed
      try {
        await ActivityService.updateActivityStatus(item.id, { moduleId, recordId, status: ACTIVITY_STATUS.COMPLETED })
      } catch { }
      showSuccessNotification({ title: 'Marked as done', description: 'To-Do saved as a new activity' })
      await load()
    } catch (e: any) {
      const message = e?.response?.data?.message || e?.message || 'Failed to mark as done'
      showErrorNotification({ title: 'Action failed', description: message })
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleDeleteActivity = async (item: ActivityResponse) => {
    try {
      setActionLoadingId(item.id)
      await ActivityService.deleteActivity(item.id)
      showSuccessNotification({ title: 'Deleted', description: 'Activity deleted' })
      await load()
    } catch (e: any) {
      const message = e?.response?.data?.message || e?.message || 'Failed to delete activity'
      showErrorNotification({ title: 'Delete failed', description: message })
    } finally {
      setActionLoadingId(null)
    }
  }

  const parseAdditional = (additionalData?: string): any => {
    if (!additionalData) return {}
    try {
      return JSON.parse(additionalData)
    } catch {
      return {}
    }
  }

  const getActivityVisuals = (name?: string) => {
    switch ((name || '').toLowerCase()) {
      case 'approval':
        return { icon: CheckCircle, accentClass: 'border-l-4 border-orange-400', iconClass: 'text-orange-500' }
      case 'todo':
      default:
        return { icon: CheckSquare, accentClass: 'border-l-4 border-blue-400', iconClass: 'text-blue-600' }
    }
  }

  // Using date-fns: only "Due in N days" or "Overdue by N days" (no Today)
  const getDueLabel = (due?: string) => {
    if (!due) return { label: '', className: '' }
    let date: Date
    try { date = parseISO(due) } catch { return { label: '', className: '' } }
    if (isNaN(date.getTime())) return { label: '', className: '' }
    const days = differenceInCalendarDays(date, new Date())
    if (days > 0) return { label: `Due in ${days} day${days === 1 ? '' : 's'}:`, className: 'text-green-600' }
    if (days < 0) { const o = Math.abs(days); return { label: `Overdue by ${o} day${o === 1 ? '' : 's'}:`, className: 'text-red-600' } }
    return { label: '', className: '' }
  }

  // Use backend-provided activityName directly for the menu label

  const renderStatus = (status?: string) => {
    switch (status) {
      case ACTIVITY_STATUS.COMPLETED:
        return <span className="text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded">Completed</span>
      case ACTIVITY_STATUS.IN_PROGRESS:
        return <span className="text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">In progress</span>
      case ACTIVITY_STATUS.CANCELLED:
        return <span className="text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">Cancelled</span>
      default:
        return <span className="text-gray-600 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded">Pending</span>
    }
  }

  const isApprovalActionAllowed = (item: ActivityResponse): boolean => {
    if (!item) return false
    
    // Check if it's an approval-type activity (more flexible)
    const activityName = (item.activityName || '').toLowerCase()
    const isApprovalType = activityName === 'approval' || 
                          activityName === 'approve' || 
                          activityName === 'approval required' ||
                          activityName.includes('approval')
    
    if (!isApprovalType) return false
    
    // Don't allow actions on completed or cancelled activities
    if (item.status === ACTIVITY_STATUS.COMPLETED || item.status === ACTIVITY_STATUS.CANCELLED) return false
    
    // Check user assignment
    const currentUsername = tokenManager.getUsername()
    const add = parseAdditional(item.additionalData)
    const assignedName = (add.assignedName || '').trim().toLowerCase()
    
    // If no assignment specified, allow any authenticated user to act
    if (!assignedName || !item.assignedTo) {
      return tokenManager.isAuthenticated()
    }
    
    // If no current user, don't allow (unless no assignment specified)
    if (!currentUsername) return false
    
    // Check if current user is assigned (case-insensitive)
    const currentUserLower = currentUsername.trim().toLowerCase()
    return assignedName === currentUserLower || assignedName.includes(currentUserLower)
  }

  const handleApprovalAction = async (item: ActivityResponse, action: 'approve' | 'reject') => {
    const newStatus = action === 'approve' ? ACTIVITY_STATUS.COMPLETED : ACTIVITY_STATUS.CANCELLED
    try {
      setActionLoadingId(item.id)
      const add = parseAdditional(item.additionalData)
      const additionalData = JSON.stringify({ ...add, prevId: item.id, action })
      await ActivityService.addOrUpdateActivity({
        moduleId,
        recordId,
        activityName: item.activityName,
        parentId: item.id,
        assignedTo: item.assignedTo,
        status: newStatus,
        dueDate: item.dueDate || null,
        notes: item.notes,
        summary: item.summary,
        additionalData,
      })
      // Also update parent status to reflect the action
      try {
        await ActivityService.updateActivityStatus(item.id, { moduleId, recordId, status: newStatus })
      } catch { }
      showSuccessNotification({ title: action === 'approve' ? 'Approved' : 'Rejected', description: `Saved as a new activity` })
      await load()
    } catch (e: any) {
      const message = e?.response?.data?.message || e?.message || `Failed to ${action}`
      showErrorNotification({ title: 'Action failed', description: message })
    } finally {
      setActionLoadingId(null)
    }
  }

  // Group activities by activityName (menu name) and due date (day)
  const groupedActivities = React.useMemo(() => {
    const byName: Record<string, ActivityResponse[]> = {}
      ; (cached || []).forEach((it) => {
        const name = (it.activityName || 'Activity').trim()
        if (!byName[name]) byName[name] = []
        byName[name].push(it)
      })

    const groups = Object.entries(byName)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, items]) => {
        const byDate: Record<string, { label: string, items: ActivityResponse[] }> = {}
        items.forEach((it) => {
          let key = 'No date'
          let label = 'No date'
          const createdRaw: string | undefined = (it as any)?.createdDate
          let dateCandidate: Date | null = null
          if (createdRaw) {
            try {
              const parsed = parseISO(createdRaw)
              dateCandidate = isNaN(parsed.getTime()) ? null : parsed
            } catch {
              try {
                const d2 = new Date(createdRaw)
                dateCandidate = isNaN(d2.getTime()) ? null : d2
              } catch { }
            }
          }
          if (dateCandidate) {
            key = format(dateCandidate, 'yyyy-MM-dd')
            label = format(dateCandidate, 'MMM d, yyyy')
          }
          if (!byDate[key]) byDate[key] = { label, items: [] }
          byDate[key].items.push(it)
        })
        const dates = Object.entries(byDate)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([key, val]) => ({ key, label: val.label, items: val.items }))
        return { name, dates, count: items.length }
      })

    return groups
  }, [cached])

  // Map of activityId -> hasChild (derived from additionalData.prevId chains)
  const hasChildMap = React.useMemo(() => {
    const map: Record<number, boolean> = {}
      ; (cached || []).forEach((it) => {
        const add = parseAdditional(it.additionalData)
        const prevId = add?.prevId
        if (typeof prevId === 'number') {
          map[prevId] = true
        }
      })
    return map
  }, [cached])

  return (
    <div className={cn("flex-1 flex flex-col min-h-0", className)}>
      <div className="px-4 py-2 border-b flex items-center justify-between">
        <div className="flex items-center gap-1 p-0.5 rounded-[10px] bg-slate-100 border border-slate-200">
          {([
            { key: 'general', label: 'General Activity' },
            { key: 'logs', label: 'Activity Logs' },
            { key: 'maritime', label: 'Maritime Activity' },
          ] as const).map(tab => (
            <button
              key={tab.key}
              className={cn(
                "px-3 py-1.5 text-xs rounded-[8px] transition-colors",
                activeTab === tab.key
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-800 hover:bg-slate-200/60"
              )}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            aria-label="Refresh"
            title="Refresh"
            className="h-8 w-8 grid place-items-center rounded-[10px] ring-1 ring-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-800 hover:ring-gray-300 shadow-sm disabled:opacity-50 transition-colors"
            onClick={() => load()}
            disabled={isLoading}
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
          <button
            aria-label="Schedule Activity"
            title="Add Activity"
            className="h-8 w-8 grid place-items-center rounded-[10px] ring-1 ring-blue-200 text-blue-600 hover:bg-blue-50 hover:ring-blue-300 shadow-sm transition-colors"
            onClick={() => onAdd?.()}
          >
            <CalendarPlus className="w-4 h-4" />
          </button>
        </div>
      </div>
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-3 space-y-2">
          {activeTab === 'logs' ? (
            <AuditLogList 
              moduleId={moduleId.toString()} 
              recordId={recordId}
              className="border-0 p-0"
            />
          ) : activeTab === 'maritime' ? (
            <div className="text-sm text-gray-500 px-2 py-8 text-center">Maritime Activity coming soon</div>
          ) : (!cached || cached.length === 0) ? (
            <div className="text-sm text-gray-500 px-2 py-8 text-center">No activity yet</div>
          ) : (
            groupedActivities.map((group) => (
              <div key={group.name} className="space-y-2">
                <div className="rounded-[10px] border border-slate-200 bg-white shadow-sm overflow-hidden">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between px-3 py-2 text-[12px] font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
                    onClick={() => setOpenGroups((prev) => ({ ...prev, [group.name]: !prev[group.name] }))}
                  >
                    <span className="flex items-center gap-2">
                      <span className="uppercase">{group.name}</span>
                      <span className="text-slate-400">({group.count})</span>
                    </span>
                    <ChevronDown className={cn("w-4 h-4 text-slate-500 transition-transform", openGroups[group.name] ? "rotate-180" : "")} />
                  </button>
                  {(openGroups[group.name] ?? true) && (
                    <div className="p-2 space-y-2">
                      {group.dates.map((d) => (
                        <div key={`${group.name}-${d.key}`} className="space-y-2">
                          <div className="relative flex items-center gap-2 px-1 mt-1">
                            <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent" />
                            <span className="text-[10px] font-medium text-slate-500 bg-white px-2 rounded-full border border-slate-200">{d.label}</span>
                            <div className="flex-1 h-px bg-gradient-to-l from-slate-200 to-transparent" />
                          </div>
                          {d.items.map((a) => {
                            const visuals = getActivityVisuals(a.activityName)
                            const Icon = visuals.icon
                            const canAct = isApprovalActionAllowed(a)
                            const showTodoActions = isTodoActionAllowed(a)
                            const add = parseAdditional(a.additionalData)
                            const typeLabel = a.activityName && a.activityName.trim().length > 0 ? a.activityName : 'Activity'
                            const titleText = a.summary ? `${typeLabel} - ${a.summary}` : typeLabel
                            const dueInfo = getDueLabel(a.dueDate || undefined)
                            const isSameTypeCompleted = !!hasChildMap[a.id]
                            return (
                              <div key={a.id} className={cn("bg-white p-3 rounded-[10px] border shadow-sm hover:shadow-md transition-shadow", visuals.accentClass)}>
                                <div className="flex items-start justify-between">
                                  <div className="pr-3">
                                    <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                                      <span className="grid h-6 w-6 place-items-center rounded-full ring-1 ring-slate-200 bg-slate-50">
                                        <Icon className={cn("w-3.5 h-3.5", visuals.iconClass)} />
                                      </span>
                                      <span className="uppercase">{titleText}</span>
                                      {(a.status !== ACTIVITY_STATUS.COMPLETED && a.status !== ACTIVITY_STATUS.CANCELLED && dueInfo.label) && (
                                        <span className={cn(dueInfo.className)}>{dueInfo.label}</span>
                                      )}

                                    </div>
                                    {add.assignedName && (
                                      <div className="mt-2 flex items-center gap-2">
                                        <span className="text-[10px] uppercase tracking-wide text-slate-400">Assigned to</span>
                                        <span className="inline-flex items-center gap-2 rounded-[10px] border border-slate-200/80 bg-white/60 px-2 py-1 text-xs text-slate-700 shadow-sm backdrop-blur-sm">
                                          <span className="max-w-[180px] truncate font-medium uppercase">{add.assignedName}</span>
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-xs text-gray-500 text-right space-y-2">
                                    <div className="flex items-center justify-end gap-2">{renderStatus(a.status)}</div>
                                    {!isSameTypeCompleted && (
                                      <div className="flex items-center justify-end gap-2">
                                        {canAct && (
                                          <>
                                            <button
                                              aria-label="Approve"
                                              title="Approve"
                                              className="h-8 w-8 grid place-items-center rounded-[10px] ring-1 ring-green-200 text-green-600 hover:bg-green-50 hover:ring-green-300 shadow-sm transition-colors"
                                              onClick={() => handleApprovalAction(a, 'approve')}
                                              disabled={actionLoadingId === a.id}
                                            >
                                              <Check className="w-4 h-4" />
                                            </button>
                                            <button
                                              aria-label="Reject"
                                              title="Reject"
                                              className="h-8 w-8 grid place-items-center rounded-[10px] ring-1 ring-red-200 text-red-600 hover:bg-red-50 hover:ring-red-300 shadow-sm transition-colors"
                                              onClick={() => handleApprovalAction(a, 'reject')}
                                              disabled={actionLoadingId === a.id}
                                            >
                                              <X className="w-4 h-4" />
                                            </button>
                                          </>
                                        )}
                                        {showTodoActions && (
                                          <>
                                            <button
                                              aria-label="Mark Done"
                                              title="Mark Done"
                                              className="h-8 w-8 grid place-items-center rounded-[10px] ring-1 ring-green-200 text-green-600 hover:bg-green-50 hover:ring-green-300 shadow-sm transition-colors"
                                              onClick={() => handleMarkTodoDone(a)}
                                              disabled={actionLoadingId === a.id}
                                            >
                                              <Check className="w-4 h-4" />
                                            </button>
                                          </>
                                        )}
                                        {(a.status !== ACTIVITY_STATUS.COMPLETED && a.status !== ACTIVITY_STATUS.CANCELLED) && (
                                          <>
                                            {(canAct || showTodoActions) && (
                                              <span className="h-6 w-px bg-gray-200 mx-1" />
                                            )}
                                            <DropdownMenu>
                                              <DropdownMenuTrigger asChild>
                                                <button
                                                  aria-label="More actions"
                                                  title="More actions"
                                                  className="h-8 w-8 grid place-items-center rounded-[10px] ring-1 ring-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-800 hover:ring-gray-300 shadow-sm transition-colors"
                                                  onClick={(e) => e.stopPropagation()}
                                                >
                                                  <EllipsisVertical className="w-4 h-4" />
                                                </button>
                                              </DropdownMenuTrigger>
                                              <DropdownMenuContent align="end" className="w-[160px]">
                                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setEditing(a); openEdit() }}>
                                                  Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={(e) => { e.stopPropagation(); handleDeleteActivity(a) }}>
                                                  Delete
                                                </DropdownMenuItem>
                                              </DropdownMenuContent>
                                            </DropdownMenu>
                                          </>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
      <ScheduleActivity
        {...dialogProps}
        moduleId={moduleId}
        recordId={recordId}
        initialActivity={editing}
        mode={editing ? 'edit' : 'add'}
        onOpenChange={(o) => { if (!o) { setEditing(null); dialogProps.onOpenChange?.(o) } else { dialogProps.onOpenChange?.(o) } }}
      />
    </div>
  )
}

export default ActivityList


