<script setup lang="ts">
import type { Toast } from "@/components/ui/toast/use-toast"
import { Eraser, LoaderCircle, Save } from "lucide-vue-next"

const emit = defineEmits<{ (_event: "postSubmit", _propsToast: Toast): void }>()

const isFormPersonOpen = useState<boolean>("isFormPersonOpen")
const isPersonNew = useState<boolean>("isPersonNew")
const personBeingFormed = useState<Person | undefined>("personBeingFormed")

const { handleSubmit, setValues, isSubmitting, resetForm } = useForm({ 
    validationSchema: schemaFormPerson,
})

watch(isFormPersonOpen, (isFormPersonOpenNew) => {
    if (isFormPersonOpenNew) {
        !personBeingFormed.value ? resetForm() : setValues(personBeingFormed.value)
    }
})

const onSubmit = handleSubmit(async (body) => {
    let request = ""
    const opts: any = { method: "", body: body }
    let verb = ""

    try {
        if (isPersonNew.value) {
            request = "/api/person"
            opts.method = "POST"
            verb = "created"
        } else if (personBeingFormed.value) {
            opts.method = "PUT"
            request = `/api/person/${personBeingFormed.value.personId}`
            verb = "updated"
        } else {
            throw new Error("Invalid combination of state")
        }

        await $fetch(request, opts)

        emit("postSubmit", { 
            title: `Person ${verb} successfully`,
            variant: "default",
        })
    } catch (error: Error) {
        console.error(error)
        
        emit("postSubmit", { 
            title: `Person ${verb} unsuccessfully`,
            description: error.data.message,
            variant: "destructive",
        })
    }
})
</script>

<template>
    <SheetContent aria-describedby="form">
        <form 
            class="h-full flex flex-col gap-4" 
            @submit="onSubmit"
            @reset="() => resetForm()"
        >
            <SheetHeader>
                <SheetTitle>{{ isPersonNew ? "New" : "Edit" }} person</SheetTitle>
            </SheetHeader>

            <div class="h-full flex flex-col gap-4">
                <FormField v-slot="{ componentField }" name="givenName">
                    <FormItem v-auto-animate>
                        <FormLabel>Given Name</FormLabel>

                        <FormControl>
                            <Input v-bind="componentField" placeholder="John" />
                        </FormControl>

                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="familyName">
                    <FormItem v-auto-animate>
                        <FormLabel>Family Name</FormLabel>

                        <FormControl>
                            <Input v-bind="componentField" placeholder="Doe" />
                        </FormControl>

                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="phoneNumber">
                    <FormItem v-auto-animate>
                        <FormLabel>Phone Number</FormLabel>

                        <FormControl>
                            <Input v-bind="componentField" placeholder="+12223334444" />
                        </FormControl>

                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="email">
                    <FormItem v-auto-animate>
                        <FormLabel>Email</FormLabel>

                        <FormControl>
                            <Input 
                                v-bind="componentField" 
                                placeholder="john.doe@homefusioninstall.com" 
                            />
                        </FormControl>

                        <FormMessage />
                    </FormItem>
                </FormField>
            </div>

            <SheetFooter>
                <Button 
                    class="w-full"
                    variant="secondary" 
                    type="reset" 
                    :disabled="isSubmitting"
                >
                    <Eraser v-if="!isSubmitting" class="size-5 mr-2" />
                    Clear
                </Button>
                
                <Button 
                    class="w-full" 
                    type="submit" 
                    :disabled="isSubmitting"
                >
                    <Save v-if="!isSubmitting" class="size-5 mr-2" />
                    <LoaderCircle v-else class="size-5 mr-2 animate-spin" />
                    Save
                </Button>
            </SheetFooter>
        </form>
    </SheetContent>
</template>
