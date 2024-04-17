import DropdownAction from "@/components/address/DataTableDropDown.vue"
import { Button } from "@/components/ui/button"
import type { Address } from "@/server/api/address"
import { ArrowUpDown } from "lucide-vue-next"
import type { ColumnDef } from "@tanstack/vue-table"
import { h } from "vue"

export const columns: ColumnDef<Address>[] = [
    {
        accessorKey: "streetOne",
        header: ({ column }) => {
            return h(Button, {
                variant: "ghost",
                onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
            }, () => ["Street One", h(ArrowUpDown, { class: "ml-2 size-4" })])
        },
        cell: ({ row }) => {            
            return h("div", { class: "text-left font-medium" }, row.getValue("streetOne"))
        },
    },
    {
        accessorKey: "streetTwo",
        header: () => h("div", { class: "text-left" }, "Street Two"),
        cell: ({ row }) => {            
            return h("div", { class: "text-left font-medium" }, row.getValue("streetTwo"))
        },
    },
    {
        accessorKey: "city",
        header: () => h("div", { class: "text-left" }, "City"),
        cell: ({ row }) => {            
            return h("div", { class: "text-left font-medium" }, row.getValue("city"))
        },
    },
    {
        accessorKey: "county",
        header: () => h("div", { class: "text-left" }, "County"),
        cell: ({ row }) => {            
            return h("div", { class: "text-left font-medium" }, row.getValue("county"))
        },
    },
    {
        accessorKey: "state",
        header: () => h("div", { class: "text-left" }, "State"),
        cell: ({ row }) => {            
            return h("div", { class: "text-left font-medium" }, row.getValue("state"))
        },
    },
    {
        accessorKey: "postalCode",
        header: () => h("div", { class: "text-left" }, "Postal Code"),
        cell: ({ row }) => {            
            return h("div", { class: "text-left font-medium" }, row.getValue("postalCode"))
        },
    },
    {
        accessorKey: "country",
        header: () => h("div", { class: "text-left" }, "Country"),
        cell: ({ row }) => {            
            return h("div", { class: "text-left font-medium" }, row.getValue("country"))
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const address = row.original

            return h("div", { class: "relative" }, h(DropdownAction, {
                address,
            }))
        },
    },
]
