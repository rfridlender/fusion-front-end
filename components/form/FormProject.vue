<script setup lang="ts">
import type { Toast } from "@/components/ui/toast/use-toast"
import { DateFormatter, getLocalTimeZone, parseDate, today } from "@internationalized/date"
import { 
    Calendar as CalendarIcon,
    Check,
    ChevronsUpDown,
    Eraser,
    LoaderCircle,
    Map,
    MoreHorizontal,
    Save,
    SquarePlus,
    TableProperties,
    Trash,
    X,
} from "lucide-vue-next"
import { toDate } from "radix-vue/date"

const emit = defineEmits<{ (_event: "postSubmit", _propsToast: Toast): void }>()

const { 
    data: dataItems, 
    error: errorItems, 
} = await useFetch<Item[]>("/api/item", { default: () => [] })

const optionsItems = computed(() => dataItems.value.map(item => ({ 
    label: item.sku, 
    value: item.itemId, 
})))

// TODO: Handle items retrieval error
watch(errorItems, (errorNew) => console.error(errorNew))

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
    initialValues: { lineItems: [] },
})
watch(values, (v) => console.log(JSON.stringify(v, null, 2)))

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
                lineItems: projectBeingFormed.value.lineItems.map(lineItem => {
                    return {
                        lineNumber: lineItem.lineNumber,
                        description: lineItem.description,
                        quantity: lineItem.quantity,
                        priceUnit: lineItem.priceUnit,
                        itemId: lineItem.itemId,
                    }
                }),
            })
    }
})

const df = new DateFormatter("en-US", { dateStyle: "long" })

const placeholderInstallDate = ref()

const valueInstallDate = computed({
    get: () => values.installDate ? parseDate(values.installDate) : undefined,
    set: v => v,
})

function onSelect(i: number, optionValue: string) {
    const item = dataItems.value.find(({ itemId }) => itemId === optionValue)

    setFieldValue(`lineItems.${i}.itemId`, item?.itemId ?? "")
    setFieldValue(`lineItems.${i}.description`, item?.itemDescription)
    setFieldValue(`lineItems.${i}.priceUnit`, item?.priceBuilder ?? 0)
}

function onDelete(i: number) {
    if (values.lineItems) {
        setFieldValue(
            "lineItems",
            [...values.lineItems.slice(0, i), ...values.lineItems.slice(i + 1)].map(
                (lineItem, i) => {
                    return {
                        lineNumber: i + 1,
                        description: lineItem.description,
                        quantity: lineItem.quantity,
                        priceUnit: lineItem.priceUnit,
                        itemId: lineItem.itemId,
                    }
                },
            ),
        )
    } else {
        setFieldValue("lineItems", [])
    }
}

