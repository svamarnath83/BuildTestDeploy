// components/datatable-util/EntityTable.tsx
"use client"

import { useState, useEffect } from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import type {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  labelText,
  subheading,
  valueText,
} from "@commercialapp/ui"
import { DataTablePagination } from "./data-table-pagination"
import { ScrollArea } from "@commercialapp/ui"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@commercialapp/ui"
import { TableToolbar } from "./data-table-toolbar"
import { buildColumns } from "./datatable-columns"
import type { ColumnMeta } from "./types"
import { heading } from "@commercialapp/ui"

interface EntityTableProps<TData> {
  title: string
  data: TData[]
  columnsMeta: ColumnMeta<TData>[]
  ModalComponent?: React.ComponentType<{
    open: boolean;
    onOpenChange: (open: boolean) => void;
    id: number | null;
    onSubmit: (data: TData) => void;
    onCancel: () => void;
  }>
  filterKey?: keyof TData
  onRowClick?: (row: TData) => void
  onShowForm?: () => void;
  showPagination?: boolean;
  onDelete?: (row: TData) => void;
  onEdit?: (row: TData) => void;
  enableSelection?: boolean;
  onSelectionChange?: (selectedRows: TData[]) => void;
}

export function EntityTable<TData extends object>({
  title,
  data,
  columnsMeta,
  ModalComponent,
  filterKey,
  onRowClick,
  onShowForm,
  showPagination = true,
  onDelete,
  onEdit,
  enableSelection = false,
  onSelectionChange,
}: EntityTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const columns = buildColumns<TData>(columnsMeta, { 
    enableSelection,
    actions: { 
      onDelete: onDelete ? (row) => onDelete(row.original) : undefined, 
      onEdit: onEdit ? (row) => onEdit(row.original) : undefined 
    } 
  })

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: {
        pageSize: 15,
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  // Handle selection changes and call onSelectionChange callback
  useEffect(() => {
    if (onSelectionChange) {
      const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original);
      onSelectionChange(selectedRows);
    }
  }, [rowSelection, onSelectionChange, table]);
  const onAdd = () => {
    // TODO: Implement add functionality
  }

  return (
    <section className="grid gap-2">
      <Card className="bg-white max-w-[1300px] w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className={subheading}>{title}</CardTitle>
          <TableToolbar<TData>
            table={table}
            onAdd={onAdd}
            ModalComponent={ModalComponent}
            filterKey={filterKey as string}
            onShowForm={onShowForm}
          />
        </CardHeader>
        <CardContent className="p-2">
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <Table className="bg-white min-w-[900px] table-auto">
              <TableHeader className="bg-gray-200">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody style={{ border: "none" }}>
                {/* Filter Row */}
                <TableRow className="group hover:bg-blue-100 hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 ease-in-out border-l-4 border-l-transparent hover:border-l-blue-400">
                  {table.getHeaderGroups()[0].headers.map((header) => (
                    <TableCell key={`filter-${header.id}`}>
                      {header.column.getCanFilter() ? (
                        (() => {
                          // Check if this is a boolean column by looking at the column meta
                          const columnMeta = columnsMeta.find(col => col.key === header.column.id);
                          const isBooleanColumn = columnMeta?.isBoolean;
                          
                            if (isBooleanColumn) {
                             return (
                               <Select
                                 value={(() => {
                                   const filterValue = header.column.getFilterValue();
                                   if (filterValue === '' || filterValue === null || filterValue === undefined) {
                                     return 'all';
                                   } else if (filterValue === true) {
                                     return 'true';
                                   } else if (filterValue === false) {
                                     return 'false';
                                   }
                                   return 'all';
                                 })()}
                                 onValueChange={(value) => {
                                   if (value === 'all') {
                                     header.column.setFilterValue('');
                                   } else if (value === 'true') {
                                     header.column.setFilterValue(true);
                                   } else if (value === 'false') {
                                     header.column.setFilterValue(false);
                                   }
                                 }}
                               >
                                 <SelectTrigger className={`${valueText} min-w-[80px] w-auto`}>
                                   <SelectValue placeholder="All" />
                                 </SelectTrigger>
                                 <SelectContent>
                                   <SelectItem value="all">All</SelectItem>
                                   <SelectItem value="true">True</SelectItem>
                                   <SelectItem value="false">False</SelectItem>
                                 </SelectContent>
                               </Select>
                             );
                           }
                          
                          return (
                            <Input
                              type="text"
                              value={(header.column.getFilterValue() as string) ?? ''}
                              onChange={(event) =>
                                header.column.setFilterValue(event.target.value)
                              }
                              className={`${valueText} min-w-[80px] w-auto`}
                              style={{ width: `${Math.max(80, ((header.column.getFilterValue() as string)?.length || 0) * 8 + 16)}px` }}
                            />
                          );
                        })()
                      ) : (
                        <div /> // Empty space for non-filterable columns
                      )}
                    </TableCell>
                  ))}
                </TableRow>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      style={onRowClick ? { cursor: 'pointer' } : {}}
                      onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                      className="group transition-all duration-200 ease-in-out border-l-4 border-l-transparent hover:border-l-blue-400 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 py-0"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        {enableSelection && (
          <CardFooter className="block ">
             <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
           
          </CardFooter>
        )}
      </Card>
    </section>
  )
}
