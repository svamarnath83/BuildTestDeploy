"use client"

import * as React from "react"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog"
import { Button } from "./button"
import { cn } from "@commercialapp/ui"

export type AlertAction = 'save' | 'edit' | 'delete' | 'custom'

export interface DynamicAlertBoxProps {
  action: AlertAction
  title?: string
  description?: string
  trigger?: React.ReactNode
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  disabled?: boolean
  loading?: boolean
  className?: string
  children?: React.ReactNode
}

const getDefaultContent = (action: AlertAction) => {
  switch (action) {
    case 'save':
      return {
        title: 'Save Changes',
        description: 'Are you sure you want to save these changes?',
        confirmText: 'Save',
        variant: 'default' as const,
      }
    case 'edit':
      return {
        title: 'Edit Item',
        description: 'Are you sure you want to edit this item?',
        confirmText: 'Edit',
        variant: 'default' as const,
      }
    case 'delete':
      return {
        title: 'Delete Item',
        description: 'Are you sure you want to delete this item? This action cannot be undone.',
        confirmText: 'Delete',
        variant: 'destructive' as const,
      }
    default:
      return {
        title: 'Confirm Action',
        description: 'Are you sure you want to proceed?',
        confirmText: 'Confirm',
        variant: 'default' as const,
      }
  }
}

export function DynamicAlertBox({
  action,
  title,
  description,
  trigger,
  onConfirm,
  onCancel,
  confirmText,
  cancelText = 'Cancel',
  variant,
  size = 'default',
  disabled = false,
  loading = false,
  className,
  children,
}: DynamicAlertBoxProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  
  const defaultContent = getDefaultContent(action)
  const finalTitle = title || defaultContent.title
  const finalDescription = description || defaultContent.description
  const finalConfirmText = confirmText || defaultContent.confirmText
  const finalVariant = variant || defaultContent.variant

  const handleConfirm = async () => {
    if (loading || isLoading) return
    
    setIsLoading(true)
    try {
      await onConfirm()
      setIsOpen(false)
    } catch (error) {
      console.error('Action failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
    setIsOpen(false)
  }

  const defaultTrigger = (
    <Button
      variant={finalVariant}
      size={size}
      disabled={disabled || loading || isLoading}
      className={cn(className)}
    >
      {loading || isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {loading || isLoading ? 'Processing...' : finalConfirmText}
        </>
      ) : (
        finalConfirmText
      )}
    </Button>
  )

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        {trigger || defaultTrigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{finalTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            {finalDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {children && (
          <div className="py-4">
            {children}
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading || isLoading}
            className={cn(
              finalVariant === 'destructive' && "bg-destructive text-destructive-foreground hover:bg-destructive/90"
            )}
          >
            {loading || isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </>
            ) : (
              finalConfirmText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// Convenience components for common actions
export function SaveAlertBox(props: Omit<DynamicAlertBoxProps, 'action'>) {
  return <DynamicAlertBox {...props} action="save" />
}

export function EditAlertBox(props: Omit<DynamicAlertBoxProps, 'action'>) {
  return <DynamicAlertBox {...props} action="edit" />
}

export function DeleteAlertBox(props: Omit<DynamicAlertBoxProps, 'action'>) {
  return <DynamicAlertBox {...props} action="delete" />
} 