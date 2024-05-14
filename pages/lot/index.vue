<script setup lang="ts">
import { columns } from "@/components/data-table/columns/lot"
import { useToast, type Toast } from "@/components/ui/toast/use-toast"
import { SquarePlus } from "lucide-vue-next"

definePageMeta({ layout: "protected" })

const { toast } = useToast()

const { data, error, refresh } = await useFetch<Lot[]>(
    "/api/lot", { default: () => [] },
)

watch(error, (errorNew) => toast({
    title: "Failed to retrieve lots", 
    description: errorNew?.data.message, 
    variant: "destructive",
}))

const isFormLotOpen = useState<boolean>("isFormLotOpen", () => false)
const isLotNew = useState<boolean>("isLotNew", () => true)
const lotBeingFormed = useState<Lot | undefined>("lotBeingFormed")
const isDialogDeleteLotOpen = useState<boolean>("isDialogDeleteLotOpen", () => false)

function onNew() {
    lotBeingFormed.value = undefined
    isLotNew.value = true
    isFormLotOpen.value = true
}

async function onPostSubmit({ title, description, variant }: Toast) {
    isFormLotOpen.value = false
    isDialogDeleteLotOpen.value = false

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
                    Lot
                </h1>

                <Button @click="onNew">
                    <SquarePlus class="size-5 mr-2" />
                    New lot
                </Button>              
            </div>
            
            <DataTable 
                :data="data" 
                :columns="columns" 
                search-column-id="lotNumber"
                :filters="[]" 
            />
        </div>

        <Sheet v-model:open="isFormLotOpen">
            <FormLot @post-submit="onPostSubmit" />
        </Sheet>

        <Dialog v-model:open="isDialogDeleteLotOpen">
            <DialogDeleteModel 
                is-dialog-delete-model-open-key="isDialogDeleteLotOpen"
                model-being-deleted-key="lotBeingDeleted"
                input-key="lotNumber"
                model-name="lot"
                @post-submit="onPostSubmit" 
            />
        </Dialog>
    </main>
</template>
