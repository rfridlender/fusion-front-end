<script setup lang="ts">
import { columns } from "@/components/data-table/columns/development"
import { useToast, type Toast } from "@/components/ui/toast/use-toast"
import { SquarePlus } from "lucide-vue-next"

definePageMeta({ layout: "protected" })

const { toast } = useToast()

const { data, error, refresh } = await useFetch<Development[]>(
    "/api/development", { default: () => [] },
)

watch(error, (errorNew) => toast({
    title: "Failed to retrieve developments", 
    description: errorNew?.data.message, 
    variant: "destructive",
}))

const isFormDevelopmentOpen = useState<boolean>("isFormDevelopmentOpen", () => false)
const isDevelopmentNew = useState<boolean>("isDevelopmentNew", () => true)
const developmentBeingFormed = useState<Development | undefined>("developmentBeingFormed")
const isDialogDeleteDevelopmentOpen = useState<boolean>(
    "isDialogDeleteDevelopmentOpen", () => false,
)

function onNew() {
    developmentBeingFormed.value = undefined
    isDevelopmentNew.value = true
    isFormDevelopmentOpen.value = true
}

async function onPostSubmit({ title, description, variant }: Toast) {
    isFormDevelopmentOpen.value = false
    isDialogDeleteDevelopmentOpen.value = false

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
                    Development
                </h1>

                <Button @click="onNew">
                    <SquarePlus class="size-5 mr-2" />
                    New development
                </Button>              
            </div>
            
            <DataTable 
                :data="data" 
                :columns="columns" 
                search-column-id="developmentName"
                :filters="[]" 
            />
        </div>

        <Sheet v-model:open="isFormDevelopmentOpen">
            <FormDevelopment @post-submit="onPostSubmit" />
        </Sheet>

        <Dialog v-model:open="isDialogDeleteDevelopmentOpen">
            <DialogDeleteModel 
                is-dialog-delete-model-open-key="isDialogDeleteDevelopmentOpen"
                model-being-deleted-key="developmentBeingDeleted"
                input-key="developmentName"
                model-name="development"
                @post-submit="onPostSubmit" 
            />
        </Dialog>
    </main>
</template>
