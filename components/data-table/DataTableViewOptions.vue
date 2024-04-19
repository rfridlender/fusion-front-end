<script setup lang="ts">
import type { Table } from "@tanstack/vue-table"
import { SlidersHorizontal } from "lucide-vue-next"
import { computed } from "vue"

const props = defineProps<{ table: Table<Address> }>()

const columns = computed(() => props.table.getAllColumns()
    .filter(
        column =>
            typeof column.accessorFn !== "undefined" && column.getCanHide(),
    ))
</script>

<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <Button
                variant="outline"
                size="sm"
                class="ml-auto hidden h-8 lg:flex"
            >
                <SlidersHorizontal class="mr-2 size-4" />
                View
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-40" align="end">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuCheckboxItem
                v-for="column in columns"
                :key="column.id"
                class="capitalize"
                :checked="column.getIsVisible()"
                @update:checked="(value) => column.toggleVisibility(!!value)"
            >
                {{ column.id }}
            </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>