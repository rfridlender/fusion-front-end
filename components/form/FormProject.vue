<script setup lang="ts">
import type { Toast } from "@/components/ui/toast/use-toast"
import { DateFormatter, getLocalTimeZone, parseDate, today } from "@internationalized/date"
import { Calendar as CalendarIcon, Eraser, LoaderCircle, Map, Save, X } from "lucide-vue-next"
import { toDate } from "radix-vue/date"

const emit = defineEmits<{ (_event: "postSubmit", _propsToast: Toast): void }>()

const { 
    data: dataLots, 
    error: errorLots, 
} = await useFetch<Lot[]>("/api/lot", { default: () => [] })

const optionsLots = computed(() => dataLots.value.map(lot => ({ 
    label: `${lot.lotNumber} ${lot.development.developmentName}`, 
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
const isDialogConfirmLeaveProjectOpen = useState<boolean>(
    "isDialogConfirmLeaveProjectOpen", 
    () => false,
)

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
    <SheetContent 
        class="h-full" 
        aria-describedby="form" 
        side="bottom"
    >
        <form 
            class="h-full flex flex-col" 
            @submit="onSubmit"
            @reset="() => resetForm()"
        >
            <SheetHeader class="flex flex-row justify-between">
                <SheetTitle class="flex text-2xl">
                    <Map class="size-8 mr-4" />
                    {{ isProjectNew ? "New" : "Edit" }} project
                </SheetTitle>

                <Button 
                    variant="ghost" 
                    size="icon"
                    :disabled="isSubmitting"
                    @click="isDialogConfirmLeaveProjectOpen = true"
                >
                    <X class="size-8" />
                </Button>
            </SheetHeader>

            <Separator class="my-6" />

            <div class="h-full flex flex-col gap-4">
                <FormField 
                    v-slot="{ componentField }" 
                    type="radio" 
                    name="projectCategory"
                >
                    <FormFieldItem>
                        <FormControl>
                            <RadioGroup
                                class="flex items-center gap-4"
                                v-bind="componentField"
                            >
                                <FormFieldItem 
                                    v-for="itemCategory in itemCategories"
                                    :key="itemCategory"
                                    class="flex items-center space-y-0 gap-x-2"
                                >
                                    <FormControl>
                                        <RadioGroupItem :value="itemCategory" />
                                    </FormControl>

                                    <FormLabel class="font-normal">
                                        {{ itemCategory }}
                                    </FormLabel>
                                </FormFieldItem>
                            </RadioGroup>
                        </FormControl>
                        
                        <FormMessage />
                    </FormFieldItem>
                </FormField>

                <div class="w-full flex justify-center items-center gap-8">
                    <FormField name="customer">
                        <FormFieldItem class="w-full">
                            <FormLabel>Customer</FormLabel>
    
                            <FormControl>
                                <Input 
                                    :value="dataLots.find(
                                        ({ lotId }) => 
                                            lotId === values.lotId)?.development.builder.builderName
                                    " 
                                    readonly 
                                />
                            </FormControl>
                        </FormFieldItem>
                    </FormField>

                    <FormField name="installDate">
                        <FormFieldItem class="w-full">
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
                                        :min-value="today(getLocalTimeZone()).subtract(
                                            { months: 1 }
                                        )"
                                        :max-value="today(getLocalTimeZone()).add(
                                            { months: 5 }
                                        )"
                                        @update:model-value="(v) => setFieldValue(
                                            'installDate',
                                            v ? v.toString() : undefined
                                        )"
                                    />
                                </PopoverContent>
                            </Popover>

                            <FormMessage />
                        </FormFieldItem>
                    </FormField>
                </div>

                <div class="w-full flex justify-center items-center gap-8">
                    <FormField name="contactId">
                        <FormFieldItem class="w-full h-[72px] flex flex-col">
                            <FormLabel class="leading-6">
                                Contact
                            </FormLabel>

                            <FormFieldCombobox 
                                name="contactId"
                                placeholder="contact"
                                :options="optionsPersons"
                                :set-values="setValues"
                                :values="values"
                            />

                            <FormMessage />
                        </FormFieldItem>
                    </FormField>

                    <FormField name="lotId">
                        <FormFieldItem class="w-full h-[72px] flex flex-col">
                            <FormLabel class="leading-6">
                                Lot
                            </FormLabel>

                            <FormFieldCombobox 
                                name="lotId"
                                placeholder="lot"
                                :options="optionsLots"
                                :set-values="setValues"
                                :values="values"
                            />

                            <FormMessage />
                        </FormFieldItem>
                    </FormField>
                </div>

                <div class="w-full flex justify-center items-center gap-8">
                    <FormField name="phone">
                        <FormFieldItem class="w-full">
                            <FormLabel>Phone</FormLabel>
    
                            <FormControl>
                                <Input 
                                    :value="dataPersons.find(({ personId }) => 
                                        personId === values.contactId)?.phoneNumber
                                    " 
                                    readonly 
                                />
                            </FormControl>
                        </FormFieldItem>
                    </FormField>

                    <div class="w-full flex justify-center items-center gap-8">
                        <FormField name="address">
                            <FormFieldItem class="w-full">
                                <FormLabel>Address</FormLabel>
        
                                <FormControl>
                                    <Input 
                                        :value="dataLots.find(({ lotId }) => 
                                            lotId === values.lotId)?.address.streetOne
                                        " 
                                        readonly 
                                    />
                                </FormControl>
                            </FormFieldItem>
                        </FormField>

                        <FormField name="address">
                            <FormFieldItem class="w-full">
                                <FormLabel>Apartment, Suite, Etc. </FormLabel>
        
                                <FormControl>
                                    <Input 
                                        :value="dataLots.find(({ lotId }) => 
                                            lotId === values.lotId)?.address.streetTwo
                                        " 
                                        readonly 
                                    />
                                </FormControl>
                            </FormFieldItem>
                        </FormField>
                    </div>
                </div>

                <div class="w-full flex justify-center items-center gap-8">
                    <FormField v-slot="{ componentField }" name="customerPurchaseOrderNumber">
                        <FormFieldItem v-auto-animate class="w-full">
                            <FormLabel>Customer PO</FormLabel>

                            <FormControl>
                                <Input v-bind="componentField" placeholder="HF1234" />
                            </FormControl>

                            <FormMessage />
                        </FormFieldItem>
                    </FormField>

                    <div class="w-full flex justify-center items-center gap-8">
                        <FormField name="city">
                            <FormFieldItem class="w-full">
                                <FormLabel>City</FormLabel>
        
                                <FormControl>
                                    <Input 
                                        :value="dataLots.find(
                                            ({ lotId }) => lotId === values.lotId)?.address.city
                                        " 
                                        readonly 
                                    />
                                </FormControl>
                            </FormFieldItem>
                        </FormField>
    
                        <FormField name="county">
                            <FormFieldItem class="w-full">
                                <FormLabel>County</FormLabel>
        
                                <FormControl>
                                    <Input 
                                        :value="dataLots.find(
                                            ({ lotId }) => lotId === values.lotId)?.address.county
                                        " 
                                        readonly 
                                    />
                                </FormControl>
                            </FormFieldItem>
                        </FormField>
                    </div>
                </div>

                <div class="w-full flex justify-center items-center gap-8">
                    <FormField name="representativeId">
                        <FormFieldItem class="w-full h-[72px] flex flex-col">
                            <FormLabel class="leading-6">
                                Rep
                            </FormLabel>

                            <FormFieldCombobox 
                                name="representativeId"
                                placeholder="representative"
                                :options="optionsPersons"
                                :set-values="setValues"
                                :values="values"
                            />

                            <FormMessage />
                        </FormFieldItem>
                    </FormField>

                    <div class="w-full flex justify-center items-center gap-8">
                        <FormField name="warehouseId">
                            <FormFieldItem class="w-full h-[72px] flex flex-col">
                                <FormLabel class="leading-6">
                                    WH
                                </FormLabel>

                                <FormFieldCombobox 
                                    name="warehouseId"
                                    placeholder="warehouse"
                                    :options="optionsWarehouses"
                                    :set-values="setValues"
                                    :values="values"
                                />

                                <FormMessage />
                            </FormFieldItem>
                        </FormField>
    
                        <FormField v-slot="{ componentField }" name="salesOrderNumber">
                            <FormFieldItem v-auto-animate class="w-full">
                                <FormLabel>S.O.</FormLabel>

                                <FormControl>
                                    <Input v-bind="componentField" placeholder="RM9876" />
                                </FormControl>

                                <FormMessage />
                            </FormFieldItem>
                        </FormField>
                    </div>
                </div>

                <div class="w-full flex justify-center items-center gap-8">
                    <div class="w-full" />

                    <FormField name="email">
                        <FormFieldItem class="w-full">
                            <FormLabel>Email</FormLabel>
    
                            <FormControl>
                                <Input 
                                    :value="dataPersons.find(
                                        ({ personId }) => personId === values.contactId)?.email
                                    " 
                                    readonly 
                                />
                            </FormControl>
                        </FormFieldItem>
                    </FormField>
                </div>
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

    <Dialog v-model:open="isDialogConfirmLeaveProjectOpen">
        <DialogConfirmLeaveProject />
    </Dialog>
</template>
