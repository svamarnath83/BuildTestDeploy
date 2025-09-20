"use client"

import * as React from "react"
import { cn } from "@commercialapp/ui"
import { ScheduleActivity, useScheduleActivity } from "./scheduleactivity"
import ActivityPanelHeader from "./ActivityPanelHeader"
import ActivityList from "./ActivityList"

export interface ActivityPanelProps {
	moduleId: number
	recordId: number
	className?: string
	placement?: 'right' | 'bottom'
	collapsible?: boolean
	initialCollapsed?: boolean
	title?: string
  overlay?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ActivityPanel({ moduleId, recordId, className, placement = 'right', collapsible = false, initialCollapsed = false, title = 'Activity', overlay = false, open = true, onOpenChange }: ActivityPanelProps) {
	const [collapsed, setCollapsed] = React.useState(initialCollapsed)
  const { openDialog, dialogProps } = useScheduleActivity()

	const containerClasses = placement === 'right'
		? "w-96 border-l bg-white rounded-l-[10px] flex flex-col"
		: "w-full border-t bg-white rounded-t-[10px] flex flex-col"

	if (overlay) {
		if (!open) return null
		return (
			<div className={cn("fixed inset-0 z-50", className)}>
				<div className="absolute inset-0 bg-black/30" onClick={() => onOpenChange?.(false)} />
				<div className="absolute right-0 top-0 h-full w-1/2 min-w-[520px] max-w-[960px] bg-white shadow-xl flex flex-col">
					<ActivityPanelHeader
						title={title}
						placement={placement}
						collapsible={collapsible}
						collapsed={collapsed}
						onToggleCollapse={() => setCollapsed((c) => !c)}
						overlay
						onClose={() => onOpenChange?.(false)}
					/>
					{!collapsed && (
						<ActivityList
							moduleId={moduleId}
							recordId={recordId}
							onAdd={() => openDialog()}
						/>
					)}
					<ScheduleActivity {...dialogProps} moduleId={moduleId} recordId={recordId} />
				</div>
			</div>
		)
	}

	return (
		<div className={cn(containerClasses, className)}>
			<ActivityPanelHeader
				title={title}
				placement={placement}
				collapsible={collapsible}
				collapsed={collapsed}
				onToggleCollapse={() => setCollapsed((c) => !c)}
			/>
			{!collapsed && (
				<ActivityList
					moduleId={moduleId}
					recordId={recordId}
					onAdd={() => openDialog()}
				/>
			)}
			<ScheduleActivity {...dialogProps} moduleId={moduleId} recordId={recordId} />
		</div>
	)
}

export default ActivityPanel


