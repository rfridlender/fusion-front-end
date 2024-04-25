import { DataTableColumnHeader, DataTableRowActions } from "@/components/data-table"
import type { Address } from "@/utils/schemas"
import type { ColumnDef } from "@tanstack/vue-table"
import { h } from "vue"

export const columns: ColumnDef<Address>[] = [
    {
        accessorKey: "streetOne",
        header: ({ column }) => h(DataTableColumnHeader, { column: column, title: "Street One" }),
        cell: ({ row }) => h("div", { class: "text-left font-medium" }, row.getValue("streetOne")),
    },
    {
        accessorKey: "streetTwo",
        header: ({ column }) => h(DataTableColumnHeader, { column: column, title: "Street Two" }),
        cell: ({ row }) => h("div", { class: "text-left font-medium" }, row.getValue("streetTwo")),
    },
    {
        accessorKey: "city",
        header: ({ column }) => h(DataTableColumnHeader, { column: column, title: "City" }),
        cell: ({ row }) => h("div", { class: "text-left font-medium" }, row.getValue("city")),
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
        accessorKey: "county",
        header: ({ column }) => h(DataTableColumnHeader, { column: column, title: "County" }),
        cell: ({ row }) => h("div", { class: "text-left font-medium" }, row.getValue("county")),
    },
    {
        accessorKey: "state",
        header: ({ column }) => h(DataTableColumnHeader, { column: column, title: "State" }),
        cell: ({ row }) => h("div", { class: "text-left font-medium" }, row.getValue("state")),
    },
    {
        accessorKey: "postalCode",
        header: ({ column }) => h(DataTableColumnHeader, {column: column,title: "Postal Code" }),
        cell: ({ row }) => h("div", { class: "text-left font-medium" }, row.getValue("postalCode")),
    },
    {
        accessorKey: "country",
        header: ({ column }) => h(DataTableColumnHeader, { column: column, title: "Country" }),
        cell: ({ row }) => h("div", { class: "text-left font-medium" }, row.getValue("country")),
    },
    {
        id: "actions",
        cell: ({ row }) => h(DataTableRowActions, { 
            row: row, 
            keyIsFormModelOpen: "isFormAddressOpen", 
            keyModelBeingEdited: "addressBeingEdited", 
        }),
    },
]
