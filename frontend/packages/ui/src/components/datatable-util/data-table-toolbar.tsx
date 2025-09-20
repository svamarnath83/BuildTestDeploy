"use client"

import type { Table } from "@tanstack/react-table"
import { DataTablePagination, Input } from "@commercialapp/ui"
import { TableViewOptions } from "./data-table-view-options"
import { AddEntityButton } from "./AddEntityButton"

interface TableToolbarProps<TData> {
  table: Table<TData>
  onAdd: () => void
  ModalComponent?: React.ComponentType<{
    open: boolean;
    onOpenChange: (open: boolean) => void;
    id: number | null;
    onSubmit: (data: TData) => void;
    onCancel: () => void;    // added onCancel prop
  }>
  filterKey?: string // defaults to "id"
  onShowForm?: () => void;

}

export function TableToolbar<TData>({
  table,
  onAdd,
  ModalComponent,
  onShowForm,
}: TableToolbarProps<TData>) {
  const canShowAdd = ModalComponent !== undefined || onShowForm !== undefined;

  return (
    <div className="flex gap-x-1.5 items-center">
      <DataTablePagination table={table} />
      {(canShowAdd ) && (
        <AddEntityButton<TData> onAdd={onAdd} ModalComponent={ModalComponent} onShowForm={onShowForm} />
      )}
    </div>
  )
}
