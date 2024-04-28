import { DataTableColumnHeader, DataTableRowActions } from "@/components/data-table"
import type { Person } from "@/utils/schemas"
import type { ColumnDef } from "@tanstack/vue-table"
import { h } from "vue"

export const columns: ColumnDef<Person>[] = [
    {
        accessorKey: "firstName",
        header: ({ column }) => h(DataTableColumnHeader, { column: column, title: "First Name" }),
        cell: ({ row }) => h("div", { class: "text-left font-medium" }, row.getValue("firstName")),
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
        accessorKey: "lastName",
        header: ({ column }) => h(DataTableColumnHeader, { column: column, title: "Last Name" }),
        cell: ({ row }) => h("div", { class: "text-left font-medium" }, row.getValue("lastName")),
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
        accessorKey: "phoneNumber",
        header: ({ column }) => h(DataTableColumnHeader, { column: column, title: "Phone Number" }),
        cell: ({ row }) => h(
            "a", 
            { class: "text-left font-medium", href: `tel:${row.getValue("phoneNumber")}` }, 
            row.getValue("phoneNumber"),
        ),
    },
    {
        accessorKey: "email",
        header: ({ column }) => h(DataTableColumnHeader, { column: column, title: "Email" }),
        cell: ({ row }) => h(
            "a", 
            { class: "text-left font-medium", href: `mailto:${row.getValue("email")}` }, 
            row.getValue("email"),
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => h(DataTableRowActions, { 
            row: row, 
            isFormModelOpenKey: "isFormPersonOpen", 
            isModelNewKey: "isPersonNew", 
            modelBeingFormedKey: "personBeingFormed", 
            isDialogDeleteModelOpenKey: "isDialogDeletePersonOpen",
            modelBeingDeletedKey: "personBeingDeleted",
        }),
    },
]
