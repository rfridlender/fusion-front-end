<script setup lang="ts">
import { Eye, EyeOff } from "lucide-vue-next"
import type { ComponentFieldBindingObject } from "vee-validate"

const { componentField } = defineProps<{
    componentField: ComponentFieldBindingObject<any>
}>()

const isPasswordVisible = useState(componentField.name, () => false)
</script>

<template>
    <div class="relative w-full max-w-sm items-center">
        <Input 
            :type="!isPasswordVisible ? 'password' : 'text'"
            placeholder="••••••••" 
            v-bind="componentField" 
        />
        <span 
            v-auto-animate
            class="absolute end-0 inset-y-0 flex items-center justify-center px-2"
        >
            <Eye 
                v-if="!isPasswordVisible"
                class="size-6 transition-all opacity-50 hover:opacity-100"
                @click="isPasswordVisible = true"
            />
            <EyeOff
                v-else
                v-auto-animate
                class="size-6 transition-all opacity-50 hover:opacity-100"
                @click="isPasswordVisible = false"
            />
        </span>
    </div>
</template>
