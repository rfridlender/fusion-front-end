<script setup lang="ts">
import { columns } from "@/components/data-table/columns"
import { useToast } from "@/components/ui/toast/use-toast"
import { SquarePlus } from "lucide-vue-next"

definePageMeta({ layout: "protected" })

const { data, refresh } = await useFetch<Address[]>("/api/address")

const { toast } = useToast()

const isFormAddressOpen = useState("isFormAddressOpen", () => false)
const addressBeingEdited = useState<Address | undefined>("addressBeingEdited")

function onNew() {
    addressBeingEdited.value = undefined

    isFormAddressOpen.value = true
}

async function onSubmit(status: string, message: string) {
    await refresh()

    isFormAddressOpen.value = false

    switch (status) {
    case "error": toast({ title: message, variant: "destructive" }); break
    case "success": toast({ title: message }); break
    default: throw new Error(`Invalid status ${status}`)
    }
}
</script>

<template>
    <main class="flex flex-1 flex-col gap-4">
        <div class="h-full flex flex-col">
            <div class="flex justify-between items-center p-12">
                <h1 class="text-2xl font-semibold">
                    Address
                </h1>

                <Button @click="onNew">
                    <SquarePlus class="size-5 gap-2 mr-2" />
                    New address
                </Button>              
            </div>
            
            <DataTable :columns="columns" :data="data ?? []" />
        </div>

        <Sheet v-model:open="isFormAddressOpen">
            <FormAddress @submit="onSubmit" />
        </Sheet>
    </main>
</template>
