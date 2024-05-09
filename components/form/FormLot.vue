<script setup lang="ts">
import type { Toast } from "@/components/ui/toast/use-toast"
import { Eraser, LoaderCircle, Save } from "lucide-vue-next"

const emit = defineEmits<{ (_event: "postSubmit", _propsToast: Toast): void }>()

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

const { 
    data: dataDevelopments, 
    error: errorDevelopments, 
} = await useFetch<Development[]>("/api/development", { default: () => [] })

const optionsDevelopments = computed(() => dataDevelopments.value.map(development => ({ 
    label: development.developmentName, 
    value: development.developmentId,
})))

// TODO: Handle developments retrieval error
watch(errorDevelopments, (errorNew) => console.error(errorNew))

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

const isFormLotOpen = useState<boolean>("isFormLotOpen")
const isLotNew = useState<boolean>("isLotNew")
const lotBeingFormed = useState<Lot | undefined>("lotBeingFormed")

const { handleSubmit, setValues, values, isSubmitting, resetForm } = useForm({ 
    validationSchema: schemaFormLot,
    initialValues: {},
})

watch(isFormLotOpen, (isFormLotOpenNew) => {
    if (isFormLotOpenNew) {
        !lotBeingFormed.value ? 
            resetForm() 
            : 
            setValues({ 
                lotNumber: lotBeingFormed.value.lotNumber,
                addressId: lotBeingFormed.value.address.addressId,
                developmentId: lotBeingFormed.value.development.developmentId,
                contactId: lotBeingFormed.value.contact.personId,
            })
    }
})

const onSubmit = handleSubmit(async (body) => {
    let request = ""
    const opts: any = { method: "", body: body }
    let verb = ""

    try {
        if (isLotNew.value) {
            request = "/api/lot"
            opts.method = "POST"
            verb = "created"
        } else if (lotBeingFormed.value) {
            opts.method = "PUT"
            request = `/api/lot/${lotBeingFormed.value.lotId}`
            verb = "updated"
        } else {
            throw new Error("Invalid combination of state")
        }

        await $fetch(request, opts)

        emit("postSubmit", { 
            title: `Lot ${verb} successfully`,
            variant: "default",
        })
    } catch (error: any) {
        console.error(error)
        
        emit("postSubmit", { 
            title: `Lot ${verb} unsuccessfully`,
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
                <SheetTitle>{{ isLotNew ? "New" : "Edit" }} lot</SheetTitle>
            </SheetHeader>

            <div class="h-full flex flex-col gap-4">
                <FormField v-slot="{ componentField }" name="lotNumber">
                    <FormItem v-auto-animate>
                        <FormLabel>Lot Number</FormLabel>

                        <FormControl>
                            <Input v-bind="componentField" placeholder="100" />
                        </FormControl>

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

                <FormField name="developmentId">
                    <FormItem class="flex flex-col">
                        <FormLabel>Development</FormLabel>

                        <FormFieldCombobox 
                            name="developmentId"
                            placeholder="development"
                            :options="optionsDevelopments"
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
