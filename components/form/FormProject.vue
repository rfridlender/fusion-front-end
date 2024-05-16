<script setup lang="ts">
import { Calendar } from "@/components/ui/calendar"
import type { Toast } from "@/components/ui/toast/use-toast"
import { DateFormatter, getLocalTimeZone, parseDate, today } from "@internationalized/date"
import { Calendar as CalendarIcon, Eraser, LoaderCircle, Save } from "lucide-vue-next"
import { toDate } from "radix-vue/date"


const emit = defineEmits<{ (_event: "postSubmit", _propsToast: Toast): void }>()

const { 
    data: dataLots, 
    error: errorLots, 
} = await useFetch<Lot[]>("/api/lot", { default: () => [] })

const optionsLots = computed(() => dataLots.value.map(lot => ({ 
    label: `Lot ${lot.lotNumber} ${lot.development.developmentName}`, 
    value: lot.lotId,
})))

// TODO: Handle lots retrieval error
watch(errorLots, (errorNew) => console.error(errorNew))

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
    data: dataWarehouses, 
    error: errorWarehouses, 
} = await useFetch<Warehouse[]>("/api/warehouse", { default: () => [] })

const optionsWarehouses = computed(() => dataWarehouses.value.map(warehouse => ({ 
    label: warehouse.warehouseName, 
    value: warehouse.warehouseId,
})))

// TODO: Handle warehouses retrieval error
watch(errorWarehouses, (errorNew) => console.error(errorNew))

const isFormProjectOpen = useState<boolean>("isFormProjectOpen")
const isProjectNew = useState<boolean>("isProjectNew")
const projectBeingFormed = useState<Project | undefined>("projectBeingFormed")

const { handleSubmit, setFieldValue, setValues, values, isSubmitting, resetForm } = useForm({ 
    validationSchema: schemaFormProject,
    initialValues: {},
})

watch(isFormProjectOpen, (isFormProjectOpenNew) => {
    if (isFormProjectOpenNew) {
        !projectBeingFormed.value ? 
            resetForm() 
            : 
            setValues({ 
                projectCategory: projectBeingFormed.value.projectCategory,
                installDate: projectBeingFormed.value.installDate,
                customerPurchaseOrderNumber: projectBeingFormed.value.customerPurchaseOrderNumber,
                salesOrderNumber: projectBeingFormed.value.salesOrderNumber,
                lotId: projectBeingFormed.value.lot.lotId,
                contactId: projectBeingFormed.value.contact.personId,
                representativeId: projectBeingFormed.value.representative.personId,
                warehouseId: projectBeingFormed.value.warehouse.warehouseId,
            })
    }
})

const df = new DateFormatter("en-US", { dateStyle: "long" })

const placeholderInstallDate = ref()

const valueInstallDate = computed({
    get: () => values.installDate ? parseDate(values.installDate) : undefined,
    set: val => val,
})

const onSubmit = handleSubmit(async (body) => {
    let request = ""
    const opts: any = { method: "", body: body }
    let verb = ""

    try {
        if (isProjectNew.value) {
            request = "/api/project"
            opts.method = "POST"
            verb = "created"
        } else if (projectBeingFormed.value) {
            opts.method = "PUT"
            request = `/api/project/${projectBeingFormed.value.projectId}`
            verb = "updated"
        } else {
            throw new Error("Invalid combination of state")
        }

        await $fetch(request, opts)

        emit("postSubmit", { 
            title: `Project ${verb} successfully`,
            variant: "default",
        })
    } catch (error: any) {
        console.error(error)
        
        emit("postSubmit", { 
            title: `Project ${verb} unsuccessfully`,
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
                <SheetTitle>{{ isProjectNew ? "New" : "Edit" }} project</SheetTitle>
            </SheetHeader>

            <div class="h-full flex flex-col gap-4">
                <FormField name="projectCategory">
                    <FormItem class="flex flex-col">
                        <FormLabel>Category</FormLabel>

                        <FormFieldCombobox 
                            name="projectCategory"
                            placeholder="category"
                            :options="optionsCategories"
                            :set-values="setValues"
                            :values="values"
                        />

                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField name="installDate">
                    <FormItem class="flex flex-col">
                        <FormLabel>Install Date</FormLabel>

                        <Popover>
                            <PopoverTrigger as-child>
                                <FormControl>
                                    <Button
                                        variant="outline" 
                                        :class="cn(
                                            'w-full ps-3 text-start font-normal',
                                            !valueInstallDate && 'text-muted-foreground',
                                        )"
                                    >
                                        <span>
                                            {{ valueInstallDate ? 
                                                df.format(toDate(valueInstallDate)) : 
                                                "Pick a date" 
                                            }}
                                        </span>

                                        <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
                                    </Button>

                                    <input hidden>
                                </FormControl>
                            </PopoverTrigger>

                            <PopoverContent class="w-auto p-0">
                                <Calendar
                                    v-model:placeholder="placeholderInstallDate"
                                    v-model="valueInstallDate"
                                    calendar-label="Install date"
                                    :min-value="today(getLocalTimeZone()).subtract({ months: 1 })"
                                    :max-value="today(getLocalTimeZone()).add({ months: 5 })"
                                    @update:model-value="(v) => setFieldValue(
                                        'installDate',
                                        v ? v.toString() : undefined
                                    )"
                                />
                            </PopoverContent>
                        </Popover>

                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="customerPurchaseOrderNumber">
                    <FormItem v-auto-animate>
                        <FormLabel>Cust. P.O.</FormLabel>

                        <FormControl>
                            <Input v-bind="componentField" placeholder="HF1234" />
                        </FormControl>

                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="salesOrderNumber">
                    <FormItem v-auto-animate>
                        <FormLabel>S.O.</FormLabel>

                        <FormControl>
                            <Input v-bind="componentField" placeholder="RM9876" />
                        </FormControl>

                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField name="lotId">
                    <FormItem class="flex flex-col">
                        <FormLabel>Lot</FormLabel>

                        <FormFieldCombobox 
                            name="lotId"
                            placeholder="lot"
                            :options="optionsLots"
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

                <FormField name="representativeId">
                    <FormItem class="flex flex-col">
                        <FormLabel>Representative</FormLabel>

                        <FormFieldCombobox 
                            name="representativeId"
                            placeholder="representative"
                            :options="optionsPersons"
                            :set-values="setValues"
                            :values="values"
                        />

                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField name="warehouseId">
                    <FormItem class="flex flex-col">
                        <FormLabel>Warehouse</FormLabel>

                        <FormFieldCombobox 
                            name="warehouseId"
                            placeholder="warehouse"
                            :options="optionsWarehouses"
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
