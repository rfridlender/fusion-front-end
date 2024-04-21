<script setup lang="ts">
import { Eraser, LoaderCircle, SquarePlus } from "lucide-vue-next"

const formAddress = useState<FormAddress | undefined>("formAddress")

const emit = defineEmits<{ (_event: "submit", _status: string, _message: string): void }>()

const { handleSubmit, setValues, values, isSubmitting, resetForm } = useForm({ 
    validationSchema: schemaFormAddress,
    initialValues: { state: "GA", country: "US" },
})

watch(formAddress, (formAddressNew) => !formAddressNew ? resetForm() : setValues(formAddressNew))

const onSubmit = handleSubmit(async (body) => {
    try {
        await $fetch<Address>("/api/address", { method: "POST", body: body })

        emit("submit", "success", "Address created successfully.")
    } catch (error: Error) {
        console.error(error)
        
        emit("submit", "error", "Failed to create address.")
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
                <SheetTitle>Address</SheetTitle>
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
                    <Eraser v-if="!isSubmitting" class="size-5 gap-2 mr-2" />
                    Clear
                </Button>
                <Button 
                    class="w-full" 
                    type="submit" 
                    :disabled="isSubmitting"
                >
                    <SquarePlus v-if="!isSubmitting" class="size-5 gap-2 mr-2" />
                    <LoaderCircle v-else class="size-5 gap-2 mr-2 animate-spin" />
                    Create address
                </Button>
            </SheetFooter>
        </form>
    </SheetContent>
</template>
