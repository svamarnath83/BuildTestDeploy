"use client"

import toast, { ToastOptions } from 'react-hot-toast'

export interface NotificationAlertProps {
  title?: string
  description?: string
  duration?: number
}

// Success notification (green)
export const showSuccessNotification = ({
  title = "Success",
  description = "Operation completed successfully",
  duration = 4000,
}: NotificationAlertProps = {}) => {
  const message = title && description ? `${title}: ${description}` : title || description || "Success"
  
  toast.success(message, {
    duration,
    position: 'bottom-right',
    style: {
      background: '#f0fdf4',
      color: '#166534',
      border: '1px solid #bbf7d0',
      fontSize: '14px',
      padding: '12px 16px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
  })
}

// Error notification (red)
export const showErrorNotification = ({
  title = "Error",
  description = "An error occurred",
  duration = 4000,
}: NotificationAlertProps = {}) => {
  const message = title && description ? `${title}: ${description}` : title || description || "Error"
  
  toast.error(message, {
    duration,
    position: 'bottom-right',
    style: {
      background: '#fef2f2',
      color: '#dc2626',
      border: '1px solid #fecaca',
      fontSize: '14px',
      padding: '12px 16px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
  })
}

// Warning notification (yellow)
export const showWarningNotification = ({
  title = "Warning",
  description = "Please check your input",
  duration = 4000,
}: NotificationAlertProps = {}) => {
  const message = title && description ? `${title}: ${description}` : title || description || "Warning"
  
  toast(message, {
    duration,
    position: 'bottom-right',
    icon: '⚠️',
    style: {
      background: '#fffbeb',
      color: '#d97706',
      border: '1px solid #fed7aa',
      fontSize: '14px',
      padding: '12px 16px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
  })
}

// Info notification (blue)
export const showInfoNotification = ({
  title = "Information",
  description = "Here's some information for you",
  duration = 4000,
}: NotificationAlertProps = {}) => {
  const message = title && description ? `${title}: ${description}` : title || description || "Information"
  
  toast(message, {
    duration,
    position: 'bottom-right',
    icon: 'ℹ️',
    style: {
      background: '#eff6ff',
      color: '#2563eb',
      border: '1px solid #bfdbfe',
      fontSize: '14px',
      padding: '12px 16px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
  })
}

// Convenience functions for common operations
export const showCreatedNotification = (itemName: string = "Item") => {
  showSuccessNotification({
    title: "Created Successfully",
    description: `${itemName} has been created successfully.`,
  })
}

export const showUpdatedNotification = (itemName: string = "Item") => {
  showSuccessNotification({
    title: "Updated Successfully",
    description: `${itemName} has been updated successfully.`,
  })
}

export const showDeletedNotification = (itemName: string = "Item") => {
  showSuccessNotification({
    title: "Deleted Successfully",
    description: `${itemName} has been deleted successfully.`,
  })
}

export const showSaveNotification = (itemName: string = "Item") => {
  showSuccessNotification({
    title: "Saved Successfully",
    description: `${itemName} has been saved successfully.`,
  })
}

// Hook for using notifications in components
export const useNotificationAlert = () => {
  return {
    toast,
    success: showSuccessNotification,
    error: showErrorNotification,
    warning: showWarningNotification,
    info: showInfoNotification,
    created: showCreatedNotification,
    updated: showUpdatedNotification,
    deleted: showDeletedNotification,
    saved: showSaveNotification,
  }
} 