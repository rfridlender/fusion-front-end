<script setup lang="ts" generic="TData">
import type { Row } from "@tanstack/vue-table"
import { MoreHorizontal, Pencil } from "lucide-vue-next"

const props = defineProps<{ 
    row: Row<TData>
    keyIsFormModelOpen: string 
    keyModelBeingEdited: string
}>()

const isFormModelOpen = useState(props.keyIsFormModelOpen)
const modelBeingEdited = useState<TData | undefined>(props.keyModelBeingEdited)

function onEdit() {
    modelBeingEdited.value = props.row.original

    isFormModelOpen.value = true
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
            <DropdownMenuItem>Make a copy</DropdownMenuItem>
            <DropdownMenuItem>Favorite</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
                Delete
                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>
