<script setup lang="ts" generic="TModel">
import { type Toast } from "@/components/ui/toast/use-toast"
import { Ban, LoaderCircle, Trash } from "lucide-vue-next"

const props = defineProps<{ 
    isDialogDeleteModelOpenKey: string
    modelBeingDeletedKey: string
    inputKey: string
    modelName: string
}>()

const emit = defineEmits<{ (_event: "postSubmit", _propsToast: Toast): void }>()

const isDialogDeleteModelOpen = useState(props.isDialogDeleteModelOpenKey)
const modelBeingDeleted = useState<any | undefined>(props.modelBeingDeletedKey)
const inputConfirmation = useState<string>("inputConfirmation", () => "")
const isSubmitting = useState<boolean>("isSubmitting", () => false)

watch(isDialogDeleteModelOpen, (isDialogDeleteModelOpenNew) => {
    if (!isDialogDeleteModelOpenNew) {
        modelBeingDeleted.value = undefined
        inputConfirmation.value = ""
    }
})

const isDisabled = computed(() => (
    modelBeingDeleted.value && 
    modelBeingDeleted.value[props.inputKey] !== inputConfirmation.value
) || isSubmitting.value)

async function onClick() { 
    try {
        if (!modelBeingDeleted.value) {
            throw new Error("Invalid combination of state")
        }

        isSubmitting.value = true

        await $fetch<TModel>(
            `/api/${props.modelName}/${modelBeingDeleted.value[props.modelName + "Id"]}`,
            { method: "DELETE" },
        )

        emit("postSubmit", { 
            title: `${titlize(props.modelName)} deleted successfully`,
            variant: "default",
        })
    } catch (error: any) {
        console.error(error)
        
        emit("postSubmit", { 
            title: `${titlize(props.modelName)} deleted unsuccessfully`,
            description: error.data.message,
            variant: "destructive",
        })
    } finally {
        isSubmitting.value = false
    }
}
</script>

<template>
    <DialogContent class="sm:max-w-md">
        <DialogHeader>
            <DialogTitle>
                Delete {{ modelName }} 
                <i>{{ modelBeingDeleted && modelBeingDeleted[inputKey] }}</i>
                ?
            </DialogTitle>
        </DialogHeader>

        <Separator />

        <div class="flex items-center space-x-2 px-2">
            <div class="grid w-full max-w-sm items-center gap-1.5">
                <Label class="font-normal" for="inputConfirmation">
                    To confirm deletion, enter 
                    <i>{{ modelBeingDeleted && modelBeingDeleted[inputKey] }}</i>
                    in the field.
                </Label>

                <Input
                    id="inputConfirmation"
                    v-model="inputConfirmation"
                    :placeholder="modelBeingDeleted && modelBeingDeleted[inputKey]"
                    autocomplete="off"
                />
            </div>
        </div>
        
        <DialogFooter class="sm:justify-between px-2 gap-4">
            <DialogClose as-child>
                <Button type="button" variant="secondary">
                    <Ban class="size-5 mr-2" />
                    Cancel
                </Button>
                    
                <Button
                    :disabled="isDisabled"
                    @click="onClick"
                >
                    <Trash v-if="!isSubmitting" class="size-5 mr-2" />
                    <LoaderCircle v-else class="size-5 mr-2 animate-spin" />
                    Delete
                </Button>
            </DialogClose>
        </DialogFooter>
    </DialogContent>
</template>
