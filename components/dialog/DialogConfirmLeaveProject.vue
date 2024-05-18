<script setup lang="ts">
import { Ban, DoorOpen } from "lucide-vue-next"

const isDialogConfirmLeaveProjectOpen = useState<boolean>(
    "isDialogConfirmLeaveProjectOpen", 
    () => false,
)
const isFormProjectOpen = useState<boolean>("isFormProjectOpen")

function onLeave() {
    isFormProjectOpen.value = false
    isDialogConfirmLeaveProjectOpen.value = false
}
</script>

<template>
    <DialogContent class="sm:max-w-md">
        <DialogHeader>
            <DialogTitle class="text-center">
                Leave without saving?
            </DialogTitle>
        </DialogHeader>

        <Separator />

        <div class="flex justify-center items-center space-x-2 px-2">
            You'll lose any changes you made.
        </div>
        
        <DialogFooter class="sm:justify-between px-2 gap-4">
            <DialogClose as-child>
                <Button variant="secondary">
                    <Ban class="size-5 mr-2" />
                    Cancel
                </Button>
                    
                <Button @click="onLeave">
                    <DoorOpen class="size-5 mr-2" />
                    Leave
                </Button>
            </DialogClose>
        </DialogFooter>
    </DialogContent>
</template>
