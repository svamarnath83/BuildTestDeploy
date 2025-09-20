import type { Column, ColumnDef, Row } from "@tanstack/react-table";
import { Checkbox, Button, TableViewOptions } from "@commercialapp/ui";
import { DataTableColumnHeader } from "./data-table-column-header";
import { TableRowActions } from "./data-table-row-actions";
import type {ColumnMeta} from "./types";
import { Check, X, EyeOff } from "lucide-react";

export function buildColumns<T extends object>(
  meta: ColumnMeta<T>[],
  options?: { enableSelection?: boolean; enableActions?: boolean; actions?: { onDelete?: (row: Row<T>) => void; onEdit?: (row: Row<T>) => void } }
): ColumnDef<T>[] {
  const { enableSelection = true, enableActions = true, actions } = options ?? {};

  const dynamicColumns: ColumnDef<T>[] = [];

  // Optional checkbox column
  if (enableSelection) {
    dynamicColumns.push({
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          className="ms-4"
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          className="ms-4"
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    });
  }

  // Data columns
  const filteredMeta = meta.filter((col) => {
    const shouldInclude = !col.isOptional;
    return shouldInclude;
  });
  
  
  dynamicColumns.push(
    ...filteredMeta.map((col) => ({
        accessorKey: col.key as string,
        enableColumnFilter: true,
        header: ({ column }: { column: Column<T, unknown> }) => (
          <DataTableColumnHeader column={column} title={col.title} />
        ),
        cell: ({ row }: { row: Row<T> }) => {
          const value = row.getValue(col.key as string);
          const rowData = row.original;
          
          if (value === null || value === undefined) {
            return <span className={col.isNumeric ? "text-right" : ""}>-</span>;
          }
          
          // Use custom cell renderer if provided
          if (col.customCell) {
            return col.customCell(value, row);
          }
          
          // Handle boolean values with visual indicators
          if (col.isBoolean && typeof value === 'boolean') {
            return (
              <div className="flex ">
                {value ? (
                  <div className="flex  gap-1 text-green-600">
                    <Check className="h-4 w-4" />
                  </div>
                ) : (
                  <div className="flex gap-1 text-gray-400">
                    <X className="h-4 w-4 text-red-600" />
                  </div>
                )}
              </div>
            );
          }
          
          return (
            <span className={col.isNumeric ? "text-right" : ""}>
              {col.isNumeric ? Number(value).toFixed(2) : String(value)}
            </span>
          );
        },
      }))
  );

  // Optional actions column
  if (enableActions) {
    dynamicColumns.push({
      id: "actions",
      header: ({ table }) => (
        <TableViewOptions table={table} />
  
      ),
      cell: ({ row }) => <TableRowActions row={row} onDelete={actions?.onDelete} onEdit={actions?.onEdit} />,
    });
  }

  return dynamicColumns;
}
