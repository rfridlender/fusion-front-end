<script setup lang="ts">
import { columns } from "~/components/data-table/columns"
import type { Address } from "@/utils/schemas"

definePageMeta({ layout: "protected" })

const { data } = await useFetch<Address[]>("/api/address")
</script>

<template>
    <main class="flex flex-1 flex-col gap-4">
        <div class="h-full flex flex-col">
            <h1 class="p-12 text-2xl font-semibold">
                Address
            </h1>
            
            <DataTable :columns="columns" :data="data ?? []" />
        </div>
    </main>
</template>
