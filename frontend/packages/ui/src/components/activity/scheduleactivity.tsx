"use client"

import * as React from "react"
import { X, Check, AlertCircle, Mail, Paperclip, MessageSquare, Bell } from "lucide-react"

import { cn, UserInfo } from "@commercialapp/ui"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { 
  showSuccessNotification, 
  showErrorNotification 
} from "../ui/react-hot-toast-notifications"

import { 
  ActivityService,
  ActivityResponse,
  ActivityModel,
  ACTIVITY_STATUS
} from "../../../libs/activity"
import { useActivityStore } from "../../../libs/activity/store"
import { authService } from "../../../libs/auth/services"
import { TodoFields } from "./fields/TodoFields"
import { ApprovalFields } from "./fields/ApprovalFields"

export interface ScheduleActivityProps {
  // Required props - only these are exposed
  moduleId: number
  recordId: number
  
  // Optional UI props
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSave?: (data: ActivityResponse) => void
  onMarkDone?: (data: ActivityResponse) => void
  onDiscard?: () => void
  trigger?: React.ReactNode
  className?: string
  initialActivity?: ActivityResponse | null
  mode?: 'add' | 'edit'
}

export function ScheduleActivity({
  moduleId,
  recordId,
  open,
  onOpenChange,
  onSave,
  onMarkDone,
  onDiscard,
  trigger,
  className,
  initialActivity = null,
  mode = 'add'
}: ScheduleActivityProps) {
  // Visual tab category (does not affect activity type selection)
  const [selectedCategory, setSelectedCategory] = React.useState<'generic' | 'maritime'>('generic')
  
  // Assignee options state
  const [assigneeOptions, setAssigneeOptions] = React.useState<UserInfo[]>([])
 
  const [activity, setActivity] = React.useState<ActivityModel>({
    moduleId,
    recordId,
    activityName: 'todo',
    summary: '',
    notes: '',
    dueDate: '',
    assignedTo: undefined
  })

  const createDefaultActivity = React.useCallback((): ActivityModel => ({
    moduleId,
    recordId,
    activityName: 'todo',
    summary: '',
    notes: '',
    dueDate: '',
    assignedTo: undefined
  }), [moduleId, recordId])
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Initialize activity and fetch users when dialog opens
  React.useEffect(() => {
    if (!open) return
    if (mode === 'edit' && initialActivity) {
      setActivity({
        id: initialActivity.id,
        moduleId,
        recordId,
        activityName: initialActivity.activityName,
        assignedTo: initialActivity.assignedTo,
        status: initialActivity.status,
        dueDate: initialActivity.dueDate || null,
        notes: initialActivity.notes || '',
        summary: initialActivity.summary || '',
        additionalData: initialActivity.additionalData
      })
    } else {
      setActivity(createDefaultActivity())
    }
    ;(async () => {
      try {
        const response = await authService.getUsers()
        const users = response.data as UserInfo[]
        setAssigneeOptions(users || [])
      } catch {
        setAssigneeOptions([])
      }
    })()
  }, [open, moduleId, recordId, createDefaultActivity, mode, initialActivity])

  //

  // Handle activity field changes
  const handleActivityFieldChange = (fieldName: keyof ActivityModel, value: any) => {
    setActivity(prev => ({
      ...prev,
      [fieldName]: value
    }))
  }

  // Dynamic validation
  // Static validation - same for both todo and approval for now
  // TODO: In future, customize validation based on selectedActivityType
  const isFormValid = React.useMemo(() => {
    return Boolean(activity.summary && activity.summary.trim() !== '') && Boolean(activity.assignedTo)
  }, [activity.summary, activity.assignedTo])

  // Handle save
  const handleSave = async () => {
    if (!isFormValid) {
      showErrorNotification({
        title: "Validation Error",
        description: "Please fill in all required fields."
      })
      return
    }

    setIsSubmitting(true)
    try {
      const numericId = activity.assignedTo
      const assigneeName = numericId
        ? assigneeOptions.find(opt => Number(opt.Id) === numericId)?.Name
        : undefined

      // Determine parent linkage: for new items prevId = 0; for edits, preserve existing prevId if any
      let existingPrevId = 0
      if (mode === 'edit' && initialActivity?.additionalData) {
        try {
          const parsed = JSON.parse(initialActivity.additionalData as string)
          if (parsed && typeof parsed.prevId === 'number') {
            existingPrevId = parsed.prevId
          }
        } catch {}
      }

      const additionalDataObj = {
        moduleId: activity.moduleId,
        recordId: activity.recordId,
        activityName: activity.activityName,
        assignedTo: numericId,
        status: ACTIVITY_STATUS.PENDING,
        dueDate: activity.dueDate || null,
        notes: activity.notes,
        summary: activity.summary,
        assignedName: assigneeName,
        prevId: mode === 'edit' ? existingPrevId : 0,
      }
      const additionalData = JSON.stringify(additionalDataObj)

      const activityData: ActivityModel= {
        id: mode === 'edit' && initialActivity ? initialActivity.id : undefined,
        moduleId: activity.moduleId,
        recordId: activity.recordId,
        activityName: activity.activityName,
        parentId: mode === 'edit' ? initialActivity?.parentId : undefined,
        assignedTo: numericId,
        status: initialActivity?.status || ACTIVITY_STATUS.PENDING,
        dueDate: activity.dueDate || null,
        notes: activity.notes,
        summary: activity.summary,
        additionalData
      }

      const response = await ActivityService.addOrUpdateActivity(activityData)
      
      showSuccessNotification({
        title: "Activity Scheduled",
        description: `${activity.activityName} activity has been scheduled successfully.`
      })

      onSave?.(response.data as ActivityResponse)
      // Refresh activity cache for this module/record
      try {
        const list = await ActivityService.getActivitiesByRecord(moduleId, recordId)
        useActivityStore.getState().setItems({ moduleId, recordId }, list.data || [])
      } catch {}
      handleClose()
    } catch (error: any) {
      console.error('Error creating activity:', error)
      showErrorNotification({
        title: "Creation Failed",
        description: error?.response?.data?.message || error?.message || "Failed to create activity. Please try again."
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle discard
  const handleDiscard = () => {
    setIsSubmitting(false)
    onDiscard?.()
    setActivity(createDefaultActivity())
    onOpenChange?.(false)
  }

  // Handle close
  const handleClose = () => {
    onOpenChange?.(false)
    setActivity(createDefaultActivity())
  }

  //

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={cn("w-[840px] sm:max-w-[840px] p-0 rounded-[10px] overflow-hidden", className)}
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
      >
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between p-6 pb-4">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            {mode === 'edit' ? 'Edit Activity' : 'Add New Activity'}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-6 w-6 rounded-full text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="flex">
          {/* Left Sidebar - Activity Types */}
          <div className="w-72 bg-white p-6 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Select Activity Type</h3>
              
              {/* Tab Navigation */}
              <div className="flex space-x-8 border-b border-gray-200 mb-6">
                <button
                  className={`pb-2 text-sm font-medium border-b-2 -mb-px ${
                    selectedCategory === 'generic' 
                      ? 'text-blue-600 border-blue-600' 
                      : 'text-gray-500 border-transparent'
                  }`}
                  onClick={() => setSelectedCategory('generic')}
                >
                  Generic Activities
                </button>
                <button
                  className={`pb-2 text-sm font-medium border-b-2 -mb-px ${
                    selectedCategory === 'maritime' 
                      ? 'text-blue-600 border-blue-600' 
                      : 'text-gray-500 border-transparent'
                  }`}
                  onClick={() => setSelectedCategory('maritime')}
                >
                  Maritime Activities
                </button>
              </div>
            </div>

            {/* Activity Type List */}
            <div className="space-y-2">
              <div 
                className={`flex items-center p-3 rounded-lg cursor-pointer ${
                  activity.activityName === 'todo' 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setActivity(prev => ({ ...prev, activityName: 'todo' }))}
              >
                <div className="w-5 h-5 bg-blue-500 rounded-sm flex items-center justify-center mr-3">
                  <Check className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-sm text-gray-900">To-Do</span>
              </div>
              
              <div 
                className={`flex items-center p-3 rounded-lg cursor-pointer ${
                  activity.activityName === 'approval' 
                    ? 'bg-orange-50 border border-orange-200' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setActivity(prev => ({ ...prev, activityName: 'approval' }))}
              >
                <div className="w-5 h-5 bg-orange-500 rounded-sm flex items-center justify-center mr-3">
                  <AlertCircle className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-sm text-gray-900">Approval</span>
              </div>
              
              <div className="flex items-center p-3 rounded-lg opacity-60">
                <div className="w-5 h-5 bg-green-500 rounded-sm flex items-center justify-center mr-3">
                  <Mail className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-sm text-gray-700">Email</span>
              </div>
              
              <div className="flex items-center p-3 rounded-lg opacity-60">
                <div className="w-5 h-5 bg-purple-500 rounded-sm flex items-center justify-center mr-3">
                  <Paperclip className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-sm text-gray-700">Attachment</span>
              </div>
              
              <div className="flex items-center p-3 rounded-lg opacity-60">
                <div className="w-5 h-5 bg-blue-400 rounded-sm flex items-center justify-center mr-3">
                  <MessageSquare className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-sm text-gray-700">Comment</span>
              </div>
              
              <div className="flex items-center p-3 rounded-lg opacity-60">
                <div className="w-5 h-5 bg-yellow-500 rounded-sm flex items-center justify-center mr-3">
                  <Bell className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-sm text-gray-700">Notification</span>
              </div>
            </div>
          </div>

          {/* Right Content - Form Fields */}
          <div className="flex-1 p-6 bg-white border-l border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              {activity.activityName === 'todo' ? 'To-Do Details' : 'Approval Details'}
            </h2>

            {activity.activityName === 'todo' ? (
              <TodoFields activity={activity} onChange={handleActivityFieldChange as any} assignees={assigneeOptions} />
            ) : (
              <ApprovalFields activity={activity} onChange={handleActivityFieldChange as any} assignees={assigneeOptions} />
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-8">
              <Button
                onClick={handleDiscard}
                variant="outline"
                disabled={isSubmitting}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!isFormValid || isSubmitting}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8"
              >
                {isSubmitting ? 'Saving...' : 'Save Activity'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Convenience hook for managing the dialog state
export function useScheduleActivity(
  onSave?: (data: ActivityResponse) => void,
  onMarkDone?: (data: ActivityResponse) => void,
  onDiscard?: () => void
) {
  const [open, setOpen] = React.useState(false)

  const openDialog = () => setOpen(true)
  const closeDialog = () => setOpen(false)

  return {
    open,
    openDialog,
    closeDialog,
    dialogProps: {
      open,
      onOpenChange: setOpen,
      onSave,
      onMarkDone,
      onDiscard,
    },
  }
}

export default ScheduleActivity
