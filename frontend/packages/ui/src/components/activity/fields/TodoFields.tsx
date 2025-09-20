import * as React from "react"
import { ActivityModel } from "../../../../libs/activity"
import { UserInfo } from "@commercialapp/ui"
import { Label } from "../../ui/label"
import { Input } from "../../ui/input"
import { Textarea } from "../../ui/textarea"
import { DatePicker } from "../../ui/date-picker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select"
import { parseISO, format } from "date-fns"

export interface ModeFieldsProps {
  activity: ActivityModel
  onChange: (field: keyof ActivityModel, value: any) => void
  assignees: UserInfo[]
}

export function TodoFields({ activity, onChange, assignees }: ModeFieldsProps) {
  const normalizedDueDateString = React.useMemo(() => {
    const raw = activity.dueDate
    if (!raw || typeof raw !== 'string' || raw.trim().length === 0) return null
    try {
      const d = parseISO(raw)
      if (isNaN(d.getTime())) return null
      return format(d, 'yyyy-MM-dd')
    } catch {
      return null
    }
  }, [activity.dueDate])
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="summary">Summary</Label>
        <Input
          id="summary"
          value={activity.summary || ''}
          onChange={(e) => onChange('summary', e.target.value)}
          placeholder="Enter activity summary"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={activity.notes || ''}
          onChange={(e) => onChange('notes', e.target.value)}
          placeholder="Enter activity description"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dueDate">Due Date</Label>
        <DatePicker
          valueString={normalizedDueDateString}
          valueFormat="yyyy-MM-dd"
          onChange={() => {}}
          onChangeString={(s) => onChange('dueDate', s)}
          placeholder="dd/mm/yyyy"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="assignedTo">Assigned To <span className="text-red-500">*</span></Label>
        <Select 
          value={activity.assignedTo ? String(activity.assignedTo) : ''}
          onValueChange={(value) => onChange('assignedTo', value ? Number(value) : undefined)}
        >
          <SelectTrigger id="assignedTo">
            <SelectValue placeholder="Select assignee" />
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

export default TodoFields


