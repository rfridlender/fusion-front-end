import { DataTableColumnHeader, DataTableRowActions } from "@/components/data-table"
import type { Development } from "@/utils/schemas"
import type { ColumnDef } from "@tanstack/vue-table"
import { h } from "vue"

export const columns: ColumnDef<Development>[] = [
    {
        accessorKey: "developmentName",
        header: ({ column }) => h(
            DataTableColumnHeader, 
            { column: column, title: "Development Name" },
        ),
        cell: ({ row }) => h(
            "div", 
            { class: "text-left font-medium" }, 
            row.getValue("developmentName"),
        ),
    },
    {
        id: "builder",
        accessorFn: (originalRow) => originalRow.builder.builderName,
        header: ({ column }) => h(DataTableColumnHeader, { column: column, title: "Builder" }),
        cell: ({ row }) => h(
            "div", 
            { class: "text-left font-medium" }, 
            row.original.builder.builderName,
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
            isFormModelOpenKey: "isFormDevelopmentOpen", 
            isModelNewKey: "isDevelopmentNew", 
            modelBeingFormedKey: "developmentBeingFormed", 
            isDialogDeleteModelOpenKey: "isDialogDeleteDevelopmentOpen",
            modelBeingDeletedKey: "developmentBeingDeleted",
        }),
    },
]
