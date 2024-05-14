import { DataTableColumnHeader, DataTableRowActions } from "@/components/data-table"
import type { Item } from "@/utils/schemas"
import type { ColumnDef } from "@tanstack/vue-table"
import { h } from "vue"

export const columns: ColumnDef<Item>[] = [
    {
        accessorKey: "itemCategory",
        header: ({ column }) => h(DataTableColumnHeader, { column: column, title: "Category" }),
        cell: ({ row }) => h(
            "div", 
            { class: "text-left font-medium" }, 
            row.getValue("itemCategory"),
        ),
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
        accessorKey: "itemSubcategory",
        header: ({ column }) => h(DataTableColumnHeader, { column: column, title: "Subcategory" }),
        cell: ({ row }) => h(
            "div", 
            { class: "text-left font-medium" }, 
            row.getValue("itemSubcategory"),
        ),
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
        accessorKey: "sku",
        header: ({ column }) => h(DataTableColumnHeader, { column: column, title: "SKU" }),
        cell: ({ row }) => h("div", { class: "text-left font-medium" }, row.getValue("sku")),
    },
    {
        accessorKey: "itemDescription",
        header: ({ column }) => h(DataTableColumnHeader, { column: column, title: "Description" }),
        cell: ({ row }) => h(
            "div", 
            { class: "text-left font-medium" }, 
            row.getValue("itemDescription"),
        ),
    },
    {
        accessorKey: "unitOfMeasurement",
        header: ({ column }) => h(DataTableColumnHeader, { column: column, title: "UoM" }),
        cell: ({ row }) => h(
            "div", 
            { class: "text-left font-medium" }, 
            row.getValue("unitOfMeasurement"),
        ),
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
        accessorKey: "priceBuilder",
        header: ({ column }) => h(DataTableColumnHeader, { column: column, title: "Bldr. Price" }),
        cell: ({ row }) => h(
            "div", 
            { class: "text-left font-medium" }, 
            row.getValue("priceBuilder"),
        ),
    },
    {
        accessorKey: "priceHomeOwner",
        header: ({ column }) => h(DataTableColumnHeader, { column: column, title: "H.O. Price" }),
        cell: ({ row }) => h(
            "div", 
            { class: "text-left font-medium" }, 
            row.getValue("priceHomeOwner"),
        ),
    },
    {
        accessorKey: "costBuilder",
        header: ({ column }) => h(DataTableColumnHeader, { column: column, title: "Bldr. Cost" }),
        cell: ({ row }) => h(
            "div", 
            { class: "text-left font-medium" }, 
            row.getValue("costBuilder"),
        ),
    },
    {
        accessorKey: "costHomeOwner",
        header: ({ column }) => h(DataTableColumnHeader, { column: column, title: "H.O. Cost" }),
        cell: ({ row }) => h(
            "div", 
            { class: "text-left font-medium" }, 
            row.getValue("costHomeOwner"),
        ),
    },
    {
        accessorKey: "vendorPartNumber",
        header: ({ column }) => h(DataTableColumnHeader, { column: column, title: "Vendor P.N." }),
        cell: ({ row }) => h(
            "div", 
            { class: "text-left font-medium" }, 
            row.getValue("vendorPartNumber"),
        ),
    },
    {
        id: "vendor",
        accessorFn: (originalRow) => originalRow.vendor.vendorName,
        header: ({ column }) => h(DataTableColumnHeader, { column: column, title: "Vendor" }),
        cell: ({ row }) => h(
            "div", 
            { class: "text-left font-medium" }, 
            row.original.vendor.vendorName,
        ),
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
        id: "actions",
        cell: ({ row }) => h(DataTableRowActions, { 
            row: row, 
            isFormModelOpenKey: "isFormItemOpen", 
            isModelNewKey: "isItemNew", 
            modelBeingFormedKey: "itemBeingFormed", 
            isDialogDeleteModelOpenKey: "isDialogDeleteItemOpen",
            modelBeingDeletedKey: "itemBeingDeleted",
        }),
    },
]
