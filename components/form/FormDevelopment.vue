<script setup lang="ts">
import type { Toast } from "@/components/ui/toast/use-toast"
import { Eraser, LoaderCircle, Save } from "lucide-vue-next"

const emit = defineEmits<{ (_event: "postSubmit", _propsToast: Toast): void }>()

const { 
    data: dataBuilders, 
    error: errorBuilders, 
} = await useFetch<Builder[]>("/api/builder", { default: () => [] })

const optionsBuilders = computed(() => dataBuilders.value.map(builder => ({ 
    label: builder.builderName, 
    value: builder.builderId,
})))

// TODO: Handle builders retrieval error
watch(errorBuilders, (errorNew) => console.error(errorNew))

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

const isFormDevelopmentOpen = useState<boolean>("isFormDevelopmentOpen")
const isDevelopmentNew = useState<boolean>("isDevelopmentNew")
const developmentBeingFormed = useState<Development | undefined>("developmentBeingFormed")

const { handleSubmit, setValues, values, isSubmitting, resetForm } = useForm({ 
    validationSchema: schemaFormDevelopment,
    initialValues: {},
})

watch(isFormDevelopmentOpen, (isFormDevelopmentOpenNew) => {
    if (isFormDevelopmentOpenNew) {
        !developmentBeingFormed.value ? 
            resetForm() 
            : 
            setValues({ 
                developmentName: developmentBeingFormed.value.developmentName,
                builderId: developmentBeingFormed.value.builder.builderId,
                contactId: developmentBeingFormed.value.contact.personId,
                addressId: developmentBeingFormed.value.address.addressId,
            })
    }
})

const onSubmit = handleSubmit(async (body) => {
    let request = ""
    const opts: any = { method: "", body: body }
    let verb = ""

    try {
        if (isDevelopmentNew.value) {
            request = "/api/development"
            opts.method = "POST"
            verb = "created"
        } else if (developmentBeingFormed.value) {
            opts.method = "PUT"
            request = `/api/development/${developmentBeingFormed.value.developmentId}`
            verb = "updated"
        } else {
            throw new Error("Invalid combination of state")
        }

        await $fetch(request, opts)

        emit("postSubmit", { 
            title: `Development ${verb} successfully`,
            variant: "default",
        })
    } catch (error: any) {
        console.error(error)
        
        emit("postSubmit", { 
            title: `Development ${verb} unsuccessfully`,
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
                <SheetTitle>{{ isDevelopmentNew ? "New" : "Edit" }} development</SheetTitle>
            </SheetHeader>

            <div class="h-full flex flex-col gap-4">
                <FormField v-slot="{ componentField }" name="developmentName">
                    <FormItem v-auto-animate>
                        <FormLabel>Development Name</FormLabel>

                        <FormControl>
                            <Input v-bind="componentField" placeholder="The Developments" />
                        </FormControl>

                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField name="builderId">
                    <FormItem class="flex flex-col">
                        <FormLabel>Builder</FormLabel>

                        <FormFieldCombobox 
                            name="builderId"
                            placeholder="builder"
                            :options="optionsBuilders"
                            :set-values="setValues"
                            :values="values"
                        />

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
