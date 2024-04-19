import { DataTableColumnHeader, DataTableRowActions } from "@/components/data-table"
import type { Address } from "@/utils/schemas"
import type { ColumnDef } from "@tanstack/vue-table"
import { h } from "vue"

export const columns: ColumnDef<Address>[] = [
    {
        accessorKey: "streetOne",
        header: ({ column }) => {
            return h(DataTableColumnHeader, {
                column: column,
                title: "Street One",
            })
        },
        cell: ({ row }) => {            
            return h("div", { class: "text-left font-medium" }, row.getValue("streetOne"))
        },
    },
    {
        accessorKey: "streetTwo",
        header: ({ column }) => {
            return h(DataTableColumnHeader, {
                column: column,
                title: "Street Two",
            })
        },
        cell: ({ row }) => {            
            return h("div", { class: "text-left font-medium" }, row.getValue("streetTwo"))
        },
    },
    {
        accessorKey: "city",
        header: ({ column }) => {
            return h(DataTableColumnHeader, {
                column: column,
                title: "City",
            })
        },
        cell: ({ row }) => {            
            return h("div", { class: "text-left font-medium" }, row.getValue("city"))
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "county",
        header: ({ column }) => {
            return h(DataTableColumnHeader, {
                column: column,
                title: "County",
            })
        },
        cell: ({ row }) => {            
            return h("div", { class: "text-left font-medium" }, row.getValue("county"))
        },
    },
    {
        accessorKey: "state",
        header: ({ column }) => {
            return h(DataTableColumnHeader, {
                column: column,
                title: "State",
            })
        },
        cell: ({ row }) => {            
            return h("div", { class: "text-left font-medium" }, row.getValue("state"))
        },
    },
    {
        accessorKey: "postalCode",
        header: ({ column }) => {
            return h(DataTableColumnHeader, {
                column: column,
                title: "Postal Code",
            })
        },
        cell: ({ row }) => {            
            return h("div", { class: "text-left font-medium" }, row.getValue("postalCode"))
        },
    },
    {
        accessorKey: "country",
        header: ({ column }) => {
            return h(DataTableColumnHeader, {
                column: column,
                title: "Country",
            })
        },
        cell: ({ row }) => {            
            return h("div", { class: "text-left font-medium" }, row.getValue("country"))
        },
    },
    {
        id: "actions",
        cell: ({ row }) => h(DataTableRowActions, { row }),
    },
]
