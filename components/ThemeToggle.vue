<script setup lang="ts">
import { Computer, Moon, Sun } from "lucide-vue-next"

const colorMode = useColorMode()
</script>

<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <Button 
                variant="secondary"
                size="icon"
                class="rounded-full"
            >
                <Moon 
                    class="size-5 rotate-0 scale-100 
                        transition-all dark:-rotate-90 dark:scale-0" 
                />

                <Sun 
                    class="absolute size-5 rotate-90 scale-0 
                        transition-all dark:rotate-0 dark:scale-100" 
                />

                <span class="sr-only">Toggle theme</span>
            </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
            <DropdownMenuItem @click="colorMode.preference = 'light'">
                <Sun class="size-5 mr-2" />
                Light
            </DropdownMenuItem>
            
            <DropdownMenuItem @click="colorMode.preference = 'dark'">
                <Moon class="size-5 mr-2" />
                Dark
            </DropdownMenuItem>
            
            <DropdownMenuItem @click="colorMode.preference = 'system'">
                <Computer class="size-5 mr-2" />
                System
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>
