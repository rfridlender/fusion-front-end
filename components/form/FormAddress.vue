<script setup lang="ts">
import axios from "axios"
import { Eraser, LoaderCircle, Save } from "lucide-vue-next"

type PropsToast = {
    title: string
    description?: string
    variant: "default" | "destructive" | null | undefined
}

const emit = defineEmits<{ (_event: "submit", _propsToast: PropsToast): void }>()

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
    if (isAddressNew.value) {
        try {
            await axios({ 
                method: "POST", 
                url: "/api/address", 
                data: body,
            })

            emit("submit", { 
                title: "Address created successfully",
                variant: "default",
            })
        } catch (error: Error) {
            console.error(error)
            
            emit("submit", { 
                title: "Failed to create address", 
                description: error.response.data.message,
                variant: "destructive",
            })
        }
    } else if (addressBeingFormed.value) {
        try {
            await axios({ 
                method: "PUT", 
                url: `/api/address/${addressBeingFormed.value.addressId}`, 
                data: body,
            })

            emit("submit", {
                title: "Address updated successfully",
                variant: "default",
            })
        } catch (error: Error) {
            console.error(error)

            emit("submit", { 
                title: "Failed to update address", 
                description: error.response.data.message,
                variant: "destructive",
            })
        }
    } else {
        throw new Error("Invalid combination of state")
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
                    <FormItem v-auto-animate>
                        <FormLabel>Street One</FormLabel>

                        <FormControl>
                            <Input v-bind="componentField" placeholder="1275 Evenflo Drive" />
                        </FormControl>

                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="streetTwo">
                    <FormItem v-auto-animate>
                        <FormLabel>Street Two</FormLabel>

                        <FormControl>
                            <Input v-bind="componentField" placeholder="Suite A01" />
                        </FormControl>

                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField name="city">
                    <FormItem class="flex flex-col">
                        <FormLabel>City</FormLabel>

                        <FormFieldCombobox 
                            name="city"
                            :options="cities"
                            :set-values="setValues"
                            :values="values"
                        />

                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField name="county">
                    <FormItem class="flex flex-col">
                        <FormLabel>County</FormLabel>

                        <FormFieldCombobox 
                            name="county"
                            :options="counties"
                            :set-values="setValues"
                            :values="values"
                        />
                        
                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField name="state">
                    <FormItem class="flex flex-col">
                        <FormLabel>State</FormLabel>

                        <FormFieldCombobox 
                            name="state"
                            :options="states"
                            :set-values="setValues"
                            :values="values"
                        />

                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="postalCode">
                    <FormItem v-auto-animate>
                        <FormLabel>Postal Code</FormLabel>

                        <FormControl>
                            <Input v-bind="componentField" placeholder="30107" />
                        </FormControl>

                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField name="country">
                    <FormItem class="flex flex-col">
                        <FormLabel>Country</FormLabel>

                        <FormFieldCombobox 
                            name="country"
                            :options="countries"
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
