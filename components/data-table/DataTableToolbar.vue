<script setup lang="ts" generic="TData">
import type { Table } from "@tanstack/vue-table"
import { X } from "lucide-vue-next"
import { computed } from "vue"

const props = defineProps<{ 
    table: Table<TData>
    searchColumnId: string
    filters: { 
        columnId: string
        title: string 
    }[]
}>()
    
const isFiltered = computed(() => props.table.getState().columnFilters.length > 0)
</script>

<template>
    <div class="flex items-center justify-between p-4">
        <div class="flex flex-1 items-center space-x-2">
            <Input
                class="h-8 w-40 lg:w-60"
                placeholder="Search..."
                :model-value="(table.getColumn(searchColumnId)?.getFilterValue() as string) ?? ''"
                @input="table.getColumn(searchColumnId)?.setFilterValue($event.target.value)"
            />

            <DataTableFacetedFilter
                v-for="filter in filters"
                :key="filter.columnId"
                :column="table.getColumn(filter.columnId)"
                :title="filter.title"
            />
            
            <Button
                v-if="isFiltered"
                class="h-8 px-2 lg:px-3"
                variant="ghost"
                @click="table.resetColumnFilters()"
            >
                Reset
                <X class="ml-2 size-4" />
            </Button>
        </div>
    
        <DataTableViewOptions :table="table" />
    </div>
</template>
