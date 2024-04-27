<script setup lang="ts">
import { columns } from "@/components/data-table/columns/address"
import { useToast } from "@/components/ui/toast/use-toast"
import { SquarePlus } from "lucide-vue-next"

type PropsToast = {
    title: string
    description?: string
    variant: "default" | "destructive" | null | undefined
}

definePageMeta({ layout: "protected" })

const { data, refresh } = await useFetch<Address[]>("/api/address", { default: () => [] })

const { toast } = useToast()

const isFormAddressOpen = useState<boolean>("isFormAddressOpen", () => false)
const isAddressNew = useState<boolean>("isAddressNew", () => true)
const addressBeingFormed = useState<Address | undefined>("addressBeingFormed")

function onNew() {
    addressBeingFormed.value = undefined
    isAddressNew.value = true
    isFormAddressOpen.value = true
}

async function onSubmit({ title, description, variant}: PropsToast) {
    try {
        await refresh()
    
        isFormAddressOpen.value = false

        toast({ 
            title: title, 
            description: description, 
            variant: variant,
        })
    } catch (error: any) {
        console.error(error)

        toast({ 
            title: "Failed to refresh data", 
            description: error.message, 
            variant: "destructive",
        })
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
                    <SquarePlus class="size-5 mr-2" />
                    New address
                </Button>              
            </div>
            
            <DataTable :data="data" :columns="columns" />
        </div>

        <Sheet v-model:open="isFormAddressOpen">
            <FormAddress @submit="onSubmit" />
        </Sheet>
    </main>
</template>
