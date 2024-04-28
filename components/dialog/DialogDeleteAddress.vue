<script setup lang="ts">
import { type Toast } from "@/components/ui/toast/use-toast"
import { Ban, LoaderCircle, Trash } from "lucide-vue-next"

const emit = defineEmits<{ (_event: "postSubmit", _propsToast: Toast): void }>()

const isDialogAddressOpen = useState("isDialogAddressOpen")
const addressBeingDeleted = useState<Address | undefined>("addressBeingDeleted")
const streetOneConfirmation = useState<string>("streetOneConfirmation", () => "")
const isSubmitting = useState<boolean>("isDialogAddressSubmitting", () => false)

watch(isDialogAddressOpen, (isDialogAddressOpenNew) => {
    if (!isDialogAddressOpenNew) {
        addressBeingDeleted.value = undefined
        streetOneConfirmation.value = ""
    }
})

async function onClick() { 
    try {
        if (!addressBeingDeleted.value) {
            throw new Error("Invalid combination of state")
        }

        isSubmitting.value = true

        await $fetch<Address>(`/api/address/${addressBeingDeleted.value.addressId}`, { 
            method: "DELETE",
        })


        emit("postSubmit", { 
            title: "Address deleted successfully",
            variant: "default",
        })
    } catch (error: any) {
        console.error(error)
        
        emit("postSubmit", { 
            title: "Address deleted unsuccessfully",
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
                Delete address <i>{{ addressBeingDeleted?.streetOne }}</i>?
            </DialogTitle>
        </DialogHeader>
        <Separator />
        <div class="flex items-center space-x-2 px-2">
            <div class="grid w-full max-w-sm items-center gap-1.5">
                <Label class="font-normal" for="streetOneConfirmation">
                    To confirm deletion, enter 
                    <i>{{ addressBeingDeleted?.streetOne }}</i>
                    in the field.
                </Label>
                <Input
                    id="streetOneConfirmation"
                    v-model="streetOneConfirmation"
                    :placeholder="addressBeingDeleted?.streetOne"
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
                    :disabled="
                        addressBeingDeleted?.streetOne !== streetOneConfirmation || isSubmitting
                    "
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