function onAdd() {
    if (values.lineItems) {
        setFieldValue("lineItems", [...values.lineItems, {
            lineNumber: values.lineItems ? values.lineItems.length + 1 : 1,
            description: null,
            quantity: 1,
            priceUnit: 1,
            itemId: "",
        }])
    } else {
        setFieldValue("lineItems", [])
    }
}

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
        class="h-full p-0" 
        aria-describedby="form" 
        side="bottom"
    >
        <form 
            class="h-full flex flex-col" 
            @submit="onSubmit"
            @reset="() => resetForm()"
        >
            <SheetHeader class="flex flex-row justify-between p-6 border-b">
                <SheetTitle class="flex text-2xl">
                    <Map class="size-8 mr-4" />
                    {{ isProjectNew ? "New" : "Edit" }} project
                </SheetTitle>

                <Button 
                    type="button"
                    variant="ghost" 
                    size="icon"
                    :disabled="isSubmitting"
                    @click="isDialogConfirmLeaveProjectOpen = true"
                >
                    <X class="size-8" />
                </Button>
            </SheetHeader>

            <div class="h-full flex flex-col gap-4 p-6">
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

                <div class="flex flex-col justify-center items-start gap-4 px-12 py-4">
                    <div class="flex justify-start items-center text-xl">
                        <TableProperties class="size-6 mr-2" />
                        Items
                    </div>
                    
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead class="w-[5%] px-2">
                                    #
                                </TableHead>

                                <TableHead class="w-[15%] px-2">
                                    SKU
                                </TableHead>

                                <TableHead class="px-2">
                                    Description
                                </TableHead>

                                <TableHead class="w-[10%] px-2">
                                    Qty.
                                </TableHead>

                                <TableHead class="w-[10%] px-2">
                                    Rate
                                </TableHead>

                                <TableHead class="w-[10%] px-2">
                                    Amt.
                                </TableHead>

                                <TableHead class="w-12 px-2" />
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            <TableRow 
                                v-for="(lineItem, i) in values.lineItems"
                                :key="lineItem.lineNumber"
                                class="h-16"
                            >
                                <TableCell class="p-2">
                                    {{ lineItem.lineNumber }}
                                </TableCell>
                                
                                <TableCell class="p-2">
                                    <Popover>
                                        <PopoverTrigger class="w-full" as-child>
                                            <Button
                                                :class="cn(
                                                    'justify-between font-normal', 
                                                    !lineItem.itemId && 'text-muted-foreground'
                                                )"
                                                variant="outline"
                                                role="combobox"
                                                type="button"
                                            >
                                                {{ lineItem.itemId ? 
                                                    optionsItems.find((option) => 
                                                        option.value === lineItem.itemId,
                                                    )?.label : `Select SKU...` 
                                                }}
                                                <ChevronsUpDown 
                                                    class="ml-2 size-4 shrink-0 opacity-50" 
                                                />
                                            </Button>
                                        </PopoverTrigger>

                                        <PopoverContent class="w-full p-0">
                                            <Command>
                                                <CommandInput :placeholder="`Select SKU...`" />

                                                <CommandEmpty>Nothing found.</CommandEmpty>
                                                
                                                <CommandList>
                                                    <CommandGroup>
                                                        <CommandItem
                                                            v-for="option in optionsItems"
                                                            :key="option.value"
                                                            :value="option.label"
                                                            @select="
                                                                () => onSelect(i, option.value)
                                                            "
                                                        >
                                                            <Check
                                                                :class="cn(
                                                                    'mr-2 size-4', 
                                                                    option.value === lineItem.itemId ? 'opacity-100' : 'opacity-0'
                                                                )"
                                                            />
                                                            {{ option.label }}
                                                        </CommandItem>
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                                
                                <TableCell class="p-2">
                                    <FormField 
                                        v-slot="{ componentField }"
                                        :name="`lineItems.${i}.description`"
                                    >
                                        <FormFieldItem>
                                            <FormControl>
                                                <Input 
                                                    v-bind="componentField"
                                                    placeholder="Description"
                                                />
                                            </FormControl>
                                        </FormFieldItem>
                                    </FormField>
                                </TableCell>
                                
                                <TableCell class="p-2">
                                    <FormField 
                                        v-slot="{ componentField }" 
                                        :name="`lineItems.${i}.quantity`"
                                    >
                                        <FormFieldItem>
                                            <FormControl>
                                                <Input 
                                                    v-bind="componentField"
                                                    type="number"
                                                    placeholder="Qty."
                                                    step="1"
                                                />
                                            </FormControl>
                                        </FormFieldItem>
                                    </FormField>
                                </TableCell>
                                
                                <TableCell class="p-2">
                                    <FormField 
                                        v-slot="{ componentField }" 
                                        :name="`lineItems.${i}.priceUnit`"
                                    >
                                        <FormFieldItem>
                                            <FormControl>
                                                <Input 
                                                    v-bind="componentField"
                                                    type="number"
                                                    placeholder="Rate"
                                                    step="0.01"
                                                />
                                            </FormControl>
                                        </FormFieldItem>
                                    </FormField>
                                </TableCell>
                                
                                <TableCell class="p-2">
                                    {{ dollarize(lineItem.quantity * lineItem.priceUnit) }}
                                </TableCell>

                                <TableCell class="p-2">
                                    <DropdownMenu class="flex justify-center items-center">
                                        <DropdownMenuTrigger as-child>
                                            <Button
                                                class="flex size-8 p-0 data-[state=open]:bg-muted"
                                                variant="ghost"
                                                type="button"
                                            >
                                                <MoreHorizontal class="size-4" />
                                                <span class="sr-only">Open menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent class="w-40" align="end">
                                            <DropdownMenuItem @click="() => onDelete(i)">
                                                <Trash class="mr-2 size-4" />
                                                <span>Delete</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                    <Button 
                        type="button"
                        @click="onAdd"
                    >
                        <SquarePlus class="size-5 mr-2" />
                        Add item
                    </Button>   
                </div>
            </div>

            <SheetFooter class="p-6 border-t">
                <Button 
                    variant="secondary" 
                    type="reset" 
                    :disabled="isSubmitting"
                >
                    <Eraser class="size-5 mr-2" />
                    Clear
                </Button>
                
                <Button 
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
