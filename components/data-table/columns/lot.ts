import { DataTableColumnHeader, DataTableRowActions } from "@/components/data-table"
import type { Lot } from "@/utils/schemas"
import type { ColumnDef } from "@tanstack/vue-table"
import { h } from "vue"

export const columns: ColumnDef<Lot>[] = [
    {
        accessorKey: "lotNumber",
        header: ({ column }) => h(
            DataTableColumnHeader, 
            { column: column, title: "Lot Number" },
        ),
        cell: ({ row }) => h(
            "div", 
            { class: "text-left font-medium" }, 
            row.getValue("lotNumber"),
        ),
    },
    {
        id: "contact",
        accessorFn: (originalRow) => 
            `${originalRow.contact.givenName} ${originalRow.contact.familyName}`,
        header: ({ column }) => h(DataTableColumnHeader, { column: column, title: "Contact" }),
        cell: ({ row }) => h(
            "div", 
            { class: "text-left font-medium" }, 
            `${row.original.contact.givenName} ${row.original.contact.familyName}`,
        ),
    },
    {
        id: "development",
        accessorFn: (originalRow) => originalRow.development.developmentName,
        header: ({ column }) => h(DataTableColumnHeader, { column: column, title: "Development" }),
        cell: ({ row }) => h(
            "div", 
            { class: "text-left font-medium" }, 
            row.original.development.developmentName,
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
            isFormModelOpenKey: "isFormLotOpen", 
            isModelNewKey: "isLotNew", 
            modelBeingFormedKey: "lotBeingFormed", 
            isDialogDeleteModelOpenKey: "isDialogDeleteLotOpen",
            modelBeingDeletedKey: "lotBeingDeleted",
        }),
    },
]
