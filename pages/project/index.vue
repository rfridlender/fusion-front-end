<script setup lang="ts">
import { columns } from "@/components/data-table/columns/project"
import { useToast, type Toast } from "@/components/ui/toast/use-toast"
import { SquarePlus } from "lucide-vue-next"

definePageMeta({ layout: "protected" })

const { toast } = useToast()

const { data, error, refresh } = await useFetch<Project[]>("/api/project", { default: () => [] })

watch(error, (errorNew) => toast({
    title: "Failed to retrieve projects", 
    description: errorNew?.data.message, 
    variant: "destructive",
}))

const isFormProjectOpen = useState<boolean>("isFormProjectOpen", () => false)
const isProjectNew = useState<boolean>("isProjectNew", () => true)
const projectBeingFormed = useState<Project | undefined>("projectBeingFormed")
const isDialogDeleteProjectOpen = useState<boolean>("isDialogDeleteProjectOpen", () => false)

const filters = [
    { columnId: "projectCategory", title: "Category" },
    { columnId: "installDate", title: "Install Date" },
    { columnId: "lot", title: "Lot" },
    { columnId: "contact", title: "Contact" },
    { columnId: "representative", title: "Representative" },
    { columnId: "warehouse", title: "Warehouse" },
]

function onNew() {
    projectBeingFormed.value = undefined
    isProjectNew.value = true
    isFormProjectOpen.value = true
}

async function onPostSubmit({ title, description, variant }: Toast) {
    isFormProjectOpen.value = false
    isDialogDeleteProjectOpen.value = false

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
                    Project
                </h1>

                <Button @click="onNew">
                    <SquarePlus class="size-5 mr-2" />
                    New project
                </Button>              
            </div>
            
            <DataTable 
                :data="data" 
                :columns="columns" 
                search-column-id="customerPurchaseOrderNumber"
                :filters="filters" 
            />
        </div>

        <Sheet v-model:open="isFormProjectOpen">
            <FormProject @post-submit="onPostSubmit" />
        </Sheet>

        <Dialog v-model:open="isDialogDeleteProjectOpen">
            <DialogDeleteModel 
                is-dialog-delete-model-open-key="isDialogDeleteProjectOpen"
                model-being-deleted-key="projectBeingDeleted"
                input-key="installDate"
                model-name="project"
                @post-submit="onPostSubmit" 
            />
        </Dialog>
    </main>
</template>
