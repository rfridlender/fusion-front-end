<script setup lang="ts">
import type { Row } from "@tanstack/vue-table"
import { MoreHorizontal } from "lucide-vue-next"

const _ = defineProps<{ row: Row<Address> }>()
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
            <DropdownMenuItem>Edit</DropdownMenuItem>
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