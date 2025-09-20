"use client"

import { format, parse } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Calendar, Input, valueText } from "@commercialapp/ui"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@commercialapp/ui"
import { cn } from "@commercialapp/ui"
import { useState } from "react"

type DatePickerProps = {
  id?: string
  name?: string
  value?: Date | null
  valueString?: string | null
  valueFormat?: string // default: 'yyyy-MM-dd'
  onChange: (date: Date | undefined) => void
  onChangeString?: (value?: string) => void
  placeholder?: string
  minDate?: Date
  maxDate?: Date
  disabled?: boolean
  className?: string
}

export function DatePicker({
  id,
  name,
  value,
  valueString,
  valueFormat,
  onChange,
  onChangeString,
  placeholder = "Pick a date",
  minDate = new Date("1900-01-01"),
  maxDate = new Date(),
  disabled = false,
  className
}: DatePickerProps) {
  const [open, setOpen] = useState(false)

  const handleDateSelect = (date: Date | undefined) => {
    onChange(date)
    if (onChangeString) {
      const fmt = valueFormat || "yyyy-MM-dd"
      onChangeString(date ? format(date, fmt) : undefined)
    }
    setOpen(false) // Close the popover after date selection
  }

  const fmt = valueFormat || "yyyy-MM-dd"
  const dateValue: Date | null = (() => {
    if (value) return value
    if (valueString) {
      try {
        return parse(valueString, fmt, new Date())
      } catch {
        return null
      }
    }
    return null
  })()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full">
          <Input
            type="text"
            readOnly
            value={dateValue ? format(dateValue, fmt) : ""}
            placeholder={placeholder}
            disabled={disabled}
            className={className || valueText}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          id={id}
          mode="single"
          selected={dateValue || undefined}
          onSelect={handleDateSelect}
          disabled={(date) =>
            (minDate && date < minDate)
          }
          captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
  )
}
