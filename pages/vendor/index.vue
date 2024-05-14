<script setup lang="ts">
import { columns } from "@/components/data-table/columns/vendor"
import { useToast, type Toast } from "@/components/ui/toast/use-toast"
import { SquarePlus } from "lucide-vue-next"

definePageMeta({ layout: "protected" })

const { toast } = useToast()

const { data, error, refresh } = await useFetch<Vendor[]>("/api/vendor", { default: () => [] })

watch(error, (errorNew) => toast({
    title: "Failed to retrieve vendors", 
    description: errorNew?.data.message, 
    variant: "destructive",
}))

const isFormVendorOpen = useState<boolean>("isFormVendorOpen", () => false)
const isVendorNew = useState<boolean>("isVendorNew", () => true)
const vendorBeingFormed = useState<Vendor | undefined>("vendorBeingFormed")
const isDialogDeleteVendorOpen = useState<boolean>("isDialogDeleteVendorOpen", () => false)

function onNew() {
    vendorBeingFormed.value = undefined
    isVendorNew.value = true
    isFormVendorOpen.value = true
}

async function onPostSubmit({ title, description, variant }: Toast) {
    isFormVendorOpen.value = false
    isDialogDeleteVendorOpen.value = false

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
                    Vendor
                </h1>

                <Button @click="onNew">
                    <SquarePlus class="size-5 mr-2" />
                    New vendor
                </Button>              
            </div>
            
            <DataTable 
                :data="data" 
                :columns="columns" 
                search-column-id="vendorName"
                :filters="[]" 
            />
        </div>

        <Sheet v-model:open="isFormVendorOpen">
            <FormVendor @post-submit="onPostSubmit" />
        </Sheet>

        <Dialog v-model:open="isDialogDeleteVendorOpen">
            <DialogDeleteModel 
                is-dialog-delete-model-open-key="isDialogDeleteVendorOpen"
                model-being-deleted-key="vendorBeingDeleted"
                input-key="vendorName"
                model-name="vendor"
                @post-submit="onPostSubmit" 
            />
        </Dialog>
    </main>
</template>
