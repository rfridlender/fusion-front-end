<script setup lang="ts">
import type { Table } from "@tanstack/vue-table"
import { X } from "lucide-vue-next"
import { computed } from "vue"

const props = defineProps<{ table: Table<Address> }>()
    
const isFiltered = computed(() => props.table.getState().columnFilters.length > 0)
</script>

<template>
    <div class="flex items-center justify-between p-4">
        <div class="flex flex-1 items-center space-x-2">
            <Input
                class="h-8 w-40 lg:w-60"
                placeholder="Search addresses..."
                :model-value="(table.getColumn('streetOne')?.getFilterValue() as string) ?? ''"
                @input="table.getColumn('streetOne')?.setFilterValue($event.target.value)"
            />

            <DataTableFacetedFilter
                v-if="table.getColumn('city')"
                :column="table.getColumn('city')"
                title="City"
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
