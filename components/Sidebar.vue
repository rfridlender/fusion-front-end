<script setup lang="ts">
import { Bell, Home, LayoutDashboard, User } from "lucide-vue-next"

const route = useRoute()

const routesProtected = [
    {
        displayText: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        displayText: "Address",
        path: "/address",
        icon: Home,
    },
    {
        displayText: "Person",
        path: "/person",
        icon: User,
    },
]
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
                <nav class="grid items-start px-2 text-sm font-medium">
                    <NuxtLink 
                        v-for="routeProtected in routesProtected" 
                        :key="routeProtected.path" 
                        class="flex items-center gap-3 rounded-lg px-3 py-2 
                            transition-all hover:text-foreground"
                        :class="{ 
                            'bg-muted': routeProtected.path === route.path, 
                            'text-muted-foreground': routeProtected.path !== route.path 
                        }"
                        :to="routeProtected.path"
                    >
                        <component :is="routeProtected.icon" class="size-4" />
                        {{ routeProtected.displayText }}
                    </NuxtLink>
                </nav>
            </div>
        </div>
    </div>
</template>
