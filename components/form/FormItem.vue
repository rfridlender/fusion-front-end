<script setup lang="ts">
import type { Toast } from "@/components/ui/toast/use-toast"
import { Eraser, LoaderCircle, Save } from "lucide-vue-next"

const emit = defineEmits<{ (_event: "postSubmit", _propsToast: Toast): void }>()

const { 
    data: dataVendors, 
    error: errorVendors, 
} = await useFetch<Vendor[]>("/api/vendor", { default: () => [] })

const optionsVendors = computed(() => dataVendors.value.map(vendor => ({ 
    label: vendor.vendorName, 
    value: vendor.vendorId,
})))

// TODO: Handle vendors retrieval error
watch(errorVendors, (errorNew) => console.error(errorNew))

const isFormItemOpen = useState<boolean>("isFormItemOpen")
const isItemNew = useState<boolean>("isItemNew")
const itemBeingFormed = useState<Item | undefined>("itemBeingFormed")

const { handleSubmit, setValues, values, isSubmitting, resetForm } = useForm({ 
    validationSchema: schemaFormItem,
    initialValues: {},
})

watch(isFormItemOpen, (isFormItemOpenNew) => {
    if (isFormItemOpenNew) {
        !itemBeingFormed.value ? 
            resetForm() 
            : 
            setValues({ 
                itemCategory: itemBeingFormed.value.itemCategory,
                itemSubcategory: itemBeingFormed.value.itemSubcategory,
                sku: itemBeingFormed.value.sku,
                itemDescription: itemBeingFormed.value.itemDescription,
                unitOfMeasurement: itemBeingFormed.value.unitOfMeasurement,
                priceBuilder: itemBeingFormed.value.priceBuilder,
                priceHomeOwner: itemBeingFormed.value.priceHomeOwner,
                costBuilder: itemBeingFormed.value.costBuilder,
                costHomeOwner: itemBeingFormed.value.costHomeOwner,
                vendorPartNumber: itemBeingFormed.value.vendorPartNumber,
                vendorId: itemBeingFormed.value.vendor.vendorId,
            })
    }
})

const onSubmit = handleSubmit(async (body) => {
    let request = ""
    const opts: any = { method: "", body: body }
    let verb = ""

    try {
        if (isItemNew.value) {
            request = "/api/item"
            opts.method = "POST"
            verb = "created"
        } else if (itemBeingFormed.value) {
            opts.method = "PUT"
            request = `/api/item/${itemBeingFormed.value.itemId}`
            verb = "updated"
        } else {
            throw new Error("Invalid combination of state")
        }

        await $fetch(request, opts)

        emit("postSubmit", { 
            title: `Item ${verb} successfully`,
            variant: "default",
        })
    } catch (error: any) {
        console.error(error)
        
        emit("postSubmit", { 
            title: `Item ${verb} unsuccessfully`,
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
                <SheetTitle>{{ isItemNew ? "New" : "Edit" }} item</SheetTitle>
            </SheetHeader>

            <div class="h-full flex flex-col gap-4">
                <FormField name="itemCategory">
                    <FormFieldItem class="flex flex-col">
                        <FormLabel>Category</FormLabel>

                        <FormFieldCombobox 
                            name="itemCategory"
                            placeholder="category"
                            :options="optionsCategories"
                            :set-values="setValues"
                            :values="values"
                        />

                        <FormMessage />
                    </FormFieldItem>
                </FormField>

                <FormField name="itemSubcategory">
                    <FormFieldItem class="flex flex-col">
                        <FormLabel>Subcategory</FormLabel>

                        <FormFieldCombobox 
                            name="itemSubcategory"
                            placeholder="subcategory"
                            :options="optionsSubcategories[values.itemCategory ?? 'LOCK']"
                            :set-values="setValues"
                            :values="values"
                        />

                        <FormMessage />
                    </FormFieldItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="sku">
                    <FormFieldItem v-auto-animate>
                        <FormLabel>SKU</FormLabel>

                        <FormControl>
                            <Input v-bind="componentField" placeholder="HF123" />
                        </FormControl>

                        <FormMessage />
                    </FormFieldItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="itemDescription">
                    <FormFieldItem v-auto-animate>
                        <FormLabel>Description</FormLabel>

                        <FormControl>
                            <Input v-bind="componentField" placeholder="Home Fusion Item #123" />
                        </FormControl>

                        <FormMessage />
                    </FormFieldItem>
                </FormField>

                <FormField name="unitOfMeasurement">
                    <FormFieldItem class="flex flex-col">
                        <FormLabel>UoM</FormLabel>

                        <FormFieldCombobox 
                            name="unitOfMeasurement"
                            placeholder="EA"
                            :options="optionsUnitOfMeasurement"
                            :set-values="setValues"
                            :values="values"
                        />

                        <FormMessage />
                    </FormFieldItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="priceBuilder">
                    <FormFieldItem v-auto-animate>
                        <FormLabel>Bldr. Price</FormLabel>

                        <FormControl>
                            <Input 
                                v-bind="componentField"
                                type="number" 
                                placeholder="2.50" 
                                step="0.01"
                            />
                        </FormControl>

                        <FormMessage />
                    </FormFieldItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="priceHomeOwner">
                    <FormFieldItem v-auto-animate>
                        <FormLabel>H.O. Price</FormLabel>

                        <FormControl>
                            <Input 
                                v-bind="componentField"
                                type="number" 
                                placeholder="3.50" 
                                step="0.01"
                            />
                        </FormControl>

                        <FormMessage />
                    </FormFieldItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="costBuilder">
                    <FormFieldItem v-auto-animate>
                        <FormLabel>Bldr. Cost</FormLabel>

                        <FormControl>
                            <Input 
                                v-bind="componentField"
                                type="number" 
                                placeholder="1.25" 
                                step="0.01"
                            />
                        </FormControl>

                        <FormMessage />
                    </FormFieldItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="costHomeOwner">
                    <FormFieldItem v-auto-animate>
                        <FormLabel>H.O. Cost</FormLabel>

                        <FormControl>
                            <Input 
                                v-bind="componentField"
                                type="number" 
                                placeholder="1.75" 
                                step="0.01"
                            />
                        </FormControl>

                        <FormMessage />
                    </FormFieldItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="vendorPartNumber">
                    <FormFieldItem v-auto-animate>
                        <FormLabel>Vendor P.N.</FormLabel>

                        <FormControl>
                            <Input v-bind="componentField" placeholder="XYZ123" />
                        </FormControl>

                        <FormMessage />
                    </FormFieldItem>
                </FormField>

                <FormField name="vendorId">
                    <FormFieldItem class="flex flex-col">
                        <FormLabel>Vendor</FormLabel>

                        <FormFieldCombobox 
                            name="vendorId"
                            placeholder="vendor"
                            :options="optionsVendors"
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
