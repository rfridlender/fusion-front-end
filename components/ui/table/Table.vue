<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/utils/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
    <div class="relative w-full h-full overflow-auto">
        <table :class="cn('w-full caption-bottom text-sm', props.class)">
            <slot />
        </table>
    </div>
</template>
