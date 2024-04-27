<script setup lang="ts" generic="TData, TValue">
import type { Column } from "@tanstack/vue-table"
import { ArrowUpDown, EyeOff, MoveDown, MoveUp } from "lucide-vue-next"

defineProps<{ 
    column: Column<TData, TValue>, 
    title: string 
}>()
</script>

<script lang="ts">
export default { inheritAttrs: false }
</script>

<template>
    <div v-if="column.getCanSort()" :class="cn('flex items-center space-x-2', $attrs.class ?? '')">
        <DropdownMenu>
            <DropdownMenuTrigger as-child>
                <Button
                    class="-ml-3 h-8 data-[state=open]:bg-accent"
                    variant="ghost"
                    size="sm"
                >
                    <span>{{ title }}</span>
                    <MoveUp v-if="column.getIsSorted() === 'asc'" class="size-4 ml-2" />
                    <MoveDown v-else-if="column.getIsSorted() === 'desc'" class="size-4 ml-2" />
                    <ArrowUpDown v-else class="size-4 ml-2" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
                <DropdownMenuItem @click="column.toggleSorting(false)">
                    <MoveUp class="mr-2 size-3.5 text-muted-foreground/70" />
                    Asc
                </DropdownMenuItem>

                <DropdownMenuItem @click="column.toggleSorting(true)">
                    <MoveDown class="mr-2 size-3.5 text-muted-foreground/70" />
                    Desc
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                
                <DropdownMenuItem @click="column.toggleVisibility(false)">
                    <EyeOff class="mr-2 size-3.5 text-muted-foreground/70" />
                    Hide
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>

    <div v-else :class="$attrs.class">
        {{ title }}
    </div>
</template>
