<script setup lang="ts">
import type { Toast } from "@/components/ui/toast/use-toast"
import { Eraser, LoaderCircle, Save } from "lucide-vue-next"

const emit = defineEmits<{ (_event: "postSubmit", _propsToast: Toast): void }>()

const { 
    data: dataPersons, 
    error: errorPersons, 
} = await useFetch<Person[]>("/api/person", { default: () => [] })

const optionsPersons = computed(() => dataPersons.value.map(person => ({ 
    label: `${person.givenName} ${person.familyName}`, 
    value: person.personId,
})))

// TODO: Handle persons retrieval error
watch(errorPersons, (errorNew) => console.error(errorNew))

const { 
    data: dataAddresses, 
    error: errorAddresses, 
} = await useFetch<Address[]>("/api/address", { default: () => [] })

const optionsAddresses = computed(() => dataAddresses.value.map(address => ({ 
    label: `${address.streetOne}, ${address.streetTwo}`, 
    value: address.addressId,
})))

// TODO: Handle addresses retrieval error
watch(errorAddresses, (errorNew) => console.error(errorNew))

const isFormBuilderOpen = useState<boolean>("isFormBuilderOpen")
const isBuilderNew = useState<boolean>("isBuilderNew")
const builderBeingFormed = useState<Builder | undefined>("builderBeingFormed")

const { handleSubmit, setValues, values, isSubmitting, resetForm } = useForm({ 
    validationSchema: schemaFormBuilder,
    initialValues: {},
})

watch(isFormBuilderOpen, (isFormBuilderOpenNew) => {
    if (isFormBuilderOpenNew) {
        !builderBeingFormed.value ? 
            resetForm() 
            : 
            setValues({ 
                builderName: builderBeingFormed.value.builderName,
                contactId: builderBeingFormed.value.contact.personId,
                addressId: builderBeingFormed.value.address.addressId,
            })
    }
})

const onSubmit = handleSubmit(async (body) => {
    let request = ""
    const opts: any = { method: "", body: body }
    let verb = ""

    try {
        if (isBuilderNew.value) {
            request = "/api/builder"
            opts.method = "POST"
            verb = "created"
        } else if (builderBeingFormed.value) {
            opts.method = "PUT"
            request = `/api/builder/${builderBeingFormed.value.builderId}`
            verb = "updated"
        } else {
            throw new Error("Invalid combination of state")
        }

        await $fetch(request, opts)

        emit("postSubmit", { 
            title: `Builder ${verb} successfully`,
            variant: "default",
        })
    } catch (error: Error) {
        console.error(error)
        
        emit("postSubmit", { 
            title: `Builder ${verb} unsuccessfully`,
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
                <SheetTitle>{{ isBuilderNew ? "New" : "Edit" }} builder</SheetTitle>
            </SheetHeader>

            <div class="h-full flex flex-col gap-4">
                <FormField v-slot="{ componentField }" name="builderName">
                    <FormItem v-auto-animate>
                        <FormLabel>Builder Name</FormLabel>

                        <FormControl>
                            <Input v-bind="componentField" placeholder="Builder Hardware LLC" />
                        </FormControl>

                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField name="contactId">
                    <FormItem class="flex flex-col">
                        <FormLabel>Contact</FormLabel>

                        <FormFieldCombobox 
                            name="contactId"
                            placeholder="contact"
                            :options="optionsPersons"
                            :set-values="setValues"
                            :values="values"
                        />

                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField name="addressId">
                    <FormItem class="flex flex-col">
                        <FormLabel>Address</FormLabel>

                        <FormFieldCombobox 
                            name="addressId"
                            placeholder="address"
                            :options="optionsAddresses"
                            :set-values="setValues"
                            :values="values"
                        />

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
