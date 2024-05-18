<script setup lang="ts">
import type { Toast } from "@/components/ui/toast/use-toast"
import { Eraser, LoaderCircle, Save } from "lucide-vue-next"

const emit = defineEmits<{ (_event: "postSubmit", _propsToast: Toast): void }>()

const isFormAddressOpen = useState<boolean>("isFormAddressOpen")
const isAddressNew = useState<boolean>("isAddressNew")
const addressBeingFormed = useState<Address | undefined>("addressBeingFormed")

const { handleSubmit, setValues, values, isSubmitting, resetForm } = useForm({ 
    validationSchema: schemaFormAddress,
    initialValues: { state: "GA", country: "US" },
})

watch(isFormAddressOpen, (isFormAddressOpenNew) => {
    if (isFormAddressOpenNew) {
        !addressBeingFormed.value ? resetForm() : setValues(addressBeingFormed.value)
    }
})

const onSubmit = handleSubmit(async (body) => {
    let request = ""
    const opts: any = { method: "", body: body }
    let verb = ""

    try {
        if (isAddressNew.value) {
            request = "/api/address"
            opts.method = "POST"
            verb = "created"
        } else if (addressBeingFormed.value) {
            opts.method = "PUT"
            request = `/api/address/${addressBeingFormed.value.addressId}`
            verb = "updated"
        } else {
            throw new Error("Invalid combination of state")
        }

        await $fetch(request, opts)

        emit("postSubmit", { 
            title: `Address ${verb} successfully`,
            variant: "default",
        })
    } catch (error: any) {
        console.error(error)
        
        emit("postSubmit", { 
            title: `Address ${verb} unsuccessfully`,
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
                <SheetTitle>{{ isAddressNew ? "New" : "Edit" }} address</SheetTitle>
            </SheetHeader>

            <div class="h-full flex flex-col gap-4">
                <FormField v-slot="{ componentField }" name="streetOne">
                    <FormFieldItem v-auto-animate>
                        <FormLabel>Street One</FormLabel>

                        <FormControl>
                            <Input v-bind="componentField" placeholder="1275 Evenflo Drive" />
                        </FormControl>

                        <FormMessage />
                    </FormFieldItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="streetTwo">
                    <FormFieldItem v-auto-animate>
                        <FormLabel>Street Two</FormLabel>

                        <FormControl>
                            <Input v-bind="componentField" placeholder="Suite A01" />
                        </FormControl>

                        <FormMessage />
                    </FormFieldItem>
                </FormField>

                <FormField name="city">
                    <FormFieldItem class="flex flex-col">
                        <FormLabel>City</FormLabel>

                        <FormFieldCombobox 
                            name="city"
                            :options="optionsCities"
                            :set-values="setValues"
                            :values="values"
                        />

                        <FormMessage />
                    </FormFieldItem>
                </FormField>

                <FormField name="county">
                    <FormFieldItem class="flex flex-col">
                        <FormLabel>County</FormLabel>

                        <FormFieldCombobox 
                            name="county"
                            :options="optionsCounties"
                            :set-values="setValues"
                            :values="values"
                        />
                        
                        <FormMessage />
                    </FormFieldItem>
                </FormField>

                <FormField name="state">
                    <FormFieldItem class="flex flex-col">
                        <FormLabel>State</FormLabel>

                        <FormFieldCombobox 
                            name="state"
                            :options="optionsStates"
                            :set-values="setValues"
                            :values="values"
                        />

                        <FormMessage />
                    </FormFieldItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="postalCode">
                    <FormFieldItem v-auto-animate>
                        <FormLabel>Postal Code</FormLabel>

                        <FormControl>
                            <Input v-bind="componentField" placeholder="30107" />
                        </FormControl>

                        <FormMessage />
                    </FormFieldItem>
                </FormField>

                <FormField name="country">
                    <FormFieldItem class="flex flex-col">
                        <FormLabel>Country</FormLabel>

                        <FormFieldCombobox 
                            name="country"
                            :options="optionsCountries"
                            :set-values="setValues"
                            :values="values"
                        />

                        <FormMessage />
                    </FormFieldItem>
                </FormField>
            </div>

            <SheetFooter>
                <Button 
                    class="w-full"
                    variant="secondary" 
                    type="reset" 
                    :disabled="isSubmitting"
                >
                    <Eraser class="size-5 mr-2" />
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
