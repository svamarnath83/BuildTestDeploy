import * as React from "react"
import { ActivityModel } from "../../../../libs/activity"
import { UserInfo } from "@commercialapp/ui"
import { Label } from "../../ui/label"
import { Input } from "../../ui/input"
import { Textarea } from "../../ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select"

export interface ModeFieldsProps {
  activity: ActivityModel
  onChange: (field: keyof ActivityModel, value: any) => void
  assignees: UserInfo[]
}

export function ApprovalFields({ activity, onChange, assignees }: ModeFieldsProps) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="summary">Summary</Label>
        <Input
          id="summary"
          value={activity.summary || ''}
          onChange={(e) => onChange('summary', e.target.value)}
          placeholder="Enter approval summary"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={activity.notes || ''}
          onChange={(e) => onChange('notes', e.target.value)}
          placeholder="Add context for approval"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="assignedTo">Approver <span className="text-red-500">*</span></Label>
        <Select 
          value={activity.assignedTo ? String(activity.assignedTo) : ''}
          onValueChange={(value) => onChange('assignedTo', value ? Number(value) : undefined)}
        >
          <SelectTrigger id="assignedTo">
            <SelectValue placeholder="Select approver" />
          </SelectTrigger>
          <SelectContent>
            {Array.isArray(assignees) && assignees.length > 0 ? (
              assignees.map((opt) => (
                <SelectItem key={opt.Id} value={String(opt.Id)}>
                  {opt.Name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-users" disabled>
                No users available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default ApprovalFields


