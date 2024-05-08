<script setup lang="ts">
import { columns } from "@/components/data-table/columns/person"
import { useToast, type Toast } from "@/components/ui/toast/use-toast"
import { SquarePlus } from "lucide-vue-next"

definePageMeta({ layout: "protected" })

const { toast } = useToast()

const { data, error, refresh } = await useFetch<Person[]>("/api/person", { default: () => [] })

watch(error, (errorNew) => toast({
    title: "Failed to retrieve persons", 
    description: errorNew?.data.message, 
    variant: "destructive",
}))

const isFormPersonOpen = useState<boolean>("isFormPersonOpen", () => false)
const isPersonNew = useState<boolean>("isPersonNew", () => true)
const personBeingFormed = useState<Person | undefined>("personBeingFormed")

const isDialogDeletePersonOpen = useState<boolean>("isDialogDeletePersonOpen", () => false)


const filters = [{ columnId: "familyName", title: "Family Name" }]

function onNew() {
    personBeingFormed.value = undefined
    isPersonNew.value = true
    isFormPersonOpen.value = true
}

async function onPostSubmit({ title, description, variant }: Toast) {
    isFormPersonOpen.value = false
    isDialogDeletePersonOpen.value = false

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
                    Person
                </h1>

                <Button @click="onNew">
                    <SquarePlus class="size-5 mr-2" />
                    New person
                </Button>              
            </div>
            
            <DataTable 
                :data="data" 
                :columns="columns" 
                search-column-id="givenName"
                :filters="filters" 
            />
        </div>

        <Sheet v-model:open="isFormPersonOpen">
            <FormPerson @post-submit="onPostSubmit" />
        </Sheet>

        <Dialog v-model:open="isDialogDeletePersonOpen">
            <DialogDeleteModel 
                is-dialog-delete-model-open-key="isDialogDeletePersonOpen"
                model-being-deleted-key="personBeingDeleted"
                input-key="givenName"
                model-name="person"
                @post-submit="onPostSubmit" 
            />
        </Dialog>
    </main>
</template>
