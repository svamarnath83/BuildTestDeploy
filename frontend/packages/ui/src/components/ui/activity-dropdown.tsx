"use client"

import * as React from "react"
import { 
  CheckSquare, 
  Mail, 
  Phone, 
  Users, 
  FileText, 
  PenTool, 
  CheckCircle,
  ChevronDown 
} from "lucide-react"

import { cn } from "@commercialapp/ui"
import { Button } from "./button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu"

export type ActivityType = 
  | "todo" 
  | "email" 
  | "call" 
  | "meeting" 
  | "document" 
  | "signature" 
  | "grant-approval"

export interface Activity {
  type: ActivityType
  label: string
  icon: React.ComponentType<{ className?: string }>
}

export interface ActivityDropdownProps {
  onActivitySelect?: (activityType: ActivityType) => void
  selectedActivity?: ActivityType
  className?: string
  disabled?: boolean
  placeholder?: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
}

const activities: Activity[] = [
  {
    type: "todo",
    label: "To-Do",
    icon: CheckSquare,
  },
  {
    type: "email",
    label: "Email",
    icon: Mail,
  },
  {
    type: "call",
    label: "Call",
    icon: Phone,
  },
  {
    type: "meeting",
    label: "Meeting",
    icon: Users,
  },
  {
    type: "document",
    label: "Document",
    icon: FileText,
  },
  {
    type: "signature",
    label: "Signature",
    icon: PenTool,
  },
  {
    type: "grant-approval",
    label: "Grant Approval",
    icon: CheckCircle,
  },
]

export function ActivityDropdown({
  onActivitySelect,
  selectedActivity,
  className,
  disabled = false,
  placeholder = "Select Activity",
  variant = "outline",
  size = "default",
}: ActivityDropdownProps) {
  const selectedActivityData = activities.find(
    (activity) => activity.type === selectedActivity
  )

  const handleActivitySelect = (activityType: ActivityType) => {
    onActivitySelect?.(activityType)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          disabled={disabled}
          className={cn(
            "justify-between min-w-[180px]",
            className
          )}
        >
          <div className="flex items-center gap-2">
            {selectedActivityData ? (
              <>
                <selectedActivityData.icon className="h-4 w-4" />
                <span>{selectedActivityData.label}</span>
              </>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]" align="start">
        {activities.map((activity) => (
          <DropdownMenuItem
            key={activity.type}
            onClick={() => handleActivitySelect(activity.type)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <activity.icon className="h-4 w-4" />
            <span>{activity.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { activities }

