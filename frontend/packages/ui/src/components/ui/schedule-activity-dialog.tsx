"use client"

import * as React from "react"
import { X, User } from "lucide-react"
import { format } from "date-fns"

import { cn } from "@commercialapp/ui"
import { Button } from "./button"
import { Input } from "./input"
import { Textarea } from "./textarea"
import { Label } from "./label"
import { DatePicker } from "./date-picker"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog"
import { ActivityDropdown, ActivityType } from "./activity-dropdown"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"

// Field configuration interfaces
export interface FieldOption {
  id: string
  name: string
}

export interface FieldDefinition {
  name: string
  label: string
  type: 'text' | 'textarea' | 'datetime' | 'dropdown'
  required?: boolean
  placeholder?: string
  options?: FieldOption[]
}

export interface ActivityConfig {
  fields: FieldDefinition[]
}

// Activity configurations - JSON structure
const activityConfigs: Record<string, ActivityConfig> = {
  todo: {
    fields: [
      {
        name: 'assignedTo',
        label: 'Assigned to',
        type: 'dropdown',
        required: true,
        placeholder: 'Select assignee',
        options: [
          { id: '1', name: 'Mitchell Admin' },
          { id: '2', name: 'John Doe' },
          { id: '3', name: 'Jane Smith' },
          { id: '4', name: 'Mike Johnson' }
        ]
      },
      {
        name: 'notes',
        label: 'Log a note...',
        type: 'textarea',
        required: false,
        placeholder: 'Add any additional notes or details...'
      },
      {
        name: 'dueDate',
        label: 'Due Date',
        type: 'datetime',
        required: true,
        placeholder: 'Select date'
      }
    ]
  },
  email: {
    fields: [
      {
        name: 'assignedTo',
        label: 'Assigned to',
        type: 'dropdown',
        required: true,
        placeholder: 'Select assignee',
        options: [
          { id: '1', name: 'Mitchell Admin' },
          { id: '2', name: 'John Doe' },
          { id: '3', name: 'Jane Smith' },
          { id: '4', name: 'Mike Johnson' },
          { id: '5', name: 'Sarah Wilson' }
        ]
      },
      {
        name: 'notes',
        label: 'Log a note...',
        type: 'textarea',
        required: false,
        placeholder: 'Add any additional notes or details...'
      },
      {
        name: 'dueDate',
        label: 'Due Date',
        type: 'datetime',
        required: true,
        placeholder: 'Select date'
      },
      {
        name: 'summary',
        label: 'Summary',
        type: 'text',
        required: true,
        placeholder: 'Enter summary'
      }
    ]
  }
}

export interface ScheduleActivityData {
  activityType: ActivityType
  [key: string]: any // Dynamic fields
}

export interface ScheduleActivityDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSave?: (data: ScheduleActivityData) => void
  onMarkDone?: (data: ScheduleActivityData) => void
  onDiscard?: () => void
  defaultValues?: Partial<ScheduleActivityData>
  trigger?: React.ReactNode
  className?: string
}

