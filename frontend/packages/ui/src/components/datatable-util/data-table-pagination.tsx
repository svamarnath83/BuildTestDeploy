import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

import type { Table } from "@tanstack/react-table"

import { Button } from "@commercialapp/ui"

interface DataTablePaginationProps<TData> {
  table: Table<TData>
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const startRow = table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1
  const endRow = Math.min(
    (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
    table.getFilteredRowModel().rows.length
  )
  const totalRows = table.getFilteredRowModel().rows.length

  return (
    <div className="flex items-center justify-between gap-2">
     
      <div className="flex items-center gap-x-4">
        <div className="flex items-center justify-center text-sm font-medium text-gray-700">
          {startRow}-{endRow} / {totalRows}
        </div>
        <div className="flex items-center gap-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0 bg-gray-50 border-gray-200 hover:bg-gray-100"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Go to previous page"
          >
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 bg-gray-50 border-gray-200 hover:bg-gray-100"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Go to next page"
          >
            <ChevronRight className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
      </div>
    </div>
  )
}
