<script setup lang="ts">
import { columns } from "@/components/data-table/columns/address"
import { useToast, type Toast } from "@/components/ui/toast/use-toast"
import { SquarePlus } from "lucide-vue-next"

definePageMeta({ layout: "protected" })

const { toast } = useToast()

const { data, error, refresh } = await useFetch<Address[]>("/api/address", { default: () => [] })

const isFormAddressOpen = useState<boolean>("isFormAddressOpen", () => false)
const isAddressNew = useState<boolean>("isAddressNew", () => true)
const addressBeingFormed = useState<Address | undefined>("addressBeingFormed")

const isDialogAddressOpen = useState("isDialogAddressOpen", () => false)

watch(error, (errorNew) => toast({
    title: "Failed to retrieve addresses", 
    description: errorNew?.data.message, 
    variant: "destructive",
}))

function onNew() {
    addressBeingFormed.value = undefined
    isAddressNew.value = true
    isFormAddressOpen.value = true
}

async function onPostSubmit({ title, description, variant }: Toast) {
    isFormAddressOpen.value = false
    isDialogAddressOpen.value = false

    toast({ 
        title: title, 
        description: description, 
        variant: variant,
    })

    await refresh()
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
            <FormAddress @post-submit="onPostSubmit" />
        </Sheet>

        <Dialog v-model:open="isDialogAddressOpen">
            <DialogDeleteAddress @post-submit="onPostSubmit" />
        </Dialog>
    </main>
</template>
