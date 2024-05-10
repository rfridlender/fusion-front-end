<script setup lang="ts">
import { Bell } from "lucide-vue-next"
</script>

<template>
    <div class="hidden border-r bg-muted/40 md:block">
        <div class="flex h-full max-h-screen flex-col gap-2">
            <div class="flex h-14 items-center border-b px-4">
                <NuxtLink
                    class="flex items-center gap-3 font-semibold"
                    to="https://www.homefusioninstall.com"
                >
                    <img
                        class="size-5"
                        src="/assets/home-fusion-logo.png"
                        alt="Modern House"
                    >
                    
                    <span class="">Home Fusion</span>
                </NuxtLink>

                <Button
                    variant="outline"
                    size="icon"
                    class="ml-auto size-8"
                >
                    <Bell class="size-4" />
                    <span class="sr-only">Toggle notifications</span>
                </Button>
            </div>
            
            <div class="flex-1">
                <nav class="grid items-start px-2 text-md font-medium">
                    <LayoutNavigationList />
                </nav>
            </div>
        </div>
    </div>
</template>
