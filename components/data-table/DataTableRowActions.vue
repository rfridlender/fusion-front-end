<script setup lang="ts" generic="TData">
import type { Row } from "@tanstack/vue-table"
import { Copy, MoreHorizontal, Pencil, Trash } from "lucide-vue-next"

const props = defineProps<{ 
    row: Row<TData>
    isFormModelOpenKey: string
    isModelNewKey: string
    modelBeingFormedKey: string
    isDialogDeleteModelOpenKey: string
    modelBeingDeletedKey: string
}>()

const isFormModelOpen = useState<boolean>(props.isFormModelOpenKey)
const isModelNew = useState<boolean>(props.isModelNewKey)
const modelBeingFormed = useState<TData | undefined>(props.modelBeingFormedKey)

const isDialogDeleteModelOpen = useState<boolean>(props.isDialogDeleteModelOpenKey)
const modelBeingDeleted = useState<TData | undefined>(props.modelBeingDeletedKey)

function onEdit() {
    modelBeingFormed.value = props.row.original
    isModelNew.value = false
    isFormModelOpen.value = true
}

function onDuplicate() {
    modelBeingFormed.value = props.row.original
    isModelNew.value = true
    isFormModelOpen.value = true
}

function onDelete() {
    modelBeingDeleted.value = props.row.original
    isDialogDeleteModelOpen.value = true
}
</script>

<template>
    <DropdownMenu class="flex justify-center items-center">
        <DropdownMenuTrigger as-child>
            <Button
                class="flex size-8 p-0 data-[state=open]:bg-muted"
                variant="ghost"
            >
                <MoreHorizontal class="size-4" />
                <span class="sr-only">Open menu</span>
            </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent class="w-40" align="end">
            <DropdownMenuItem @click="onEdit">
                <Pencil class="mr-2 size-4" />
                <span>Edit</span>
            </DropdownMenuItem>

            <DropdownMenuItem @click="onDuplicate">
                <Copy class="mr-2 size-4" />
                <span>Duplicate</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem @click="onDelete">
                <Trash class="mr-2 size-4" />
                <span>Delete</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>
