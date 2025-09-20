"use client"

import { EllipsisVertical } from "lucide-react"

import type { Row } from "@tanstack/react-table"

import { Button } from "@commercialapp/ui"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@commercialapp/ui"

interface TableRowActionsProps<TData> {
  row: Row<TData>;
  onDelete?: (row: Row<TData>) => void;
  onEdit?: (row: Row<TData>) => void;
}

export function TableRowActions<TData>({
  row,
  onDelete,
  onEdit,
}: TableRowActionsProps<TData>) {

  return (
    <div className="flex justify-end me-4" onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 p-0.5"
            aria-label="Open actions"
            onClick={(e) => e.stopPropagation()}
          >
            <EllipsisVertical className="size-max" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={onEdit ? (e) => { e.stopPropagation(); onEdit(row); } : undefined}>Edit</DropdownMenuItem>
          
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={onDelete ? (e) => { e.stopPropagation(); onDelete(row); } : undefined}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
