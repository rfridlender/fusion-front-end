import { DataTableColumnHeader, DataTableRowActions } from "@/components/data-table"
import type { Project } from "@/utils/schemas"
import type { ColumnDef } from "@tanstack/vue-table"
import { h } from "vue"

export const columns: ColumnDef<Project>[] = [
    {
        accessorKey: "projectCategory",
        header: ({ column }) => h(DataTableColumnHeader, { column: column, title: "Category" }),
        cell: ({ row }) => h(
            "div", 
            { class: `text-left font-medium ${row.original.projectIsDeleted ? 
                " text-muted-foreground line-through" : ""}`,
            },
            row.getValue("projectCategory"),
        ),
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
        accessorKey: "installDate",
        header: ({ column }) => h(DataTableColumnHeader, { column: column, title: "Install Date" }),
        cell: ({ row }) => h(
            "div", 
            { class: `text-left font-medium ${row.original.projectIsDeleted ? 
                " text-muted-foreground line-through" : ""}`,
            },
            row.getValue("installDate"),
        ),
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
        accessorKey: "customerPurchaseOrderNumber",
        header: ({ column }) => h(DataTableColumnHeader, { column: column, title: "Cust. P.O." }),
        cell: ({ row }) => h(
            "div", 
            { class: `text-left font-medium ${row.original.projectIsDeleted ? 
                " text-muted-foreground line-through" : ""}`,
            },
            row.getValue("customerPurchaseOrderNumber"),
        ),
    },
    {
        accessorKey: "salesOrderNumber",
        header: ({ column }) => h(DataTableColumnHeader, { column: column, title: "S.O." }),
        cell: ({ row }) => h(
            "div", 
            { class: `text-left font-medium ${row.original.projectIsDeleted ? 
                " text-muted-foreground line-through" : ""}`,
            },
            row.getValue("salesOrderNumber"),
        ),
    },
    {
        id: "lot",
        accessorFn: (originalRow) => 
            `${originalRow.lot.lotNumber} ${originalRow.lot.development.developmentName}`,
        header: ({ column }) => h(DataTableColumnHeader, { column: column, title: "Lot" }),
        cell: ({ row }) => h(
            "div", 
            { class: `text-left font-medium ${row.original.projectIsDeleted ? 
                " text-muted-foreground line-through" : ""}`,
            },
            `${row.original.lot.lotNumber} ${row.original.lot.development.developmentName}`,
        ),
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
        id: "contact",
        accessorFn: (originalRow) => 
            `${originalRow.contact.givenName} ${originalRow.contact.familyName}`,
        header: ({ column }) => h(DataTableColumnHeader, { column: column, title: "Contact" }),
        cell: ({ row }) => h(
            "div", 
            { class: `text-left font-medium ${row.original.projectIsDeleted ? 
                " text-muted-foreground line-through" : ""}`,
            },
            `${row.original.contact.givenName} ${row.original.contact.familyName}`,
        ),
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
        id: "representative",
        accessorFn: (originalRow) => 
            `${originalRow.representative.givenName} ${originalRow.representative.familyName}`,
        header: ({ column }) => h(
            DataTableColumnHeader, 
            { column: column, title: "Representative" },
        ),
        cell: ({ row }) => h(
            "div", 
            { class: `text-left font-medium ${row.original.projectIsDeleted ? 
                " text-muted-foreground line-through" : ""}`,
            },
            `${row.original.representative.givenName} ${row.original.representative.familyName}`,
        ),
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
        id: "warehouse",
        accessorFn: (originalRow) => originalRow.warehouse.warehouseName,
        header: ({ column }) => h(DataTableColumnHeader, { column: column, title: "Warehouse" }),
        cell: ({ row }) => h(
            "div", 
            { class: `text-left font-medium ${row.original.projectIsDeleted ? 
                " text-muted-foreground line-through" : ""}`,
            },
            row.original.warehouse.warehouseName,
        ),
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
        id: "actions",
        cell: ({ row }) => h(DataTableRowActions, { 
            row: row, 
            isFormModelOpenKey: "isFormProjectOpen", 
            isModelNewKey: "isProjectNew", 
            modelBeingFormedKey: "projectBeingFormed", 
            isDialogDeleteModelOpenKey: "isDialogDeleteProjectOpen",
            modelBeingDeletedKey: "projectBeingDeleted",
        }),
    },
]