export function ScheduleActivityDialog({
  open,
  onOpenChange,
  onSave,
  onMarkDone,
  onDiscard,
  defaultValues,
  trigger,
  className,
}: ScheduleActivityDialogProps) {
  const [activityType, setActivityType] = React.useState<ActivityType | undefined>(
    defaultValues?.activityType
  )
  
  // Dynamic field values state
  const [fieldValues, setFieldValues] = React.useState<Record<string, any>>({})
  
  // Get current activity configuration
  const currentConfig = activityType ? activityConfigs[activityType] : null

  // Initialize field values when activity type changes
  React.useEffect(() => {
    if (currentConfig) {
      const initialValues: Record<string, any> = {}
      currentConfig.fields.forEach(field => {
        initialValues[field.name] = fieldValues[field.name] || (field.type === 'datetime' ? undefined : '')
      })
      setFieldValues(initialValues)
    } else {
      setFieldValues({})
    }
  }, [activityType, currentConfig])

  // Initialize with default values
  React.useEffect(() => {
    if (defaultValues && currentConfig) {
      const initialValues: Record<string, any> = {}
      currentConfig.fields.forEach(field => {
        initialValues[field.name] = defaultValues[field.name] || (field.type === 'datetime' ? undefined : '')
      })
      setFieldValues(initialValues)
    }
  }, [defaultValues, currentConfig])

  // Handle field value changes
  const handleFieldChange = (fieldName: string, value: any) => {
    setFieldValues(prev => ({
      ...prev,
      [fieldName]: value
    }))
  }

  // Dynamic validation based on current config
  const validateForm = () => {
    if (!activityType || !currentConfig) return false
    
    return currentConfig.fields.every(field => {
      if (field.required) {
        const value = fieldValues[field.name]
        return value !== undefined && value !== null && value !== ''
      }
      return true
    })
  }

  const handleSave = () => {
    if (!validateForm()) {
      return // Validation failed
    }

    const data: ScheduleActivityData = {
      activityType: activityType!,
      ...fieldValues
    }

    onSave?.(data)
    handleClose()
  }

  const handleMarkDone = () => {
    if (!validateForm()) {
      return // Validation failed
    }

    const data: ScheduleActivityData = {
      activityType: activityType!,
      ...fieldValues
    }

    onMarkDone?.(data)
    handleClose()
  }

  const handleDiscard = () => {
    onDiscard?.()
    handleClose()
  }

  const handleClose = () => {
    onOpenChange?.(false)
  }

  const resetForm = () => {
    setActivityType(defaultValues?.activityType)
    if (defaultValues && currentConfig) {
      const initialValues: Record<string, any> = {}
      currentConfig.fields.forEach(field => {
        initialValues[field.name] = defaultValues[field.name] || (field.type === 'datetime' ? undefined : '')
      })
      setFieldValues(initialValues)
    } else {
      setFieldValues({})
    }
  }

  React.useEffect(() => {
    if (open) {
      resetForm()
    }
  }, [open, defaultValues])

  const isFormValid = validateForm()

  // Render field based on type
  const renderField = (field: FieldDefinition) => {
    const value = fieldValues[field.name]

    switch (field.type) {
      case 'text':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>{field.label}</Label>
            <Input
              id={field.name}
              value={value || ''}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              className="w-full"
            />
          </div>
        )

      case 'textarea':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>{field.label}</Label>
            <Textarea
              id={field.name}
              value={value || ''}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              className="min-h-[80px] resize-none"
            />
          </div>
        )

      case 'datetime':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>{field.label}</Label>
            <DatePicker
              value={value}
              onChange={(date) => handleFieldChange(field.name, date)}
              className="w-full"
              placeholder={field.placeholder}
            />
          </div>
        )

      case 'dropdown':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>{field.label}</Label>
            <Select 
              value={value || ''} 
              onValueChange={(selectedValue) => handleFieldChange(field.name, selectedValue)}
            >
              <SelectTrigger className="w-full">
                <div className="flex items-center gap-2">
                  {field.name === 'assignedTo' && <User className="h-4 w-4 text-muted-foreground" />}
                  <SelectValue placeholder={field.placeholder} />
                </div>
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.id} value={option.name}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent className={cn("max-w-md p-0", className)}>
        <AlertDialogHeader className="flex flex-row items-center justify-between p-6 pb-4">
          <AlertDialogTitle className="text-lg font-semibold">
            Schedule Activity
          </AlertDialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-6 w-6 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </AlertDialogHeader>

        <div className="px-6 pb-6 space-y-4">
          {/* Activity Type Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="activity-type">Activity Type</Label>
            <ActivityDropdown
              selectedActivity={activityType}
              onActivitySelect={setActivityType}
              placeholder="Select Activity Type"
              className="w-full"
            />
          </div>

          {/* Dynamic Fields Based on Activity Configuration */}
          {currentConfig ? (
            currentConfig.fields.map(field => renderField(field))
          ) : (
            activityType && (
              <div className="text-center py-4 text-muted-foreground">
                No configuration found for {activityType} activity type
              </div>
            )
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSave}
              disabled={!isFormValid}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Save
            </Button>
            <Button
              onClick={handleMarkDone}
              disabled={!isFormValid}
              variant="outline"
            >
              Mark Done
            </Button>
            <Button
              onClick={handleDiscard}
              variant="outline"
            >
              Discard
            </Button>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// Convenience hook for managing the dialog state
export function useScheduleActivityDialog(
  onSave?: (data: ScheduleActivityData) => void,
  onMarkDone?: (data: ScheduleActivityData) => void,
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

