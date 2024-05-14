<script setup lang="ts">
import { columns } from "@/components/data-table/columns/item"
import { useToast, type Toast } from "@/components/ui/toast/use-toast"
import { SquarePlus } from "lucide-vue-next"

definePageMeta({ layout: "protected" })

const { toast } = useToast()

const { data, error, refresh } = await useFetch<Item[]>(
    "/api/item", { default: () => [] },
)

watch(error, (errorNew) => toast({
    title: "Failed to retrieve items", 
    description: errorNew?.data.message, 
    variant: "destructive",
}))

const isFormItemOpen = useState<boolean>("isFormItemOpen", () => false)
const isItemNew = useState<boolean>("isItemNew", () => true)
const itemBeingFormed = useState<Item | undefined>("itemBeingFormed")
const isDialogDeleteItemOpen = useState<boolean>("isDialogDeleteItemOpen", () => false)

const filters = [
    { columnId: "itemCategory", title: "Category" },
    { columnId: "itemSubcategory", title: "Subcategory" },
    { columnId: "unitOfMeasurement", title: "UoM" },
    { columnId: "vendor", title: "Vendor" },
]

function onNew() {
    itemBeingFormed.value = undefined
    isItemNew.value = true
    isFormItemOpen.value = true
}

async function onPostSubmit({ title, description, variant }: Toast) {
    isFormItemOpen.value = false
    isDialogDeleteItemOpen.value = false

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
                    Item
                </h1>

                <Button @click="onNew">
                    <SquarePlus class="size-5 mr-2" />
                    New item
                </Button>              
            </div>
            
            <DataTable 
                :data="data" 
                :columns="columns" 
                search-column-id="sku"
                :filters="filters" 
            />
        </div>

        <Sheet v-model:open="isFormItemOpen">
            <FormModelItem @post-submit="onPostSubmit" />
        </Sheet>

        <Dialog v-model:open="isDialogDeleteItemOpen">
            <DialogDeleteModel 
                is-dialog-delete-model-open-key="isDialogDeleteItemOpen"
                model-being-deleted-key="itemBeingDeleted"
                input-key="sku"
                model-name="item"
                @post-submit="onPostSubmit" 
            />
        </Dialog>
    </main>
</template>
