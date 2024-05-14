<script setup lang="ts">
import { columns } from "@/components/data-table/columns/warehouse"
import { useToast, type Toast } from "@/components/ui/toast/use-toast"
import { SquarePlus } from "lucide-vue-next"

definePageMeta({ layout: "protected" })

const { toast } = useToast()

const { data, error, refresh } = await useFetch<Warehouse[]>(
    "/api/warehouse", { default: () => [] },
)

watch(error, (errorNew) => toast({
    title: "Failed to retrieve warehouses", 
    description: errorNew?.data.message, 
    variant: "destructive",
}))

const isFormWarehouseOpen = useState<boolean>("isFormWarehouseOpen", () => false)
const isWarehouseNew = useState<boolean>("isWarehouseNew", () => true)
const warehouseBeingFormed = useState<Warehouse | undefined>("warehouseBeingFormed")
const isDialogDeleteWarehouseOpen = useState<boolean>("isDialogDeleteWarehouseOpen", () => false)

function onNew() {
    warehouseBeingFormed.value = undefined
    isWarehouseNew.value = true
    isFormWarehouseOpen.value = true
}

async function onPostSubmit({ title, description, variant }: Toast) {
    isFormWarehouseOpen.value = false
    isDialogDeleteWarehouseOpen.value = false

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
                    Warehouse
                </h1>

                <Button @click="onNew">
                    <SquarePlus class="size-5 mr-2" />
                    New warehouse
                </Button>              
            </div>
            
            <DataTable 
                :data="data" 
                :columns="columns" 
                search-column-id="warehouseName"
                :filters="[]" 
            />
        </div>

        <Sheet v-model:open="isFormWarehouseOpen">
            <FormWarehouse @post-submit="onPostSubmit" />
        </Sheet>

        <Dialog v-model:open="isDialogDeleteWarehouseOpen">
            <DialogDeleteModel 
                is-dialog-delete-model-open-key="isDialogDeleteWarehouseOpen"
                model-being-deleted-key="warehouseBeingDeleted"
                input-key="warehouseName"
                model-name="warehouse"
                @post-submit="onPostSubmit" 
            />
        </Dialog>
    </main>
</template>
