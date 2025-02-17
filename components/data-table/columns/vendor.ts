import { DataTableColumnHeader, DataTableRowActions } from "@/components/data-table"
import type { Vendor } from "@/utils/schemas"
import type { ColumnDef } from "@tanstack/vue-table"
import { h } from "vue"

export const columns: ColumnDef<Vendor>[] = [
    {
        accessorKey: "vendorName",
        header: ({ column }) => h(DataTableColumnHeader, { column: column, title: "Vendor Name" }),
        cell: ({ row }) => h("div", { class: "text-left font-medium" }, row.getValue("vendorName")),
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
            isFormModelOpenKey: "isFormVendorOpen", 
            isModelNewKey: "isVendorNew", 
            modelBeingFormedKey: "vendorBeingFormed", 
            isDialogDeleteModelOpenKey: "isDialogDeleteVendorOpen",
            modelBeingDeletedKey: "vendorBeingDeleted",
        }),
    },
]
