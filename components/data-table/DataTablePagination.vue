<script setup lang="ts">
import { type Table } from "@tanstack/vue-table"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-vue-next"

defineProps<{ table: Table<Address> }>()
</script>

<template>
    <div class="flex items-center justify-between px-4 py-8">
        <div class="flex items-center md:space-x-2">
            <p class="hidden text-sm font-medium md:block">
                Rows per page
            </p>
            <Select
                :model-value="`${table.getState().pagination.pageSize}`"
                @update:model-value="table.setPageSize"
            >
                <SelectTrigger class="h-8 w-[70px]">
                    <SelectValue :placeholder="`${table.getState().pagination.pageSize}`" />
                </SelectTrigger>
                <SelectContent side="top">
                    <SelectItem 
                        v-for="pageSize in [10, 20, 30, 40, 50]" 
                        :key="pageSize" 
                        :value="`${pageSize}`"
                    >
                        {{ pageSize }}
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div class="flex items-center space-x-6 lg:space-x-8">
            <div class="flex w-[100px] items-center justify-center text-sm font-medium">
                Page {{ table.getState().pagination.pageIndex + 1 }} of
                {{ table.getPageCount() }}
            </div>
            <div class="flex items-center space-x-2">
                <Button
                    class="hidden size-8 p-0 lg:flex"
                    variant="outline"
                    :disabled="!table.getCanPreviousPage()"
                    @click="table.setPageIndex(0)"
                >
                    <span class="sr-only">Go to first page</span>
                    <ChevronsLeft class="size-4" />
                </Button>
                <Button
                    variant="outline"
                    class="size-8 p-0"
                    :disabled="!table.getCanPreviousPage()"
                    @click="table.previousPage()"
                >
                    <span class="sr-only">Go to previous page</span>
                    <ChevronLeft class="size-4" />
                </Button>
                <Button
                    variant="outline"
                    class="size-8 p-0"
                    :disabled="!table.getCanNextPage()"
                    @click="table.nextPage()"
                >
                    <span class="sr-only">Go to next page</span>
                    <ChevronRight class="size-4" />
                </Button>
                <Button
                    variant="outline"
                    class="hidden size-8 p-0 lg:flex"
                    :disabled="!table.getCanNextPage()"
                    @click="table.setPageIndex(table.getPageCount() - 1)"
                >
                    <span class="sr-only">Go to last page</span>
                    <ChevronsRight class="size-4" />
                </Button>
            </div>
        </div>
    </div>
</template>
