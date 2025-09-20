"use client"

import * as React from "react"
import { Clock, ChevronDown, X } from "lucide-react"
import { cn } from "@commercialapp/ui"

export interface ActivityPanelHeaderProps {
  title?: string
  placement?: 'right' | 'bottom'
  collapsible?: boolean
  collapsed?: boolean
  onToggleCollapse?: () => void
  overlay?: boolean
  onClose?: () => void
  className?: string
}

export function ActivityPanelHeader({
  title = 'Activity',
  placement = 'right',
  collapsible = false,
  collapsed = false,
  onToggleCollapse,
  overlay = false,
  onClose,
  className
}: ActivityPanelHeaderProps) {
  return (
    <div
      className={cn(
        "px-4 py-3 border-b flex items-center justify-between",
        placement === 'bottom' && collapsible ? 'cursor-pointer' : '',
        className
      )}
      onClick={() => {
        if (placement === 'bottom' && collapsible) onToggleCollapse?.()
      }}
    >
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-blue-600" />
        <div className="text-sm font-medium">{title}</div>
      </div>
      <div className="flex items-center gap-2">
        {placement === 'bottom' && collapsible && (
          <ChevronDown className={cn("w-4 h-4 text-gray-600 transition-transform", collapsed ? "rotate-180" : "rotate-0")} />
        )}
        {overlay && (
          <button onClick={onClose} className="h-6 w-6 grid place-items-center rounded-full text-gray-500 hover:text-gray-700">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export default ActivityPanelHeader


