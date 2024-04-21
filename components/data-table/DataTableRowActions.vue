<script setup lang="ts">
import type { Row } from "@tanstack/vue-table"
import { MoreHorizontal, Pencil } from "lucide-vue-next"

const { row } = defineProps<{ row: Row<Address> }>()

const isFormAddressOpen = useState("isFormAddressOpen")
const formAddress = useState<FormAddress | undefined>("formAddress")

function onEdit() {
    formAddress.value = {
        streetOne: row.getValue("streetOne"),
        city: row.getValue("city"),
        state: row.getValue("state"),
        country: row.getValue("country"),
        streetTwo: row.getValue("streetTwo"),
        county: row.getValue("county"),
        postalCode: row.getValue("postalCode"),
    }

    isFormAddressOpen.value = true
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