<script setup lang="ts">
import { columns } from "@/components/data-table/columns/builder"
import { useToast, type Toast } from "@/components/ui/toast/use-toast"
import { SquarePlus } from "lucide-vue-next"

definePageMeta({ layout: "protected" })

const { toast } = useToast()

const { data, error, refresh } = await useFetch<Builder[]>("/api/builder", { default: () => [] })

const isFormBuilderOpen = useState<boolean>("isFormBuilderOpen", () => false)
const isBuilderNew = useState<boolean>("isBuilderNew", () => true)
const builderBeingFormed = useState<Builder | undefined>("builderBeingFormed")

const isDialogDeleteBuilderOpen = useState<boolean>("isDialogDeleteBuilderOpen", () => false)

watch(error, (errorNew) => toast({
    title: "Failed to retrieve builders", 
    description: errorNew?.data.message, 
    variant: "destructive",
}))

function onNew() {
    builderBeingFormed.value = undefined
    isBuilderNew.value = true
    isFormBuilderOpen.value = true
}

async function onPostSubmit({ title, description, variant }: Toast) {
    isFormBuilderOpen.value = false
    isDialogDeleteBuilderOpen.value = false

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
                    Builder
                </h1>

                <Button @click="onNew">
                    <SquarePlus class="size-5 mr-2" />
                    New builder
                </Button>              
            </div>
            
            <DataTable 
                :data="data" 
                :columns="columns" 
                search-column-id="builderName"
                :filters="[]" 
            />
        </div>

        <Sheet v-model:open="isFormBuilderOpen">
            <FormBuilder @post-submit="onPostSubmit" />
        </Sheet>

        <Dialog v-model:open="isDialogDeleteBuilderOpen">
            <DialogDeleteModel 
                is-dialog-delete-model-open-key="isDialogDeleteBuilderOpen"
                model-being-deleted-key="builderBeingDeleted"
                input-key="builderName"
                model-name="builder"
                @post-submit="onPostSubmit" 
            />
        </Dialog>
    </main>
</template>
