<script setup lang="ts">
import { Check, ChevronsUpDown } from "lucide-vue-next"

defineProps<{
    name: string
    options: { label: string, value: string }[],
    setValues: (fields: PartialObjectDeep<PartialObjectDeep<any, any>, any>) => void
    values: PartialObjectDeep<any, any>
}>()
</script>

<template>
    <Popover>
        <PopoverTrigger as-child>
            <FormControl>
                <Button
                    variant="outline"
                    role="combobox"
                    :class="cn(
                        'justify-between', 
                        !values[name] && 'text-muted-foreground')"
                >
                    {{ values[name] ? options.find((option) => 
                        option.value === values[name],
                    )?.label : `Select ${name}...` }}
                    <ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
            </FormControl>
        </PopoverTrigger>

        <PopoverContent class="w-full p-0">
            <Command>
                <CommandInput :placeholder="`Select ${name}...`" />

                <CommandEmpty>Nothing found.</CommandEmpty>
                
                <CommandList>
                    <CommandGroup>
                        <CommandItem
                            v-for="option in options"
                            :key="option.value"
                            :value="option.label"
                            @select="() => setValues({ [name]: option.value })"
                        >
                            <Check
                                :class="cn(
                                    'mr-2 size-4', 
                                    option.value === values[name] ? 
                                        'opacity-100' : 
                                        'opacity-0'
                                )"
                            />
                            {{ option.label }}
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </Command>
        </PopoverContent>
    </Popover>
</template>