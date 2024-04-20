<script setup lang="ts">
import type { Column } from "@tanstack/vue-table"
import { Check, CirclePlus } from "lucide-vue-next"
import { computed } from "vue"

type DataTableFacetedFilter = {
    column?: Column<Address, any>
    title?: string
}

const props = defineProps<DataTableFacetedFilter>()

const facets = computed(() => props.column?.getFacetedUniqueValues())
const options = computed(() => {
    if (!facets.value) {
        return []
    } 
    
    return [...facets.value.keys()].map(facet => { 
        return { label: facet, value: facet } },
    )
})
const selectedValues = computed(() => new Set(props.column?.getFilterValue() as string[]))
</script>

<template>
    <Popover>
        <PopoverTrigger as-child>
            <Button
                variant="outline"
                size="sm"
                class="h-8 border-dashed"
            >
                <CirclePlus class="mr-2 size-4" />
                {{ title }}
                <template v-if="selectedValues.size > 0">
                    <Separator orientation="vertical" class="mx-2 h-4" />
                    <Badge
                        variant="secondary"
                        class="rounded-sm px-1 font-normal lg:hidden"
                    >
                        {{ selectedValues.size }}
                    </Badge>
                    <div class="hidden space-x-1 lg:flex">
                        <Badge
                            v-if="selectedValues.size > 2"
                            variant="secondary"
                            class="rounded-sm px-1 font-normal"
                        >
                            {{ selectedValues.size }} selected
                        </Badge>
                
                        <template v-else>
                            <Badge
                                v-for="option in options
                                    .filter((option) => selectedValues.has(option.value))"
                                :key="option.value"
                                class="rounded-sm px-1 font-normal"
                                variant="secondary"
                            >
                                {{ option.value }}
                            </Badge>
                        </template>
                    </div>
                </template>
            </Button>
        </PopoverTrigger>
        <PopoverContent class="w-48 p-0" align="start">
            <Command
                :filterfunction="(list: any[], term: string) => list
                    .filter(e => e.label.toLowerCase()?.includes(term))"
            >
                <CommandInput :placeholder="title" />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                        <CommandItem
                            v-for="option in options"
                            :key="option.value"
                            :value="option"
                            @select="(e) => {
                                console.log(e.detail.value)
                                const isSelected = selectedValues.has(option.value)
                                if (isSelected) {
                                    selectedValues.delete(option.value)
                                }
                                else {
                                    selectedValues.add(option.value)
                                }
                                const filterValues = Array.from(selectedValues)
                                column?.setFilterValue(
                                    filterValues.length ? filterValues : undefined,
                                )
                            }"
                        >
                            <div
                                :class="cn(
                                    'mr-2 flex size-4 items-center justify-center ' + 
                                        'rounded-sm border border-primary',
                                    selectedValues.has(option.value)
                                        ? 'bg-primary text-primary-foreground'
                                        : 'opacity-50 [&_svg]:invisible',
                                )"
                            >
                                <Check :class="cn('size-4')" />
                            </div>
                            <span>{{ option.label }}</span>
                            <span 
                                v-if="facets?.get(option.value)" 
                                class="ml-auto flex items-center justify-center 
                                    size-4 font-mono text-xs"
                            >
                                {{ facets.get(option.value) }}
                            </span>
                        </CommandItem>
                    </CommandGroup>

                    <template v-if="selectedValues.size > 0">
                        <CommandSeparator />
                        <CommandGroup>
                            <CommandItem
                                class="justify-center text-center"
                                :value="{ label: 'Clear filters' }"
                                @select="column?.setFilterValue(undefined)"
                            >
                                Clear filters
                            </CommandItem>
                        </CommandGroup>
                    </template>
                </CommandList>
            </Command>
        </PopoverContent>
    </Popover>
</template>
