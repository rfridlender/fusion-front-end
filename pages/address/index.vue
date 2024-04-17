<script setup lang="ts">
import { columns } from "@/components/address/columns"
import DataTable from "~/components/address/DataTable.vue"
import type { Address } from "@/server/api/address"

definePageMeta({ layout: "protected" })

const { data } = await useFetch<Address[]>("/api/address")
</script>

<template>
    <main class="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div class="flex flex-col">
            <h1 class="text-lg font-semibold md:text-2xl">
                Address
            </h1>
            <div class="container py-10 mx-auto">
                <DataTable :columns="columns" :data="data ?? []" />
            </div>
        </div>
    </main>
</template>
