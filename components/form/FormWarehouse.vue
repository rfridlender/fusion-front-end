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

const isFormWarehouseOpen = useState<boolean>("isFormWarehouseOpen")
const isWarehouseNew = useState<boolean>("isWarehouseNew")
const warehouseBeingFormed = useState<Warehouse | undefined>("warehouseBeingFormed")

const { handleSubmit, setValues, values, isSubmitting, resetForm } = useForm({ 
    validationSchema: schemaFormWarehouse,
    initialValues: {},
})

watch(isFormWarehouseOpen, (isFormWarehouseOpenNew) => {
    if (isFormWarehouseOpenNew) {
        !warehouseBeingFormed.value ? 
            resetForm() 
            : 
            setValues({ 
                warehouseName: warehouseBeingFormed.value.warehouseName,
                addressId: warehouseBeingFormed.value.address.addressId,
            })
    }
})

const onSubmit = handleSubmit(async (body) => {
    let request = ""
    const opts: any = { method: "", body: body }
    let verb = ""

    try {
        if (isWarehouseNew.value) {
            request = "/api/warehouse"
            opts.method = "POST"
            verb = "created"
        } else if (warehouseBeingFormed.value) {
            opts.method = "PUT"
            request = `/api/warehouse/${warehouseBeingFormed.value.warehouseId}`
            verb = "updated"
        } else {
            throw new Error("Invalid combination of state")
        }

        await $fetch(request, opts)

        emit("postSubmit", { 
            title: `Warehouse ${verb} successfully`,
            variant: "default",
        })
    } catch (error: any) {
        console.error(error)
        
        emit("postSubmit", { 
            title: `Warehouse ${verb} unsuccessfully`,
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
                <SheetTitle>{{ isWarehouseNew ? "New" : "Edit" }} warehouse</SheetTitle>
            </SheetHeader>

            <div class="h-full flex flex-col gap-4">
                <FormField v-slot="{ componentField }" name="warehouseName">
                    <FormFieldItem v-auto-animate>
                        <FormLabel>Warehouse Name</FormLabel>

                        <FormControl>
                            <Input v-bind="componentField" placeholder="Ball Ground" />
                        </FormControl>

                        <FormMessage />
                    </FormFieldItem>
                </FormField>

                <FormField name="addressId">
                    <FormFieldItem class="flex flex-col">
                        <FormLabel>Address</FormLabel>

                        <FormFieldCombobox 
                            name="addressId"
                            placeholder="address"
                            :options="optionsAddresses"
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
