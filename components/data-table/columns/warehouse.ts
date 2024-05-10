import { DataTableColumnHeader, DataTableRowActions } from "@/components/data-table"
import type { Warehouse } from "@/utils/schemas"
import type { ColumnDef } from "@tanstack/vue-table"
import { h } from "vue"

export const columns: ColumnDef<Warehouse>[] = [
    {
        accessorKey: "warehouseName",
        header: ({ column }) => h(DataTableColumnHeader, 
            { column: column, title: "Warehouse Name" },
        ),
        cell: ({ row }) => h(
            "div", 
            { class: "text-left font-medium" }, 
            row.getValue("warehouseName"),
        ),
    },
    {
        id: "address",
        accessorFn: (originalRow) => 
            `${originalRow.address.streetOne}, ${originalRow.address.streetTwo}`,
        header: ({ column }) => h(DataTableColumnHeader, { column: column, title: "Address" }),
        cell: ({ row }) => h(
            "div", 
            { class: "text-left font-medium" }, 
            `${row.original.address.streetOne}, ${row.original.address.streetTwo}`,
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => h(DataTableRowActions, { 
            row: row, 
            isFormModelOpenKey: "isFormWarehouseOpen", 
            isModelNewKey: "isWarehouseNew", 
            modelBeingFormedKey: "warehouseBeingFormed", 
            isDialogDeleteModelOpenKey: "isDialogDeleteWarehouseOpen",
            modelBeingDeletedKey: "warehouseBeingDeleted",
        }),
    },
]
