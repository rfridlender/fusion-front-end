<script setup lang="ts">
import { columns } from "@/components/data-table/columns"
import { useToast } from "@/components/ui/toast/use-toast"
import type { Address } from "@/utils/schemas"
import { SquarePlus } from "lucide-vue-next"

definePageMeta({ layout: "protected" })

const { data } = await useFetch<Address[]>("/api/address")

const route = useRoute()
const messageError = computed(() => route.query["message-error"]?.toString() ?? "")
const messageSuccess = computed(() => route.query["message-success"]?.toString() ?? "")

watch(messageSuccess, (message) => toast({ title: message }))

const { toast } = useToast()

onMounted(async () => {
    if (!messageError.value && !messageSuccess.value) {
        return
    }

    await nextTick()

    messageError.value ? 
        toast({ title: messageError.value, variant: "destructive" }) :
        toast({ title: messageSuccess.value })
})

const isFormAddressOpen = useState("isFormAddressOpen", () => false)
</script>

<template>
    <main class="flex flex-1 flex-col gap-4">
        <div class="h-full flex flex-col">
            <div class="flex justify-between items-center p-12">
                <h1 class="text-2xl font-semibold">
                    Address
                </h1>

                <Sheet v-model:open="isFormAddressOpen">
                    <SheetTrigger as-child>
                        <Button>
                            <SquarePlus class="size-5 gap-2 mr-2" />
                            New address
                        </Button>
                    </SheetTrigger>
                    
                    <FormAddress />
                </Sheet>
            </div>

            <DataTable :columns="columns" :data="data ?? []" />
        </div>
    </main>
</template>
